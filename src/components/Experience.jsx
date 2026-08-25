import { motion } from "framer-motion";
import { Eyebrow } from "./About";

const ROLES = [
  {
    title: "AI Engineer",
    org: "MLBench Pvt Ltd",
    time: "Present",
    desc: "Building computer vision pipelines for production use, including OCR-based document field detection, from research to deployed inference APIs.",
  },
  {
    title: "Teaching Assistant",
    org: "Information Technology University (ITU)",
    time: "Software Engineering & Artificial Intelligence",
    desc: "Supported course delivery for two core CS courses and mentored students on AI/ML fundamentals.",
  },
  {
    title: "Final Year Project",
    org: "Multimodal Deepfake Detection using LLMs and VLMs",
    time: "Supervised by Dr. Waqas Sultani",
    desc: "Detect-explain-judge pipeline replacing large VLMs with lightweight alternatives, over 80% smaller.",
  },
];

const HIGHLIGHTS = [
  { k: "experience", v: "5 roles across AI, full-stack, and Salesforce" },
  { k: "education", v: "BS CS, ITU Lahore · 2022 – 2026" },
  { k: "current", v: "AI Engineer @ MLBench Pvt Ltd" },
  { k: "teaching", v: "TA for SE & AI courses at ITU" },
];

export default function Experience() {
  return (
    <section id="experience" className="relative px-6 sm:px-10 lg:px-20 py-24 sm:py-32 bg-[var(--panel)]/40 border-y border-[var(--border)]">
      <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <Eyebrow>04 · timeline</Eyebrow>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold mt-4">
          Training history
        </h2>
      </motion.div>

      <div className="mt-14 grid lg:grid-cols-[1fr_320px] gap-12 lg:gap-16 items-start">
        <div className="relative pl-8">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border)]" />
          <div className="space-y-12">
            {ROLES.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-8 top-1.5 w-3.5 h-3.5 rounded-full bg-[var(--bg)] border-2 border-[var(--lime)]" />
                <span className="font-mono text-[11px] text-[var(--cyan)]">{r.time}</span>
                <h3 className="font-display text-xl font-semibold mt-1">{r.title}</h3>
                <p className="font-mono text-sm text-[var(--muted)] mt-0.5">{r.org}</p>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed max-w-xl">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-lg border border-[var(--border)] bg-[var(--panel)] overflow-hidden lg:sticky lg:top-28"
        >
          <div className="font-mono text-[11px] text-[var(--muted)] px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <span>summary.log</span>
            <span className="text-[var(--lime)]">● live</span>
          </div>
          <dl className="divide-y divide-[var(--border)]">
            {HIGHLIGHTS.map((h) => (
              <div key={h.k} className="px-5 py-3.5">
                <dt className="font-mono text-xs text-[var(--cyan)]">{h.k}</dt>
                <dd className="text-sm text-[var(--text)] mt-1">{h.v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
      </div>
    </section>
  );
}
