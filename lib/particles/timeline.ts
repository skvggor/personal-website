export interface StageState {
  readonly fromIndex: number;
  readonly toIndex: number;
  readonly rawProgress: number;
  readonly floatingFactor: number;
  readonly settled: boolean;
}

export interface StageTimelineOptions {
  readonly elapsedMilliseconds: number;
  readonly morphMilliseconds: number;
  readonly holdMilliseconds: number;
  readonly stageCount: number;
}

export function computeStageState(options: StageTimelineOptions): StageState {
  const {
    elapsedMilliseconds,
    morphMilliseconds,
    holdMilliseconds,
    stageCount,
  } = options;
  const transitionDuration = morphMilliseconds + holdMilliseconds;
  const transitionCount = Math.max(0, stageCount - 1);

  if (transitionCount === 0 || transitionDuration <= 0) {
    return {
      fromIndex: 0,
      toIndex: 0,
      rawProgress: 1,
      floatingFactor: 1,
      settled: true,
    };
  }

  const clampedElapsed = Math.max(0, elapsedMilliseconds);
  const lastTransitionStart = (transitionCount - 1) * transitionDuration;
  const settled = clampedElapsed >= transitionCount * transitionDuration;

  const transitionIndex = Math.min(
    Math.floor(clampedElapsed / transitionDuration),
    transitionCount - 1,
  );
  const within = clampedElapsed - transitionIndex * transitionDuration;
  const rawProgress = Math.min(within / morphMilliseconds, 1);

  const floatingElapsed = clampedElapsed - lastTransitionStart;
  const floatingFactor = Math.max(
    0,
    Math.min(floatingElapsed / transitionDuration, 1),
  );

  return {
    fromIndex: transitionIndex,
    toIndex: transitionIndex + 1,
    rawProgress,
    floatingFactor,
    settled,
  };
}
