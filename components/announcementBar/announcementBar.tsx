"use client";

import { ArrowRight, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { AnnouncementBarProps } from "./announcementBar.d";
import { useTranslation } from "@/lib/i18n/context";

const STORAGE_KEY = "announcement-dismissed";

export default function AnnouncementBar({ config }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  const displayText = config.translationKey
    ? t(config.translationKey)
    : config.text;

  useEffect(() => {
    if (!config.enabled || !config.text) return;
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed !== config.text) {
      setIsVisible(true);
    }
  }, [config.enabled, config.text]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    sessionStorage.setItem(STORAGE_KEY, config.text);
  }, [config.text]);

  if (!config.enabled || !config.text || !isVisible) {
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

  const linkContent = (
    <>
      <span className="flex-1">{displayText}</span>
      <ArrowRight
        size={12}
        weight="bold"
        className="shrink-0"
      />
    </>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="border-l-2 border-poster-dark/25 pl-3 py-3 mb-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-start gap-3">
            {isExternal ? (
              <a
                {...linkProps}
                className="flex items-center gap-2 text-[0.75rem] min-[2560px]:text-[0.55vw] text-poster-dark/80 leading-relaxed transition-colors hover:text-poster-dark"
              >
                {linkContent}
              </a>
            ) : (
              <Link
                {...linkProps}
                className="flex items-center gap-2 text-[0.75rem] min-[2560px]:text-[0.55vw] text-poster-dark/80 leading-relaxed transition-colors hover:text-poster-dark"
              >
                {linkContent}
              </Link>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="shrink-0 mt-0.5 p-1 text-poster-dark/20 transition-colors hover:text-poster-dark/50 focus:outline-none"
              aria-label="Close announcement"
            >
              <X
                size={12}
                weight="bold"
              />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
