"use client";

import { MapPin } from "@phosphor-icons/react";
import { motion } from "motion/react";

import MagneticHover from "@/components/magneticHover/magneticHover";
import { useTranslation } from "@/lib/i18n/context";

const MAP_URL =
  "https://www.google.com/maps/place/Peruíbe,+SP,+Brazil";

export default function Location() {
  const { t } = useTranslation();

  return (
    <MagneticHover>
      <motion.a
        href={MAP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-poster-dark/80 transition-colors hover:text-poster-dark"
        whileTap={{ scale: 0.95 }}
      >
        <MapPin
          weight="bold"
          className="h-[18px] w-[18px] min-[2560px]:h-[0.85vw] min-[2560px]:w-[0.85vw] shrink-0"
        />
        <span className="text-[0.8rem] min-[2560px]:text-[0.7vw] tracking-wide">
          {t("location")}
        </span>
      </motion.a>
    </MagneticHover>
  );
}
