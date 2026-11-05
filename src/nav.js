import { CHAPTERS, PROJECTS, ROLES } from "./data";
import { S, goTo, goToY, hold } from "./scroll";

const base = import.meta.env.BASE_URL;
const fire = (name) => window.dispatchEvent(new Event(name));

// how many stops each chapter has, the keys step through them
const COUNTS = [1, 1, ROLES.length, PROJECTS.length, 1, 1];

function stops() {
  const ys = [];
  COUNTS.forEach((n, i) => {
    const pin = Math.max(0, S.heights[i] - S.vh);
    for (let k = 0; k < n; k++) ys.push(S.tops[i] + (n > 1 ? pin * (k / (n - 1)) : 0));
  });
  return ys;
}

let target = 0;
let targetAt = 0;

function step(dir) {
  const ys = stops();
  // while a glide is still running, step from where it is heading
  const from = performance.now() - targetAt < 1500 ? target : S.y;
  const y = dir > 0 ? ys.find((v) => v > from + 30) : [...ys].reverse().find((v) => v < from - 30);
  if (y === undefined) return;
  target = y;
  targetAt = performance.now();
  goToY(y);
}

function onKey(e) {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.closest?.("input,textarea,select,[contenteditable]")) return;
  if (document.documentElement.dataset.modal) return;
  const k = e.key;
  const inWork = Math.abs(S.c - 3) < 0.5;
  if (k === "ArrowDown" || k === "PageDown" || k === "j" || (k === "ArrowRight" && inWork)) {
    e.preventDefault();
    step(1);
  } else if (k === "ArrowUp" || k === "PageUp" || k === "k" || (k === "ArrowLeft" && inWork)) {
    e.preventDefault();
    step(-1);
  } else if (k === "Home") goTo(0);
  else if (k === "End") goTo(5);
  else if (/^[1-6]$/.test(k)) goTo(+k - 1);
  else if (k === "a") fire("archive-open");
  else if (k === "p") location.href = `${base}?view=plain`;
  else if (k === "?") fire("help-toggle");
}

// #work/scratchgpt style links, read once on load, written while you scroll
function readHash() {
  const [ch, sub] = location.hash.slice(1).split("/");
  if (ch === "archive") return fire("archive-open");
  const i = CHAPTERS.findIndex((c) => c.id === ch);
  if (i < 0) return;
  let y = S.tops[i];
  const n = COUNTS[i];
  if (n > 1) {
    const list = i === 3 ? PROJECTS : null;
    const k = list ? list.findIndex((p) => p.id === sub) : -1;
    if (k >= 0) y += Math.max(0, S.heights[i] - S.vh) * (k / (n - 1));
  }
  goToY(y, 0);
}

export function initNav() {
  window.addEventListener("keydown", onKey);
  let live = false;
  const start = () => {
    readHash();
    setTimeout(() => (live = true), 600);
  };
  document.fonts.ready.then(() => setTimeout(start, 500));

  let last = "";
  setInterval(() => {
    if (!live || document.documentElement.dataset.modal) return;
    const i = Math.min(5, Math.round(S.c));
    let next = i === 0 ? "" : CHAPTERS[i].id;
    if (i === 3) next += `/${PROJECTS[Math.round(hold(S.u[3], PROJECTS.length))].id}`;
    if (next !== last) {
      last = next;
      history.replaceState(null, "", next ? `#${next}` : location.pathname + location.search);
    }
  }, 400);
}
