import { toNormalizedDeviceCoordinates } from "@/lib/particles/aspect";

export type PixelArray = Uint8ClampedArray | Uint8Array;

export interface ExtractParticlesInput {
  readonly pixels: PixelArray;
  readonly width: number;
  readonly height: number;
  readonly stride: number;
  readonly brightnessThreshold: number;
}

export interface ParticleData {
  readonly positions: Float32Array;
  readonly colors: Float32Array;
  readonly count: number;
}

function luminance(red: number, green: number, blue: number): number {
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function extractParticles(input: ExtractParticlesInput): ParticleData {
  const { pixels, width, height, stride, brightnessThreshold } = input;

  if (width <= 0 || height <= 0 || stride <= 0) {
    return {
      positions: new Float32Array(0),
      colors: new Float32Array(0),
      count: 0,
    };
  }

  const positionList: number[] = [];
  const colorList: number[] = [];

  for (let row = 0; row < height; row += stride) {
    for (let column = 0; column < width; column += stride) {
      const pixelIndex = (row * width + column) * 4;
      const red = pixels[pixelIndex];
      const green = pixels[pixelIndex + 1];
      const blue = pixels[pixelIndex + 2];

      if (luminance(red, green, blue) < brightnessThreshold) {
        continue;
      }

      const horizontal = (column + 0.5) / width;
      const vertical = (row + 0.5) / height;
      const coordinates = toNormalizedDeviceCoordinates(
        horizontal,
        vertical,
        width,
        height,
      );

      positionList.push(coordinates.x, coordinates.y);
      colorList.push(red / 255, green / 255, blue / 255);
    }
  }

  return {
    positions: new Float32Array(positionList),
    colors: new Float32Array(colorList),
    count: positionList.length / 2,
  };
}
