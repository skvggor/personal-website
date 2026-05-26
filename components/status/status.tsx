"use client";

import {
  BatteryCharging,
  BatteryWarning,
  Laptop,
  MusicNote,
  SmileyWink,
  SunHorizon,
} from "@phosphor-icons/react";

import Loading from "@/components/loading/loading";
import type {
  IStatusComponentProps,
  IStatusData,
} from "@/components/status/status.d";
import { useTranslation } from "@/lib/i18n/context";
import type { ReactNode } from "react";

const ICON_WEIGHT = "bold" as const;
const ICON_CLASS = "mr-1.5 h-[18px] w-[18px] min-[2560px]:h-[0.85vw] min-[2560px]:w-[0.85vw]";

interface StatusConfig {
  color: string;
  translationKey: string;
  icon: ReactNode;
}

const statusConfigs: Record<string, StatusConfig> = {
  weekend: {
    color: "text-poster-dark",
    translationKey: "status.weekend",
    icon: <SmileyWink className={ICON_CLASS} weight={ICON_WEIGHT} />,
  },
  sleep: {
    color: "text-poster-mid",
    translationKey: "status.sleep",
    icon: <BatteryWarning className={ICON_CLASS} weight={ICON_WEIGHT} />,
  },
  lunch: {
    color: "text-poster-dark",
    translationKey: "status.lunch",
    icon: <BatteryCharging className={ICON_CLASS} weight={ICON_WEIGHT} />,
  },
  work: {
    color: "text-poster-dark",
    translationKey: "status.work",
    icon: <Laptop className={ICON_CLASS} weight={ICON_WEIGHT} />,
  },
  free: {
    color: "text-poster-dark",
    translationKey: "status.free",
    icon: <SunHorizon className={ICON_CLASS} weight={ICON_WEIGHT} />,
  },
  listening: {
    color: "text-poster-dark",
    translationKey: "status.listening",
    icon: <MusicNote className={ICON_CLASS} weight={ICON_WEIGHT} />,
  },
};

export default function Status({ dataFromAPI }: IStatusComponentProps) {
  const { t } = useTranslation();
  const config = statusConfigs[`${dataFromAPI?.status}`];

  const statusContent: IStatusData = {
    time: dataFromAPI?.time,
    status: config
      ? { color: config.color, text: t(config.translationKey), icon: config.icon }
      : undefined,
  };

  return statusContent.status ? (
    <span className="status flex items-center text-poster-dark/80 text-[0.8rem] min-[2560px]:text-[0.7vw] tracking-wide">
      <span className={`flex items-center ${statusContent.status.color}`}>
        {statusContent.status.icon}
        <span className="font-bold mr-1">{statusContent.time}</span>
        <span className="text-[0.7rem] mr-1">(UTC-03)</span>
        <span className="mr-1.5">—</span>
      </span>
      {statusContent.status.text}
    </span>
  ) : (
    <Loading />
  );
}
