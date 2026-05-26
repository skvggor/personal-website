"use client";

import { Globe } from "@phosphor-icons/react";
import { useTranslation, type Locale } from "@/lib/i18n/context";
import { usePageTransition } from "@/lib/transition/context";

const languages: { id: Locale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "pt-BR", label: "PT" },
];

export default function LanguageSelector() {
  const { locale, setLocale } = useTranslation();
  const { triggerTransition } = usePageTransition();

  const handleChange = (newLocale: Locale) => {
    if (newLocale === locale) return;
    triggerTransition(() => setLocale(newLocale));
  };

  return (
    <div className="flex items-center gap-1.5 text-[0.65rem] min-[2560px]:text-[0.6vw] font-bold tracking-widest text-poster-dark/60">
      <Globe weight="bold" className="h-[18px] w-[18px] min-[2560px]:h-[0.85vw] min-[2560px]:w-[0.85vw]" />
      {languages.map((language, index) => (
        <span key={language.id} className="flex items-center">
          {index > 0 && (
            <span className="text-poster-dark/20 mx-1">/</span>
          )}
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => handleChange(language.id)}
            className={`cursor-pointer transition-colors duration-300 ${
              locale === language.id
                ? "text-poster-dark"
                : "text-poster-dark/60 hover:text-poster-dark/80"
            }`}
          >
            {language.label}
          </button>
        </span>
      ))}
    </div>
  );
}
