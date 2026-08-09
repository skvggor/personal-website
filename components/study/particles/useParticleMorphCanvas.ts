import { useEffect, useRef, useState } from "react";
import type { StageData } from "@/components/study/particles/pipeline";
import { loadStageData } from "@/components/study/particles/pipeline";
import {
  bindAttribute,
  createProgram,
  uploadBuffer,
} from "@/components/study/particles/webgl";
import { resolveColor } from "@/lib/particles/color";
import { easeInOutCubic } from "@/lib/particles/easing";
import {
  capDevicePixelRatio,
  selectStride,
  stepMagnet,
} from "@/lib/particles/runtime";
import { computeStageState } from "@/lib/particles/timeline";

export interface ParticleMorphConfiguration {
  readonly width: number;
  readonly height: number;
  readonly imageSource: string;
  readonly countdownFrom: number;
  readonly morphDurationMilliseconds: number;
  readonly stageHoldMilliseconds: number;
  readonly brightnessThreshold: number;
  readonly floatingAmplitude: number;
  readonly pointFillRatio: number;
  readonly backgroundColor: string | undefined;
  readonly strideOverride: number | undefined;
  readonly digitFontVariable: string;
  readonly magnetRampMilliseconds: number;
  readonly magnetColor: string;
}

export interface ParticleMorphCanvas {
  readonly canvasReference: React.RefObject<HTMLCanvasElement | null>;
  readonly renderFallback: boolean;
}

const BLACK: { red: number; green: number; blue: number } = {
  red: 0,
  green: 0,
  blue: 0,
};

export function useParticleMorphCanvas(
  configuration: ParticleMorphConfiguration,
): ParticleMorphCanvas {
  const {
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
  } = configuration;

  const canvasReference = useRef<HTMLCanvasElement>(null);
  const animationFrameReference = useRef<number>(0);
  const mouseReference = useRef({ x: 0, y: 0, active: false });
  const [renderFallback, setRenderFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasReference.current;
    if (!canvas) {
      return;
    }

    const renderingContext = canvas.getContext("webgl");
    if (!renderingContext) {
      setRenderFallback(true);
      return;
    }

    let cancelled = false;
    let resizeListener: (() => void) | undefined;
    let mouseMoveListener: ((event: MouseEvent) => void) | undefined;
    let mouseLeaveListener: (() => void) | undefined;
    const createdBuffers: WebGLBuffer[] = [];

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const stride = strideOverride ?? selectStride(isCoarsePointer);
    const devicePixelRatio = capDevicePixelRatio(window.devicePixelRatio);

    const configureDrawingBuffer = () => {
      canvas.width = Math.round(width * devicePixelRatio);
      canvas.height = Math.round(height * devicePixelRatio);
      renderingContext.viewport(0, 0, canvas.width, canvas.height);
    };
    configureDrawingBuffer();
    resizeListener = () => configureDrawingBuffer();
    window.addEventListener("resize", resizeListener);

    mouseMoveListener = (event: MouseEvent) => {
      const rectangle = canvas.getBoundingClientRect();
      mouseReference.current.x =
        ((event.clientX - rectangle.left) / rectangle.width) * 2 - 1;
      mouseReference.current.y = -(
        ((event.clientY - rectangle.top) / rectangle.height) * 2 -
        1
      );
      mouseReference.current.active = true;
    };
    mouseLeaveListener = () => {
      mouseReference.current.active = false;
    };
    canvas.addEventListener("mousemove", mouseMoveListener);
    canvas.addEventListener("mouseleave", mouseLeaveListener);

    let program: WebGLProgram | null = null;
    let startTime = 0;

    loadStageData(
      imageSource,
      stride,
      brightnessThreshold,
      countdownFrom,
      digitFontVariable,
    )
      .then((stageData: StageData) => {
        if (cancelled || stageData.count === 0) {
          return;
        }
        const { stages, seeds, count, workingSize } = stageData;
        program = createProgram(renderingContext);
        // biome-ignore lint/correctness/useHookAtTopLevel: WebGL useProgram method, not a React hook
        renderingContext.useProgram(program);

        const stagePositionBuffers = stages.map((stage) =>
          uploadBuffer(renderingContext, stage.positions),
        );
        const stageColorBuffers = stages.map((stage) =>
          uploadBuffer(renderingContext, stage.colors),
        );
        createdBuffers.push(...stagePositionBuffers, ...stageColorBuffers);
        const seedBuffer = uploadBuffer(renderingContext, seeds);
        createdBuffers.push(seedBuffer);

        const positionFromLocation = renderingContext.getAttribLocation(
          program,
          "aPositionFrom",
        );
        const positionToLocation = renderingContext.getAttribLocation(
          program,
          "aPositionTo",
        );
        const colorFromLocation = renderingContext.getAttribLocation(
          program,
          "aColorFrom",
        );
        const colorToLocation = renderingContext.getAttribLocation(
          program,
          "aColorTo",
        );
        const seedLocation = renderingContext.getAttribLocation(
          program,
          "aSeed",
        );
        bindAttribute(renderingContext, seedBuffer, seedLocation, 1);

        renderingContext.enable(renderingContext.BLEND);
        renderingContext.blendFunc(
          renderingContext.SRC_ALPHA,
          renderingContext.ONE_MINUS_SRC_ALPHA,
        );
        const background = resolveColor(backgroundColor, BLACK);
        renderingContext.clearColor(
          background.red,
          background.green,
          background.blue,
          backgroundColor ? 1 : 0,
        );

        const progressLocation = renderingContext.getUniformLocation(
          program,
          "uProgress",
        );
        const timeLocation = renderingContext.getUniformLocation(
          program,
          "uTime",
        );
        const amplitudeLocation = renderingContext.getUniformLocation(
          program,
          "uFloatingAmplitude",
        );
        const pointSizeLocation = renderingContext.getUniformLocation(
          program,
          "uPointSize",
        );
        const fillRatioLocation = renderingContext.getUniformLocation(
          program,
          "uFillRatio",
        );
        const mouseLocation = renderingContext.getUniformLocation(
          program,
          "uMouse",
        );
        const magnetLocation = renderingContext.getUniformLocation(
          program,
          "uMagnet",
        );
        const photoWeightLocation = renderingContext.getUniformLocation(
          program,
          "uPhotoWeight",
        );
        const magnetColorLocation = renderingContext.getUniformLocation(
          program,
          "uMagnetColor",
        );
        renderingContext.uniform1f(fillRatioLocation, pointFillRatio);
        const magnet = resolveColor(magnetColor, BLACK);
        renderingContext.uniform3f(
          magnetColorLocation,
          magnet.red,
          magnet.green,
          magnet.blue,
        );

        let activeFromIndex = -1;
        let magnetStrength = 0;
        let previousFrameTime = 0;

        const render = (now: number) => {
          if (cancelled) {
            return;
          }
          const deltaTime =
            previousFrameTime === 0 ? 0 : now - previousFrameTime;
          previousFrameTime = now;
          const elapsed = now - startTime;
          const state = computeStageState({
            elapsedMilliseconds: elapsed,
            morphMilliseconds: morphDurationMilliseconds,
            holdMilliseconds: stageHoldMilliseconds,
            stageCount: stages.length,
          });

          if (state.fromIndex !== activeFromIndex) {
            bindAttribute(
              renderingContext,
              stagePositionBuffers[state.fromIndex],
              positionFromLocation,
              2,
            );
            bindAttribute(
              renderingContext,
              stagePositionBuffers[state.toIndex],
              positionToLocation,
              2,
            );
            bindAttribute(
              renderingContext,
              stageColorBuffers[state.fromIndex],
              colorFromLocation,
              3,
            );
            bindAttribute(
              renderingContext,
              stageColorBuffers[state.toIndex],
              colorToLocation,
              3,
            );
            activeFromIndex = state.fromIndex;
          }

          renderingContext.clear(renderingContext.COLOR_BUFFER_BIT);
          renderingContext.uniform1f(
            progressLocation,
            easeInOutCubic(state.rawProgress),
          );
          renderingContext.uniform1f(timeLocation, elapsed / 1000);
          renderingContext.uniform1f(
            amplitudeLocation,
            floatingAmplitude * state.floatingFactor,
          );
          renderingContext.uniform1f(photoWeightLocation, state.floatingFactor);
          renderingContext.uniform1f(
            pointSizeLocation,
            stride * (canvas.width / workingSize) * pointFillRatio,
          );
          const targetMagnet = mouseReference.current.active
            ? state.floatingFactor
            : 0;
          magnetStrength = stepMagnet(
            magnetStrength,
            targetMagnet,
            deltaTime / magnetRampMilliseconds,
          );
          renderingContext.uniform2f(
            mouseLocation,
            mouseReference.current.x,
            mouseReference.current.y,
          );
          renderingContext.uniform1f(magnetLocation, magnetStrength);
          renderingContext.drawArrays(renderingContext.POINTS, 0, count);
          animationFrameReference.current = requestAnimationFrame(render);
        };
        startTime = performance.now();
        animationFrameReference.current = requestAnimationFrame(render);
      })
      .catch((error: unknown) => {
        console.error("[particleMorph] stage loading failed:", error);
        if (!cancelled) {
          setRenderFallback(true);
        }
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrameReference.current);
      if (resizeListener) {
        window.removeEventListener("resize", resizeListener);
      }
      if (mouseMoveListener) {
        canvas.removeEventListener("mousemove", mouseMoveListener);
      }
      if (mouseLeaveListener) {
        canvas.removeEventListener("mouseleave", mouseLeaveListener);
      }
      if (program) {
        renderingContext.deleteProgram(program);
      }
      for (const buffer of createdBuffers) {
        renderingContext.deleteBuffer(buffer);
      }
    };
  }, [
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
  ]);

  return { canvasReference, renderFallback };
}
