"use client";

import { useCallback, useEffect, useRef } from "react";

const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;

const GRAD3 = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function buildPermTable(seed: number) {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);

  for (let i = 0; i < 256; i++) p[i] = i;

  let n: number;
  let q: number;
  let s = seed;

  for (let i = 255; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    n = ((s % (i + 1)) + i + 1) % (i + 1);
    q = p[i];
    p[i] = p[n];
    p[n] = q;
  }

  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  return perm;
}

function simplex2D(perm: Uint8Array, x: number, y: number): number {
  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const t = (i + j) * G2;
  const X0 = i - t;
  const Y0 = j - t;
  const x0 = x - X0;
  const y0 = y - Y0;

  const i1 = x0 > y0 ? 1 : 0;
  const j1 = x0 > y0 ? 0 : 1;

  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;

  const ii = i & 255;
  const jj = j & 255;

  let n0 = 0;
  let n1 = 0;
  let n2 = 0;

  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 >= 0) {
    t0 *= t0;
    const gi0 = perm[ii + perm[jj]] % 8;
    n0 = t0 * t0 * (GRAD3[gi0][0] * x0 + GRAD3[gi0][1] * y0);
  }

  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 >= 0) {
    t1 *= t1;
    const gi1 = perm[ii + i1 + perm[jj + j1]] % 8;
    n1 = t1 * t1 * (GRAD3[gi1][0] * x1 + GRAD3[gi1][1] * y1);
  }

  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 >= 0) {
    t2 *= t2;
    const gi2 = perm[ii + 1 + perm[jj + 1]] % 8;
    n2 = t2 * t2 * (GRAD3[gi2][0] * x2 + GRAD3[gi2][1] * y2);
  }

  return 70 * (n0 + n1 + n2);
}

function fbm(perm: Uint8Array, x: number, y: number, octaves: number): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    value += amplitude * simplex2D(perm, x * frequency, y * frequency);
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / maxValue;
}

function getContourColor(normalizedLevel: number): string {
  const r = Math.round(3 + normalizedLevel * (147 - 3));
  const g = Math.round(25 + normalizedLevel * (225 - 25));
  const b = Math.round(60 + normalizedLevel * (255 - 60));
  return `rgb(${r}, ${g}, ${b})`;
}

function extractContourSegments(
  grid: Float64Array,
  cols: number,
  rows: number,
  threshold: number,
): [number, number, number, number][] {
  const segments: [number, number, number, number][] = [];

  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      const tl = grid[y * cols + x];
      const tr = grid[y * cols + x + 1];
      const br = grid[(y + 1) * cols + x + 1];
      const bl = grid[(y + 1) * cols + x];

      let caseIndex = 0;
      if (tl >= threshold) caseIndex |= 8;
      if (tr >= threshold) caseIndex |= 4;
      if (br >= threshold) caseIndex |= 2;
      if (bl >= threshold) caseIndex |= 1;

      if (caseIndex === 0 || caseIndex === 15) continue;

      const lerp = (a: number, b: number) => {
        const d = b - a;
        return d === 0 ? 0.5 : (threshold - a) / d;
      };

      const top = lerp(tl, tr);
      const right = lerp(tr, br);
      const bottom = lerp(bl, br);
      const left = lerp(tl, bl);

      const px = (fx: number, fy: number): [number, number] => [x + fx, y + fy];

      const addSeg = (x1: number, y1: number, x2: number, y2: number) => {
        segments.push([x1, y1, x2, y2]);
      };

      const T = px(top, 0);
      const R = px(1, right);
      const B = px(bottom, 1);
      const L = px(0, left);

      switch (caseIndex) {
        case 1:
        case 14:
          addSeg(L[0], L[1], B[0], B[1]);
          break;
        case 2:
        case 13:
          addSeg(B[0], B[1], R[0], R[1]);
          break;
        case 3:
        case 12:
          addSeg(L[0], L[1], R[0], R[1]);
          break;
        case 4:
        case 11:
          addSeg(T[0], T[1], R[0], R[1]);
          break;
        case 5:
          addSeg(L[0], L[1], T[0], T[1]);
          addSeg(B[0], B[1], R[0], R[1]);
          break;
        case 6:
        case 9:
          addSeg(T[0], T[1], B[0], B[1]);
          break;
        case 7:
        case 8:
          addSeg(L[0], L[1], T[0], T[1]);
          break;
        case 10:
          addSeg(L[0], L[1], B[0], B[1]);
          addSeg(T[0], T[1], R[0], R[1]);
          break;
      }
    }
  }

  return segments;
}

const GRID_RESOLUTION_DESKTOP = 400;
const GRID_RESOLUTION_MOBILE = 250;
const CONTOUR_LEVELS = 14;
const NOISE_SCALE = 0.006;
const LINE_OPACITY = 0.22;
const LINE_WIDTH = 1;
const MOUSE_INFLUENCE_RADIUS = 0.15;
const TOUCH_INFLUENCE_RADIUS = 0.22;
const MOUSE_INFLUENCE_STRENGTH = 0.35;
const OCTAVES = 4;
const MOUSE_DRIFT_SPEED = 0.3;
const IDLE_DRIFT_SPEED = 0.15;
const IDLE_DRIFT_CHANGE_INTERVAL = 3000;
const COORD_GRID_SPACING = 500;
const COORD_GRID_COLOR = "rgb(30, 80, 140)";
const COORD_GRID_OPACITY = 0.28;
const COORD_GRID_WIDTH = 1;
const MAP_MARGIN_MOBILE = 24;
const MAP_MARGIN_DESKTOP = 40;
const MAP_BORDER_COLOR = "rgb(30, 80, 140)";
const MAP_BORDER_OPACITY = 0.4;
const MAP_BORDER_WIDTH = 1.2;
const TICK_LENGTH = 8;
const INDEX_CONTOUR_INTERVAL = 4;
const INDEX_CONTOUR_WIDTH = 2.2;

const BackgroundTopographic = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });
  const animationRef = useRef<number>(0);
  const offsetRef = useRef({ x: 0, y: 0 });
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const permRef = useRef<Uint8Array | null>(null);
  const lastFrameRef = useRef(0);
  const isTouchRef = useRef(false);
  const idleDriftRef = useRef({
    x: (Math.random() - 0.5) * IDLE_DRIFT_SPEED,
    y: (Math.random() - 0.5) * IDLE_DRIFT_SPEED,
  });
  const lastDriftChangeRef = useRef(0);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!permRef.current) {
      permRef.current = buildPermTable(42);
    }
    const perm = permRef.current;

    const width = canvas.width;
    const height = canvas.height;
    const cssWidth = Number.parseFloat(canvas.style.width);
    const isMobileViewport = cssWidth < 768;
    const cols = isMobileViewport
      ? GRID_RESOLUTION_MOBILE
      : GRID_RESOLUTION_DESKTOP;
    const rows = Math.round((cols * height) / width);
    const cellW = width / (cols - 1);
    const cellH = height / (rows - 1);

    const mouseNormX = mouseRef.current.x;
    const mouseNormY = mouseRef.current.y;
    const ox = offsetRef.current.x;
    const oy = offsetRef.current.y;

    const grid = new Float64Array(cols * rows);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const nx = x * NOISE_SCALE + ox;
        const ny = y * NOISE_SCALE + oy;

        let value = fbm(perm, nx, ny, OCTAVES);

        if (mouseNormX >= 0) {
          const gx = x / (cols - 1);
          const gy = y / (rows - 1);
          const dx = gx - mouseNormX;
          const dy = gy - mouseNormY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = isTouchRef.current
            ? TOUCH_INFLUENCE_RADIUS
            : MOUSE_INFLUENCE_RADIUS;

          if (dist < radius) {
            const influence = 1 - dist / radius;
            const smoothInfluence = influence * influence * (3 - 2 * influence);
            value += MOUSE_INFLUENCE_STRENGTH * smoothInfluence;
          }
        }

        grid[y * cols + x] = value;
      }
    }

    let minVal = Infinity;
    let maxVal = -Infinity;
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] < minVal) minVal = grid[i];
      if (grid[i] > maxVal) maxVal = grid[i];
    }

    ctx.clearRect(0, 0, width, height);

    const dpr = width / Number.parseFloat(canvas.style.width);
    const isMobile = isMobileViewport;
    const margin = (isMobile ? MAP_MARGIN_MOBILE : MAP_MARGIN_DESKTOP) * dpr;

    ctx.beginPath();
    ctx.strokeStyle = MAP_BORDER_COLOR;
    ctx.globalAlpha = MAP_BORDER_OPACITY;
    ctx.lineWidth = MAP_BORDER_WIDTH;
    ctx.lineJoin = "miter";
    ctx.lineCap = "butt";
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    const spacing = COORD_GRID_SPACING * dpr;

    ctx.beginPath();
    ctx.strokeStyle = COORD_GRID_COLOR;
    ctx.globalAlpha = COORD_GRID_OPACITY;
    ctx.lineWidth = COORD_GRID_WIDTH;
    ctx.lineJoin = "miter";
    ctx.lineCap = "butt";

    const verticalLines: number[] = [];
    const horizontalLines: number[] = [];

    for (let x = margin + spacing; x < width - margin; x += spacing) {
      ctx.moveTo(x, margin);
      ctx.lineTo(x, height - margin);
      verticalLines.push(x);
    }

    for (let y = margin + spacing; y < height - margin; y += spacing) {
      ctx.moveTo(margin, y);
      ctx.lineTo(width - margin, y);
      horizontalLines.push(y);
    }

    ctx.stroke();

    const tick = TICK_LENGTH * dpr;
    ctx.beginPath();
    ctx.strokeStyle = MAP_BORDER_COLOR;
    ctx.globalAlpha = MAP_BORDER_OPACITY;
    ctx.lineWidth = MAP_BORDER_WIDTH;

    for (const x of verticalLines) {
      ctx.moveTo(x, margin - tick);
      ctx.lineTo(x, margin);
      ctx.moveTo(x, height - margin);
      ctx.lineTo(x, height - margin + tick);
    }

    for (const y of horizontalLines) {
      ctx.moveTo(margin - tick, y);
      ctx.lineTo(margin, y);
      ctx.moveTo(width - margin, y);
      ctx.lineTo(width - margin + tick, y);
    }

    ctx.stroke();

    const baseLon = -58;
    const baseLat = -62;
    const degStep = 0.02;
    const fontSize = Math.round((isMobile ? 11 : 9) * dpr);
    ctx.font = `${fontSize}px var(--font-vt323), monospace`;
    ctx.fillStyle = MAP_BORDER_COLOR;
    ctx.globalAlpha = MAP_BORDER_OPACITY * 0.9;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    for (let i = 0; i < verticalLines.length; i++) {
      const deg = baseLon + (i + 1) * degStep;
      const d = Math.floor(Math.abs(deg));
      const minRaw = (Math.abs(deg) - d) * 60;
      const m = Math.floor(minRaw);
      const s = Math.round((minRaw - m) * 60);
      const label = `${d}\u00B0${String(m).padStart(2, "0")}'${String(s).padStart(2, "0")}"`;

      ctx.textBaseline = "bottom";
      ctx.fillText(label, verticalLines[i], margin - tick - 2 * dpr);

      ctx.textBaseline = "top";
      ctx.fillText(label, verticalLines[i], height - margin + tick + 2 * dpr);
    }

    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (let i = 0; i < horizontalLines.length; i++) {
      const deg = baseLat - (i + 1) * degStep;
      const d = Math.floor(Math.abs(deg));
      const minRaw = (Math.abs(deg) - d) * 60;
      const m = Math.floor(minRaw);
      const s = Math.round((minRaw - m) * 60);
      const label = `${d}\u00B0${String(m).padStart(2, "0")}'${String(s).padStart(2, "0")}"`;

      ctx.textAlign = "right";
      ctx.fillText(label, margin - tick - 4 * dpr, horizontalLines[i]);

      ctx.textAlign = "left";
      ctx.fillText(label, width - margin + tick + 4 * dpr, horizontalLines[i]);
    }

    const scaleBarWidth = (isMobile ? 140 : 100) * dpr;
    const scaleBarX = margin + 20 * dpr;
    const scaleBarY = height - margin + tick + (isMobile ? 14 : 18) * dpr;

    ctx.globalAlpha = MAP_BORDER_OPACITY;
    ctx.lineWidth = MAP_BORDER_WIDTH;
    ctx.strokeStyle = MAP_BORDER_COLOR;
    ctx.fillStyle = MAP_BORDER_COLOR;

    ctx.beginPath();
    ctx.moveTo(scaleBarX, scaleBarY);
    ctx.lineTo(scaleBarX + scaleBarWidth, scaleBarY);
    ctx.stroke();

    const endTick = 4 * dpr;
    ctx.beginPath();
    ctx.moveTo(scaleBarX, scaleBarY - endTick);
    ctx.lineTo(scaleBarX, scaleBarY + endTick);
    ctx.moveTo(scaleBarX + scaleBarWidth / 2, scaleBarY - endTick * 0.6);
    ctx.lineTo(scaleBarX + scaleBarWidth / 2, scaleBarY + endTick * 0.6);
    ctx.moveTo(scaleBarX + scaleBarWidth, scaleBarY - endTick);
    ctx.lineTo(scaleBarX + scaleBarWidth, scaleBarY + endTick);
    ctx.stroke();

    ctx.font = `${fontSize}px var(--font-vt323), monospace`;
    ctx.globalAlpha = MAP_BORDER_OPACITY * 0.9;
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    ctx.fillText("0", scaleBarX, scaleBarY + endTick + 2 * dpr);
    ctx.fillText(
      "50",
      scaleBarX + scaleBarWidth / 2,
      scaleBarY + endTick + 2 * dpr,
    );
    ctx.fillText(
      "100 m",
      scaleBarX + scaleBarWidth,
      scaleBarY + endTick + 2 * dpr,
    );

    for (let level = 0; level < CONTOUR_LEVELS; level++) {
      const normalizedLevel = level / (CONTOUR_LEVELS - 1);
      const threshold = minVal + normalizedLevel * (maxVal - minVal);
      const color = getContourColor(normalizedLevel);
      const isIndex = level % INDEX_CONTOUR_INTERVAL === 0 && level > 0;

      const segments = extractContourSegments(grid, cols, rows, threshold);

      if (segments.length === 0) continue;

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.globalAlpha = isIndex ? LINE_OPACITY * 1.4 : LINE_OPACITY;
      ctx.lineWidth = isIndex ? INDEX_CONTOUR_WIDTH : LINE_WIDTH;
      ctx.lineJoin = "miter";
      ctx.lineCap = "butt";

      for (const seg of segments) {
        ctx.moveTo(seg[0] * cellW, seg[1] * cellH);
        ctx.lineTo(seg[2] * cellW, seg[3] * cellH);
      }

      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);

      render();
    };

    setCanvasSize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
      targetOffsetRef.current.x =
        (e.clientX / window.innerWidth - 0.5) * MOUSE_DRIFT_SPEED;
      targetOffsetRef.current.y =
        (e.clientY / window.innerHeight - 0.5) * MOUSE_DRIFT_SPEED;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX / window.innerWidth;
        mouseRef.current.y = e.touches[0].clientY / window.innerHeight;
        targetOffsetRef.current.x =
          (e.touches[0].clientX / window.innerWidth - 0.5) * MOUSE_DRIFT_SPEED;
        targetOffsetRef.current.y =
          (e.touches[0].clientY / window.innerHeight - 0.5) * MOUSE_DRIFT_SPEED;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      isTouchRef.current = true;
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX / window.innerWidth;
        mouseRef.current.y = e.touches[0].clientY / window.innerHeight;
      }
    };

    const handleTouchEnd = () => {
      isTouchRef.current = false;
      mouseRef.current.x = -1;
      mouseRef.current.y = -1;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1;
      mouseRef.current.y = -1;
    };

    const animate = (timestamp: number) => {
      const delta = timestamp - lastFrameRef.current;
      const frameInterval = isTouchRef.current ? 33 : 50;

      if (delta >= frameInterval) {
        lastFrameRef.current = timestamp;

        const isMouseActive = mouseRef.current.x >= 0;

        if (!isMouseActive) {
          if (
            timestamp - lastDriftChangeRef.current >
            IDLE_DRIFT_CHANGE_INTERVAL
          ) {
            lastDriftChangeRef.current = timestamp;
            idleDriftRef.current = {
              x: (Math.random() - 0.5) * IDLE_DRIFT_SPEED,
              y: (Math.random() - 0.5) * IDLE_DRIFT_SPEED,
            };
          }
          targetOffsetRef.current.x += idleDriftRef.current.x * 0.03;
          targetOffsetRef.current.y += idleDriftRef.current.y * 0.03;
        }

        const lerpFactor = isTouchRef.current ? 0.08 : 0.02;
        offsetRef.current.x +=
          (targetOffsetRef.current.x - offsetRef.current.x) * lerpFactor;
        offsetRef.current.y +=
          (targetOffsetRef.current.y - offsetRef.current.y) * lerpFactor;

        render();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    window.addEventListener("resize", setCanvasSize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [render]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <canvas ref={canvasRef} />
      <span
        style={{
          position: "absolute",
          bottom: "10px",
          right: "48px",
          fontFamily: "var(--font-vt323)",
          fontSize: "0.875rem",
          color: "rgb(30, 80, 140)",
          opacity: 0.5,
          letterSpacing: "0.1em",
        }}
      >
        [skvggor land]
      </span>
    </div>
  );
};

export default BackgroundTopographic;
