export function capDevicePixelRatio(
  devicePixelRatio: number,
  maximum: number = 2,
): number {
  return Math.max(1, Math.min(devicePixelRatio, maximum));
}

export function selectStride(isCoarsePointer: boolean): number {
  return isCoarsePointer ? 4 : 2;
}

export function stepRamp(
  current: number,
  target: number,
  rampStep: number,
): number {
  if (current < target) {
    return Math.min(target, current + rampStep);
  }
  if (current > target) {
    return Math.max(target, current - rampStep);
  }
  return current;
}
