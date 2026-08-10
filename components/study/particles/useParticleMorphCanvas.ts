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
  stepRamp,
} from "@/lib/particles/runtime";
import { computeStageState } from "@/lib/particles/timeline";

export interface ParticleMorphConfiguration {
  readonly width: number;
  readonly height: number;
  readonly imageSource: string;
  readonly hoverImageSource: string;
  readonly countdownFrom: number;
  readonly morphDurationMilliseconds: number;
  readonly stageHoldMilliseconds: number;
  readonly brightnessThreshold: number;
  readonly floatingAmplitude: number;
  readonly pointFillRatio: number;
  readonly backgroundColor: string | undefined;
  readonly strideOverride: number | undefined;
  readonly digitFontVariable: string;
  readonly hoverMorphMilliseconds: number;
  readonly onInitialAnimationComplete?: () => void;
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
  } = configuration;

  const canvasReference = useRef<HTMLCanvasElement>(null);
  const animationFrameReference = useRef<number>(0);
  const hoverReference = useRef(false);
  const initialAnimationCompleteReference = useRef(false);
  const onInitialAnimationCompleteReference = useRef(
    onInitialAnimationComplete,
  );
  const [renderFallback, setRenderFallback] = useState(false);

  useEffect(() => {
    onInitialAnimationCompleteReference.current = onInitialAnimationComplete;
  }, [onInitialAnimationComplete]);

  useEffect(() => {
    const canvas = canvasReference.current;
    if (!canvas) {
      return;
    }

    const completeInitialAnimation = () => {
      if (initialAnimationCompleteReference.current) {
        return;
      }
      initialAnimationCompleteReference.current = true;
      onInitialAnimationCompleteReference.current?.();
    };

    const renderingContext = canvas.getContext("webgl");
    if (!renderingContext) {
      setRenderFallback(true);
      completeInitialAnimation();
      return;
    }

    let cancelled = false;
    let resizeListener: (() => void) | undefined;
    let mouseMoveListener: ((event: MouseEvent) => void) | undefined;
    let mouseLeaveListener: (() => void) | undefined;
    let tapListener: (() => void) | undefined;
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

    if (isCoarsePointer) {
      tapListener = () => {
        hoverReference.current = !hoverReference.current;
      };
      canvas.addEventListener("click", tapListener);
    } else {
      mouseMoveListener = () => {
        hoverReference.current = true;
      };
      mouseLeaveListener = () => {
        hoverReference.current = false;
      };
      canvas.addEventListener("mousemove", mouseMoveListener);
      canvas.addEventListener("mouseleave", mouseLeaveListener);
    }

    let program: WebGLProgram | null = null;
    let startTime = 0;

    loadStageData(
      imageSource,
      hoverImageSource,
      stride,
      brightnessThreshold,
      countdownFrom,
      digitFontVariable,
    )
      .then((stageData: StageData) => {
        if (cancelled) {
          return;
        }
        if (stageData.count === 0) {
          completeInitialAnimation();
          return;
        }
        const { stages, seeds, count, workingSize, hover } = stageData;
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
        const hoverPositionBuffer = uploadBuffer(
          renderingContext,
          hover.positions,
        );
        const hoverColorBuffer = uploadBuffer(renderingContext, hover.colors);
        createdBuffers.push(seedBuffer, hoverPositionBuffer, hoverColorBuffer);

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
        const hoverPositionLocation = renderingContext.getAttribLocation(
          program,
          "aHoverPosition",
        );
        const hoverColorLocation = renderingContext.getAttribLocation(
          program,
          "aHoverColor",
        );
        bindAttribute(renderingContext, seedBuffer, seedLocation, 1);
        bindAttribute(
          renderingContext,
          hoverPositionBuffer,
          hoverPositionLocation,
          2,
        );
        bindAttribute(
          renderingContext,
          hoverColorBuffer,
          hoverColorLocation,
          3,
        );

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
        const hoverLocation = renderingContext.getUniformLocation(
          program,
          "uHover",
        );
        const photoWeightLocation = renderingContext.getUniformLocation(
          program,
          "uPhotoWeight",
        );
        renderingContext.uniform1f(fillRatioLocation, pointFillRatio);

        let activeFromIndex = -1;
        let hoverProgress = 0;
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

          if (state.settled) {
            completeInitialAnimation();
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
          const targetHover = hoverReference.current ? state.floatingFactor : 0;
          hoverProgress = stepRamp(
            hoverProgress,
            targetHover,
            deltaTime / hoverMorphMilliseconds,
          );
          renderingContext.uniform1f(
            hoverLocation,
            easeInOutCubic(hoverProgress),
          );
          renderingContext.drawArrays(renderingContext.POINTS, 0, count);
          animationFrameReference.current = requestAnimationFrame(render);
        };
        startTime = performance.now();
        animationFrameReference.current = requestAnimationFrame(render);
      })
      .catch((error: unknown) => {
        console.error("[particleMorph] stage loading failed:", error);
        if (!cancelled) {
          completeInitialAnimation();
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
      if (tapListener) {
        canvas.removeEventListener("click", tapListener);
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
  ]);

  return { canvasReference, renderFallback };
}
