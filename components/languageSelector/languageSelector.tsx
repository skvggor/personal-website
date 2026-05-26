"use client";

import { useTranslation, type Locale } from "@/lib/i18n/context";

const languages: { id: Locale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "pt-BR", label: "PT" },
];

export default function LanguageSelector() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center gap-1 text-[0.65rem] min-[2560px]:text-[0.9vw] font-bold uppercase tracking-widest">
      {languages.map((language, index) => (
        <span key={language.id} className="flex items-center">
          {index > 0 && (
            <span className="text-poster-dark/20 mx-1">/</span>
          )}
          <button
            type="button"
            onClick={() => setLocale(language.id)}
            className={`transition-colors duration-300 ${
              locale === language.id
                ? "text-poster-dark"
                : "text-poster-dark/30 hover:text-poster-dark/60"
            }`}
          >
            {language.label}
          </button>
        </span>
      ))}
    </div>
  );
}
