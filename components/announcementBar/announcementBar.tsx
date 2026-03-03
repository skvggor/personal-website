"use client";

import Link from "next/link";
import { useState } from "react";

interface AnnouncementBarConfig {
  enabled: boolean;
  text: string;
  link: string;
  target?: string;
  bgColor?: string;
  textColor?: string;
}

interface AnnouncementBarProps {
  config: AnnouncementBarConfig;
}

export default function AnnouncementBar({ config }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

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

  return (
    <div
      className="announcement-bar w-full py-2.5 px-4 text-center text-sm font-medium relative z-50 backdrop-blur-md"
      style={{
        backgroundColor: `${config.bgColor || "#209ae7"}cc`,
        color: config.textColor || "#ffffff",
      }}
    >
      <div className="flex items-center justify-center gap-4">
        {isExternal ? (
          <a
            {...linkProps}
            className="hover:underline transition-opacity hover:opacity-80"
          >
            {config.text}
          </a>
        ) : (
          <Link
            {...linkProps}
            className="hover:underline transition-opacity hover:opacity-80"
          >
            {config.text}
          </Link>
        )}

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Close announcement"
          title="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
