import { describe, expect, it } from "vitest";
import { easeInOutCubic, smoothstep } from "@/lib/particles/easing";

describe("easeInOutCubic", () => {
  it("returns boundary values at 0 and 1", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
  });

  it("produces a value in the open interval for midpoint", () => {
    const value = easeInOutCubic(0.5);
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThan(1);
    expect(value).toBeCloseTo(0.5, 1);
  });

  it("is monotonically increasing", () => {
    const previous = easeInOutCubic(0.3);
    const next = easeInOutCubic(0.7);
    expect(next).toBeGreaterThan(previous);
  });
});

describe("smoothstep", () => {
  it("clamps below edge0 and above edge1", () => {
    expect(smoothstep(0, 1, -1)).toBe(0);
    expect(smoothstep(0, 1, 2)).toBe(1);
  });

  it("returns boundaries exactly at the edges", () => {
    expect(smoothstep(0, 1, 0)).toBe(0);
    expect(smoothstep(0, 1, 1)).toBe(1);
  });

  it("returns 0.5 at the midpoint", () => {
    expect(smoothstep(0, 1, 0.5)).toBe(0.5);
  });

  it("handles a zero span without dividing by zero", () => {
    expect(smoothstep(5, 5, 3)).toBe(0);
    expect(smoothstep(5, 5, 6)).toBe(1);
  });

  it("works with a reversed edge range", () => {
    expect(smoothstep(1, 0, 0.5)).toBe(0.5);
  });
});
