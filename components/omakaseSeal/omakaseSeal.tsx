"use client";

import { motion } from "motion/react";

export default function OmakaseSeal() {
  const characters = ["お", "ま", "か", "せ"];

  return (
    <>
      {/* Desktop: vertical hero on the right */}
      <div
        className="pointer-events-none fixed right-[6vw] top-0 z-10 hidden h-screen items-center min-[1440px]:flex"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-0">
          {characters.map((character, index) => (
            <motion.span
              key={character}
              className="block leading-none text-poster-dark/10"
              style={{
                fontFamily: "var(--font-shippori)",
                fontSize: "clamp(8rem, 12vw, 14rem)",
                fontWeight: 700,
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.8 + index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {character}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Mobile: horizontal watermark behind content */}
      <div
        className="pointer-events-none fixed left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 min-[1440px]:hidden"
        aria-hidden="true"
      >
        <motion.span
          className="block whitespace-nowrap text-poster-dark/6"
          style={{
            fontFamily: "var(--font-shippori)",
            fontSize: "clamp(6rem, 30vw, 12rem)",
            fontWeight: 700,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          おまかせ
        </motion.span>
      </div>
    </>
  );
}
