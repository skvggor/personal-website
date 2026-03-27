"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AnnouncementTrigger from "@/components/announcementTrigger/announcementTrigger";
import CloseButton from "@/components/closeButton/closeButton";
import TopographicPattern from "@/components/topographicPattern/topographicPattern";
import type { AnnouncementBarProps } from "./announcementBar.d";

export default function AnnouncementBar({ config }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  const handleInteraction = useCallback(() => {
    setShowAnnouncement(true);
  }, []);

  useEffect(() => {
    const events = ["click", "scroll", "keydown", "touchstart", "mousemove"];

    events.forEach((event) => {
      window.addEventListener(event, handleInteraction, {
        passive: true,
        once: true,
      });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleInteraction);
      });
    };
  }, [handleInteraction]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleReopen = useCallback(() => {
    setIsVisible(true);
  }, []);

  if (!config.enabled || !config.text || !showAnnouncement) return null;

  const isExternal =
    config.link.startsWith("http://") || config.link.startsWith("https://");

  const linkProps = isExternal
    ? {
        href: config.link,
        target: config.target || "_blank",
        rel: "noopener noreferrer",
      }
    : {
        href: config.link,
      };

  if (!isVisible) return <AnnouncementTrigger onClick={handleReopen} />;

  return (
    <div
      className={`
        announcement-bar
        fixed
        top-3
        left-1/2
        z-50
        max-w-[1366px]
        w-[calc(100%-24px)]
        py-2.5
        px-4
        text-center
        bg-gray-950
        border
        border-gray-800
        rounded-none
        shadow-lg
        animate-bounce-down
        overflow-hidden
      `}
    >
      <TopographicPattern />

      <div className="relative flex items-center justify-center gap-4">
        {isExternal ? (
          <a
            {...linkProps}
            className="hover:underline transition-opacity hover:opacity-80 text-[clamp(0.75rem,2vw,1rem)] text-sky-300"
          >
            {config.text}
          </a>
        ) : (
          <Link
            {...linkProps}
            className="hover:underline transition-opacity hover:opacity-80 text-[clamp(0.75rem,2vw,1rem)] text-sky-300"
          >
            {config.text}
          </Link>
        )}

        <CloseButton onClick={handleClose} />
      </div>
    </div>
  );
}
