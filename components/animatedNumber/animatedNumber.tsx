"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  target: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
}

export default function AnimatedNumber({
  target,
  duration = 1500,
  decimals = 1,
  suffix = "",
}: AnimatedNumberProps) {
  const [value, setValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - (1 - progress) ** 4;
      const currentValue = target * easeOutQuart;

      setValue(currentValue);

      if (progress < 1) animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [target, duration]);

  return (
    <>
      {value.toFixed(decimals)}
      {suffix}
    </>
  );
}
