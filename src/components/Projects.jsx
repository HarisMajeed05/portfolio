import { useState } from "react";
import { motion } from "framer-motion";
import { Eyebrow } from "./About";
import DetectionBox from "./DetectionBox";

const PROJECTS = [
  {
    id: "legal-ai",
    name: "Legal AI Chatbot",
    tag: "rag_system",
    confidence: 94,
    stack: ["React", "FastAPI", "MongoDB", "LangChain", "FAISS", "Groq"],
    desc: "Full-stack RAG-based legal assistant with project-scoped retrieval and source-cited answers.",
    href: "https://github.com/HarisMajeed05/legal-ai-chatbot",
  },
  {
    id: "footfall",
    name: "Footfall Counter",
    tag: "real_time_cv",
    confidence: 97,
    stack: ["YOLO", "RT-DETR", "ByteTrack", "OpenCV"],
    desc: "Real-time people-counting with configurable virtual-line entry/exit, runs entirely on CPU.",
    href: "https://github.com/HarisMajeed05/Footfall-counter-Yolo",
  },
  {
    id: "deepfake",
    name: "Multimodal Deepfake Detection",
    tag: "final_year_project",
    confidence: 91,
    stack: ["VLMs", "PyTorch"],
    desc: "Detect-explain-judge pipeline (ExDDV-Judge), 80% smaller than baseline VLMs, runs on one consumer GPU.",
    href: null,
  },
  {
    id: "compiler",
    name: "C++ Compiler From Scratch",
    tag: "systems",
    confidence: 89,
    stack: ["C++"],
    desc: "Lexical analysis, recursive-descent parsing, and semantic checks, built from first principles.",
    href: "https://github.com/HarisMajeed05/Cpp-Compiler-From-Scratch",
  },
  {
    id: "airbnb",
    name: "Airbnb Clone (Extended)",
    tag: "full_stack",
    confidence: 90,
    stack: ["React", "Node.js", "Express", "MongoDB"],
    desc: "Full-stack booking platform clone with JWT auth and role-based access control.",
    href: "https://github.com/HarisMajeed05/Airbnb-Inspired-Homepage",
  },
  {
    id: "search",
    name: "Search Engine",
    tag: "systems",
    confidence: 88,
    stack: ["C++"],
    desc: "Custom search engine using an inverted index for efficient text retrieval.",
    href: "https://github.com/HarisMajeed05/Search-Engine",
  },
];

export default function Projects() {
  const [active, setActive] = useState(null);

  return (
    <section id="projects" className="relative px-6 sm:px-10 lg:px-20 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <Eyebrow>03 · projects</Eyebrow>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold mt-4">
          Inference log
        </h2>
        <p className="mt-3 text-[var(--muted)] max-w-xl">
          Hover a project to run detection.
        </p>
      </motion.div>

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {PROJECTS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="relative"
            onMouseEnter={() => setActive(p.id)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(p.id)}
            onBlur={() => setActive(null)}
            tabIndex={0}
          >
            <DetectionBox label={p.tag} confidence={p.confidence} active={active === p.id} />
            <a
              href={p.href || "#"}
              target={p.href ? "_blank" : undefined}
              rel={p.href ? "noreferrer" : undefined}
              className={`block h-full rounded-md border border-[var(--border)] bg-[var(--panel)] p-6 transition-colors ${
                p.href ? "cursor-pointer" : "cursor-default"
              }`}
              onClick={(e) => !p.href && e.preventDefault()}
            >
              <h3 className="font-display text-lg font-semibold">{p.name}</h3>
              <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{p.desc}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-[10px] px-2 py-1 rounded-sm bg-white/5 text-[var(--muted)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
              {!p.href && (
                <span className="mt-4 inline-block font-mono text-[10px] text-[var(--muted)]">
                  private / academic repo
                </span>
              )}
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
