import { useEffect, useState } from "react";

const LINKS = [
  { href: "#about", label: "about" },
  { href: "#skills", label: "skills" },
  { href: "#projects", label: "projects" },
  { href: "#experience", label: "experience" },
  { href: "#contact", label: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-[var(--bg)]/85 backdrop-blur border-b border-[var(--border)]" : ""
      }`}
    >
      <nav className="flex items-center justify-between px-6 sm:px-10 lg:px-20 h-16 sm:h-20">
        <a href="#" className="font-mono text-sm tracking-wide">
          <span className="text-[var(--lime)]">hmr</span>
          <span className="text-[var(--muted)]">.dev</span>
        </a>

        <div className="hidden md:flex items-center gap-8 font-mono text-xs">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-[var(--muted)] hover:text-[var(--text)] transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <button
          className="md:hidden font-mono text-xs text-[var(--muted)]"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "close" : "menu"}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-[var(--bg)] border-b border-[var(--border)] px-6 py-4 flex flex-col gap-4 font-mono text-sm">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-[var(--muted)]">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
