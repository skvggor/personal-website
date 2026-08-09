export interface RgbColor {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
}

const HEX_COLOR_PATTERN = /^[0-9a-fA-F]{6}$/;

export function parseHexColor(hex: string): RgbColor | null {
  const normalized = hex.replace("#", "").trim();
  if (!HEX_COLOR_PATTERN.test(normalized)) {
    return null;
  }
  const integer = Number.parseInt(normalized, 16);
  return {
    red: ((integer >> 16) & 0xff) / 255,
    green: ((integer >> 8) & 0xff) / 255,
    blue: (integer & 0xff) / 255,
  };
}

export function resolveColor(
  hex: string | undefined,
  fallback: RgbColor,
): RgbColor {
  if (!hex) {
    return fallback;
  }
  return parseHexColor(hex) ?? fallback;
}
