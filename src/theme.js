import { useEffect, useState } from "react";

// One accent for the whole site. The CSS reads --hot, the 3D scene reads
// ACCENT, so a single switch recolours both.
export const ACCENTS = [
  { id: "orange", label: "Orange", hex: "#ff5b2e" },
  { id: "lime", label: "Lime", hex: "#c6ff3d" },
  { id: "violet", label: "Violet", hex: "#a78bfa" },
  { id: "rose", label: "Rose", hex: "#ff5d8f" },
];

// live binding: importers always see the current colour
export let ACCENT = ACCENTS[0].hex;
export const A = { id: ACCENTS[0].id, v: 0 };

const KEY = "hmr-accent";

// ORBITS in data.js uses the word "accent" for the ring that follows the theme
export const tint = (c) => (c === "accent" ? "var(--hot)" : c);
export const tint3d = (c) => (c === "accent" ? ACCENT : c);

function apply(a, announce) {
  ACCENT = a.hex;
  A.id = a.id;
  A.v++;
  document.documentElement.style.setProperty("--hot", a.hex);
  if (announce) window.dispatchEvent(new Event("accent-change"));
}

export function setAccent(id) {
  const a = ACCENTS.find((x) => x.id === id);
  if (!a) return;
  apply(a, true);
  // a remembered choice is a nice-to-have, storage can be blocked
  try {
    localStorage.setItem(KEY, id);
    // the head script in index.html reads this one, so the colour is right on the first paint
    localStorage.setItem("hmr-hot", a.hex);
  } catch {
    /* ignore */
  }
}

export function cycleAccent() {
  const i = ACCENTS.findIndex((x) => x.id === A.id);
  setAccent(ACCENTS[(i + 1) % ACCENTS.length].id);
}

export function initAccent() {
  let id = new URLSearchParams(location.search).get("accent");
  if (!ACCENTS.some((x) => x.id === id)) {
    try {
      id = localStorage.getItem(KEY);
    } catch {
      id = null;
    }
  }
  const a = ACCENTS.find((x) => x.id === id);
  if (a) apply(a, false);
}

// re-renders the component when the accent changes, returns the hex
export function useAccent() {
  const [, bump] = useState(0);
  useEffect(() => {
    const on = () => bump((n) => n + 1);
    window.addEventListener("accent-change", on);
    return () => window.removeEventListener("accent-change", on);
  }, []);
  return ACCENT;
}
