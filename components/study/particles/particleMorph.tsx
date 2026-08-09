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
  readonly magnetRampMilliseconds?: number;
  readonly magnetColor?: string;
}

const DEFAULT_POINT_FILL_RATIO = 1.0;
const DEFAULT_DIGIT_FONT_VARIABLE = "--font-shippori";

export default function ParticleMorph({
  width,
  height,
  imageSource,
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
  magnetRampMilliseconds = 700,
  magnetColor = "#b48e08",
}: ParticleMorphProps) {
  const configuration: ParticleMorphConfiguration = {
    width,
    height,
    imageSource,
    countdownFrom,
    morphDurationMilliseconds,
    stageHoldMilliseconds,
    brightnessThreshold,
    floatingAmplitude,
    pointFillRatio,
    backgroundColor,
    strideOverride,
    digitFontVariable,
    magnetRampMilliseconds,
    magnetColor,
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
