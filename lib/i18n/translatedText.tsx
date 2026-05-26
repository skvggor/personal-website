"use client";

import { useTranslation } from "@/lib/i18n/context";

interface TranslatedTextProps {
  readonly id: string;
  readonly replacements?: Record<string, string>;
}

export default function TranslatedText({ id, replacements }: TranslatedTextProps) {
  const { t } = useTranslation();
  return <>{t(id, replacements)}</>;
}
