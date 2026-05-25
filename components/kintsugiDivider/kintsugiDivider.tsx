"use client";

import { motion } from "motion/react";

interface KintsugiDividerProps {
  readonly delay?: number;
  readonly variant?: "full" | "short";
}

export default function KintsugiDivider({
  delay = 0,
  variant = "full",
}: KintsugiDividerProps) {
  return (
    <motion.div
      className="flex items-center justify-start py-6"
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      style={{ transformOrigin: "left center" }}
    >
      <div
        className={`h-[2px] bg-poster-dark/15 ${variant === "full" ? "w-full max-w-[300px]" : "w-[60px]"}`}
      />
    </motion.div>
  );
}
