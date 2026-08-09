import { describe, expect, it } from "vitest";
import {
  capDevicePixelRatio,
  selectStride,
  stepMagnet,
} from "@/lib/particles/runtime";

describe("capDevicePixelRatio", () => {
  it("caps values above the maximum", () => {
    expect(capDevicePixelRatio(3, 2)).toBe(2);
    expect(capDevicePixelRatio(4, 2)).toBe(2);
  });

  it("preserves values within the limit", () => {
    expect(capDevicePixelRatio(1, 2)).toBe(1);
    expect(capDevicePixelRatio(2, 2)).toBe(2);
  });

  it("floors fractional ratios to a minimum of 1", () => {
    expect(capDevicePixelRatio(0.5, 2)).toBe(1);
    expect(capDevicePixelRatio(0, 2)).toBe(1);
  });

  it("defaults to a maximum of 2", () => {
    expect(capDevicePixelRatio(5)).toBe(2);
  });
});

describe("selectStride", () => {
  it("returns a larger stride for coarse pointers (mobile)", () => {
    expect(selectStride(true)).toBe(4);
  });

  it("returns a smaller stride for fine pointers (desktop)", () => {
    expect(selectStride(false)).toBe(2);
  });
});

describe("stepMagnet", () => {
  it("ramps up towards the target without overshooting", () => {
    expect(stepMagnet(0, 1, 0.25)).toBe(0.25);
    expect(stepMagnet(0.9, 1, 0.5)).toBe(1);
  });

  it("ramps down towards the target without undershooting", () => {
    expect(stepMagnet(1, 0, 0.25)).toBe(0.75);
    expect(stepMagnet(0.2, 0, 0.5)).toBe(0);
  });

  it("stays put when already at the target", () => {
    expect(stepMagnet(0.5, 0.5, 0.25)).toBe(0.5);
  });
});
