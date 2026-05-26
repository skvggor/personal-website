"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface ScrollRevealProps {
  readonly children: ReactNode;
  readonly delay?: number;
  readonly direction?: "up" | "left" | "right";
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const directionOffset = {
    up: { x: 0, y: 24 },
    left: { x: -24, y: 0 },
    right: { x: 24, y: 0 },
  };

  const offset = directionOffset[direction];

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
