import { describe, expect, it } from "vitest";
import { toNormalizedDeviceCoordinates } from "@/lib/particles/aspect";

describe("toNormalizedDeviceCoordinates", () => {
  it("maps the center to the origin for a square", () => {
    const coordinates = toNormalizedDeviceCoordinates(0.5, 0.5, 10, 10);
    expect(coordinates.x).toBeCloseTo(0, 10);
    expect(coordinates.y).toBeCloseTo(0, 10);
  });

  it("spans the full [-1, 1] range on both axes for a square", () => {
    const topLeft = toNormalizedDeviceCoordinates(0, 0, 10, 10);
    const bottomRight = toNormalizedDeviceCoordinates(1, 1, 10, 10);
    expect(topLeft.x).toBeCloseTo(-1, 10);
    expect(bottomRight.x).toBeCloseTo(1, 10);
    expect(topLeft.y).toBeCloseTo(1, 10);
    expect(bottomRight.y).toBeCloseTo(-1, 10);
  });

  it("compresses the vertical axis for a landscape image", () => {
    const top = toNormalizedDeviceCoordinates(0.5, 0, 20, 10);
    const bottom = toNormalizedDeviceCoordinates(0.5, 1, 20, 10);
    expect(Math.abs(top.y)).toBeCloseTo(0.5, 10);
    expect(Math.abs(bottom.y)).toBeCloseTo(0.5, 10);
  });

  it("compresses the horizontal axis for a portrait image", () => {
    const left = toNormalizedDeviceCoordinates(0, 0.5, 10, 20);
    const right = toNormalizedDeviceCoordinates(1, 0.5, 10, 20);
    expect(Math.abs(left.x)).toBeCloseTo(0.5, 10);
    expect(Math.abs(right.x)).toBeCloseTo(0.5, 10);
  });
});
