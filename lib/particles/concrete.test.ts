import { describe, expect, it } from "vitest";
import { concreteRender, distanceTransform } from "@/lib/particles/concrete";

describe("distanceTransform", () => {
  it("returns zero distance for an empty mask", () => {
    const mask = new Uint8Array([0, 0, 0, 0]);
    const distance = distanceTransform(mask, 2, 2);
    expect(Array.from(distance)).toEqual([0, 0, 0, 0]);
  });

  it("computes distance to the nearest empty cell", () => {
    const mask = new Uint8Array([
      0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
    ]);
    const distance = distanceTransform(mask, 5, 5);
    const center = distance[2 * 5 + 2];
    expect(center).toBeGreaterThan(1);
    const edge = distance[1 * 5 + 1];
    expect(edge).toBeLessThan(center);
  });
});

describe("concreteRender", () => {
  it("produces no particles for an empty mask", () => {
    const result = concreteRender(new Uint8Array(16), 4, 4, 1);
    expect(result.positions.length).toBe(0);
    expect(result.colors.length).toBe(0);
  });

  it("emits positions and colors for every filled pixel", () => {
    const mask = new Uint8Array([0, 0, 0, 0, 1, 0, 0, 0, 0]);
    const result = concreteRender(mask, 3, 3, 5);
    expect(result.positions.length).toBe(2);
    expect(result.colors.length).toBe(3);
    for (const channel of result.colors) {
      expect(channel).toBeGreaterThanOrEqual(0);
      expect(channel).toBeLessThanOrEqual(1);
    }
  });

  it("is deterministic for the same mask and seed", () => {
    const mask = new Uint8Array([
      0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
    ]);
    const first = concreteRender(mask, 4, 4, 42);
    const second = concreteRender(mask, 4, 4, 42);
    expect(Array.from(first.positions)).toEqual(Array.from(second.positions));
    expect(Array.from(first.colors)).toEqual(Array.from(second.colors));
  });

  it("keeps colors within the concrete palette range", () => {
    const mask = new Uint8Array(100).fill(1);
    const result = concreteRender(mask, 10, 10, 3);
    expect(result.colors.length).toBe(10 * 10 * 3);
    for (const channel of result.colors) {
      expect(channel).toBeGreaterThanOrEqual(0);
      expect(channel).toBeLessThanOrEqual(1);
    }
  });
});
