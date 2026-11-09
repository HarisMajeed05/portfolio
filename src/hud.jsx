import { useEffect, useRef, useState } from "react";
import { CHAPTERS, ME } from "./data";
import { S, goTo, clamp01, ready, reveal } from "./scroll";
import { openArchive } from "./archive";
import { ACCENTS, A, setAccent, useAccent } from "./theme";
import { sfx } from "./sound";

const base = import.meta.env.BASE_URL;

// how much of the left-hand scrim each chapter wants
const SCRIM = [1, 1, 1, 0.15, 0.3, 1];

const BOOT = [
  ["fonts", "Fonts"],
  ["portrait", "Portrait"],
  ["scene", "3D scene"],
];

export function Loader() {
  const [gone, setGone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [boot, setBoot] = useState({ ...S.boot });
  const num = useRef();
  const bar = useRef();

  useEffect(() => {
    const t0 = performance.now();
    let go = false;
    let shown = 0;
    let raf;
    const on = () => {
      go = true;
      ready("scene");
    };
    const sync = () => setBoot({ ...S.boot });
    window.addEventListener("world-ready", on);
    window.addEventListener("boot", sync);
    document.fonts?.ready.then(() => ready("fonts"));
    const finish = () => {
      document.documentElement.classList.add("is-ready");
      // the camera dolly and the portrait assembling both start now
      reveal();
      setLeaving(true);
      setTimeout(() => setGone(true), 1100);
    };
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      // short on purpose: the page is usable as soon as the scene is, never more than 3.5s
      const target = go && t > 0.6 ? 100 : Math.min(92, 92 * (1 - Math.exp(-t * 1.4)));
      shown += (target - shown) * 0.16;
      if (num.current) num.current.textContent = String(Math.round(shown)).padStart(3, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${shown / 100})`;
      if (shown > 99.4 || t > 3.5) return finish();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("world-ready", on);
      window.removeEventListener("boot", sync);
    };
  }, []);

  if (gone) return null;
  return (
    <div className={`loader ${leaving ? "leaving" : ""}`} aria-hidden="true">
      <div className="loader-in">
        <span className="mono">Loading weights</span>
        <b ref={num} className="loader-num">000</b>
        <i className="loader-bar">
          <u ref={bar} />
        </i>
        <ul className="boot mono">
          {BOOT.map(([k, label]) => (
            <li key={k} className={boot[k] ? "ok" : ""}>
              <span>{label}</span>
              <i />
              <b>{boot[k] ? "ready" : "..."}</b>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const KEYS = [
  ["Ctrl K, /", "Search and jump"],
  ["Up Down, J K", "Next or previous stop"],
  ["Left Right", "Turn the project ring"],
  ["1 to 6", "Jump to a chapter"],
  ["A", "Open the archive"],
  ["N", "Open the lab notes"],
  ["S", "Sound on or off"],
  ["C", "Switch the colour"],
  ["P", "Plain view"],
  ["Esc", "Close"],
];

const fire = (n) => window.dispatchEvent(new Event(n));

function Tools() {
  const [help, setHelp] = useState(false);
  const [snd, setSnd] = useState(sfx.on);
  useAccent();
  useEffect(() => {
    const t = () => setHelp((v) => !v);
    const esc = (e) => e.key === "Escape" && setHelp(false);
    const s = () => setSnd(sfx.on);
    window.addEventListener("help-toggle", t);
    window.addEventListener("sound-change", s);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("help-toggle", t);
      window.removeEventListener("sound-change", s);
      window.removeEventListener("keydown", esc);
    };
  }, []);
  return (
    <div className="tools mono">
      <button onClick={() => fire("palette-open")} data-hit="search">
        Search <kbd>Ctrl K</kbd>
      </button>
      <button onClick={openArchive}>
        Archive <kbd>A</kbd>
      </button>
      <button className="opt" onClick={() => fire("notes-open")}>
        Lab notes <kbd>N</kbd>
      </button>
      <a className="opt" href={`${base}?view=plain`}>
        Plain view <kbd>P</kbd>
      </a>
      <button className="opt" onClick={() => sfx.toggle()} aria-pressed={snd}>
        Sound {snd ? "on" : "off"} <kbd>S</kbd>
      </button>
      <span className="dots opt" role="group" aria-label="Accent colour">
        {ACCENTS.map((a) => (
          <button key={a.id} className={A.id === a.id ? "on" : ""} style={{ "--c": a.hex }} onClick={() => setAccent(a.id)} aria-label={a.label} aria-pressed={A.id === a.id} data-hit={a.label.toLowerCase()} />
        ))}
      </span>
      <button className="tools-keys opt" aria-expanded={help} onClick={() => setHelp((v) => !v)}>
        Keys <kbd>?</kbd>
      </button>
      {help && (
        <dl className="keys" role="dialog" aria-label="Keyboard shortcuts">
          {KEYS.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

// Fixed overlay: wordmark, chapter rail, readout. Also drives the per-chapter
// fade of every [data-panel] straight from the scroll state, no React renders.
export function Hud() {
  const [ch, setCh] = useState(0);
  const depth = useRef();
  const fps = useRef();
  const chLabel = useRef();
  const prog = useRef();

  useEffect(() => {
    const panels = [...document.querySelectorAll("[data-panel]")];
    const root = document.documentElement;
    let raf;
    let last = performance.now();
    let f = 60;
    let cur = -1;
    const loop = (now) => {
      f += (1000 / Math.max(1, now - last) - f) * 0.05;
      last = now;
      for (const el of panels) {
        const i = +el.dataset.panel;
        const a = clamp01(1 - Math.abs(S.c - i) * 2.1);
        el.style.setProperty("--a", a.toFixed(3));
        el.style.visibility = a < 0.01 ? "hidden" : "visible";
        el.toggleAttribute("data-on", a > 0.55);
      }
      const lo = Math.min(5, Math.floor(S.c));
      const hi = Math.min(5, lo + 1);
      root.style.setProperty("--scrim", (SCRIM[lo] + (SCRIM[hi] - SCRIM[lo]) * (S.c - lo)).toFixed(3));
      const idx = Math.min(5, Math.round(S.c));
      if (idx !== cur) {
        if (cur >= 0) sfx.chapter();
        cur = idx;
        setCh(idx);
      }
      sfx.drive(S.speed);
      if (depth.current) depth.current.textContent = Math.max(0, 10 - S.camZ).toFixed(1).padStart(6, "0");
      if (fps.current) fps.current.textContent = String(Math.round(f));
      if (chLabel.current) chLabel.current.textContent = CHAPTERS[idx].label.toUpperCase();
      if (prog.current) {
        const max = Math.max(1, document.documentElement.scrollHeight - S.vh);
        prog.current.style.transform = `scaleX(${clamp01(S.y / max)})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div className="progress" aria-hidden="true">
        <u ref={prog} />
      </div>
      <header className="brand">
        <button className="brand-btn" onClick={() => goTo(0)} aria-label={`HMR ${ME.name}, back to the start`}>
          <span className="brand-mark">HMR</span>
          <span className="brand-name">{ME.name}</span>
        </button>
      </header>
      <nav className="rail" aria-label="Chapters">
        {CHAPTERS.map((c, i) => (
          <button key={c.id} className={i === ch ? "on" : ""} onClick={() => goTo(i)} aria-label={c.label}>
            <span className="rail-label mono">{c.label}</span>
            <span className="rail-tick" />
          </button>
        ))}
      </nav>
      <Tools />
      <div className="readout mono" aria-hidden="true">
        <span>
          Depth <b ref={depth}>000.0</b> m
        </span>
        <span ref={chLabel}>INTRO</span>
        <span>
          <b ref={fps}>60</b> fps
        </span>
      </div>
    </>
  );
}
