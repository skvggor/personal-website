"use client";

import { useCallback, useEffect, useState } from "react";

import { usePageTransition } from "@/lib/transition/context";

interface Theme {
  readonly id: string;
  readonly label: string;
  readonly swatch: string;
}

const themes: Theme[] = [
  { id: "terracotta", label: "赤土", swatch: "#d89868" },
  { id: "sumi", label: "墨", swatch: "#1c1a17" },
  { id: "matcha", label: "抹茶", swatch: "#354028" },
  { id: "washi", label: "和紙", swatch: "#d8cab0" },
  { id: "ai", label: "藍", swatch: "#1b3a4b" },
  { id: "sakura", label: "桜", swatch: "#deb0b0" },
];

const STORAGE_KEY = "theme";

const SIZES = {
  default: { collapsed: "40px", padding: "12px", label: "60px" },
  large: { collapsed: "48px", padding: "16px", label: "80px" },
};

export default function ThemeSelector() {
  const [active, setActive] = useState("terracotta");
  const [displayActive, setDisplayActive] = useState("terracotta");
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { triggerTransition } = usePageTransition();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && themes.some((theme) => theme.id === stored)) {
      setActive(stored);
      setDisplayActive(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }

    const mediaQuery = window.matchMedia("(min-width: 2560px)");
    setIsLargeScreen(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) =>
      setIsLargeScreen(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleSelect = useCallback(
    (themeId: string) => {
      if (themeId === active) return;
      setHoveredTheme(null);
      triggerTransition(() => {
        setActive(themeId);
        setDisplayActive(themeId);
        document.documentElement.setAttribute("data-theme", themeId);
        localStorage.setItem(STORAGE_KEY, themeId);
      });
    },
    [active, triggerTransition],
  );

  const handlePointerEnter = useCallback((themeId: string) => {
    setHoveredTheme(themeId);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setHoveredTheme(null);
  }, []);

  const sizes = isLargeScreen ? SIZES.large : SIZES.default;

  return (
    <div
      className="fixed right-2 min-[2560px]:right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col items-end gap-0 min-[2560px]:gap-1 animate-fade-in-slide-right"
      style={{ animationDelay: "1s" }}
    >
      {[...themes].sort((a, b) => (a.id === displayActive ? -1 : b.id === displayActive ? 1 : 0)).map((theme) => {
        const isExpanded = hoveredTheme === theme.id;
        const isActive = displayActive === theme.id;

        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => handleSelect(theme.id)}
            onPointerEnter={() => handlePointerEnter(theme.id)}
            onPointerLeave={handlePointerLeave}
            className="cursor-pointer flex items-center justify-end h-10 min-[2560px]:h-12 gap-2 min-[2560px]:gap-3 pr-3 min-[2560px]:pr-4 rounded-full transition-all duration-300 ease-out focus:outline-none"
            style={{
              width: isExpanded ? "auto" : sizes.collapsed,
              paddingLeft: isExpanded ? sizes.padding : "0",
              backgroundColor: isExpanded
                ? `color-mix(in srgb, ${theme.swatch} 20%, transparent)`
                : "transparent",
            }}
            aria-label={`Theme: ${theme.label}`}
          >
            <span
              className="text-[0.65rem] min-[2560px]:text-sm font-bold tracking-wider whitespace-nowrap overflow-hidden transition-all duration-300 ease-out"
              style={{
                fontFamily: "var(--font-shippori)",
                maxWidth: isExpanded ? sizes.label : "0",
                opacity: isExpanded ? 1 : 0,
                color: theme.swatch,
              }}
            >
              {theme.label}
            </span>
            <span
              className="block h-4 w-4 min-[2560px]:h-5 min-[2560px]:w-5 shrink-0 rounded-full transition-all duration-300"
              style={{
                backgroundColor: theme.swatch,
                boxShadow: isActive
                  ? `0 0 0 2px var(--poster-bg), 0 0 0 3.5px ${theme.swatch}`
                  : "0 1px 3px rgba(0,0,0,0.15)",
                transform: isExpanded ? "scale(1.2)" : "scale(1)",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
