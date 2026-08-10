import EntranceLink from "@/components/study/particles/entranceLink";
import ParticleMorph from "@/components/study/particles/particleMorph";

export default function Home() {
  return (
    <main
      className="flex min-h-dvh flex-col items-center justify-center gap-10"
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
      <EntranceLink />
    </main>
  );
}
