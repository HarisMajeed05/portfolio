import { ME, BRIEF, STATS, ROLES, PROJECTS, ARCHIVE, ORBITS, NOTES, RESUMES } from "./data";

const base = import.meta.env.BASE_URL;
const stat = (s) => `${s.prefix || ""}${s.to.toFixed(s.dec)}${s.suffix || ""}`;

// Same content as the 3D site as one quick, readable page. No WebGL, no scroll
// tricks, works on anything. It also loads first if the browser has no WebGL.
export default function Plain() {
  const more = ARCHIVE.filter((a) => !a.featured);
  return (
    <div className="pl">
      <header className="pl-top">
        <div>
          <p className="mono pl-kicker">
            <i className="dot" /> {ME.role} at {ME.org} <span className="sep">/</span> {ME.place}
          </p>
          <h1>{ME.name}</h1>
        </div>
        <a className="btn hot" href={base}>
          Open the 3D site <span aria-hidden="true">↗</span>
        </a>
      </header>

      <nav className="pl-nav mono" aria-label="Sections">
        {["about", "experience", "projects", "more", "toolbox", "contact"].map((x) => (
          <a key={x} href={`#${x}`}>
            {x}
          </a>
        ))}
      </nav>

      <section id="about">
        <h2>
          {BRIEF.lead} <em>{BRIEF.em}</em>
        </h2>
        <p>{BRIEF.body}</p>
        <p className="dim">{BRIEF.ask}</p>
        <dl className="pl-stats">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt>{stat(s)}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>
        <ul className="pl-notes">
          {NOTES.map((n) => (
            <li key={n.k}>
              <b className="mono">{n.k}</b> {n.t}
            </li>
          ))}
        </ul>
      </section>

      <section id="experience">
        <h2>Experience and education</h2>
        {ROLES.map((r) => (
          <article key={r.title + r.time} className="pl-role">
            <p className="mono pl-time">{r.time}</p>
            <h3>{r.title}</h3>
            <p className="pl-org">{r.org}</p>
            <ul>
              {r.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section id="projects">
        <h2>Selected projects</h2>
        {PROJECTS.map((p) => (
          <article key={p.id} className="pl-proj" id={p.id}>
            <p className="mono pl-time">
              {p.kind} <span className="sep">/</span> {p.year}
            </p>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <ul className="chips mono">
              {p.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            {p.href ? (
              <a className="pl-link mono" href={p.href} target="_blank" rel="noreferrer noopener">
                {p.hrefLabel || "View on GitHub"} ↗
              </a>
            ) : (
              <p className="mono pl-note">{p.note}</p>
            )}
          </article>
        ))}
      </section>

      <section id="more">
        <h2>More from GitHub</h2>
        <ul className="pl-more">
          {more.map((a) => (
            <li key={a.name}>
              <a href={a.href} target="_blank" rel="noreferrer noopener">
                {a.title} ↗
              </a>
              <span>{a.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="toolbox">
        <h2>Toolbox</h2>
        {ORBITS.map((o) => (
          <p key={o.name} className="pl-tools">
            <b className="mono" style={{ color: o.color }}>
              {o.name}
            </b>{" "}
            {o.words.join(", ")}
          </p>
        ))}
      </section>

      <section id="contact">
        <h2>
          Let&apos;s build something <em>that sees.</em>
        </h2>
        <p>
          <a className="pl-mail" href={`mailto:${ME.email}`}>
            {ME.email}
          </a>
        </p>
        <p className="mono pl-links">
          <a href={ME.github} target="_blank" rel="noreferrer noopener">
            GitHub ↗
          </a>
          <a href={ME.linkedin} target="_blank" rel="noreferrer noopener">
            LinkedIn ↗
          </a>
          {RESUMES.map((r) => (
            <a key={r.file} href={`${base}resumes/${r.file}`} target="_blank" rel="noreferrer noopener">
              Résumé, {r.label}
            </a>
          ))}
        </p>
      </section>
      <p className="foot mono">© 2026 {ME.name}</p>
    </div>
  );
}
