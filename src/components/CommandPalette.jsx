import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";

const ITEMS = [
  { id: "about", type: "section", label: "About", hint: "who I am", action: { kind: "scroll", target: "about" } },
  { id: "skills", type: "section", label: "Skills", hint: "capabilities", action: { kind: "scroll", target: "skills" } },
  { id: "projects", type: "section", label: "Projects", hint: "inference log", action: { kind: "scroll", target: "projects" } },
  { id: "experience", type: "section", label: "Experience", hint: "training history", action: { kind: "scroll", target: "experience" } },
  { id: "contact", type: "section", label: "Contact", hint: "open a connection", action: { kind: "scroll", target: "contact" } },
  { id: "p-defect", type: "project", label: "Object Defect Detection", hint: "Python · PyTorch · DINOv2", action: { kind: "link", href: "https://github.com/HarisMajeed05/Object-Defect-Detection" } },
  { id: "p-legal", type: "project", label: "Legal AI Chatbot", hint: "React · FastAPI · LangChain", action: { kind: "link", href: "https://github.com/HarisMajeed05/legal-ai-chatbot" } },
  { id: "p-footfall", type: "project", label: "Footfall Counter", hint: "YOLO · ByteTrack", action: { kind: "link", href: "https://github.com/HarisMajeed05/Footfall-counter-Yolo" } },
  { id: "p-yolo", type: "project", label: "YOLO Training + Deployment", hint: "Python · YOLO", action: { kind: "link", href: "https://github.com/HarisMajeed05/YOLO-Model-Training-Deployment" } },
  { id: "p-brainbox", type: "project", label: "Brainbox AI Chatbot", hint: "React · FastAPI · Groq", action: { kind: "link", href: "https://github.com/HarisMajeed05/brainbox-ai-chatbot-app" } },
  { id: "p-meeting", type: "project", label: "AI Meeting Summarizer", hint: "Django · Transformers", action: { kind: "link", href: "https://github.com/HarisMajeed05/AI-Meeting-Summarizer" } },
  { id: "p-compiler", type: "project", label: "C++ Compiler From Scratch", hint: "C++", action: { kind: "link", href: "https://github.com/HarisMajeed05/Cpp-Compiler-From-Scratch" } },
  { id: "p-search", type: "project", label: "Search Engine", hint: "C++, inverted index", action: { kind: "link", href: "https://github.com/HarisMajeed05/Search-Engine" } },
  { id: "l-github", type: "link", label: "GitHub", hint: "github.com/HarisMajeed05", action: { kind: "link", href: "https://github.com/HarisMajeed05" } },
  { id: "l-linkedin", type: "link", label: "LinkedIn", hint: "connect", action: { kind: "link", href: "https://www.linkedin.com/in/haris-majeed-raja-390386267/" } },
  { id: "l-email", type: "link", label: "Email", hint: "harismajeed0501@gmail.com", action: { kind: "link", href: "mailto:harismajeed0501@gmail.com" } },
  { id: "l-resume", type: "link", label: "Resume", hint: "view PDF", action: { kind: "link", href: "https://drive.google.com/file/d/17BfmxrvdsJnaKDuiCunApBNM1tg35Ls3/view?usp=sharing" } },
];

const fuse = new Fuse(ITEMS, { keys: ["label", "hint", "type"], threshold: 0.35 });

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return ITEMS;
    return fuse.search(query).map((r) => r.item);
  }, [query]);

  useEffect(() => {
    const onKey = (e) => {
      const isK = e.key.toLowerCase() === "k";
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  const run = (item) => {
    if (!item) return;
    if (item.action.kind === "scroll") {
      document.getElementById(item.action.target)?.scrollIntoView({ behavior: "smooth" });
    } else if (item.action.kind === "link") {
      window.open(item.action.href, "_blank", "noreferrer");
    }
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      run(results[activeIndex]);
    }
  };

  return (
    <>
      <button
        data-cursor="search"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-20 z-40 hidden lg:flex items-center gap-2 px-3 h-9 rounded-full border border-[var(--border)] bg-[var(--panel)]/80 backdrop-blur font-mono text-[11px] text-[var(--muted)] hover:text-[var(--lime)] hover:border-[var(--lime)] transition"
      >
        <span>search</span>
        <kbd className="px-1 py-0.5 rounded-sm bg-white/5 text-[10px]">⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[900] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="fixed top-[18%] left-1/2 -translate-x-1/2 z-[901] w-[92vw] max-w-lg rounded-lg border border-[var(--border)] bg-[var(--panel)] shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 border-b border-[var(--border)]">
                <span className="text-[var(--lime)] font-mono text-sm">$</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="jump to a section, project, or link..."
                  className="w-full bg-transparent py-3.5 font-mono text-sm outline-none placeholder:text-[var(--muted)]"
                />
                <kbd className="text-[10px] font-mono text-[var(--muted)] px-1.5 py-0.5 rounded-sm bg-white/5">esc</kbd>
              </div>
              <div className="max-h-80 overflow-y-auto py-2">
                {results.length === 0 && (
                  <div className="px-4 py-6 text-center font-mono text-xs text-[var(--muted)]">
                    no matches
                  </div>
                )}
                {results.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => run(item)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                      i === activeIndex ? "bg-white/5" : ""
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm shrink-0"
                        style={{
                          background: i === activeIndex ? "var(--lime)" : "rgba(255,255,255,0.06)",
                          color: i === activeIndex ? "#0b0f14" : "var(--muted)",
                        }}
                      >
                        {item.type}
                      </span>
                      <span className="font-mono text-sm text-[var(--text)]">{item.label}</span>
                    </span>
                    <span className="font-mono text-[11px] text-[var(--muted)] truncate max-w-[40%]">{item.hint}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
