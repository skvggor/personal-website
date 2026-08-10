"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { useAnimationFrame } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { useTranslation } from "@/lib/i18n/context";

const MAXIMUM_OFFSET_PIXELS = 10;
const MINIMUM_CYCLE_MILLISECONDS = 350;
const MAXIMUM_CYCLE_MILLISECONDS = 850;
const MINIMUM_VELOCITY = 14;
const MAXIMUM_VELOCITY = 40;

interface EntranceLinkProps {
  readonly visible: boolean;
}

export default function EntranceLink({ visible }: EntranceLinkProps) {
  const { t } = useTranslation();
  const arrowReference = useRef<HTMLSpanElement>(null);
  const offset = useRef(0);
  const velocity = useRef(0);
  const switchDirectionAt = useRef(0);

  const scheduleDirectionChange = (time: number) => {
    const randomCycleMilliseconds =
      MINIMUM_CYCLE_MILLISECONDS +
      Math.random() * (MAXIMUM_CYCLE_MILLISECONDS - MINIMUM_CYCLE_MILLISECONDS);
    switchDirectionAt.current = time + randomCycleMilliseconds;
    const randomVelocity =
      MINIMUM_VELOCITY + Math.random() * (MAXIMUM_VELOCITY - MINIMUM_VELOCITY);
    velocity.current = Math.random() < 0.5 ? randomVelocity : -randomVelocity;
  };

  useAnimationFrame((time, deltaTime) => {
    if (!visible) {
      return;
    }
    const arrow = arrowReference.current;
    if (!arrow) {
      return;
    }
    if (time >= switchDirectionAt.current) {
      scheduleDirectionChange(time);
    }
    offset.current += (velocity.current * deltaTime) / 1000;
    if (Math.abs(offset.current) > MAXIMUM_OFFSET_PIXELS) {
      offset.current = Math.sign(offset.current) * MAXIMUM_OFFSET_PIXELS;
      velocity.current *= -1;
      scheduleDirectionChange(time);
    }
    arrow.style.transform = `translateX(${offset.current}px)`;
  });

  return (
    <Link
      href="/home"
      inert={!visible}
      className={`group flex items-center gap-3 text-poster-cream/80 transition-opacity duration-700 hover:text-poster-cream ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="font-[family-name:var(--font-vt323)] text-xl uppercase tracking-[0.3em]">
        {t("enter")}
      </span>
      <span
        ref={arrowReference}
        className="inline-flex"
        aria-hidden="true"
      >
        <ArrowRight
          size={20}
          weight="bold"
        />
      </span>
    </Link>
  );
}
