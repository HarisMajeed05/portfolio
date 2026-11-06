import { useEffect, useRef, useState } from "react";
import { ME, BRIEF, STATS, STATUS, NOTES, ROLES, PROJECTS, ARCHIVE, ORBITS, RESUMES, LENSES, usesOf } from "./data";
import { S, goTo, goToProgress, useStop } from "./scroll";
import { Split, Decode } from "./fx";
import { openArchive } from "./archive";
import { openStory, openNotes } from "./story";
import { openCompose } from "./compose";
import { setLens, useLens } from "./lens";
import { tint } from "./theme";
import { useTool, clearTool } from "./pick";
import { usePulse, ago } from "./pulse";

const base = import.meta.env.BASE_URL;
const pad = (n) => String(n).padStart(2, "0");
const WORDS = ["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen"];

function Count({ s }) {
  const ref = useRef();
  useEffect(() => {
    let raf;
    let t0 = null;
    const show = (v) => {
      if (ref.current) ref.current.textContent = `${s.prefix || ""}${v.toFixed(s.dec)}${s.suffix || ""}`;
    };
    show(s.from);
    const tick = (now) => {
      if (t0 === null && Math.abs(S.c - 1) < 0.4) t0 = now;
      if (t0 !== null) {
        const p = Math.min(1, (now - t0) / 1700);
        show(s.from + (s.to - s.from) * (1 - Math.pow(1 - p, 3)));
        if (p >= 1) return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [s]);
  return <b ref={ref} />;
}

export function Hero() {
  const lens = useLens();
  return (
    <section id="intro" data-chapter className="sec hero">
      <div data-panel="0" className="panel">
        <div className="copy">
          <p className="mono eyebrow reveal" style={{ "--d": "0.1s" }}>
            <i className="dot" /> AI Engineer at {ME.org} <span className="sep">/</span> {ME.place}
          </p>
          <h1 className="display">
            <span className="reveal" style={{ "--d": "0.2s" }}>Haris</span>
            <span className="reveal" style={{ "--d": "0.32s" }}>
              Majeed <em>Raja</em>
            </span>
          </h1>
          <p className="lede reveal" style={{ "--d": "0.5s" }} key={lens.id}>
            {lens.lede}
          </p>
          <div className="cta reveal" style={{ "--d": "0.64s" }}>
            <button className="btn hot" onClick={() => goTo(1)}>
              Start the flight <span aria-hidden="true">↓</span>
            </button>
            <a className="btn" href={ME.github} target="_blank" rel="noreferrer noopener">
              GitHub ↗
            </a>
            <a className="btn" href={ME.linkedin} target="_blank" rel="noreferrer noopener">
              LinkedIn ↗
            </a>
          </div>
          <div className="lens mono reveal" style={{ "--d": "0.72s" }} role="group" aria-label="Read me as">
            <span>Read me as</span>
            {LENSES.map((l) => (
              <button key={l.id} className={l.id === lens.id ? "on" : ""} aria-pressed={l.id === lens.id} onClick={() => setLens(l.id)}>
                {l.label}
              </button>
            ))}
          </div>
          <dl className="status mono reveal" style={{ "--d": "0.8s" }}>
            {STATUS.map((x) => (
              <div key={x.k}>
                <dt>{x.k}</dt>
                <dd>{x.t}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="scroll-cue mono reveal" style={{ "--d": "1s" }}>
          <span className="cue-line" /> Scroll to fly
        </p>
      </div>
    </section>
  );
}

export function Brief() {
  const lens = useLens();
  return (
    <section id="brief" data-chapter className="sec brief">
      <div data-panel="1" className="panel">
        <div className="copy">
          <p className="mono eyebrow">
            <i className="dot" /> 01 <span className="sep">/</span> <Decode text="Brief" />
          </p>
          <h2 className="h2">
            <Split text={BRIEF.lead} /> <Split em text={BRIEF.em} from={4} />
          </h2>
          <p className="body">{BRIEF.body}</p>
          <p className="body dim" key={lens.id}>
            {lens.ask}
          </p>
        </div>
        <dl className="stats">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="num">
                <Count s={s} />
              </dt>
              <dd className="mono">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Timeline() {
  const k = useStop(2, ROLES.length);
  const r = ROLES[k];
  return (
    <section id="timeline" data-chapter className="sec pinned timeline">
      <div className="stick">
        <div data-panel="2" className="panel">
          <div className="head">
            <p className="mono eyebrow">
              <i className="dot" /> 02 <span className="sep">/</span> <Decode text="Timeline" />
            </p>
            <h2 className="h2 sm">
              <Split text="Back through time" />
            </h2>
            <p className="hint mono">Scroll to fly deeper, 2026 to 2022</p>
          </div>
          <article className="role" key={k}>
            <p className="mono role-time">
              {pad(k + 1)} <span className="sep">/</span> {r.time}
            </p>
            <h3 className="role-title">{r.title}</h3>
            <p className="role-org">{r.org}</p>
            <ul>
              {r.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </article>
          <ol className="steps mono" aria-hidden="true">
            {ROLES.map((x, i) => (
              <li key={x.big} className={i === k ? "on" : i < k ? "past" : ""}>
                <i />
                <span>{x.big}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Work() {
  const k = useStop(3, PROJECTS.length);
  useLens();
  const p = PROJECTS[k];
  const [copied, setCopied] = useState(false);
  const share = () => {
    const url = `${location.origin}${location.pathname}${location.search}#work/${p.id}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <section id="work" data-chapter className="sec pinned work">
      <div className="stick">
        <div data-panel="3" className="panel">
          <div className="head">
            <p className="mono eyebrow">
              <i className="dot" /> 03 <span className="sep">/</span> <Decode text="Work" />
            </p>
            <h2 className="h2 sm">
              <Split text={`${WORDS[PROJECTS.length] || PROJECTS.length} projects, one ring`} />
            </h2>
            <p className="hint mono">
              <span className="fine-only">Scroll or use the arrow keys to turn it. Click the front card for the case study.</span>
              <span className="coarse-only">Tap the front card for the case study.</span>
            </p>
            <button className="btn all" onClick={openArchive} data-hit="archive">
              All {ARCHIVE.length} repositories <span aria-hidden="true">↗</span>
            </button>
          </div>
          <article className="cap" key={k}>
            <div className="cap-l">
              <p className="mono cap-kind">
                {pad(k + 1)} <span className="sep">/</span> {p.kind} <span className="sep">/</span> {p.year}
              </p>
              <h3>{p.title}</h3>
              <button className="lnk mono" onClick={share} data-hit="copy link">
                {copied ? "Link copied" : "Copy link to this project"}
              </button>
            </div>
            <div className="cap-r">
              <p>{p.desc}</p>
              <div className="cap-foot">
                <ul className="chips mono">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <div className="cap-btns">
                  <button className="btn hot" onClick={() => openStory(p.id)} data-hit="case study">
                    Case study <span aria-hidden="true">→</span>
                  </button>
                  {p.href ? (
                    <a className="btn" href={p.href} target="_blank" rel="noreferrer noopener">
                      {p.hrefLabel || "GitHub"} ↗
                    </a>
                  ) : (
                    <span className="mono note">{p.note}</span>
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

// what the picked tool is listed on
function Picked() {
  const tool = useTool();
  if (!tool) return null;
  const { cards, roles } = usesOf(tool);
  const jump = (id) => {
    const i = PROJECTS.findIndex((x) => x.id === id);
    goToProgress(3, i / (PROJECTS.length - 1));
  };
  return (
    <div className="picked mono" role="status">
      <p>
        <b>{tool}</b>
        <button className="lnk mono" onClick={clearTool}>
          Clear
        </button>
      </p>
      {cards.length ? (
        <p className="picked-l">
          On {cards.length} project {cards.length > 1 ? "cards" : "card"}:{" "}
          {cards.map((c, i) => (
            <span key={c.id}>
              <button className="picked-b" onClick={() => jump(c.id)}>
                {c.title}
              </button>
              {i < cards.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      ) : (
        <p className="picked-l">No project card lists it.</p>
      )}
      {roles.length > 0 && <p className="picked-l">In the timeline: {roles.map((r) => r.big).join(", ")}</p>}
    </div>
  );
}

export function Stack() {
  const tool = useTool();
  return (
    <section id="stack" data-chapter className={`sec pinned stack ${tool ? "pick" : ""}`}>
      <div className="stick">
        <div data-panel="4" className="panel">
          <div className="head">
            <p className="mono eyebrow">
              <i className="dot" /> 04 <span className="sep">/</span> <Decode text="Toolbox" />
            </p>
            <h2 className="h2 sm">
              <Split text="Three orbits" />
            </h2>
            <p className="hint mono">
              <span className="fine-only">Move your pointer. The rings follow. Click a tool to see where it shows up.</span>
              <span className="coarse-only">Tap a tool to see which projects use it.</span>
            </p>
            <button className="btn all" onClick={openNotes} data-hit="lab notes">
              Lab notes <span aria-hidden="true">↗</span>
            </button>
            <Picked />
          </div>
          <ol className="notes">
            {NOTES.map((n, i) => (
              <li key={n.k}>
                <span className="mono">
                  {pad(i + 1)} <b>{n.k}</b>
                </span>
                <p>{n.t}</p>
              </li>
            ))}
          </ol>
          <ul className="legend mono">
            {ORBITS.map((o) => (
              <li key={o.name} style={{ "--c": tint(o.color) }}>
                <i /> {o.name} <span>{pad(o.words.length)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CopyMail() {
  const [done, setDone] = useState(false);
  return (
    <button
      className="btn"
      data-hit="copy"
      onClick={() => {
        navigator.clipboard?.writeText(ME.email).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        });
      }}
    >
      {done ? "Copied" : "Copy email"}
    </button>
  );
}

function Pulse() {
  const d = usePulse();
  if (!d) return null;
  return (
    <p className="pulse mono">
      <b>
        <i className="dot" /> GitHub, live
      </b>
      <span>{d.repos} public repos</span>
      {d.last && <span>Last push {ago(d.last)}</span>}
      {d.langs.length > 0 && <span>Mostly {d.langs.join(", ")}</span>}
    </p>
  );
}

export function Contact() {
  return (
    <section id="contact" data-chapter className="sec contact">
      <div data-panel="5" className="panel">
        <div className="copy">
          <p className="mono eyebrow">
            <i className="dot" /> 05 <span className="sep">/</span> <Decode text="Contact" />
          </p>
          <h2 className="display big">
            <Split text="Let's build something" /> <Split em text="that sees." from={3} />
          </h2>
          <p className="body">
            Open to AI and computer vision roles, and to graduate research in vision and multimodal learning. Email is the fastest way to reach me.
          </p>
          <div className="mail-row">
            <a className="mail" href={`mailto:${ME.email}`}>
              {ME.email}
            </a>
            <CopyMail />
          </div>
          <div className="cols mono">
            <div>
              <h4>Find me</h4>
              <a href={ME.github} target="_blank" rel="noreferrer noopener">
                GitHub ↗
              </a>
              <a href={ME.linkedin} target="_blank" rel="noreferrer noopener">
                LinkedIn ↗
              </a>
              {ME.form && (
                <button className="ln" onClick={openCompose} data-hit="message">
                  Write a message
                </button>
              )}
            </div>
            <div>
              <h4>Résumé (PDF)</h4>
              {RESUMES.map((r) => (
                <a key={r.file} href={`${base}resumes/${r.file}`} target="_blank" rel="noreferrer noopener">
                  {r.label}
                </a>
              ))}
            </div>
            <div>
              <h4>Based in</h4>
              <span>{ME.place}</span>
              <span>UTC+5</span>
            </div>
          </div>
          <Pulse />
        </div>
        <p className="foot mono">
          © 2026 {ME.name}. Built with React, three.js and Lenis. <a href={`${base}?view=plain`}>Plain version</a>
        </p>
      </div>
    </section>
  );
}
