import { Fragment, useEffect, useRef } from "react";

// Heading words slide up out of a mask when the panel they sit in switches on.
// The Hud sets data-on on every [data-panel], the css does the rest.
export function Split({ text, em = false, from = 0 }) {
  return text.split(" ").map((w, i) => (
    <Fragment key={i}>
      <span className="w">
        <i style={{ "--i": from + i }}>{em ? <em>{w}</em> : w}</i>
      </span>{" "}
    </Fragment>
  ));
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>#";

// Small labels scramble for a moment, then lock onto the real text.
export function Decode({ text }) {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    const panel = el?.closest("[data-panel]");
    if (!panel || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer;
    const run = () => {
      let n = 0;
      clearInterval(timer);
      timer = setInterval(() => {
        n++;
        el.textContent = [...text].map((c, i) => (c === " " || i < n / 1.2 ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
        if (n > text.length * 1.2 + 4) {
          clearInterval(timer);
          el.textContent = text;
        }
      }, 32);
    };
    const mo = new MutationObserver(() => panel.hasAttribute("data-on") && run());
    mo.observe(panel, { attributes: true, attributeFilter: ["data-on"] });
    return () => {
      mo.disconnect();
      clearInterval(timer);
    };
  }, [text]);
  return <span ref={ref}>{text}</span>;
}

// What the reticle should say when it lands on something.
function tagFor(el) {
  if (el.dataset.hit) return el.dataset.hit;
  if (el.closest(".rail")) return (el.getAttribute("aria-label") || "go").toLowerCase();
  const href = el.getAttribute("href") || "";
  if (href.startsWith("mailto:")) return "email";
  if (el.hasAttribute("download")) return "download";
  if (el.target === "_blank") return "open";
  return el.tagName === "A" ? "go" : "press";
}

// Detection-box cursor. It idles as a small crosshair, then snaps to whatever
// you hover like a bounding box with a label. Also makes buttons lean toward
// the pointer. Fine pointers only, touch devices never mount it.
export function Cursor() {
  const box = useRef();
  const tag = useRef();

  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-ret");

    let px = -200;
    let py = -200;
    let x = -200;
    let y = -200;
    let w = 30;
    let h = 30;
    let hit = null;
    let lean = null;
    let raf;
    let label = "";
    let last = performance.now();
    let n = 0;

    const onMove = (e) => {
      px = e.clientX;
      py = e.clientY;
      box.current.classList.add("on");
      hit = e.target.closest?.("a,button,[data-hit]") || null;
      const b = e.target.closest?.(".btn");
      if (lean && lean !== b) {
        lean.style.setProperty("--mx", "0px");
        lean.style.setProperty("--my", "0px");
      }
      lean = b || null;
      if (b) {
        const r = b.getBoundingClientRect();
        const k = (v) => Math.max(-7, Math.min(7, v * 0.16));
        b.style.setProperty("--mx", `${k(px - (r.left + r.width / 2))}px`);
        b.style.setProperty("--my", `${k(py - (r.top + r.height / 2))}px`);
      }
    };
    const onLeave = () => box.current.classList.remove("on");
    const onDown = () => box.current.classList.add("down");
    const onUp = () => box.current.classList.remove("down");

    const loop = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const k = 1 - Math.exp(-dt * 20);
      // pages move under a still pointer, so look again now and then
      if (++n % 6 === 0) hit = document.elementFromPoint(px, py)?.closest("a,button,[data-hit]") || null;
      // I skip the scene label while a sheet is open, because the sheet sits in front of the canvas
      const sceneHit = root.dataset.modal ? "" : root.dataset.scene;
      let tx;
      let ty;
      let tw;
      let th;
      let text = "";
      if (hit && hit.isConnected) {
        const r = hit.getBoundingClientRect();
        tx = r.left - 6;
        ty = r.top - 6;
        tw = r.width + 12;
        th = r.height + 12;
        text = tagFor(hit);
      } else if (sceneHit) {
        tx = px - 26;
        ty = py - 26;
        tw = 52;
        th = 52;
        text = sceneHit;
      } else {
        tx = px - 15;
        ty = py - 15;
        tw = 30;
        th = 30;
      }
      x += (tx - x) * k;
      y += (ty - y) * k;
      w += (tw - w) * k;
      h += (th - h) * k;
      box.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      box.current.style.width = `${w}px`;
      box.current.style.height = `${h}px`;
      box.current.classList.toggle("hit", !!text);
      if (text !== label) {
        label = text;
        tag.current.textContent = text;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-ret");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="ret" ref={box} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <b ref={tag} className="mono" />
    </div>
  );
}
