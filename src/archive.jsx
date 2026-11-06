import { useEffect, useState } from "react";
import { ARCHIVE, FILTERS, ME } from "./data";
import Sheet from "./sheet";
import { usePulse, ago } from "./pulse";

export const openArchive = () => window.dispatchEvent(new Event("archive-open"));

// Full-screen drawer with every repo worth listing. Filter by kind or search.
export default function Archive() {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState("all");
  const [q, setQ] = useState("");
  const pulse = usePulse();

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
    if (open) history.replaceState(null, "", "#archive");
  }, [open]);

  const close = () => setOpen(false);
  const needle = q.trim().toLowerCase();
  const list = ARCHIVE.filter(
    (a) => (f === "all" || a.tags.includes(f)) && (!needle || `${a.title} ${a.text} ${a.lang}`.toLowerCase().includes(needle)),
  );

  return (
    <Sheet name="archive" open={open} onClose={close} label="Archive of repositories">
      <div className="arc-sheet">
        <header className="arc-head">
          <div>
            <p className="mono eyebrow">
              <i className="dot" /> Archive
            </p>
            <h2 className="h2 sm">{ARCHIVE.length} repositories from my GitHub</h2>
          </div>
          <button className="btn" onClick={close} data-hit="close" data-autofocus>
            Close <span aria-hidden="true">Esc</span>
          </button>
        </header>
        <div className="arc-bar">
          <ul className="arc-filters mono">
            {FILTERS.map((x) => (
              <li key={x.id}>
                <button className={f === x.id ? "on" : ""} onClick={() => setF(x.id)}>
                  {x.label}
                </button>
              </li>
            ))}
          </ul>
          <input className="arc-q mono" type="search" placeholder="Search repos" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search repositories" />
        </div>
        <div className="arc-scroll" data-lenis-prevent>
          {list.length ? (
            <ul className="arc-list">
              {list.map((a) => {
                const at = pulse?.pushed[a.name.toLowerCase()];
                return (
                  <li key={a.name}>
                    <a className="arc-item" href={a.href} target="_blank" rel="noreferrer noopener">
                      <span className="arc-top mono">
                        <b>{a.title}</b>
                        {a.featured && <u>on the ring</u>}
                      </span>
                      <p>{a.text}</p>
                      <span className="arc-meta mono">
                        <span className="arc-lang">
                          {a.lang}
                          {at && <i> / pushed {ago(at)}</i>}
                        </span>
                        <span aria-hidden="true">↗</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="arc-empty mono">Nothing matches that. Try fewer letters.</p>
          )}
          <p className="arc-foot mono">
            Showing {list.length} of {ARCHIVE.length}. More on{" "}
            <a href={ME.github} target="_blank" rel="noreferrer noopener">
              GitHub ↗
            </a>
          </p>
        </div>
      </div>
    </Sheet>
  );
}
