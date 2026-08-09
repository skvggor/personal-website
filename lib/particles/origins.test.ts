import { describe, expect, it } from "vitest";
import {
  createRandom,
  resampleStage,
  uniformResampleStage,
} from "@/lib/particles/origins";

describe("createRandom", () => {
  it("produces values in the [0, 1) interval", () => {
    const random = createRandom(42);
    for (let index = 0; index < 100; index += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("is deterministic for the same seed", () => {
    const first = createRandom(7);
    const second = createRandom(7);
    for (let index = 0; index < 10; index += 1) {
      expect(first()).toBe(second());
    }
  });

  it("varies the sequence with the seed", () => {
    const first = createRandom(1);
    const second = createRandom(999);
    expect(first()).not.toBe(second());
  });
});

describe("resampleStage", () => {
  it("returns the requested number of particles", () => {
    const positions = new Float32Array([0, 0, 1, 1, 2, 2]);
    const colors = new Float32Array([0, 0, 0, 1, 1, 1, 2, 2, 2]);
    const result = resampleStage(positions, colors, 10, 1);
    expect(result.positions.length).toBe(20);
    expect(result.colors.length).toBe(30);
  });

  it("only emits samples present in the source", () => {
    const positions = new Float32Array([10, 20, 30, 40]);
    const colors = new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5, 0.6]);
    const result = resampleStage(positions, colors, 50, 7);
    for (let index = 0; index < result.positions.length; index += 2) {
      const x = result.positions[index];
      const y = result.positions[index + 1];
      const matchesSource = (x === 10 && y === 20) || (x === 30 && y === 40);
      expect(matchesSource).toBe(true);
    }
  });

  it("is deterministic for the same seed", () => {
    const positions = new Float32Array([0, 1, 2, 3, 4, 5, 6, 7]);
    const colors = new Float32Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    const first = resampleStage(positions, colors, 20, 42);
    const second = resampleStage(positions, colors, 20, 42);
    expect(Array.from(first.positions)).toEqual(Array.from(second.positions));
    expect(Array.from(first.colors)).toEqual(Array.from(second.colors));
  });

  it("returns zero-filled arrays for an empty source", () => {
    const result = resampleStage(
      new Float32Array(0),
      new Float32Array(0),
      8,
      1,
    );
    expect(result.positions.length).toBe(16);
    expect(result.colors.length).toBe(24);
    expect(result.positions.every((value) => value === 0)).toBe(true);
  });

  it("returns empty arrays for a non-positive target count", () => {
    const positions = new Float32Array([1, 2]);
    const colors = new Float32Array([1, 2, 3]);
    const result = resampleStage(positions, colors, 0, 1);
    expect(result.positions.length).toBe(0);
    expect(result.colors.length).toBe(0);
  });
});

describe("uniformResampleStage", () => {
  it("returns the requested number of particles", () => {
    const positions = new Float32Array([0, 0, 1, 1, 2, 2]);
    const colors = new Float32Array([0, 0, 0, 1, 1, 1, 2, 2, 2]);
    const result = uniformResampleStage(positions, colors, 10);
    expect(result.positions.length).toBe(20);
    expect(result.colors.length).toBe(30);
  });

  it("spans the whole source range without skipping the first or last sample", () => {
    const positions = new Float32Array([0, 0, 10, 10, 20, 20, 30, 30]);
    const colors = new Float32Array([0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3]);
    const result = uniformResampleStage(positions, colors, 4);
    expect(result.positions[0]).toBe(0);
    expect(result.positions[result.positions.length - 1]).toBe(30);
  });

  it("preserves raster order so the output is monotonically distributed", () => {
    const positions = new Float32Array([0, 0, 1, 1, 2, 2, 3, 3, 4, 4]);
    const colors = new Float32Array([0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3]);
    const result = uniformResampleStage(positions, colors, 5);
    const xValues = Array.from(result.positions.filter((_, i) => i % 2 === 0));
    const sortedXValues = [...xValues].sort((a, b) => a - b);
    expect(xValues).toEqual(sortedXValues);
  });

  it("is deterministic and independent of call order", () => {
    const positions = new Float32Array([0, 1, 2, 3, 4, 5, 6, 7]);
    const colors = new Float32Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    const first = uniformResampleStage(positions, colors, 20);
    const second = uniformResampleStage(positions, colors, 20);
    expect(Array.from(first.positions)).toEqual(Array.from(second.positions));
    expect(Array.from(first.colors)).toEqual(Array.from(second.colors));
  });

  it("returns zero-filled arrays for an empty source", () => {
    const result = uniformResampleStage(
      new Float32Array(0),
      new Float32Array(0),
      8,
    );
    expect(result.positions.length).toBe(16);
    expect(result.positions.every((value) => value === 0)).toBe(true);
  });

  it("returns empty arrays for a non-positive target count", () => {
    const positions = new Float32Array([1, 2]);
    const colors = new Float32Array([1, 2, 3]);
    const result = uniformResampleStage(positions, colors, 0);
    expect(result.positions.length).toBe(0);
    expect(result.colors.length).toBe(0);
  });
});
