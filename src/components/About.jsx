import { motion } from "framer-motion";

const FACTS = [
  { k: "role", v: "AI Engineer @ MLBench Pvt Ltd" },
  { k: "education", v: "BS Computer Science, ITU Lahore" },
  { k: "gpa", v: "3.28 / 4.0" },
  { k: "focus", v: "Computer Vision · RAG Systems · Full-Stack AI" },
  { k: "fyp", v: "Multimodal Deepfake Detection (VLMs)" },
  { k: "location", v: "Lahore, Pakistan" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function About() {
  return (
    <section id="about" className="relative px-6 sm:px-10 lg:px-20 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <Eyebrow>01 · about</Eyebrow>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold mt-4 leading-tight">
            I build systems from scratch, then teach them to see.
          </h2>
          <p className="mt-6 text-[var(--muted)] text-base sm:text-lg leading-relaxed max-w-xl">
            I like understanding things at the root, compilers, search engines,
            before applying modern AI on top of them. That habit shapes how I
            build: computer vision pipelines, retrieval-augmented tools,
            and applied AI systems that go all the way from a research
            idea to a deployed FastAPI + React product.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-[var(--border)] bg-[var(--panel)] overflow-hidden"
        >
          <div className="font-mono text-[11px] text-[var(--muted)] px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <span>model_card.yaml</span>
            <span className="text-[var(--lime)]">● loaded</span>
          </div>
          <dl className="divide-y divide-[var(--border)]">
            {FACTS.map((f) => (
              <div key={f.k} className="flex flex-col sm:flex-row sm:items-center px-5 py-3.5 gap-1 sm:gap-6">
                <dt className="font-mono text-xs text-[var(--cyan)] sm:w-32 shrink-0">{f.k}</dt>
                <dd className="text-sm text-[var(--text)]">{f.v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}

export function Eyebrow({ children }) {
  return (
    <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--lime)]">
      {children}
    </span>
  );
}
