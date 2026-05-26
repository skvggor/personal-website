"use client";

import { useCallback, useEffect, useState } from "react";

interface Theme {
  readonly id: string;
  readonly label: string;
  readonly swatch: string;
}

const themes: Theme[] = [
  { id: "terracotta", label: "赤土", swatch: "#c4693e" },
  { id: "sumi", label: "墨", swatch: "#1c1a17" },
  { id: "matcha", label: "抹茶", swatch: "#5e6b50" },
  { id: "washi", label: "和紙", swatch: "#d8cab0" },
  { id: "ai", label: "藍", swatch: "#1b3a4b" },
  { id: "sakura", label: "桜", swatch: "#d4a0a0" },
];

const STORAGE_KEY = "theme";

export default function ThemeSelector() {
  const [active, setActive] = useState("terracotta");
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && themes.some((theme) => theme.id === stored)) {
      setActive(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  const handleSelect = useCallback((themeId: string) => {
    setActive(themeId);
    setHoveredTheme(null);
    document.documentElement.setAttribute("data-theme", themeId);
    localStorage.setItem(STORAGE_KEY, themeId);
  }, []);

  const handlePointerEnter = useCallback((themeId: string) => {
    setHoveredTheme(themeId);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setHoveredTheme(null);
  }, []);

  return (
    <div
      className="fixed right-2 top-1/2 z-50 flex -translate-y-1/2 flex-col items-end gap-0 animate-fade-in-slide-right"
      style={{ animationDelay: "1s" }}
    >
      {themes.map((theme) => {
        const isExpanded = hoveredTheme === theme.id;
        const isActive = active === theme.id;

        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => handleSelect(theme.id)}
            onPointerEnter={() => handlePointerEnter(theme.id)}
            onPointerLeave={handlePointerLeave}
            className="flex items-center justify-end h-10 gap-2 pr-3 rounded-full transition-all duration-300 ease-out focus:outline-none"
            style={{
              width: isExpanded ? "auto" : "40px",
              paddingLeft: isExpanded ? "12px" : "0",
              backgroundColor: isExpanded
                ? `color-mix(in srgb, ${theme.swatch} 20%, transparent)`
                : "transparent",
            }}
            aria-label={`Theme: ${theme.label}`}
          >
            <span
              className="text-[0.65rem] font-bold tracking-wider whitespace-nowrap overflow-hidden transition-all duration-300 ease-out"
              style={{
                fontFamily: "var(--font-shippori)",
                maxWidth: isExpanded ? "60px" : "0",
                opacity: isExpanded ? 1 : 0,
                color: theme.swatch,
              }}
            >
              {theme.label}
            </span>
            <span
              className="block h-4 w-4 shrink-0 rounded-full transition-all duration-300"
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
