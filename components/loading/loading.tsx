"use client";

import { HeartBreak, SpinnerGap } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import type { LoadingProps } from "@/components/loading/loading.d";
import { useTranslation } from "@/lib/i18n/context";

export default function Loading({ serviceName }: LoadingProps) {
  const [serviceStatus, setServiceStatus] = useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    const TIMEOUT_DELAY = 7000;

    const timeout = setTimeout(() => {
      setServiceStatus(false);
    }, TIMEOUT_DELAY);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="loading flex items-center gap-2 py-2">
      {serviceStatus ? (
        <>
          <SpinnerGap
            className="animate-spin text-poster-dark/70"
            size={18}
            weight="bold"
          />
          <span className="animate-pulse text-poster-dark/60 text-sm tracking-wide">
            {t("loading.loading")}
          </span>
        </>
      ) : (
        <>
          <HeartBreak
            className="text-poster-dark/50"
            size={18}
            weight="bold"
          />
          <span className="text-poster-dark/60 text-sm tracking-wide">
            {t("loading.serviceUnavailable", { serviceName: serviceName ?? "" })}
          </span>
        </>
      )}
    </div>
  );
}
