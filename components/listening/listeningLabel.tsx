"use client";

import { useTranslation } from "@/lib/i18n/context";

export default function ListeningLabel({ isPlaying }: { readonly isPlaying: boolean }) {
  const { t } = useTranslation();
  return <>{isPlaying ? t("listening.nowPlaying") : t("listening.lastPlayed")}</>;
}
