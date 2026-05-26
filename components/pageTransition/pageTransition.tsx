"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

import { usePageTransition } from "@/lib/transition/context";

export default function PageTransition({
  children,
}: {
  readonly children: ReactNode;
}) {
  const { phase } = usePageTransition();
  const contentHidden = phase === "fadeOut" || phase === "loader";

  return (
    <>
      <AnimatePresence>
        {phase === "loader" && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-poster-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <motion.span
              className="text-poster-dark/15 text-7xl font-bold"
              style={{ fontFamily: "var(--font-shippori)" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              おまかせ
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          opacity: contentHidden ? 0 : 1,
          transition: "opacity 0.4s ease",
        }}
      >
        {children}
      </div>
    </>
  );
}
