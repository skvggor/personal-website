import type { Metadata } from "next";
import ParticleMorph from "@/components/study/particles/particleMorph";

export const metadata: Metadata = {
  title: "Particle Morphing — Study",
  description: "WebGL particle image morphing study.",
  robots: { index: false, follow: false },
};

export default function ParticleStudyPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 py-12">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-[family-name:var(--font-shippori)] text-2xl font-bold text-poster-dark">
          Particle Morphing
        </h1>
        <p className="max-w-sm text-sm text-poster-cream-dim">
          Countdown 5 → 0 → retrato, formado por partículas via WebGL puro.
        </p>
      </header>

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
        backgroundColor="#341d02"
        stride={2}
        circular
      />

      <a
        href="/"
        className="text-sm text-poster-cream-dim underline-offset-4 hover:underline"
      >
        ← voltar
      </a>
    </main>
  );
}
