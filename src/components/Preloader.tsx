import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export type PreloaderProps = { onDone: () => void; theme?: "dark" | "light" };

const W = 1200;          // SVG viewBox width
const H = 340;           // SVG viewBox height
const AMP = 14;          // wave height
const LEN = 480;         // wave length (one period)
const MIN_MS = 1800;     // minimum display time
const MAX_MS = 3500;     // maximum display time

const THEMES = {
  dark:  { bg: "#0B3D1A", dim: "rgba(255,255,255,0.12)", fill: "#FAFAF3", accent: "#FF4D4D", label: "rgba(250,250,243,0.85)" },
  light: { bg: "#FAFAF3", dim: "#DDE6D6",               fill: "#14612A", accent: "#D62828", label: "rgba(31,42,34,0.8)" },
};

function buildWave(): string {
  // wave across [0, W + LEN], filled down below the wave line
  const pts: string[] = [];
  for (let x = 0; x <= W + LEN; x += 8) {
    const y = AMP * Math.sin((2 * Math.PI * x) / LEN);
    pts.push(`${x},${y.toFixed(2)}`);
  }
  return `M ${pts.join(" L ")} L ${W + LEN},${H * 2} L 0,${H * 2} Z`;
}
const WAVE_PATH = buildWave();

export function Preloader({ onDone, theme = "dark" }: PreloaderProps) {
  const c = THEMES[theme];
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const waveRef = useRef<SVGGElement>(null);
  progressRef.current = progress;
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // lock scroll while loading
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // progress: real readiness + eased timer
  useEffect(() => {
    let raf = 0;
    let ready = document.readyState === "complete";
    let fontsReady = false;
    const start = performance.now();
    const onLoad = () => { ready = true; };
    window.addEventListener("load", onLoad);
    document.fonts?.ready.then(() => { fontsReady = true; });

    const tick = (now: number) => {
      const t = now - start;
      const canFinish = ready && fontsReady && t >= MIN_MS;
      const forced = t >= MAX_MS;
      const eased = Math.min(1, t / (MIN_MS + 400));
      const target = canFinish || forced ? 100 : Math.min(90, eased * 90);
      setProgress((p) => {
        const next = p + (target - p) * 0.08 + (target > p ? 0.15 : 0);
        return Math.min(target, Math.max(p, next));
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  // wave movement: update the clip transform directly every frame
  // (horizontal slide = seamless loop, vertical = current progress)
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const offset = reduce ? 0 : (((now - t0) / 1000) * 120) % LEN; // 120px/s
      const y = (H + AMP) * (1 - progressRef.current / 100);
      waveRef.current?.setAttribute("transform", `translate(${-offset}, ${y})`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  // finish
  useEffect(() => {
    if (progress >= 99.5) {
      const id = setTimeout(onDone, 400);
      return () => clearTimeout(id);
    }
  }, [progress, onDone]);

  const pct = Math.min(100, Math.round(progress));

  const textProps = {
    x: W / 2,
    y: H * 0.78,
    textAnchor: "middle" as const,
    fontSize: 230,
    fontWeight: 900,
    style: { fontFamily: "'Fraunces', serif" },
  };

  const Wordmark = ({ fill }: { fill: string }) => (
    <text {...textProps} fill={fill}>
      <tspan fill={fill === c.fill ? c.accent : fill} style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>अ</tspan>
      nnapurna
    </text>
  );

  return (
    <motion.div
      role="status"
      aria-label={`Loading ${pct} percent`}
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: reduce ? 0.4 : 0.9, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999, background: c.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div style={{ width: "min(92vw, 1100px)" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }}>
          <defs>
            <clipPath id="annapurna-wave">
              <g ref={waveRef} transform={`translate(0, ${H + AMP})`}>
                <path d={WAVE_PATH} />
              </g>
            </clipPath>
          </defs>

          {/* dim base */}
          <Wordmark fill={c.dim} />
          {/* bright fill, revealed by the wave */}
          <g clipPath="url(#annapurna-wave)">
            <Wordmark fill={c.fill} />
          </g>
        </svg>

        <div
          style={{
            textAlign: "right", marginTop: 6, color: c.label,
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em",
          }}
        >
          loading... {pct} %
        </div>
      </div>
    </motion.div>
  );
}

export default Preloader;

