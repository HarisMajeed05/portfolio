import { useEffect, useState } from "react";
import { PROJECTS, LENSES } from "./data";
import { S, hold, goToY } from "./scroll";

// "Read me as": reorders the ring in place, so every part of the page that
// reads PROJECTS follows. L.v changes whenever the order does.
const ORIGINAL = PROJECTS.map((p) => p.id);
export const L = { id: LENSES[0].id, v: 0 };

LENSES.forEach((l) => l.first.forEach((id) => ORIGINAL.includes(id) || console.warn(`lens ${l.id}: no project called ${id}`)));

function sortBy(lens) {
  const rank = (p) => {
    const k = lens.first.indexOf(p.id);
    return k < 0 ? 100 + ORIGINAL.indexOf(p.id) : k;
  };
  PROJECTS.sort((a, b) => rank(a) - rank(b));
}

function write(id) {
  const u = new URL(location.href);
  if (id === LENSES[0].id) u.searchParams.delete("lens");
  else u.searchParams.set("lens", id);
  history.replaceState(null, "", u);
}

export function setLens(id) {
  const lens = LENSES.find((l) => l.id === id);
  if (!lens || id === L.id) return;
  // remember which project is in front so the ring can stay on it
  const front = PROJECTS[Math.round(hold(S.u[3], PROJECTS.length))]?.id;
  L.id = id;
  L.v++;
  sortBy(lens);
  write(id);
  if (front && Math.abs(S.c - 3) < 0.6) {
    const n = PROJECTS.length;
    const k = PROJECTS.findIndex((p) => p.id === front);
    goToY(S.tops[3] + Math.max(1, S.heights[3] - S.vh) * (k / (n - 1)), 0, true);
  }
  window.dispatchEvent(new Event("lens-change"));
}

// runs on load, so a link like ?lens=research opens already in that lens
export function initLens() {
  const id = new URLSearchParams(location.search).get("lens");
  const lens = LENSES.find((l) => l.id === id);
  if (!lens) return;
  L.id = id;
  sortBy(lens);
}

export function useLens() {
  const [, bump] = useState(0);
  useEffect(() => {
    const on = () => bump((n) => n + 1);
    window.addEventListener("lens-change", on);
    return () => window.removeEventListener("lens-change", on);
  }, []);
  return LENSES.find((l) => l.id === L.id);
}
