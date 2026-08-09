export function easeInOutCubic(time: number): number {
  return time < 0.5 ? 4 * time * time * time : 1 - (-2 * time + 2) ** 3 / 2;
}

export function smoothstep(
  edge0: number,
  edge1: number,
  value: number,
): number {
  const span = edge1 - edge0;
  if (span === 0) return value <= edge0 ? 0 : 1;
  const clamped = Math.max(0, Math.min(1, (value - edge0) / span));
  return clamped * clamped * (3 - 2 * clamped);
}
