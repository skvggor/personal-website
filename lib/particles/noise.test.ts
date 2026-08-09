import { describe, expect, it } from "vitest";
import { fractionalBrownianMotion, valueNoise } from "@/lib/particles/noise";

describe("valueNoise", () => {
  it("returns values in the [0, 1) range", () => {
    for (let step = 0; step < 40; step += 1) {
      const value = valueNoise(step * 0.37, step * 0.91, 7);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("is deterministic for the same input and seed", () => {
    expect(valueNoise(3.2, 4.8, 12)).toBe(valueNoise(3.2, 4.8, 12));
  });

  it("matches at integer coordinates across seeds", () => {
    expect(valueNoise(5, 5, 1)).not.toBe(valueNoise(5, 5, 2));
  });
});

describe("fractionalBrownianMotion", () => {
  it("returns values within the [0, 1] range", () => {
    for (let step = 0; step < 40; step += 1) {
      const value = fractionalBrownianMotion(step * 0.21, step * 0.55, 9, 3);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });

  it("is deterministic for the same input", () => {
    const first = fractionalBrownianMotion(1.5, 2.5, 4, 4);
    const second = fractionalBrownianMotion(1.5, 2.5, 4, 4);
    expect(first).toBe(second);
  });
});
