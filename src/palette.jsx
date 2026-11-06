import { useEffect, useRef, useState } from "react";
import { CHAPTERS, PROJECTS, RESUMES, LENSES, ME } from "./data";
import { goTo } from "./scroll";
import { goToProject } from "./nav";
import { openArchive } from "./archive";
import { openStory, openNotes } from "./story";
import { L, setLens, useLens } from "./lens";
import { ACCENTS, A, setAccent } from "./theme";
import { sfx } from "./sound";
import Sheet from "./sheet";

const base = import.meta.env.BASE_URL;
const fire = (n) => window.dispatchEvent(new Event(n));

function build() {
  const out = [];
  const add = (g, label, o) => out.push({ g, label, ...o });
  CHAPTERS.forEach((c, i) => add("Go to", c.label, { hint: String(i + 1), run: () => goTo(i) }));
  PROJECTS.forEach((p) =>
    add("Projects", p.title, { hint: p.kind, kw: `${p.stack.join(" ")} ${p.short}`, run: () => goToProject(p.id), alt: () => openStory(p.id) }),
  );
  add("Open", "Archive of repositories", { hint: "A", kw: "github repos list", run: openArchive });
  add("Open", "Lab notes", { hint: "N", kw: "measured fixed write-ups", run: openNotes });
  add("Open", "Plain view", { hint: "P", kw: "light simple text no 3d", run: () => (location.href = `${base}?view=plain`) });
  LENSES.forEach((l) => add("Read me as", `${l.label} lens`, { hint: L.id === l.id ? "on" : "", kw: "focus resume view", run: () => setLens(l.id) }));
  ACCENTS.forEach((a) => add("Colour", `${a.label} accent`, { hint: A.id === a.id ? "on" : "", kw: "theme color", swatch: a.hex, run: () => setAccent(a.id) }));
  add("Settings", sfx.on ? "Turn sound off" : "Turn sound on", { hint: "S", kw: "audio mute", run: () => sfx.toggle() });
  RESUMES.forEach((r) => add("Résumé", `Résumé, ${r.label}`, { hint: "PDF", kw: "cv download", run: () => window.open(`${base}resumes/${r.file}`, "_blank", "noopener") }));
  if (ME.form) add("Contact", "Write me a message", { kw: "form email contact", run: () => fire("compose-open") });
  add("Contact", "Copy my email", { hint: ME.email, kw: "mail address", run: () => navigator.clipboard?.writeText(ME.email) });
  add("Contact", "GitHub", { run: () => window.open(ME.github, "_blank", "noopener") });
  add("Contact", "LinkedIn", { run: () => window.open(ME.linkedin, "_blank", "noopener") });
  return out;
}

// Ctrl K or / : jump to a chapter or project, open a drawer, change the lens or
// colour, grab a résumé. Enter runs it, Shift Enter opens a project's case study.
export default function Palette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const list = useRef();
  useLens();

  useEffect(() => {
    const o = () => {
      setQ("");
      setSel(0);
      setOpen(true);
    };
    const key = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const m = document.documentElement.dataset.modal;
        if (m && m !== "palette") return;
        setOpen((v) => !v);
        setQ("");
        setSel(0);
      }
    };
    window.addEventListener("palette-open", o);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("palette-open", o);
      window.removeEventListener("keydown", key);
    };
  }, []);

  // rebuilt on every render while open, so the "on" markers and the sound label
  // are never stale. It is about forty small objects, nothing to optimise.
  const all = open ? build() : [];
  const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const hits = all.filter((x) => {
    const hay = `${x.label} ${x.g} ${x.kw || ""}`.toLowerCase();
    return terms.every((w) => hay.includes(w));
  });

  useEffect(() => {
    list.current?.querySelector(".on")?.scrollIntoView({ block: "nearest" });
  }, [sel, hits]);

  const close = () => setOpen(false);
  // the page unlocks a moment after the palette shuts, so wait before acting
  const run = (x, alt) => {
    close();
    setTimeout(() => (alt && x.alt ? x.alt() : x.run()), 170);
  };

  const onKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((v) => Math.min(hits.length - 1, v + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((v) => Math.max(0, v - 1));
    } else if (e.key === "Enter" && hits[sel]) {
      e.preventDefault();
      run(hits[sel], e.shiftKey);
    }
  };

  let lastGroup = "";
  return (
    <Sheet name="palette" open={open} onClose={close} label="Search and jump" className="pal">
      <div className="pal-box pop">
        <input
          className="pal-q mono"
          type="search"
          placeholder="Jump to a project, chapter or setting"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSel(0);
          }}
          onKeyDown={onKey}
          aria-label="Search"
          data-autofocus
        />
        <ul className="pal-list" ref={list} data-lenis-prevent role="listbox">
          {hits.map((x, i) => {
            const head = x.g !== lastGroup ? x.g : null;
            lastGroup = x.g;
            return (
              <li key={`${x.g}${x.label}`} role="presentation">
                {head && <p className="pal-g mono">{head}</p>}
                <button className={`pal-i ${i === sel ? "on" : ""}`} role="option" aria-selected={i === sel} onMouseMove={() => i !== sel && setSel(i)} onClick={() => run(x)}>
                  <span>
                    {x.swatch && <i className="pal-sw" style={{ background: x.swatch }} />}
                    {x.label}
                  </span>
                  {x.hint && <em className="mono">{x.hint}</em>}
                </button>
              </li>
            );
          })}
          {!hits.length && <li className="pal-none mono">Nothing matches that.</li>}
        </ul>
        <p className="pal-foot mono">
          <span>Enter go</span>
          <span className="fine-only">Shift Enter case study</span>
          <span>Esc close</span>
        </p>
      </div>
    </Sheet>
  );
}
