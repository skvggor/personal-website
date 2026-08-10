// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
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

function renderEntranceLink() {
  return render(
    <LanguageProvider>
      <EntranceLink />
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
});
