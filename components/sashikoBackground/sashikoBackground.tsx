"use client";

import { motion } from "motion/react";

interface CodeLine {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly delay: number;
}

interface ScopeBracket {
  readonly x: number;
  readonly y1: number;
  readonly y2: number;
  readonly delay: number;
}

interface CommitDot {
  readonly cx: number;
  readonly cy: number;
  readonly delay: number;
}

const desktopLines: CodeLine[] = [
  { x: 820, y: 80, width: 120, delay: 0.5 },
  { x: 820, y: 100, width: 80, delay: 0.55 },
  { x: 850, y: 125, width: 180, delay: 0.6 },
  { x: 850, y: 145, width: 140, delay: 0.65 },
  { x: 850, y: 165, width: 200, delay: 0.7 },
  { x: 880, y: 185, width: 100, delay: 0.75 },
  { x: 880, y: 205, width: 160, delay: 0.8 },
  { x: 850, y: 230, width: 60, delay: 0.85 },
  { x: 820, y: 250, width: 30, delay: 0.9 },

  { x: 820, y: 300, width: 150, delay: 1.0 },
  { x: 850, y: 325, width: 220, delay: 1.05 },
  { x: 850, y: 345, width: 170, delay: 1.1 },
  { x: 880, y: 365, width: 130, delay: 1.15 },
  { x: 880, y: 385, width: 90, delay: 1.2 },
  { x: 880, y: 405, width: 190, delay: 1.25 },
  { x: 850, y: 430, width: 50, delay: 1.3 },
  { x: 820, y: 450, width: 30, delay: 1.35 },

  { x: 820, y: 510, width: 100, delay: 1.5 },
  { x: 820, y: 530, width: 180, delay: 1.55 },
  { x: 850, y: 555, width: 240, delay: 1.6 },
  { x: 850, y: 575, width: 160, delay: 1.65 },
  { x: 850, y: 595, width: 200, delay: 1.7 },
  { x: 850, y: 615, width: 120, delay: 1.75 },
  { x: 820, y: 640, width: 30, delay: 1.8 },

  { x: 820, y: 680, width: 70, delay: 1.9 },
  { x: 820, y: 700, width: 110, delay: 1.95 },
];

const desktopBrackets: ScopeBracket[] = [
  { x: 840, y1: 115, y2: 240, delay: 0.7 },
  { x: 840, y1: 315, y2: 440, delay: 1.1 },
  { x: 840, y1: 545, y2: 635, delay: 1.6 },
];

const desktopDots: CommitDot[] = [
  { cx: 815, cy: 80, delay: 0.5 },
  { cx: 815, cy: 300, delay: 1.0 },
  { cx: 815, cy: 510, delay: 1.5 },
  { cx: 815, cy: 680, delay: 1.9 },
];

const mobileLines: CodeLine[] = [
  { x: 30, y: 380, width: 80, delay: 0.6 },
  { x: 30, y: 398, width: 55, delay: 0.65 },
  { x: 50, y: 420, width: 120, delay: 0.7 },
  { x: 50, y: 438, width: 90, delay: 0.75 },
  { x: 50, y: 456, width: 140, delay: 0.8 },
  { x: 70, y: 474, width: 70, delay: 0.85 },
  { x: 70, y: 492, width: 110, delay: 0.9 },
  { x: 50, y: 514, width: 40, delay: 0.95 },
  { x: 30, y: 532, width: 20, delay: 1.0 },

  { x: 30, y: 575, width: 100, delay: 1.15 },
  { x: 50, y: 597, width: 150, delay: 1.2 },
  { x: 50, y: 615, width: 115, delay: 1.25 },
  { x: 70, y: 633, width: 85, delay: 1.3 },
  { x: 70, y: 651, width: 130, delay: 1.35 },
  { x: 50, y: 673, width: 35, delay: 1.4 },
  { x: 30, y: 691, width: 20, delay: 1.45 },
];

const mobileBrackets: ScopeBracket[] = [
  { x: 44, y1: 412, y2: 524, delay: 0.75 },
  { x: 44, y1: 589, y2: 680, delay: 1.2 },
];

const mobileDots: CommitDot[] = [
  { cx: 24, cy: 380, delay: 0.6 },
  { cx: 24, cy: 575, delay: 1.15 },
];

function CodeTopology({
  lines,
  brackets,
  dots,
}: {
  lines: CodeLine[];
  brackets: ScopeBracket[];
  dots: CommitDot[];
}) {
  return (
    <>
      {lines.map((line) => (
        <motion.line
          key={`${line.x}-${line.y}`}
          x1={line.x}
          y1={line.y}
          x2={line.x + line.width}
          y2={line.y}
          stroke="var(--poster-line)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.045"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: line.delay, ease: "easeOut" }}
        />
      ))}

      {brackets.map((bracket) => (
        <motion.line
          key={`scope-${bracket.x}-${bracket.y1}`}
          x1={bracket.x}
          y1={bracket.y1}
          x2={bracket.x}
          y2={bracket.y2}
          stroke="var(--poster-line)"
          strokeWidth="1"
          opacity="0.03"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 0.8,
            delay: bracket.delay,
            ease: "easeOut",
          }}
        />
      ))}

      {dots.map((dot) => (
        <motion.circle
          key={`dot-${dot.cx}-${dot.cy}`}
          cx={dot.cx}
          cy={dot.cy}
          r="2"
          fill="var(--poster-line)"
          opacity="0.06"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.3,
            delay: dot.delay + 0.1,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

export default function SashikoBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Desktop */}
      <svg
        className="hidden min-[1440px]:block h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMaxYMid slice"
        role="presentation"
        aria-hidden="true"
      >
        <CodeTopology
          lines={desktopLines}
          brackets={desktopBrackets}
          dots={desktopDots}
        />
      </svg>

      {/* Mobile / Tablet */}
      <svg
        className="block min-[1440px]:hidden h-full w-full"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMinYMid slice"
        role="presentation"
        aria-hidden="true"
      >
        <CodeTopology
          lines={mobileLines}
          brackets={mobileBrackets}
          dots={mobileDots}
        />
      </svg>
    </div>
  );
}
