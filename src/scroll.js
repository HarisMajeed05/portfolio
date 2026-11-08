import { useEffect, useState } from "react";
import Lenis from "lenis";
import { sfx } from "./sound";

// One shared scroll state. The DOM sections and the WebGL world both read it,
// the world never touches React state per frame.
//   c      chapter position as a float: 2.4 means 40% of the way from chapter 2 to 3
//   u[i]   progress through chapter i while it is pinned, 0 to 1
//   speed  smoothed scroll speed in px/s, drives the warp streaks
export const S = {
  y: 0,
  vh: 1,
  c: 0,
  u: [0, 0, 0, 0, 0, 0],
  speed: 0,
  shift: 0,
  camZ: 10,
  tops: [],
  heights: [],
  max: 0,
  reduced: false,
  // seconds (performance.now based) when the loader lifted, drives the intro
  t0: -1,
  // loader checklist: fonts, portrait, scene
  boot: {},
  // tool picked on the orbits, and the set of project ids that list it
  tool: null,
  hl: null,
  // 1 while a case study is open, f is the smoothed copy the camera reads
  focus: 0,
  f: 0,
};

let lenis = null;
let lastY = 0;
let lastT = 0;
let lastVel = 0;

function measure() {
  const els = document.querySelectorAll("[data-chapter]");
  S.vh = window.innerHeight;
  S.tops = [...els].map((el) => el.getBoundingClientRect().top + window.scrollY);
  S.heights = [...els].map((el) => el.offsetHeight);
  // the furthest the page can actually scroll, so the last chapter is always reachable
  S.max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  lenis?.resize();
}

function solve() {
  const n = S.tops.length;
  if (!n) return;
  const y = S.y;
  for (let i = 0; i < n; i++) S.u[i] = 0;
  // zoom, rounding or a late layout change can leave the last chapter a little
  // below the bottom of the page. Cap it there so scrolling to the end lands on it.
  const start = (i) => (i === n - 1 ? Math.min(S.tops[i], S.max) : S.tops[i]);
  const settled = (i) => Math.min(S.tops[i] + Math.max(0, S.heights[i] - S.vh), i < n - 1 ? start(i + 1) - 1 : Infinity);

  if (y >= S.max - 1 && S.max > 0) {
    S.c = n - 1;
    S.u[n - 1] = 1;
    return;
  }
  if (y <= start(0)) {
    S.c = 0;
    return;
  }
  for (let i = 0; i < n; i++) {
    const pin = Math.max(1, S.heights[i] - S.vh);
    const last = i === n - 1;
    const next = last ? Infinity : start(i + 1);
    if (y < next) {
      if (y <= settled(i) || last) {
        S.c = i;
        S.u[i] = Math.min(1, Math.max(0, (y - start(i)) / pin));
      } else {
        const t = (y - settled(i)) / (next - settled(i));
        S.c = i + t;
        S.u[i] = 1;
        S.u[i + 1] = 0;
      }
      return;
    }
  }
}

export function initScroll() {
  S.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  measure();

  const onScroll = (y) => {
    S.y = y;
    solve();
  };

  if (S.reduced) {
    window.addEventListener("scroll", () => onScroll(window.scrollY), { passive: true });
  } else {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, touchMultiplier: 1.4 });
    lenis.on("scroll", (e) => onScroll(e.scroll));
    const raf = (t) => {
      lenis.raf(t);
      // pixels per second, eased by real time so it does not depend on frame rate
      const dt = Math.max(0.001, (t - lastT) / 1000);
      lastT = t;
      S.speed += (Math.abs(S.y - lastY) / dt - S.speed) * (1 - Math.exp(-dt * 7));
      lastY = S.y;
      // headings read this to lean a little while you scroll fast
      const vel = Math.min(1, S.speed / 4200);
      if (Math.abs(vel - lastVel) > 0.01) {
        lastVel = vel;
        document.documentElement.style.setProperty("--vel", vel.toFixed(3));
      }
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  const onResize = () => {
    measure();
    onScroll(window.scrollY);
  };
  window.addEventListener("resize", onResize);
  // any change in the page's height (fonts, the GitHub line, a lens switch) re-measures
  if ("ResizeObserver" in window) new ResizeObserver(() => onResize()).observe(document.body);
  // fonts and images change section heights, so measure again once they land
  window.addEventListener("load", onResize);
  document.fonts?.ready.then(onResize);
  setTimeout(onResize, 400);
  onScroll(window.scrollY);
}

// marks one loader step done
export function ready(name) {
  S.boot[name] = true;
  window.dispatchEvent(new Event("boot"));
}

// called once when the loader lifts, the portrait and the camera start from here
export function reveal() {
  S.t0 = S.reduced ? 0.001 : performance.now() / 1000;
}

export function goTo(i) {
  const top = S.tops[i] ?? 0;
  if (lenis) lenis.scrollTo(top, { duration: 2.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else window.scrollTo({ top });
}

// scroll to an absolute y. d = 0 jumps with no animation, force works while
// the page is locked behind a drawer
export function goToY(y, d = 1.6, force = false) {
  if (lenis) lenis.scrollTo(y, d === 0 ? { immediate: true, force } : { duration: d, force, easing: (t) => 1 - Math.pow(1 - t, 3) });
  else window.scrollTo({ top: y });
}

// freezes the page behind the archive drawer
export function lock(on) {
  if (lenis) {
    if (on) lenis.stop();
    else lenis.start();
  } else document.documentElement.style.overflow = on ? "hidden" : "";
}

// scrolls so that pinned chapter i sits at inner progress u
export function goToProgress(i, u, force = false) {
  const pin = Math.max(1, S.heights[i] - S.vh);
  const top = S.tops[i] + pin * u;
  if (lenis) lenis.scrollTo(top, { duration: 1.4, force, easing: (t) => 1 - Math.pow(1 - t, 3) });
  else window.scrollTo({ top });
}

// shared helpers for the world
// R3F listens on #root, so a click on a drawer or a button still raycasts the scene behind it.
// I only let the scene react when nothing sits in front of the canvas. .arc covers the moment a sheet is closing.
export const onScene = (e) =>
  !document.documentElement.dataset.modal && !e.nativeEvent.target.closest?.("a,button,input,textarea,.arc");
export const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const smooth = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// camera lingers on each stop, then glides to the next one.
// s runs 0..n-1, the return value is a "stop position" in the same range
export function hold(u, n) {
  const s = clamp01(u) * (n - 1);
  const k = Math.min(n - 2, Math.floor(s));
  return k + smooth(0.18, 0.82, s - k);
}

// DOM side: which stop (role, project) of a pinned chapter is in front right now
export function useStop(chapter, n) {
  const [k, setK] = useState(0);
  useEffect(() => {
    let raf;
    let last = 0;
    const tick = () => {
      const now = Math.round(hold(S.u[chapter], n));
      if (now !== last) {
        last = now;
        setK(now);
        sfx.pass();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [chapter, n]);
  return k;
}
