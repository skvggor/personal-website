"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Phase = "idle" | "fadeOut" | "loader" | "fadeIn";

interface TransitionContextValue {
  phase: Phase;
  triggerTransition: (onChange: () => void) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function TransitionProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const callbackRef = useRef<(() => void) | null>(null);

  const triggerTransition = useCallback(
    (onChange: () => void) => {
      if (phase !== "idle") return;

      callbackRef.current = onChange;
      setPhase("fadeOut");

      setTimeout(() => {
        callbackRef.current?.();
        callbackRef.current = null;
        setPhase("loader");
      }, 400);

      setTimeout(() => setPhase("fadeIn"), 1200);
      setTimeout(() => setPhase("idle"), 1700);
    },
    [phase],
  );

  return (
    <TransitionContext value={{ phase, triggerTransition }}>
      {children}
    </TransitionContext>
  );
}

export function usePageTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error(
      "usePageTransition must be used within a TransitionProvider",
    );
  }
  return context;
}
