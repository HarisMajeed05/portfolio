import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { key: "1", id: "about", label: "about" },
  { key: "2", id: "skills", label: "skills" },
  { key: "3", id: "projects", label: "projects" },
  { key: "4", id: "experience", label: "experience" },
  { key: "5", id: "contact", label: "contact" },
];

export default function KeyboardNav() {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const match = SECTIONS.find((s) => s.key === e.key);
      if (match) {
        document.getElementById(match.id)?.scrollIntoView({ behavior: "smooth" });
      }
      if (e.key === "?") {
        setShowHint((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        data-cursor="shortcuts"
        onClick={() => setShowHint((v) => !v)}
        className="fixed bottom-6 right-6 z-40 hidden lg:flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--panel)]/80 backdrop-blur font-mono text-xs text-[var(--muted)] hover:text-[var(--lime)] hover:border-[var(--lime)] transition"
        aria-label="Show keyboard shortcuts"
      >
        ?
      </button>
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-40 hidden lg:block rounded-lg border border-[var(--border)] bg-[var(--panel)] overflow-hidden w-56"
          >
            <div className="font-mono text-[11px] text-[var(--muted)] px-4 py-2.5 border-b border-[var(--border)]">
              keyboard shortcuts
            </div>
            <div className="p-4 space-y-2">
              {SECTIONS.map((s) => (
                <div key={s.key} className="flex items-center justify-between font-mono text-xs">
                  <span className="text-[var(--text)]">{s.label}</span>
                  <kbd className="px-1.5 py-0.5 rounded-sm bg-white/5 text-[var(--lime)]">{s.key}</kbd>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
