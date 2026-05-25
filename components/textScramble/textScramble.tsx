"use client";

import { useEffect, useRef, useState } from "react";

interface TextScrambleProps {
  readonly text: string;
  readonly delay?: number;
  readonly duration?: number;
  readonly className?: string;
}

const CHARS = "アイウエオカキクケコサシスセソ0123456789ABCDEF";

export default function TextScramble({
  text,
  delay = 0,
  duration = 1200,
  className = "",
}: TextScrambleProps) {
  const [display, setDisplay] = useState(text.replace(/\S/g, " "));
  const frameReference = useRef<number>(0);

  useEffect(() => {
    const startTime = performance.now() + delay * 1000;
    const textLength = text.length;

    const animate = (now: number) => {
      const elapsed = now - startTime;

      if (elapsed < 0) {
        frameReference.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const revealedCount = Math.floor(progress * textLength);

      let result = "";
      for (let i = 0; i < textLength; i++) {
        if (text[i] === " " || text[i] === ".") {
          result += text[i];
        } else if (i < revealedCount) {
          result += text[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplay(result);

      if (progress < 1) {
        frameReference.current = requestAnimationFrame(animate);
      } else {
        setDisplay(text);
      }
    };

    frameReference.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameReference.current);
  }, [text, delay, duration]);

  return <span className={className}>{display}</span>;
}
