"use client";

import NextImage from "next/image";
import {
  type ParticleMorphConfiguration,
  useParticleMorphCanvas,
} from "@/components/study/particles/useParticleMorphCanvas";

export interface ParticleMorphProps {
  readonly width: number;
  readonly height: number;
  readonly imageSource: string;
  readonly hoverImageSource?: string;
  readonly countdownFrom?: number;
  readonly morphDurationMilliseconds?: number;
  readonly stageHoldMilliseconds?: number;
  readonly brightnessThreshold?: number;
  readonly floatingAmplitude?: number;
  readonly pointFillRatio?: number;
  readonly backgroundColor?: string;
  readonly stride?: number;
  readonly digitFontVariable?: string;
  readonly circular?: boolean;
  readonly hoverMorphMilliseconds?: number;
  readonly onInitialAnimationComplete?: () => void;
}

const DEFAULT_POINT_FILL_RATIO = 1.0;
const DEFAULT_DIGIT_FONT_VARIABLE = "--font-shippori";

export default function ParticleMorph({
  width,
  height,
  imageSource,
  hoverImageSource = imageSource,
  countdownFrom = 5,
  morphDurationMilliseconds = 600,
  stageHoldMilliseconds = 400,
  brightnessThreshold = 36,
  floatingAmplitude = 0.004,
  pointFillRatio = DEFAULT_POINT_FILL_RATIO,
  backgroundColor,
  stride: strideOverride,
  digitFontVariable = DEFAULT_DIGIT_FONT_VARIABLE,
  circular = false,
  hoverMorphMilliseconds = 700,
  onInitialAnimationComplete,
}: ParticleMorphProps) {
  const configuration: ParticleMorphConfiguration = {
    width,
    height,
    imageSource,
    hoverImageSource,
    countdownFrom,
    morphDurationMilliseconds,
    stageHoldMilliseconds,
    brightnessThreshold,
    floatingAmplitude,
    pointFillRatio,
    backgroundColor,
    strideOverride,
    digitFontVariable,
    hoverMorphMilliseconds,
    onInitialAnimationComplete,
  };

  const { canvasReference, renderFallback } =
    useParticleMorphCanvas(configuration);

  if (renderFallback) {
    return (
      <NextImage
        src={imageSource}
        alt="Particle morphing fallback"
        width={width}
        height={height}
        style={{ borderRadius: circular ? "50%" : "0.5rem" }}
      />
    );
  }

  return (
    <canvas
      ref={canvasReference}
      width={width}
      height={height}
      style={{
        width,
        height,
        borderRadius: circular ? "50%" : "0.5rem",
        backgroundColor: backgroundColor ?? "transparent",
      }}
      aria-label="Particle morphing animation"
    />
  );
}
