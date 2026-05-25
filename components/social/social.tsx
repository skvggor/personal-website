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

  const iconMap: Record<string, React.ReactNode> = {
    youtube: (
      <YoutubeLogo
        size={22}
        weight="bold"
      />
    ),
    github: (
      <GithubLogo
        size={22}
        weight="bold"
      />
    ),
    linkedin: (
      <LinkedinLogo
        size={22}
        weight="bold"
      />
    ),
    strava: (
      <Bicycle
        size={22}
        weight="bold"
      />
    ),
  };

  return (
    <section className="social flex items-center gap-6">
      {socialContent.links.map((link, index) => (
        <MagneticHover key={link.id}>
          <motion.a
            className="flex items-center gap-1.5 text-poster-dark/50 transition-colors hover:text-poster-dark"
            href={link.href}
            title={link.title}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            whileTap={{ scale: 0.95 }}
          >
            {iconMap[link.icon]}
            <span className="text-[0.7rem] font-bold uppercase tracking-widest hidden min-[480px]:inline">
              {link.title}
            </span>
          </motion.a>
        </MagneticHover>
      ))}
    </section>
  );
}
