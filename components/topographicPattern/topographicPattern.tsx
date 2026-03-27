"use client";

export default function TopographicPattern() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.25 }}
    >
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <title>Topographic pattern background</title>
        <defs>
          <pattern
            id="topo-pattern"
            x="0"
            y="0"
            width="200"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 30 Q25 20, 50 30 T100 30 T150 30 T200 30"
              fill="none"
              stroke="rgb(30, 80, 140)"
              strokeWidth="1"
            />
            <path
              d="M0 45 Q25 35, 50 45 T100 45 T150 45 T200 45"
              fill="none"
              stroke="rgb(60, 120, 180)"
              strokeWidth="0.8"
            />
            <path
              d="M0 15 Q25 5, 50 15 T100 15 T150 15 T200 15"
              fill="none"
              stroke="rgb(60, 120, 180)"
              strokeWidth="0.8"
            />
            <path
              d="M0 50 Q25 42, 50 50 T100 50 T150 50 T200 50"
              fill="none"
              stroke="rgb(90, 150, 200)"
              strokeWidth="0.6"
            />
            <path
              d="M0 10 Q25 2, 50 10 T100 10 T150 10 T200 10"
              fill="none"
              stroke="rgb(90, 150, 200)"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#topo-pattern)"
        />
      </svg>
    </div>
  );
}
