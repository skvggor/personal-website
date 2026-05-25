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
  IStatus,
  IStatusComponentProps,
  IStatusData,
} from "@/components/status/status.d";

const ICON_SIZE = 18;
const ICON_WEIGHT = "bold" as const;

const statuses: Record<string, IStatus> = {
  weekend: {
    color: "text-poster-dark",
    text: "Enjoying the weekend.",
    icon: (
      <SmileyWink
        className="mr-1.5"
        size={ICON_SIZE}
        weight={ICON_WEIGHT}
      />
    ),
  },
  sleep: {
    color: "text-poster-mid",
    text: "Sleeping.",
    icon: (
      <BatteryWarning
        className="mr-1.5"
        size={ICON_SIZE}
        weight={ICON_WEIGHT}
      />
    ),
  },
  lunch: {
    color: "text-poster-dark",
    text: "Having lunch.",
    icon: (
      <BatteryCharging
        className="mr-1.5"
        size={ICON_SIZE}
        weight={ICON_WEIGHT}
      />
    ),
  },
  work: {
    color: "text-poster-dark",
    text: "At work.",
    icon: (
      <Laptop
        className="mr-1.5"
        size={ICON_SIZE}
        weight={ICON_WEIGHT}
      />
    ),
  },
  free: {
    color: "text-poster-dark",
    text: "Enjoying the life.",
    icon: (
      <SunHorizon
        className="mr-1.5"
        size={ICON_SIZE}
        weight={ICON_WEIGHT}
      />
    ),
  },
  listening: {
    color: "text-poster-dark",
    text: "Listening to music.",
    icon: (
      <MusicNote
        className="mr-1.5"
        size={ICON_SIZE}
        weight={ICON_WEIGHT}
      />
    ),
  },
};

export default function Status({ dataFromAPI }: IStatusComponentProps) {
  const statusContent: IStatusData = {
    time: dataFromAPI?.time,
    status: statuses[`${dataFromAPI?.status}`],
  };

  return statusContent.status ? (
    <span className="status flex items-center text-poster-dark/50 text-[0.8rem] tracking-wide uppercase">
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
