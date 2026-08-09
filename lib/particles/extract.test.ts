import { describe, expect, it } from "vitest";
import type { ParticleData } from "@/lib/particles/extract";
import { extractParticles } from "@/lib/particles/extract";

function buildPixels(
  width: number,
  height: number,
  fill: (column: number, row: number) => readonly [number, number, number],
): Uint8ClampedArray {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const [red, green, blue] = fill(column, row);
      const index = (row * width + column) * 4;
      pixels[index] = red;
      pixels[index + 1] = green;
      pixels[index + 2] = blue;
      pixels[index + 3] = 255;
    }
  }
  return pixels;
}

const WHITE: readonly [number, number, number] = [255, 255, 255];
const BLACK: readonly [number, number, number] = [0, 0, 0];

describe("extractParticles", () => {
  it("returns empty data for non-positive dimensions", () => {
    const pixels = new Uint8ClampedArray(0);
    const result = extractParticles({
      pixels,
      width: 0,
      height: 10,
      stride: 1,
      brightnessThreshold: 128,
    });
    expect(result.count).toBe(0);
    expect(result.positions.length).toBe(0);
  });

  it("omits dark pixels below the brightness threshold", () => {
    const pixels = buildPixels(2, 1, () => BLACK);
    const result = extractParticles({
      pixels,
      width: 2,
      height: 1,
      stride: 1,
      brightnessThreshold: 128,
    });
    expect(result.count).toBe(0);
  });

  it("keeps bright pixels and records their normalized color", () => {
    const pixels = buildPixels(1, 1, () => WHITE);
    const result = extractParticles({
      pixels,
      width: 1,
      height: 1,
      stride: 1,
      brightnessThreshold: 128,
    });
    expect(result.count).toBe(1);
    expect(result.colors[0]).toBeCloseTo(1);
    expect(result.colors[1]).toBeCloseTo(1);
    expect(result.colors[2]).toBeCloseTo(1);
  });

  it("counts particles respecting the sampling stride", () => {
    const pixels = buildPixels(4, 4, () => WHITE);
    const result: ParticleData = extractParticles({
      pixels,
      width: 4,
      height: 4,
      stride: 2,
      brightnessThreshold: 128,
    });
    expect(result.count).toBe(4);
  });

  it("handles a stride larger than the dimensions gracefully", () => {
    const pixels = buildPixels(2, 2, () => WHITE);
    const result = extractParticles({
      pixels,
      width: 2,
      height: 2,
      stride: 10,
      brightnessThreshold: 128,
    });
    expect(result.count).toBe(1);
  });

  it("normalizes positions into clip space centered at the origin", () => {
    const pixels = buildPixels(3, 1, () => WHITE);
    const result = extractParticles({
      pixels,
      width: 3,
      height: 1,
      stride: 1,
      brightnessThreshold: 128,
    });
    expect(result.count).toBe(3);
    const middleX = result.positions[2];
    expect(middleX).toBeCloseTo(0, 5);
  });

  it("preserves aspect ratio for portrait dimensions", () => {
    const pixels = buildPixels(1, 2, () => WHITE);
    const result = extractParticles({
      pixels,
      width: 1,
      height: 2,
      stride: 1,
      brightnessThreshold: 128,
    });
    expect(result.count).toBe(2);
    for (let index = 0; index < result.positions.length; index += 2) {
      const x = result.positions[index];
      expect(Math.abs(x)).toBeLessThanOrEqual(1);
    }
  });
});
