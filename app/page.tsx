"use client";

import Link from "next/link";
import ParticleMorph from "@/components/particles/particleMorph";

const POSTER_BACKGROUND = "#301b02";

export default function Home() {
  return (
    <main
      className="flex min-h-dvh flex-col items-center justify-center gap-10"
      style={{ backgroundColor: POSTER_BACKGROUND }}
    >
      <Link
        href="/home"
        aria-label="Enter home"
        className="relative cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-poster-cream"
      >
        <ParticleMorph
          width={500}
          height={500}
          imageSource="/me.avif"
          hoverImageSource="/me-censored.avif"
          hoverHintIntervalMilliseconds={6500}
          hoverHintDurationMilliseconds={1600}
          countdownFrom={3}
          morphDurationMilliseconds={600}
          stageHoldMilliseconds={400}
          brightnessThreshold={36}
          pointFillRatio={1.0}
          floatingAmplitude={0.004}
          backgroundColor={POSTER_BACKGROUND}
          stride={2}
          circular
        />
      </Link>
    </main>
  );
}
