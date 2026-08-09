import { describe, expect, it } from "vitest";
import { parseHexColor, resolveColor } from "@/lib/particles/color";

describe("parseHexColor", () => {
  it("parses a six-digit uppercase hex color", () => {
    expect(parseHexColor("#FF8800")).toEqual({
      red: 1,
      green: 136 / 255,
      blue: 0,
    });
  });

  it("parses a lowercase hex color without a hash", () => {
    expect(parseHexColor("00ff00")).toEqual({
      red: 0,
      green: 1,
      blue: 0,
    });
  });

  it("returns null for an invalid hex string", () => {
    expect(parseHexColor("#abc")).toBeNull();
    expect(parseHexColor("not-a-color")).toBeNull();
    expect(parseHexColor("#12345g")).toBeNull();
  });
});

describe("resolveColor", () => {
  const fallback = { red: 0.1, green: 0.2, blue: 0.3 };

  it("returns the parsed color when the hex is valid", () => {
    expect(resolveColor("#ffffff", fallback)).toEqual({
      red: 1,
      green: 1,
      blue: 1,
    });
  });

  it("falls back when the hex is undefined", () => {
    expect(resolveColor(undefined, fallback)).toBe(fallback);
  });

  it("falls back when the hex is invalid", () => {
    expect(resolveColor("nope", fallback)).toBe(fallback);
  });
});
