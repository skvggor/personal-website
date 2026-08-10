// @vitest-environment jsdom

import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ParticleMorph from "@/components/study/particles/particleMorph";

const baseProps = {
  width: 100,
  height: 100,
  imageSource: "/me.avif",
  morphDurationMilliseconds: 0,
  brightnessThreshold: 60,
};

interface WebGlStub {
  drawArrays: ReturnType<typeof vi.fn>;
  deleteProgram: ReturnType<typeof vi.fn>;
  deleteBuffer: ReturnType<typeof vi.fn>;
  getExtension: ReturnType<typeof vi.fn>;
  uniform1f: ReturnType<typeof vi.fn>;
}

function createWebGlStub(): WebGlStub {
  const target = {
    drawArrays: vi.fn(),
    deleteProgram: vi.fn(),
    deleteBuffer: vi.fn(),
    getExtension: vi.fn(() => ({ loseContext: vi.fn() })),
    getShaderParameter: vi.fn(() => true),
    getProgramParameter: vi.fn(() => true),
    getAttribLocation: vi.fn(() => 0),
    getUniformLocation: vi.fn((_program: unknown, name: string) => ({ name })),
    uniform1f: vi.fn(),
    createShader: vi.fn(() => ({})),
    createProgram: vi.fn(() => ({})),
    createBuffer: vi.fn(() => ({})),
    VERTEX_SHADER: 35633,
    FRAGMENT_SHADER: 35632,
    COMPILE_STATUS: 35713,
    LINK_STATUS: 35714,
    ARRAY_BUFFER: 34962,
    STATIC_DRAW: 35044,
    FLOAT: 5126,
    POINTS: 0,
    COLOR_BUFFER_BIT: 16384,
    BLEND: 3042,
    SRC_ALPHA: 770,
    ONE_MINUS_SRC_ALPHA: 771,
  };
  return new Proxy(target, {
    get(object, property) {
      return property in object
        ? object[property as keyof typeof object]
        : vi.fn();
    },
  }) as unknown as WebGlStub;
}

const originalGetContext = HTMLCanvasElement.prototype.getContext;
const originalMatchMedia = window.matchMedia;
const originalImage = globalThis.Image;

function installMatchMediaMock(coarsePointer = false): void {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: coarsePointer,
    })),
  });
}

function installFakeImage(): void {
  class MockImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    crossOrigin: string | null = null;
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

interface MountedScene {
  readonly webglStub: WebGlStub;
  readonly container: HTMLElement;
  readonly unmount: () => void;
}

function mountWithWebGl(
  props: Partial<React.ComponentProps<typeof ParticleMorph>> = {},
  pixelFill = 255,
  coarsePointer = false,
): MountedScene {
  const webglStub = createWebGlStub();
  const mockTwoDimensionalContext = {
    drawImage: vi.fn(),
    fillText: vi.fn(),
    getImageData: vi.fn(
      (_x: number, _y: number, width: number, height: number) => ({
        width,
        height,
        data: new Uint8ClampedArray(width * height * 4).fill(pixelFill),
      }),
    ),
  };
  HTMLCanvasElement.prototype.getContext = vi.fn((type: string) => {
    if (type === "2d") {
      return mockTwoDimensionalContext;
    }
    return webglStub;
  }) as unknown as typeof originalGetContext;
  installMatchMediaMock(coarsePointer);
  installFakeImage();

  const { container, unmount } = render(
    <ParticleMorph
      {...baseProps}
      {...props}
    />,
  );
  return { webglStub, container, unmount };
}

function readHoverUniformValues(webglStub: WebGlStub): number[] {
  return webglStub.uniform1f.mock.calls
    .filter((call) => call[0]?.name === "uHover")
    .map((call) => call[1] as number);
}

afterEach(() => {
  cleanup();
  HTMLCanvasElement.prototype.getContext = originalGetContext;
  vi.restoreAllMocks();
  globalThis.Image = originalImage;
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: originalMatchMedia,
  });
});

describe("ParticleMorph", () => {
  it("falls back to an image when WebGL is unavailable", () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null);
    installMatchMediaMock();
    const { container } = render(<ParticleMorph {...baseProps} />);
    const fallback = container.querySelector("img");
    expect(fallback).not.toBeNull();
    expect(fallback?.getAttribute("alt")).toBe("Particle morphing fallback");
  });

  it("renders a canvas and drives the WebGL render loop when WebGL is available", async () => {
    const { webglStub, container } = mountWithWebGl();

    await vi.waitFor(
      () => {
        expect(webglStub.drawArrays).toHaveBeenCalled();
      },
      { timeout: 3000, interval: 20 },
    );

    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("keeps animating across frames and reacts to the pointer", async () => {
    const { webglStub, container, unmount } = mountWithWebGl();
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;

    await vi.waitFor(
      () => {
        expect(webglStub.drawArrays.mock.calls.length).toBeGreaterThan(3);
      },
      { timeout: 3000, interval: 20 },
    );

    fireEvent.mouseMove(canvas, { clientX: 60, clientY: 40 });
    await vi.waitFor(
      () => {
        expect(webglStub.drawArrays.mock.calls.length).toBeGreaterThan(6);
      },
      { timeout: 3000, interval: 20 },
    );

    fireEvent.mouseLeave(canvas);
    unmount();

    expect(webglStub.deleteProgram).toHaveBeenCalled();
    expect(webglStub.deleteBuffer).toHaveBeenCalled();
  });

  it("clears with a solid background when backgroundColor is provided", async () => {
    const { webglStub } = mountWithWebGl({ backgroundColor: "#341d02" });

    await vi.waitFor(
      () => {
        expect(webglStub.drawArrays).toHaveBeenCalled();
      },
      { timeout: 3000, interval: 20 },
    );
  });

  it("skips the render loop when no particles survive the threshold", async () => {
    const { webglStub, container } = mountWithWebGl({}, 0);

    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    expect(container.querySelector("canvas")).not.toBeNull();
    expect(webglStub.drawArrays).not.toHaveBeenCalled();
  });

  it("falls back to the image when stage loading rejects", async () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() =>
      createWebGlStub(),
    ) as unknown as typeof originalGetContext;
    installMatchMediaMock();
    class BrokenImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      naturalWidth = 0;
      naturalHeight = 0;
      source = "";
      set src(value: string) {
        this.source = value;
        setTimeout(() => this.onerror?.(), 0);
      }
      get src(): string {
        return this.source;
      }
    }
    globalThis.Image = BrokenImage as unknown as typeof Image;

    const { container, findByRole } = render(<ParticleMorph {...baseProps} />);
    const fallback = await findByRole("img");
    expect(fallback.getAttribute("alt")).toBe("Particle morphing fallback");
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("toggles the hover photo on tap with a coarse pointer", async () => {
    const { webglStub, container } = mountWithWebGl(
      { morphDurationMilliseconds: 0, stageHoldMilliseconds: 0 },
      255,
      true,
    );
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;

    await vi.waitFor(
      () => {
        expect(webglStub.drawArrays).toHaveBeenCalled();
      },
      { timeout: 3000, interval: 20 },
    );

    const lastHoverValue = () => readHoverUniformValues(webglStub).at(-1) ?? 0;

    expect(lastHoverValue()).toBeLessThan(0.1);

    fireEvent.click(canvas);
    await vi.waitFor(
      () => {
        expect(lastHoverValue()).toBeGreaterThan(0.9);
      },
      { timeout: 3000, interval: 20 },
    );

    fireEvent.click(canvas);
    await vi.waitFor(
      () => {
        expect(lastHoverValue()).toBeLessThan(0.1);
      },
      { timeout: 3000, interval: 20 },
    );
  });
});
