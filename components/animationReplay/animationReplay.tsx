"use client";

import { useTranslation } from "@/lib/i18n/context";
import type { ReactNode } from "react";

export default function AnimationReplay({
  children,
}: {
  readonly children: ReactNode;
}) {
  const { locale } = useTranslation();
  return <div key={locale}>{children}</div>;
}
