// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadStageData, readFontFamily } from "@/components/particles/pipeline";

const originalGetContext = HTMLCanvasElement.prototype.getContext;
const originalImage = globalThis.Image;
const originalFonts = Object.getOwnPropertyDescriptor(
  Document.prototype,
  "fonts",
);

function installFakeImage(): void {
  class MockImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    naturalWidth = 4;
    naturalHeight = 4;
    source = "";
    set src(value: string) {
      this.source = value;
      setTimeout(() => this.onload?.(), 0);
    }
    get src(): string {
      return this.source;
    }
  }
  globalThis.Image = MockImage as unknown as typeof Image;
}

function installTwoDimensionalContext(): void {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    drawImage: vi.fn(),
    fillText: vi.fn(),
    getImageData: vi.fn(
      (_x: number, _y: number, width: number, height: number) => ({
        width,
        height,
        data: new Uint8ClampedArray(width * height * 4).fill(255),
      }),
    ),
  })) as unknown as typeof originalGetContext;
}

function installFonts(
  load: () => Promise<unknown>,
  ready: Promise<unknown> = Promise.resolve(),
): void {
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: { ready, load },
  });
}

beforeEach(() => {
  installFakeImage();
  installTwoDimensionalContext();
});

afterEach(() => {
  HTMLCanvasElement.prototype.getContext = originalGetContext;
  globalThis.Image = originalImage;
  if (originalFonts) {
    Object.defineProperty(Document.prototype, "fonts", originalFonts);
  } else {
    delete (document as { fonts?: unknown }).fonts;
  }
});

describe("readFontFamily", () => {
  it("falls back to serif when the variable is not defined", () => {
    expect(readFontFamily("--does-not-exist")).toBe("serif");
  });
});

describe("loadStageData", () => {
  it("builds one stage per countdown digit plus the photo, awaiting fonts", async () => {
    const load = vi.fn(() => Promise.resolve());
    installFonts(load);

    const data = await loadStageData(
      "/me.avif",
      "/me2.avif",
      2,
      60,
      2,
      "--font-shippori",
    );

    expect(load).toHaveBeenCalled();
    expect(data.stages.length).toBe(3);
    expect(data.count).toBeGreaterThan(0);
    expect(data.seeds.length).toBe(data.count);
    expect(data.hover.positions.length).toBe(data.count * 2);
    expect(data.hover.colors.length).toBe(data.count * 3);
  });

  it("tolerates a failing font load", async () => {
    const load = vi.fn(() => Promise.reject(new Error("offline")));
    installFonts(load);

    const data = await loadStageData(
      "/me.avif",
      "/me2.avif",
      2,
      60,
      0,
      "--font-shippori",
    );
    expect(data.stages.length).toBe(1);
  });

  it("proceeds when the font never settles instead of hanging", async () => {
    const neverSettles = () => new Promise<unknown>(() => undefined);
    installFonts(neverSettles, new Promise(() => undefined));

    const data = await loadStageData(
      "/me.avif",
      "/me2.avif",
      2,
      60,
      0,
      "--font-shippori",
    );
    expect(data.stages.length).toBe(1);
  });

  it("rejects when the 2D context is unavailable", async () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

    await expect(
      loadStageData("/me.avif", "/me2.avif", 2, 60, 0, "--font-shippori"),
    ).rejects.toThrow(/Failed to acquire 2D context/);
  });
});
