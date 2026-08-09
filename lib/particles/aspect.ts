export interface NormalizedDeviceCoordinates {
  readonly x: number;
  readonly y: number;
}

export function toNormalizedDeviceCoordinates(
  horizontal: number,
  vertical: number,
  width: number,
  height: number,
): NormalizedDeviceCoordinates {
  const aspect = width >= height ? width / height : height / width;
  if (width >= height) {
    return {
      x: horizontal * 2 - 1,
      y: -((vertical * 2 - 1) / aspect),
    };
  }
  return {
    x: (horizontal * 2 - 1) / aspect,
    y: -(vertical * 2 - 1),
  };
}
