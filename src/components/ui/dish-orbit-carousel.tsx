"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
 * Dish Orbit Carousel: a smart-kitchen-display menu. The plated dish sits on
 * the left; changing dish swings it out over the top on a wide orbit while the
 * next plate swings in from the other side.
 */

export type Dish = {
  /** The thin first title line, e.g. "Kinnaur Orchard". */
  title: string;
  /** The heavy second title line, e.g. "Royal Gala". */
  subtitle: string;
  /** Plate photo, square. */
  image: string;
  alt?: string;
  /** Small line above the title. Defaults to "#n Fresh harvest pick". */
  eyebrow?: string;
  /** Two-line label under the thumbnail. Defaults to title + subtitle. */
  label?: string;
  rating: number;
  chef: string;
  /** Farm origin or region under the producer name. */
  kitchen?: string;
  description: string;
  likes: number;
  ingredients?: string[];
  /** Badge and band colour: hex or rgb(), so the band can morph between dishes. */
  accent: string;
  /** Store product link for one-click add to cart */
  productId?: string;
  price?: string;
};

export type DishOrbitCarouselProps = {
  dishes: Dish[];
  /** Root height. A definite length: percentages collapse on a host page. */
  height?: string;
  /** Optional photo behind the display, e.g. a farm or kitchen wall. Washed by the theme background. */
  backdrop?: string;
  /** Scroll on forever: past the last dish comes the first again. */
  loop?: boolean;
  fontSrc?: string | null;
  orderLabel?: string;
  playLabel?: string;
  onPlay?: (dish: Dish, index: number) => void;
  onOrder?: (dish: Dish, index: number) => void;
  onChange?: (index: number) => void;
  className?: string;
  /** If true, expands height and drives changes via page scroll. If false (recommended), remains a clean single-height card. */
  scrollDriven?: boolean;
  /** Auto-cycle through items every X ms when not scroll-driven. */
  autoplay?: boolean;
  /** Time between auto-cycles in ms (default 4500). */
  interval?: number;
};

// #region carousel
export function wrapIndex(i: number, n: number): number {
  if (n <= 0) return 0;
  return ((Math.round(i) % n) + n) % n;
}

export function stepDirection(from: number, to: number, n: number): 1 | -1 {
  if (n <= 0) return 1;
  const fwd = (((to - from) % n) + n) % n;
  return fwd <= n - fwd ? 1 : -1;
}

export function scrollSteps(n: number, loop: boolean): number {
  return Math.max(0, loop ? n : n - 1);
}

export function segmentFor(i: number, current: number, n: number, loop: boolean): number {
  return loop && i === 0 && current > n / 2 ? n : i;
}

export function stripStart(index: number, n: number, visible: number): number {
  if (n <= visible) return 0;
  return Math.max(0, Math.min(index - 1, n - visible));
}

export function fitSize(chars: number, max: number, width: number, em: number): number {
  return Math.min(max, width / (Math.max(1, chars) * em));
}

export function arcPath(a0: number, a1: number, cx: number, cy: number, r: number, w: number, steps = 48): string {
  const outer: string[] = [];
  const inner: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = ((a0 + (a1 - a0) * t) * Math.PI) / 180;
    const h = (w / 2) * Math.pow(Math.sin(Math.PI * t), 0.45);
    const c = Math.cos(a);
    const s = Math.sin(a);
    outer.push((cx + c * (r + h)).toFixed(1) + " " + (cy + s * (r + h)).toFixed(1));
    inner.push((cx + c * (r - h)).toFixed(1) + " " + (cy + s * (r - h)).toFixed(1));
  }
  return "M" + outer.join("L") + "L" + inner.reverse().join("L") + "Z";
}

export const ARC_REST = [
  [50, 98],
  [46, 124],
  [60, 126],
  [40, 100],
];
export function arcRest(index: number): number[] {
  return ARC_REST[((index % ARC_REST.length) + ARC_REST.length) % ARC_REST.length];
}

export const ARC_SWEEP = [38, 146];
// #endregion

const ORBIT_X = 299;
const ORBIT_Y = -450;
const ORBIT_R = 650;
const SCROLL_PER_DISH = 0.7;
const SWING = 50;
const ITEM = 118;
const VISIBLE = 4;

const CSS =
  ".dsh-trk{position:relative;width:100%}" +
  ".dsh-root{position:relative;overflow:hidden;width:100%;background:var(--color-background);color:var(--color-foreground);" +
  "font-family:'DM Sans',ui-sans-serif,system-ui,sans-serif;container-type:inline-size;-webkit-tap-highlight-color:transparent}" +
  ".dsh-root *{box-sizing:border-box}" +
  ".dsh-bd{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;pointer-events:none}" +
  ".dsh-wash{position:absolute;inset:0;background:color-mix(in oklab,var(--color-background) 38%,transparent);pointer-events:none}" +
  ".dsh-dim{position:absolute;inset:0;background:var(--color-background);mix-blend-mode:multiply;opacity:.72;pointer-events:none}" +
  ".dsh-root:focus-visible{outline:2px solid var(--forest);outline-offset:-4px}" +
  ".dsh-canvas{position:absolute;left:50%;top:50%;width:960px;height:520px;transform:translate(-50%,-50%) scale(var(--dsh-s,1));transform-origin:50% 50%}" +
  ".dsh-arc{position:absolute;left:0;top:0;width:960px;height:520px;overflow:visible;pointer-events:none}" +
  ".dsh-btn{appearance:none;border:0;background:none;color:inherit;font:inherit;padding:0;margin:0;cursor:pointer}" +
  ".dsh-btn:focus-visible{outline:2px solid var(--forest);outline-offset:3px;border-radius:10px}" +
  ".dsh-ico{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}" +
  ".dsh-top{position:absolute;left:800px;top:52px;display:flex;gap:14px}" +
  ".dsh-top .dsh-btn{width:36px;height:36px;display:grid;place-items:center;border-radius:10px}" +
  ".dsh-pager{position:absolute;left:76px;top:172px;display:flex;flex-direction:column;align-items:center;gap:7px}" +
  ".dsh-dot{width:14px;height:10px;display:grid;place-items:center}" +
  ".dsh-dot i{display:block;width:3px;height:3px;border-radius:3px;background:var(--forest);opacity:.45;transition:height .45s cubic-bezier(.3,.7,.2,1),opacity .3s}" +
  ".dsh-dot[aria-current] i{height:22px;opacity:1}" +
  ".dsh-dot[aria-current]{height:26px}" +
  ".dsh-dot{transition:height .45s cubic-bezier(.3,.7,.2,1)}" +
  ".dsh-plates{position:absolute;left:130px;top:82px;width:245px;height:245px;touch-action:pan-y}" +
  ".dsh-orbit{position:absolute;inset:0;transform-origin:69% -217%;visibility:hidden;will-change:transform}" +
  ".dsh-orbit>img{display:block;width:245px;height:245px;max-width:none;object-fit:cover;border-radius:50%;user-select:none;-webkit-user-drag:none;" +
  "filter:drop-shadow(0 16px 22px rgba(0,0,0,.2)) drop-shadow(0 3px 5px rgba(0,0,0,.12));border:4px solid white}" +
  ".dsh-head{position:absolute;left:388px;top:96px;width:330px;height:150px}" +
  ".dsh-hd{position:absolute;inset:0;visibility:hidden}" +
  ".dsh-eye{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--forest);margin:0 0 4px 2px}" +
  ".dsh-t1,.dsh-t2{display:block;white-space:nowrap;line-height:1;margin:0;font-family:'Fraunces',serif}" +
  ".dsh-t1{font-weight:300;letter-spacing:-.015em;margin-top:6px;color:#1F2A22}" +
  ".dsh-t2{font-weight:700;letter-spacing:-.025em;margin-top:6px;color:var(--forest)}" +
  ".dsh-acts{position:absolute;left:388px;top:282px;display:flex;align-items:center;gap:10px;font-size:12.5px;font-weight:600;z-index:3}" +
  ".dsh-acts .dsh-btn{display:flex;align-items:center;gap:6px;padding:7px 13px;border-radius:8px;white-space:nowrap;transition:all .2s}" +
  ".dsh-acts .dsh-btn-order{background:var(--forest);color:white;box-shadow:0 4px 12px rgba(20,97,42,0.25)}" +
  ".dsh-acts .dsh-btn-order:hover{background:#0B3D1A;transform:translateY(-1px)}" +
  ".dsh-acts .dsh-btn-story{background:white;color:#1F2A22;border:1px solid #DDE6D6}" +
  ".dsh-acts .dsh-btn-story:hover{border-color:var(--forest)}" +
  ".dsh-acts .dsh-ico{width:14px;height:14px}" +
  ".dsh-card{position:absolute;left:730px;top:130px;width:218px;padding:16px 18px 18px;border-radius:20px;z-index:2;" +
  "background:rgba(255,255,255,0.85);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border:1px solid #DDE6D6;" +
  "box-shadow:0 1px 0 rgba(255,255,255,0.6) inset,0 18px 40px -24px rgba(0,0,0,.15)}" +
  ".dsh-tabs{display:flex;justify-content:space-between;padding:0 6px 0 10px;font-size:12px;margin-bottom:16px}" +
  ".dsh-tab{color:#6B7A6F;font-weight:500;padding:3px 0}" +
  ".dsh-tab[aria-selected=true]{color:#14612A;font-weight:700;border-bottom:2px solid #14612A}" +
  ".dsh-bodies{display:grid}" +
  ".dsh-body{grid-area:1/1;visibility:hidden}" +
  ".dsh-rate{position:relative;height:52px;margin:0 0 10px 4px}" +
  ".dsh-badge{position:absolute;left:0;top:0;width:42px;height:52px;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white}" +
  ".dsh-badge svg{width:11px;height:11px;fill:currentColor}" +
  ".dsh-num{font-size:20px;font-weight:700;line-height:1;margin-top:2px}" +
  ".dsh-chef{font-size:16px;font-weight:600;letter-spacing:-.01em;margin:0;color:#1F2A22}" +
  ".dsh-kit{font-size:11px;color:#6B7A6F;margin:2px 0 10px}" +
  ".dsh-desc{font-size:12px;line-height:1.4;margin:0;min-height:50px;color:#4A5568}" +
  ".dsh-ing{display:flex;flex-wrap:wrap;gap:5px;margin:0;padding:0;list-style:none;min-height:50px}" +
  ".dsh-ing li{font-size:10.5px;padding:3px 8px;border-radius:99px;background:#EAF4E4;color:#14612A;font-weight:500}" +
  ".dsh-react{display:flex;gap:10px;margin-top:16px}" +
  ".dsh-like{display:flex;align-items:center;gap:7px;height:32px;padding:0 12px;border-radius:99px;font-size:11px;font-weight:600;" +
  "background:#FAFAF3;border:1px solid #DDE6D6;color:#1F2A22;transition:background .25s}" +
  ".dsh-meh{width:32px;height:32px;display:grid;place-items:center;border-radius:99px;background:#FAFAF3;border:1px solid #DDE6D6;color:#6B7A6F}" +
  ".dsh-react .dsh-ico{width:14px;height:14px}" +
  ".dsh-react [aria-pressed=true]{background:#14612A;color:white;border-color:#14612A}" +
  ".dsh-strip{position:absolute;left:130px;top:362px;width:550px;height:122px;display:flex;align-items:center}" +
  ".dsh-arrow{width:36px;height:36px;display:grid;place-items:center;flex:none;color:#14612A}" +
  ".dsh-arrow svg{width:12px;height:16px;fill:currentColor}" +
  ".dsh-win{position:relative;width:" +
  ITEM * VISIBLE +
  "px;height:122px;overflow:hidden;flex:none;margin:0 2px;" +
  "-webkit-mask-image:linear-gradient(90deg,#000 88%,transparent);mask-image:linear-gradient(90deg,#000 88%,transparent)}" +
  ".dsh-track{position:absolute;left:0;top:0;display:flex;transition:transform .6s cubic-bezier(.65,0,.35,1)}" +
  ".dsh-th{width:" +
  ITEM +
  "px;height:122px;display:flex;justify-content:center;padding-top:3px}" +
  ".dsh-th .dsh-btn{width:84px;height:116px;border-radius:14px;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 4px;transition:all .3s}" +
  ".dsh-th .dsh-btn[aria-current]{background:white;border:1px solid #DDE6D6;box-shadow:0 8px 20px -8px rgba(20,97,42,0.2)}" +
  ".dsh-th img{width:54px;height:54px;border-radius:50%;object-fit:cover;border:2px solid white;box-shadow:0 3px 6px rgba(0,0,0,.12);transition:transform .45s}" +
  ".dsh-th .dsh-btn[aria-current] img{transform:scale(1.08)}" +
  ".dsh-th span{font-size:10px;line-height:1.2;text-align:center;font-weight:600;color:#1F2A22;max-width:80px}" +
  ".dsh-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}" +
  "@container (max-width:639px){" +
  ".dsh-canvas{position:relative;left:auto;top:auto;width:100%;height:auto;transform:none;display:flex;flex-direction:column;align-items:center;padding:14px 16px 18px}" +
  ".dsh-arc{width:200%;height:auto;left:-60%;top:-30px}" +
  ".dsh-top{display:none}" +
  ".dsh-pager{left:14px;top:150px}" +
  ".dsh-plates{position:relative;left:auto;top:auto;width:min(52vw,32svh);height:min(52vw,32svh);margin-top:0}" +
  ".dsh-orbit>img{width:100%;height:100%}" +
  ".dsh-head{position:relative;left:auto;top:auto;width:100%;height:132px;margin-top:10px}" +
  ".dsh-hd{text-align:center;transform:scale(.78);transform-origin:50% 0}" +
  ".dsh-acts{position:relative;left:auto;top:auto;margin-top:4px}" +
  ".dsh-card{position:relative;left:auto;top:auto;width:100%;max-width:420px;margin-top:12px}" +
  ".dsh-strip{display:none}" +
  "}" +
  "@media (prefers-reduced-motion:reduce){.dsh-track,.dsh-dot,.dsh-dot i,.dsh-th .dsh-btn,.dsh-th img,.dsh-like{transition:none}}";

const HIDE_1 = "inset(0% 0% 0% 100%)";
const HIDE_2 = "inset(0% 100% 0% 0%)";
const SHOW = "inset(0% 0% 0% 0%)";

const Icon = {
  play: (
    <svg className="dsh-ico" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  order: (
    <svg className="dsh-ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  up: (
    <svg className="dsh-ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 10v10H3.5V10zM7 10l4-7c1.6 0 2.6 1.2 2.2 2.8L12.6 9H19a2 2 0 0 1 2 2.3l-1.3 7A2 2 0 0 1 17.7 20H7" />
    </svg>
  ),
  down: (
    <svg className="dsh-ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17 14V4h3.5v10zM17 14l-4 7c-1.6 0-2.6-1.2-2.2-2.8l.6-3.2H5a2 2 0 0 1-2-2.3l1.3-7A2 2 0 0 1 6.3 4H17" />
    </svg>
  ),
};

export function DishOrbitCarousel({
  dishes,
  height = "520px",
  backdrop,
  loop = true,
  orderLabel = "Add to Basket",
  playLabel = "Farm Story",
  onPlay,
  onOrder,
  onChange,
  className,
  scrollDriven = false,
  autoplay = true,
  interval = 4500,
}: DishOrbitCarouselProps) {
  const n = dishes.length;
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState("overview");
  const [liked, setLiked] = useState({} as Record<number, boolean>);
  const [disliked, setDisliked] = useState({} as Record<number, boolean>);
  const isHovered = useRef(false);

  const trackRef = useRef(null as HTMLDivElement | null);
  const rootRef = useRef(null as HTMLDivElement | null);
  const stRef = useRef(null as ScrollTrigger | null);
  const segRef = useRef(0);
  const indexRef = useRef(0);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const orbits = useRef([] as (HTMLDivElement | null)[]);
  const heads = useRef([] as (HTMLDivElement | null)[]);
  const bodies = useRef([] as (HTMLDivElement | null)[]);
  const arcRef = useRef(null as SVGPathElement | null);
  const arc = useRef({ a0: 0, a1: 0 });
  const shown = useRef(-1);
  const dirRef = useRef(1 as 1 | -1);
  const tlRef = useRef(null as gsap.core.Timeline | null);
  const reducedRef = useRef(false);
  const swipe = useRef(null as { x: number; y: number } | null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const fit = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      el.style.setProperty("--dsh-s", String(Math.min(w / 960, h / 520, 1.45)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => (reducedRef.current = mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useLayoutEffect(() => {
    const from = shown.current;
    const to = index;
    const parts = (i: number) => {
      const head = heads.current[i];
      return {
        orbit: orbits.current[i],
        head,
        eye: head && head.querySelector(".dsh-eye"),
        t1: head && head.querySelector(".dsh-t1"),
        t2: head && head.querySelector(".dsh-t2"),
        body: bodies.current[i],
      };
    };
    const drawArc = () => arcRef.current?.setAttribute("d", arcPath(arc.current.a0, arc.current.a1, ORBIT_X, ORBIT_Y, ORBIT_R, 118));
    const rest = arcRest(to);
    const tint = dishes[to] ? dishes[to].accent : "#14612A";
    if (tlRef.current) tlRef.current.progress(1).kill();
    const b = parts(to);
    if (from === -1 || from === to || reducedRef.current) {
      for (let i = 0; i < n; i++)
        if (i !== to) {
          const p = parts(i);
          gsap.set([p.orbit, p.head, p.body], { autoAlpha: 0 });
        }
      gsap.set([b.orbit, b.head, b.body, b.eye], { autoAlpha: 1, rotation: 0, y: 0 });
      gsap.set(b.t1, { clipPath: SHOW });
      gsap.set(b.t2, { clipPath: SHOW });
      arc.current.a0 = rest[0];
      arc.current.a1 = rest[1];
      drawArc();
      if (arcRef.current) gsap.set(arcRef.current, { fill: tint });
      shown.current = to;
      return;
    }
    const a = parts(from);
    const d = dirRef.current;
    const tl = gsap.timeline({
      onComplete: () => {
        tlRef.current = null;
      },
    });
    tlRef.current = tl;
    tl.to(a.orbit, { rotation: SWING * d, duration: 0.62, ease: "power2.in" }, 0)
      .set(a.orbit, { autoAlpha: 0, rotation: 0 }, 0.62)
      .fromTo(b.orbit, { autoAlpha: 1, rotation: -SWING * d }, { rotation: 0, duration: 0.95, ease: "power3.out" }, 0.3);
    tl.to(a.t1, { clipPath: HIDE_1, duration: 0.42, ease: "power2.in" }, 0)
      .to(a.t2, { clipPath: HIDE_2, duration: 0.42, ease: "power2.in" }, 0.06)
      .to(a.eye, { autoAlpha: 0, duration: 0.25 }, 0)
      .set(a.head, { autoAlpha: 0 }, 0.5)
      .set(b.head, { autoAlpha: 1 }, 0.5)
      .fromTo(b.eye, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.55)
      .fromTo(b.t1, { clipPath: HIDE_1 }, { clipPath: SHOW, duration: 0.7, ease: "power3.out" }, 0.55)
      .fromTo(b.t2, { clipPath: HIDE_2 }, { clipPath: SHOW, duration: 0.7, ease: "power3.out" }, 0.62);
    tl.to(a.body, { autoAlpha: 0, y: -6, duration: 0.3, ease: "power1.in" }, 0.05).set(b.body, { autoAlpha: 1, y: 0 }, 0.4);
    if (b.body) tl.fromTo(b.body.children, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" }, 0.4);
    tl.to(arc.current, { a0: ARC_SWEEP[0], a1: ARC_SWEEP[1], duration: 0.6, ease: "power2.inOut", onUpdate: drawArc }, 0).to(
      arc.current,
      { a0: rest[0], a1: rest[1], duration: 0.85, ease: "power3.out", onUpdate: drawArc },
      0.6
    );
    if (arcRef.current) tl.to(arcRef.current, { fill: tint, duration: 1.1, ease: "power1.inOut" }, 0.1);
    shown.current = to;
  }, [index, n, dishes]);

  useEffect(() => () => {
    tlRef.current?.kill();
  }, []);

  const select = (next: number, dir: 1 | -1) => {
    if (next === indexRef.current) return;
    dirRef.current = dir;
    indexRef.current = next;
    setIndex(next);
    onChangeRef.current?.(next);
  };

  // Autoplay rotation when not driven by page scroll
  useEffect(() => {
    if (scrollDriven || !autoplay || n <= 1) return;
    const timer = setInterval(() => {
      if (!isHovered.current) {
        step(1);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [scrollDriven, autoplay, interval, n, index]);

  const steps = scrollSteps(n, loop);
  useEffect(() => {
    if (!scrollDriven) return;
    const track = trackRef.current;
    if (!track || steps < 1) return;
    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      snap: { snapTo: 1 / steps, duration: { min: 0.3, max: 0.8 }, delay: 0.08, ease: "power2.inOut" },
      onUpdate: (self) => {
        if (loop && self.progress >= 1 && self.direction > 0) {
          segRef.current = 0;
          self.scroll(self.start + 1);
          select(0, 1);
          return;
        }
        const seg = Math.round(self.progress * steps);
        if (seg === segRef.current) return;
        const dir = seg > segRef.current ? 1 : -1;
        segRef.current = seg;
        select(wrapIndex(seg, n), dir);
      },
    });

    let raf = 0;
    const onWheel = (e: WheelEvent) => {
      const y = trigger.scroll();
      if (!loop || e.deltaY >= 0 || y < trigger.start - 1 || y > trigger.start + 1) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        segRef.current = n - 1;
        trigger.scroll(trigger.start + ((trigger.end - trigger.start) * (n - 1)) / steps);
        select(n - 1, -1);
      });
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    stRef.current = trigger;
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      trigger.kill();
      stRef.current = null;
    };
  }, [steps, loop, n, scrollDriven]);

  const go = (to: number, dir?: 1 | -1) => {
    if (n < 2) return;
    const next = wrapIndex(to, n);
    if (next === index) return;
    if (scrollDriven) {
      const st = stRef.current;
      const y = st ? st.scroll() : 0;
      if (st && y >= st.start - 1 && y <= st.end + 1) {
        const seg = segmentFor(next, segRef.current, n, loop);
        segRef.current = seg;
        st.scroll(st.start + ((st.end - st.start) * seg) / steps);
      }
    }
    select(next, dir ?? stepDirection(index, next, n));
  };
  const step = (d: 1 | -1) => go(index + d, d);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };
  const onPointerDown = (e: React.PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.4) step(dx < 0 ? 1 : -1);
  };

  const start = stripStart(index, n, VISIBLE);
  const dish = dishes[index];

  return (
    <div
      ref={trackRef}
      className={"dsh-trk" + (className ? " " + className : "")}
      style={{ height: scrollDriven ? "calc(" + height + " * " + (1 + steps * SCROLL_PER_DISH) + ")" : height }}
    >
      <div
        ref={rootRef}
        className="dsh-root"
        style={{ height }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Fresh Harvest Belt"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => {
          isHovered.current = true;
        }}
        onMouseLeave={() => {
          isHovered.current = false;
        }}
      >
        <style>{CSS}</style>
        {backdrop ? <img className="dsh-bd" src={backdrop} alt="" width={1200} height={900} /> : null}
        {backdrop ? <div className="dsh-dim" /> : null}
        {backdrop ? <div className="dsh-wash" /> : null}

        <div className="dsh-canvas">
          <svg className="dsh-arc" viewBox="0 0 960 520" aria-hidden="true">
            <path ref={arcRef} style={{ opacity: 0.35 }} />
          </svg>

          <div className="dsh-pager" role="tablist" aria-label="Choose harvest item">
            {dishes.map((d, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                className="dsh-btn dsh-dot"
                aria-selected={i === index}
                aria-current={i === index ? "true" : undefined}
                aria-label={d.title + " " + d.subtitle}
                onClick={() => go(i)}
              >
                <i />
              </button>
            ))}
          </div>

          <div className="dsh-plates" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipe.current = null)}>
            {dishes.map((d, i) => (
              <div
                key={i}
                ref={(el) => {
                  orbits.current[i] = el;
                }}
                className="dsh-orbit"
                aria-hidden={i !== index}
              >
                <img src={d.image} alt={d.alt ?? d.title + " " + d.subtitle} width={245} height={245} draggable={false} />
              </div>
            ))}
          </div>

          <div className="dsh-head" aria-live="polite">
            {dishes.map((d, i) => (
              <div
                key={i}
                ref={(el) => {
                  heads.current[i] = el;
                }}
                className="dsh-hd"
                aria-hidden={i !== index}
              >
                <p className="dsh-eye">{d.eyebrow ?? "#" + (i + 1) + " Morning Harvest Pick"}</p>
                <h2 style={{ margin: 0, font: "inherit" }}>
                  <span className="dsh-t1" style={{ fontSize: fitSize(d.title.length, 36, 330, 0.56) + "px" }}>
                    {d.title}
                  </span>
                  <span className="dsh-t2" style={{ fontSize: fitSize(d.subtitle.length, 42, 320, 0.64) + "px" }}>
                    {d.subtitle}
                  </span>
                </h2>
              </div>
            ))}
          </div>

          <div className="dsh-acts">
            <button type="button" className="dsh-btn dsh-btn-order" onClick={() => dish && onOrder?.(dish, index)}>
              {Icon.order}
              {dish.price ? `${orderLabel} · ${dish.price}` : orderLabel}
            </button>
            <button type="button" className="dsh-btn dsh-btn-story" onClick={() => dish && onPlay?.(dish, index)}>
              {Icon.play}
              {playLabel}
            </button>
          </div>

          <div className="dsh-card">
            <div className="dsh-tabs" role="tablist" aria-label="Harvest details">
              {["overview", "origin"].map((t) => (
                <button key={t} type="button" role="tab" className="dsh-btn dsh-tab" aria-selected={tab === t} onClick={() => setTab(t)}>
                  {t === "overview" ? "Harvest Notes" : "Purity & Origin"}
                </button>
              ))}
            </div>
            <div className="dsh-bodies">
              {dishes.map((d, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    bodies.current[i] = el;
                  }}
                  className="dsh-body"
                  aria-hidden={i !== index}
                >
                  <div className="dsh-rate">
                    <div className="dsh-badge" style={{ background: d.accent }}>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m12 2.5 2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.2l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
                      </svg>
                      <span className="dsh-num">{d.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="dsh-chef">{d.chef}</p>
                  <p className="dsh-kit">{d.kitchen ?? "Annapurna Partner Farm"}</p>
                  {tab === "overview" || !d.ingredients?.length ? (
                    <p className="dsh-desc">{d.description}</p>
                  ) : (
                    <ul className="dsh-ing">
                      {d.ingredients.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  )}
                  <div className="dsh-react">
                    <button
                      type="button"
                      className="dsh-btn dsh-like"
                      aria-pressed={!!liked[i]}
                      tabIndex={i === index ? 0 : -1}
                      onClick={() => {
                        setLiked((s) => ({ ...s, [i]: !s[i] }));
                        setDisliked((s) => ({ ...s, [i]: false }));
                      }}
                    >
                      {Icon.up}
                      {d.likes + (liked[i] ? 1 : 0)} loved
                    </button>
                    <button
                      type="button"
                      className="dsh-btn dsh-meh"
                      aria-pressed={!!disliked[i]}
                      aria-label="Skip item"
                      tabIndex={i === index ? 0 : -1}
                      onClick={() => {
                        setDisliked((s) => ({ ...s, [i]: !s[i] }));
                        setLiked((s) => ({ ...s, [i]: false }));
                      }}
                    >
                      {Icon.down}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dsh-strip">
            <button type="button" className="dsh-btn dsh-arrow" aria-label="Previous produce" onClick={() => step(-1)}>
              <svg viewBox="0 0 12 16" aria-hidden="true">
                <path d="M11 0v16L0 8z" />
              </svg>
            </button>
            <div className="dsh-win">
              <div className="dsh-track" style={{ transform: "translateX(" + -start * ITEM + "px)" }}>
                {dishes.map((d, i) => (
                  <div key={i} className="dsh-th">
                    <button type="button" className="dsh-btn" aria-current={i === index ? "true" : undefined} onClick={() => go(i)}>
                      <img src={d.image} alt="" width={54} height={54} draggable={false} />
                      <span>{d.label ?? d.title + " " + d.subtitle}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button type="button" className="dsh-btn dsh-arrow" aria-label="Next produce" onClick={() => step(1)}>
              <svg viewBox="0 0 12 16" aria-hidden="true">
                <path d="M1 0v16l11-8z" />
              </svg>
            </button>
          </div>
        </div>
        <p className="dsh-sr" aria-live="polite">
          {dish ? "Item " + (index + 1) + " of " + n + ": " + dish.title + " " + dish.subtitle : ""}
        </p>
      </div>
    </div>
  );
}

export default DishOrbitCarousel;
