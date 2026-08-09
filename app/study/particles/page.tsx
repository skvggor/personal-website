import type { Metadata } from "next";
import ParticleMorph from "@/components/study/particles/particleMorph";

export const metadata: Metadata = {
  title: "Particle Morphing — Study",
  description: "WebGL particle image morphing study.",
  robots: { index: false, follow: false },
};

export default function ParticleStudyPage() {
  return (
    <main
      className="flex min-h-dvh items-center justify-center"
      style={{ backgroundColor: "#301b02" }}
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
        backgroundColor="#301b02"
        stride={2}
        circular
      />
    </main>
  );
}
