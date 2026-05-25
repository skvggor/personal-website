"use client";

import { motion } from "motion/react";
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
];

const STORAGE_KEY = "theme";

export default function ThemeSelector() {
  const [active, setActive] = useState("terracotta");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && themes.some((theme) => theme.id === stored)) {
      setActive(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  const handleSelect = useCallback((themeId: string) => {
    setActive(themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    localStorage.setItem(STORAGE_KEY, themeId);
  }, []);

  return (
    <motion.div
      className="fixed right-6 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-3"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      {themes.map((theme) => (
        <button
          key={theme.id}
          type="button"
          onClick={() => handleSelect(theme.id)}
          className="h-4 w-4 rounded-full transition-transform hover:scale-125 focus:outline-none"
          style={{
            backgroundColor: theme.swatch,
            boxShadow:
              active === theme.id
                ? `0 0 0 2px var(--poster-bg), 0 0 0 3.5px ${theme.swatch}`
                : "0 1px 3px rgba(0,0,0,0.15)",
          }}
          aria-label={`Theme: ${theme.label}`}
          title={theme.label}
        />
      ))}
    </motion.div>
  );
}
