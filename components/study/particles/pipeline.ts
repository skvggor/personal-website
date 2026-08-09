import type {
  ColorSampler,
  ConcreteRenderOptions,
} from "@/lib/particles/concrete";
import {
  concreteRender,
  DEFAULT_CONCRETE_OPTIONS,
} from "@/lib/particles/concrete";
import { extractParticles } from "@/lib/particles/extract";
import {
  createRandom,
  resampleStage,
  uniformResampleStage,
} from "@/lib/particles/origins";

const MAXIMUM_WORKING_DIMENSION = 512;
const DIGIT_RENDER_SIZE = 256;
const DIGIT_FONT_SCALE = 1.35;

export interface ParticleStage {
  readonly positions: Float32Array;
  readonly colors: Float32Array;
}

export interface StageData {
  readonly stages: ParticleStage[];
  readonly seeds: Float32Array;
  readonly count: number;
  readonly workingSize: number;
  readonly hover: ParticleStage;
}

function createOffscreenContext(
  width: number,
  height: number,
  purpose: string,
): CanvasRenderingContext2D {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error(`Failed to acquire 2D context for ${purpose}`);
  }
  return context;
}

export function readFontFamily(variableName: string): string {
  if (typeof window === "undefined") {
    return "serif";
  }
  const family = window
    .getComputedStyle(document.body)
    .getPropertyValue(variableName)
    .trim();
  return family || "serif";
}

export interface LoadedPhoto {
  readonly positions: Float32Array;
  readonly colors: Float32Array;
  readonly count: number;
  readonly workingWidth: number;
  readonly workingHeight: number;
  readonly pixels: Uint8ClampedArray;
}

async function loadImagePixels(
  imageSource: string,
  stride: number,
  brightnessThreshold: number,
): Promise<LoadedPhoto> {
  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () =>
      reject(new Error(`Failed to load image: ${imageSource}`));
    image.src = imageSource;
  });

  const scale =
    MAXIMUM_WORKING_DIMENSION /
    Math.max(image.naturalWidth, image.naturalHeight);
  const workingWidth = Math.max(1, Math.round(image.naturalWidth * scale));
  const workingHeight = Math.max(1, Math.round(image.naturalHeight * scale));

  const offscreenContext = createOffscreenContext(
    workingWidth,
    workingHeight,
    "pixel extraction",
  );
  offscreenContext.drawImage(image, 0, 0, workingWidth, workingHeight);
  const imageData = offscreenContext.getImageData(
    0,
    0,
    workingWidth,
    workingHeight,
  );

  const particles = extractParticles({
    pixels: imageData.data,
    width: workingWidth,
    height: workingHeight,
    stride,
    brightnessThreshold,
  });

  return {
    positions: particles.positions,
    colors: particles.colors,
    count: particles.count,
    workingWidth,
    workingHeight,
    pixels: imageData.data,
  };
}

async function extractConcreteStage(
  text: string,
  targetCount: number,
  fontFamily: string,
  seed: number,
  photoPixels: Uint8ClampedArray,
  photoWidth: number,
  photoHeight: number,
): Promise<ParticleStage> {
  const workingSize = DIGIT_RENDER_SIZE;
  const context = createOffscreenContext(
    workingSize,
    workingSize,
    "text extraction",
  );

  context.fillStyle = "#ffffff";
  context.font = `700 ${Math.round(workingSize * DIGIT_FONT_SCALE)}px ${fontFamily}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, workingSize / 2, workingSize / 2);

  const imageData = context.getImageData(0, 0, workingSize, workingSize);
  const mask = new Uint8Array(workingSize * workingSize);
  for (let index = 0; index < mask.length; index += 1) {
    mask[index] = imageData.data[index * 4] > 16 ? 1 : 0;
  }

  const options: ConcreteRenderOptions = {
    ...DEFAULT_CONCRETE_OPTIONS,
    bevelWidth: Math.round(workingSize * 0.1),
  };
  const colorSampler: ColorSampler = (normalizedX, normalizedY) => {
    const pixelX = Math.max(
      0,
      Math.min(photoWidth - 1, Math.floor(normalizedX * photoWidth)),
    );
    const pixelY = Math.max(
      0,
      Math.min(photoHeight - 1, Math.floor(normalizedY * photoHeight)),
    );
    const offset = (pixelY * photoWidth + pixelX) * 4;
    return [
      photoPixels[offset] / 255,
      photoPixels[offset + 1] / 255,
      photoPixels[offset + 2] / 255,
    ];
  };
  const concrete = concreteRender(
    mask,
    workingSize,
    workingSize,
    seed,
    options,
    colorSampler,
  );
  return resampleStage(
    concrete.positions,
    concrete.colors,
    targetCount,
    seed + 1,
  );
}

export async function loadStageData(
  imageSource: string,
  hoverImageSource: string,
  stride: number,
  brightnessThreshold: number,
  countdownFrom: number,
  fontVariable: string,
): Promise<StageData> {
  if (typeof document !== "undefined" && document.fonts) {
    await document.fonts.ready;
    const fontFamilyForLoad = readFontFamily(fontVariable);
    await document.fonts
      .load(`700 200px ${fontFamilyForLoad}`)
      .catch(() => undefined);
  }
  const fontFamily = readFontFamily(fontVariable);

  const photo = await loadImagePixels(imageSource, stride, brightnessThreshold);
  const count = photo.count;
  const stages: ParticleStage[] = [];
  const random = createRandom(31);

  for (let digit = countdownFrom; digit >= 0; digit -= 1) {
    const stage = await extractConcreteStage(
      String(digit),
      count,
      fontFamily,
      Math.floor(random() * 1_000_000),
      photo.pixels,
      photo.workingWidth,
      photo.workingHeight,
    );
    stages.push(stage);
  }
  stages.push({ positions: photo.positions, colors: photo.colors });

  const seeds = new Float32Array(count);
  for (let index = 0; index < count; index += 1) {
    seeds[index] = random();
  }

  const hoverPhoto = await loadImagePixels(
    hoverImageSource,
    stride,
    brightnessThreshold,
  );
  const hover = uniformResampleStage(
    hoverPhoto.positions,
    hoverPhoto.colors,
    count,
  );

  return {
    stages,
    seeds,
    count,
    workingSize: photo.workingWidth,
    hover,
  };
}
