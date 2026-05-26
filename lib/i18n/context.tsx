"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import en from "@/lib/i18n/messages/en.json";
import ptBR from "@/lib/i18n/messages/pt-BR.json";

export type Locale = "en" | "pt-BR";

type Messages = typeof en;

const messages: Record<Locale, Messages> = {
  en,
  "pt-BR": ptBR,
};

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "language";

function getNestedValue(object: Record<string, unknown>, path: string): string {
  const result = path
    .split(".")
    .reduce<unknown>(
      (current, key) =>
        current && typeof current === "object"
          ? (current as Record<string, unknown>)[key]
          : undefined,
      object,
    );
  return typeof result === "string" ? result : path;
}

export function LanguageProvider({ children }: { readonly children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && stored in messages) {
      setLocaleState(stored);
      return;
    }
    const browserLanguage = navigator.language;
    if (browserLanguage.startsWith("pt")) {
      setLocaleState("pt-BR");
      localStorage.setItem(STORAGE_KEY, "pt-BR");
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  }, []);

  const t = useCallback(
    (key: string, replacements?: Record<string, string>) => {
      let value = getNestedValue(
        messages[locale] as unknown as Record<string, unknown>,
        key,
      );
      if (replacements) {
        for (const [placeholder, replacement] of Object.entries(replacements)) {
          value = value.replace(`{${placeholder}}`, replacement);
        }
      }
      return value;
    },
    [locale],
  );

  return (
    <LanguageContext value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
