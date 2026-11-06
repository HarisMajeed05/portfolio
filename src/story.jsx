import { useEffect, useRef, useState } from "react";
import { PROJECTS, LAB } from "./data";
import { S } from "./scroll";
import { goToProject } from "./nav";
import { useLens } from "./lens";
import Sheet from "./sheet";

export const openStory = (id) => window.dispatchEvent(new CustomEvent("story-open", { detail: id }));
export const openNotes = () => window.dispatchEvent(new Event("notes-open"));

const pad = (n) => String(n).padStart(2, "0");

const PARTS = [
  ["why", "Why it exists"],
  ["how", "How it works"],
  ["result", "What came out"],
  ["limits", "Honest limits"],
];

// Full write-up for one project. The ring stays behind it and follows when you
// step to the next or previous project.
export function Story() {
  const [id, setId] = useState(null);
  const [copied, setCopied] = useState(false);
  const last = useRef(null);
  useLens();

  useEffect(() => {
    const o = (e) => setId(e.detail);
    const c = () => setId(null);
    window.addEventListener("story-open", o);
    window.addEventListener("story-close", c);
    return () => {
      window.removeEventListener("story-open", o);
      window.removeEventListener("story-close", c);
    };
  }, []);

  const open = id !== null;
  if (open) last.current = id;
  const k = Math.max(0, PROJECTS.findIndex((p) => p.id === (id ?? last.current)));
  const p = PROJECTS[k];
  const n = PROJECTS.length;

  // the camera slides the ring aside while this is open, and the ring turns to the project
  useEffect(() => {
    S.focus = open ? 1 : 0;
    if (!open) return;
    history.replaceState(null, "", `${location.pathname}${location.search}#work/${id}/story`);
    goToProject(id, true);
  }, [open, id]);

  const go = (dir) => setId(PROJECTS[(k + dir + n) % n].id);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.target.closest?.("input,textarea")) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const close = () => setId(null);
  const share = () => {
    navigator.clipboard?.writeText(`${location.origin}${location.pathname}${location.search}#work/${p.id}/story`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <Sheet name="story" open={open} onClose={close} label={`Case study: ${p.title}`} className="story">
      <div className="arc-sheet story-sheet">
        <header className="arc-head">
          <p className="mono eyebrow">
            <i className="dot" /> Case study <span className="sep">/</span> {pad(k + 1)} of {pad(n)}
          </p>
          <button className="btn" onClick={close} data-hit="close" data-autofocus>
            Close <span aria-hidden="true">Esc</span>
          </button>
        </header>
        <div className="arc-scroll story-body" data-lenis-prevent key={p.id}>
          <p className="mono story-kind">
            {p.kind} <span className="sep">/</span> {p.year}
          </p>
          <h2 className="h2 sm">{p.title}</h2>
          {p.note && p.href === null && <p className="mono story-note">{p.note}</p>}
          {PARTS.map(([key, label]) =>
            p.story?.[key] ? (
              <section key={key} className="story-part">
                <h3 className="mono">{label}</h3>
                <p>{p.story[key]}</p>
              </section>
            ) : null,
          )}
          <ul className="chips mono story-chips">
            {p.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="story-links">
            {p.href && (
              <a className="btn hot" href={p.href} target="_blank" rel="noreferrer noopener">
                {p.hrefLabel || "View on GitHub"} <span aria-hidden="true">↗</span>
              </a>
            )}
            <button className="btn" onClick={share}>
              {copied ? "Link copied" : "Copy link"}
            </button>
          </div>
        </div>
        <footer className="story-nav mono">
          <button onClick={() => go(-1)}>
            <span aria-hidden="true">←</span> {PROJECTS[(k - 1 + n) % n].title}
          </button>
          <button onClick={() => go(1)}>
            {PROJECTS[(k + 1) % n].title} <span aria-hidden="true">→</span>
          </button>
        </footer>
      </div>
    </Sheet>
  );
}

// A few short write-ups of things I measured or fixed.
export function Notes() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const o = () => setOpen(true);
    const c = () => setOpen(false);
    window.addEventListener("notes-open", o);
    window.addEventListener("notes-close", c);
    return () => {
      window.removeEventListener("notes-open", o);
      window.removeEventListener("notes-close", c);
    };
  }, []);

  const close = () => setOpen(false);
  // let the notes slide away first, then open the project behind them
  const see = (project) => {
    close();
    setTimeout(() => openStory(project), 380);
  };

  return (
    <Sheet name="notes" open={open} onClose={close} label="Lab notes">
      <div className="arc-sheet">
        <header className="arc-head">
          <div>
            <p className="mono eyebrow">
              <i className="dot" /> Lab notes
            </p>
            <h2 className="h2 sm">Things I measured or fixed</h2>
          </div>
          <button className="btn" onClick={close} data-hit="close" data-autofocus>
            Close <span aria-hidden="true">Esc</span>
          </button>
        </header>
        <div className="arc-scroll" data-lenis-prevent>
          <ol className="lab">
            {LAB.map((l, i) => (
              <li key={l.id}>
                <p className="mono lab-tag">
                  {pad(i + 1)} <span className="sep">/</span> {l.tag}
                </p>
                <h3>{l.title}</h3>
                <p className="lab-text">{l.text}</p>
                <dl className="lab-nums">
                  {l.nums.map((x) => (
                    <div key={x.l}>
                      <dt>{x.v}</dt>
                      <dd className="mono">{x.l}</dd>
                    </div>
                  ))}
                </dl>
                <button className="lnk mono" onClick={() => see(l.project)}>
                  Read the case study
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Sheet>
  );
}
