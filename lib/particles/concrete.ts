import { toNormalizedDeviceCoordinates } from "@/lib/particles/aspect";
import { smoothstep } from "@/lib/particles/easing";
import { fractionalBrownianMotion } from "@/lib/particles/noise";

export interface ConcreteRenderOptions {
  readonly bevelWidth: number;
  readonly relief: number;
  readonly ambient: number;
  readonly bumpStrength: number;
  readonly crackStrength: number;
  readonly baseColor: readonly [number, number, number];
  readonly light: readonly [number, number, number];
}

export interface ConcreteStage {
  readonly positions: Float32Array;
  readonly colors: Float32Array;
}

export const DEFAULT_CONCRETE_OPTIONS: ConcreteRenderOptions = {
  bevelWidth: 46,
  relief: 0.16,
  ambient: 0.42,
  bumpStrength: 0.22,
  crackStrength: 0.4,
  baseColor: [0.66, 0.63, 0.585],
  light: [-0.62, -0.33, 0.71],
};

const SQUARE_ROOT_OF_TWO = Math.SQRT2;

export function distanceTransform(
  mask: Uint8Array,
  width: number,
  height: number,
): Float32Array {
  const distance = new Float32Array(width * height);
  for (let index = 0; index < distance.length; index += 1) {
    distance[index] = mask[index] > 0 ? Number.POSITIVE_INFINITY : 0;
  }

  const indexFor = (x: number, y: number) => y * width + x;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const current = indexFor(x, y);
      if (mask[current] === 0) {
        continue;
      }
      let minimum = distance[current];
      if (x > 0) {
        minimum = Math.min(minimum, distance[indexFor(x - 1, y)] + 1);
      }
      if (y > 0) {
        minimum = Math.min(minimum, distance[indexFor(x, y - 1)] + 1);
        if (x > 0) {
          minimum = Math.min(
            minimum,
            distance[indexFor(x - 1, y - 1)] + SQUARE_ROOT_OF_TWO,
          );
        }
        if (x < width - 1) {
          minimum = Math.min(
            minimum,
            distance[indexFor(x + 1, y - 1)] + SQUARE_ROOT_OF_TWO,
          );
        }
      }
      distance[current] = minimum;
    }
  }

  for (let y = height - 1; y >= 0; y -= 1) {
    for (let x = width - 1; x >= 0; x -= 1) {
      const current = indexFor(x, y);
      if (mask[current] === 0) {
        continue;
      }
      let minimum = distance[current];
      if (x < width - 1) {
        minimum = Math.min(minimum, distance[indexFor(x + 1, y)] + 1);
      }
      if (y < height - 1) {
        minimum = Math.min(minimum, distance[indexFor(x, y + 1)] + 1);
        if (x > 0) {
          minimum = Math.min(
            minimum,
            distance[indexFor(x - 1, y + 1)] + SQUARE_ROOT_OF_TWO,
          );
        }
        if (x < width - 1) {
          minimum = Math.min(
            minimum,
            distance[indexFor(x + 1, y + 1)] + SQUARE_ROOT_OF_TWO,
          );
        }
      }
      distance[current] = minimum;
    }
  }

  return distance;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export type ColorSampler = (
  normalizedX: number,
  normalizedY: number,
) => readonly [number, number, number];

export function concreteRender(
  mask: Uint8Array,
  width: number,
  height: number,
  seed: number,
  options: ConcreteRenderOptions = DEFAULT_CONCRETE_OPTIONS,
  colorSampler?: ColorSampler,
): ConcreteStage {
  const {
    bevelWidth,
    relief,
    ambient,
    bumpStrength,
    crackStrength,
    baseColor,
    light,
  } = options;
  const distance = distanceTransform(mask, width, height);
  const pixelCount = width * height;

  const heightField = new Float32Array(pixelCount);
  for (let index = 0; index < pixelCount; index += 1) {
    if (mask[index] === 0) {
      continue;
    }
    const x = index % width;
    const y = Math.floor(index / width);
    const bevel = smoothstep(0, bevelWidth, distance[index]);
    const bump =
      (fractionalBrownianMotion(x * 0.18, y * 0.18, seed, 3) - 0.5) *
      bumpStrength;
    heightField[index] = bevel + bump;
  }

  const lightLength = Math.hypot(light[0], light[1], light[2]) || 1;
  const lightX = light[0] / lightLength;
  const lightY = light[1] / lightLength;
  const lightZ = light[2] / lightLength;

  const positions: number[] = [];
  const colors: number[] = [];

  const sampleHeight = (x: number, y: number, fallback: number): number => {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return fallback;
    }
    const neighborIndex = y * width + x;
    return mask[neighborIndex] > 0 ? heightField[neighborIndex] : fallback;
  };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      if (mask[index] === 0) {
        continue;
      }
      const heightCenter = heightField[index];
      const gradientX =
        (sampleHeight(x + 1, y, heightCenter) -
          sampleHeight(x - 1, y, heightCenter)) /
        2;
      const gradientY =
        (sampleHeight(x, y + 1, heightCenter) -
          sampleHeight(x, y - 1, heightCenter)) /
        2;

      let normalX = -gradientX / relief;
      let normalY = -gradientY / relief;
      let normalZ = 1;
      const normalLength = Math.hypot(normalX, normalY, normalZ) || 1;
      normalX /= normalLength;
      normalY /= normalLength;
      normalZ /= normalLength;

      const diffuse = Math.max(
        0,
        normalX * lightX + normalY * lightY + normalZ * lightZ,
      );
      const variation =
        0.82 +
        0.36 * fractionalBrownianMotion(x * 0.05, y * 0.05, seed + 11, 2);
      const crackNoise = fractionalBrownianMotion(
        x * 0.04,
        y * 0.04,
        seed + 23,
        2,
      );
      const ridge = Math.abs(crackNoise * 2 - 1);
      const crack = 1 - crackStrength * smoothstep(0.78, 0.94, ridge);

      const shade = ambient + (1 - ambient) * diffuse;

      const base = colorSampler
        ? colorSampler(x / width, y / height)
        : baseColor;

      const coordinates = toNormalizedDeviceCoordinates(
        (x + 0.5) / width,
        (y + 0.5) / height,
        width,
        height,
      );
      positions.push(coordinates.x, coordinates.y);
      colors.push(
        clamp01(base[0] * variation * crack * shade),
        clamp01(base[1] * variation * crack * shade),
        clamp01(base[2] * variation * crack * shade),
      );
    }
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
  };
}
