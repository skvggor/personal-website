"use client";

import { ChatCircleDots } from "@phosphor-icons/react";
import { motion } from "motion/react";

interface AnnouncementTriggerProps {
  onClick: () => void;
}

export default function AnnouncementTrigger({
  onClick,
}: AnnouncementTriggerProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="fixed top-4 right-8 min-[1440px]:right-[8vw] z-50 p-1.5 text-poster-dark/20 transition-colors hover:text-poster-dark/50 focus:outline-none"
      aria-label="Show announcement"
      title="Show announcement"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <ChatCircleDots
        size={16}
        weight="bold"
      />
    </motion.button>
  );
}
