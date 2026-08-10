"use client";

import { useState } from "react";
import EntranceLink from "@/components/particles/entranceLink";
import ParticleMorph from "@/components/particles/particleMorph";

const POSTER_BACKGROUND = "#301b02";

export default function Home() {
  const [entranceVisible, setEntranceVisible] = useState(false);

  return (
    <main
      className="flex min-h-dvh flex-col items-center justify-center gap-10"
      style={{ backgroundColor: POSTER_BACKGROUND }}
    >
      <ParticleMorph
        width={500}
        height={500}
        imageSource="/me.avif"
        hoverImageSource="/me2.avif"
        countdownFrom={5}
        morphDurationMilliseconds={600}
        stageHoldMilliseconds={400}
        brightnessThreshold={36}
        pointFillRatio={1.0}
        floatingAmplitude={0.004}
        backgroundColor={POSTER_BACKGROUND}
        stride={2}
        circular
        onInitialAnimationComplete={() => setEntranceVisible(true)}
      />
      <EntranceLink visible={entranceVisible} />
    </main>
  );
}
