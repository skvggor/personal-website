// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  loadStageData,
  readFontFamily,
} from "@/components/study/particles/pipeline";

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

function installFonts(load: () => Promise<unknown>): void {
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: { ready: Promise.resolve(), load },
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

    const data = await loadStageData("/me.avif", 2, 60, 2, "--font-shippori");

    expect(load).toHaveBeenCalled();
    expect(data.stages.length).toBe(4);
    expect(data.count).toBeGreaterThan(0);
    expect(data.seeds.length).toBe(data.count);
  });

  it("tolerates a failing font load", async () => {
    const load = vi.fn(() => Promise.reject(new Error("offline")));
    installFonts(load);

    const data = await loadStageData("/me.avif", 2, 60, 0, "--font-shippori");
    expect(data.stages.length).toBe(2);
  });

  it("rejects when the 2D context is unavailable", async () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

    await expect(
      loadStageData("/me.avif", 2, 60, 0, "--font-shippori"),
    ).rejects.toThrow(/Failed to acquire 2D context/);
  });
});
