"use client";

import {
  Bicycle,
  GithubLogo,
  LinkedinLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import { motion } from "motion/react";

import MagneticHover from "@/components/magneticHover/magneticHover";
import type { ISocial } from "@/components/social/social.d";

export default function Social() {
  const socialContent: ISocial = {
    links: [
      {
        id: 1,
        title: "YouTube",
        href: "https://youtube.com/@skvggor",
        icon: "youtube",
      },
      {
        id: 2,
        title: "GitHub",
        href: "https://github.com/skvggor",
        icon: "github",
      },
      {
        id: 3,
        title: "LinkedIn",
        href: "https://www.linkedin.com/in/marcker",
        icon: "linkedin",
      },
      {
        id: 4,
        title: "Strava",
        href: "https://www.strava.com/athletes/18616728",
        icon: "strava",
      },
    ],
  };

  const iconClass =
    "h-[22px] w-[22px] min-[2560px]:h-[1vw] min-[2560px]:w-[1vw]";

  const iconMap: Record<string, React.ReactNode> = {
    youtube: (
      <YoutubeLogo
        weight="bold"
        className={iconClass}
      />
    ),
    github: (
      <GithubLogo
        weight="bold"
        className={iconClass}
      />
    ),
    linkedin: (
      <LinkedinLogo
        weight="bold"
        className={iconClass}
      />
    ),
    strava: (
      <Bicycle
        weight="bold"
        className={iconClass}
      />
    ),
  };

  return (
    <section className="social flex items-center gap-6 min-[2560px]:gap-7">
      {socialContent.links.map((link, index) => (
        <MagneticHover key={link.id}>
          <motion.a
            className="flex items-center gap-1.5 text-poster-dark/80 transition-colors hover:text-poster-dark animate-fade-in-up"
            style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            href={link.href}
            title={link.title}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.95 }}
          >
            {iconMap[link.icon]}
            <span className="text-[0.7rem] min-[2560px]:text-[0.55vw] font-bold uppercase tracking-widest hidden min-[480px]:inline">
              {link.title}
            </span>
          </motion.a>
        </MagneticHover>
      ))}
    </section>
  );
}
