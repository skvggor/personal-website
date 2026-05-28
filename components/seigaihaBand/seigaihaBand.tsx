import { seigaihaArcs } from "@/lib/seigaiha";

const BAND_WIDTH = 150;
const BAND_HEIGHT = 900;
const arcs = seigaihaArcs(BAND_WIDTH, BAND_HEIGHT, 30);

export default function SeigaihaBand() {
  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-0 h-full w-[14px] min-[1440px]:w-[90px] overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${BAND_WIDTH} ${BAND_HEIGHT}`}
        preserveAspectRatio="xMinYMid slice"
        role="presentation"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="var(--poster-line)"
          strokeWidth={5}
          opacity={0.1}
        >
          {arcs.map((d) => (
            <path
              key={d}
              d={d}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
