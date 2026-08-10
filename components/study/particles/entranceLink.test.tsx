// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import EntranceLink from "@/components/study/particles/entranceLink";
import { LanguageProvider } from "@/lib/i18n/context";

function createStorageMock(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => [...store.keys()][index] ?? null,
    removeItem: (key: string) => store.delete(key),
    setItem: (key: string, value: string) => store.set(key, value),
  };
}

function renderEntranceLink(visible = true) {
  return render(
    <LanguageProvider>
      <EntranceLink visible={visible} />
    </LanguageProvider>,
  );
}

beforeEach(() => {
  Object.defineProperty(window, "localStorage", {
    writable: true,
    configurable: true,
    value: createStorageMock(),
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("EntranceLink", () => {
  it("links to the home page", () => {
    renderEntranceLink();
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/home");
  });

  it("shows the translated entrance label", () => {
    renderEntranceLink();
    expect(screen.getByText("enter")).not.toBeNull();
  });

  it("is inert and hidden until made visible", () => {
    renderEntranceLink(false);
    const link = screen.getByRole("link");
    expect(link.hasAttribute("inert")).toBe(true);
    expect(link.className).toContain("opacity-0");
  });

  it("bounces the arrow while visible", async () => {
    const { container } = renderEntranceLink(true);
    const arrow = container.querySelector(
      "span[aria-hidden='true']",
    ) as HTMLElement;

    expect(arrow.style.transform).toBe("");

    await new Promise((resolve) => {
      setTimeout(resolve, 120);
    });

    expect(arrow.style.transform).toMatch(/^translateX\(/);
  });

  it("moves right when the random direction is positive", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.4);
    const { container } = renderEntranceLink(true);
    const arrow = container.querySelector(
      "span[aria-hidden='true']",
    ) as HTMLElement;

    await new Promise((resolve) => {
      setTimeout(resolve, 120);
    });

    expect(arrow.style.transform).toMatch(/^translateX\(\d/);
  });

  it("clamps the offset to the maximum travel", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.6);
    const { container } = renderEntranceLink(true);
    const arrow = container.querySelector(
      "span[aria-hidden='true']",
    ) as HTMLElement;

    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    const transform = arrow.style.transform;
    expect(transform).toMatch(/^translateX\(-/);
    const offset = Number(transform.slice("translateX(".length, -3));
    expect(Math.abs(offset)).toBeLessThanOrEqual(10);
  });

  it("starts the bounce in the opposite direction when the random sign is negative", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.6);
    const { container } = renderEntranceLink(true);
    const arrow = container.querySelector(
      "span[aria-hidden='true']",
    ) as HTMLElement;

    await new Promise((resolve) => {
      setTimeout(resolve, 120);
    });

    expect(arrow.style.transform).toMatch(/^translateX\(-/);
  });
});
