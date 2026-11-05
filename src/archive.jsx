import { useEffect, useRef, useState } from "react";
import { ARCHIVE, FILTERS, ME } from "./data";
import { lock } from "./scroll";

export const openArchive = () => window.dispatchEvent(new Event("archive-open"));

// Full-screen drawer with every repo worth listing. Filter by kind or search.
export default function Archive() {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState("all");
  const [q, setQ] = useState("");
  const dlg = useRef();
  const closeBtn = useRef();

  useEffect(() => {
    const o = () => setOpen(true);
    const c = () => setOpen(false);
    window.addEventListener("archive-open", o);
    window.addEventListener("archive-close", c);
    return () => {
      window.removeEventListener("archive-open", o);
      window.removeEventListener("archive-close", c);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const back = document.activeElement;
    const root = document.documentElement;
    root.dataset.modal = "archive";
    lock(true);
    history.replaceState(null, "", "#archive");
    closeBtn.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab") return;
      // keep focus inside the drawer
      const els = [...dlg.current.querySelectorAll("a,button,input")];
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      delete root.dataset.modal;
      lock(false);
      back?.focus?.();
    };
  }, [open]);

  const needle = q.trim().toLowerCase();
  const list = ARCHIVE.filter(
    (a) => (f === "all" || a.tags.includes(f)) && (!needle || `${a.title} ${a.text} ${a.lang}`.toLowerCase().includes(needle)),
  );

  return (
    <div className={`arc ${open ? "open" : ""}`} aria-hidden={!open} ref={dlg} role="dialog" aria-modal="true" aria-label="Archive of repositories">
      <div className="arc-bg" onClick={() => setOpen(false)} />
      <div className="arc-sheet">
        <header className="arc-head">
          <div>
            <p className="mono eyebrow">
              <i className="dot" /> Archive
            </p>
            <h2 className="h2 sm">{ARCHIVE.length} repositories from my GitHub</h2>
          </div>
          <button className="btn" ref={closeBtn} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} data-hit="close">
            Close <span aria-hidden="true">Esc</span>
          </button>
        </header>
        <div className="arc-bar">
          <ul className="arc-filters mono">
            {FILTERS.map((x) => (
              <li key={x.id}>
                <button className={f === x.id ? "on" : ""} onClick={() => setF(x.id)} tabIndex={open ? 0 : -1}>
                  {x.label}
                </button>
              </li>
            ))}
          </ul>
          <input
            className="arc-q mono"
            type="search"
            placeholder="Search repos"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            tabIndex={open ? 0 : -1}
            aria-label="Search repositories"
          />
        </div>
        <div className="arc-scroll" data-lenis-prevent>
          {list.length ? (
            <ul className="arc-list">
              {list.map((a) => (
                <li key={a.name}>
                  <a className="arc-item" href={a.href} target="_blank" rel="noreferrer noopener" tabIndex={open ? 0 : -1}>
                    <span className="arc-top mono">
                      <b>{a.title}</b>
                      {a.featured && <u>on the ring</u>}
                    </span>
                    <p>{a.text}</p>
                    <span className="arc-meta mono">
                      {a.lang}
                      <span aria-hidden="true">↗</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="arc-empty mono">Nothing matches that. Try fewer letters.</p>
          )}
          <p className="arc-foot mono">
            Showing {list.length} of {ARCHIVE.length}. More on{" "}
            <a href={ME.github} target="_blank" rel="noreferrer noopener" tabIndex={open ? 0 : -1}>
              GitHub ↗
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
