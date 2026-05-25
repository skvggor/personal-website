"use client";

import { ArrowRight, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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

  if (!config.enabled || !config.text || !showAnnouncement || !isVisible) {
    return null;
  }

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

  const linkClassName =
    "flex items-center gap-2 text-[0.75rem] text-poster-dark/60 transition-colors hover:text-poster-dark";

  return (
    <AnimatePresence>
      <motion.div
        className="border-b border-poster-dark/8 py-3"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          {isExternal ? (
            <a
              {...linkProps}
              className={linkClassName}
            >
              {config.text}
              <ArrowRight
                size={12}
                weight="bold"
              />
            </a>
          ) : (
            <Link
              {...linkProps}
              className={linkClassName}
            >
              {config.text}
              <ArrowRight
                size={12}
                weight="bold"
              />
            </Link>
          )}

          <button
            type="button"
            onClick={handleClose}
            className="p-1 text-poster-dark/20 transition-colors hover:text-poster-dark/50 focus:outline-none"
            aria-label="Close announcement"
          >
            <X
              size={14}
              weight="bold"
            />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
