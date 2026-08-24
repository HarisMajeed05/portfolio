import { motion } from "framer-motion";
import { Eyebrow } from "./About";

const GROUPS = [
  {
    title: "computer vision",
    items: [
      { name: "YOLO / RF-DETR", score: 95 },
      { name: "DINOv2 / CLIP", score: 88 },
      { name: "OpenCV / ByteTrack", score: 92 },
    ],
  },
  {
    title: "ai / llm systems",
    items: [
      { name: "LangChain / RAG", score: 90 },
      { name: "FAISS / Vector Search", score: 87 },
      { name: "PyTorch", score: 93 },
    ],
  },
  {
    title: "full-stack",
    items: [
      { name: "FastAPI", score: 94 },
      { name: "React", score: 89 },
      { name: "MongoDB / SQL", score: 85 },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="relative px-6 sm:px-10 lg:px-20 py-24 sm:py-32 bg-[var(--panel)]/40 border-y border-[var(--border)]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <Eyebrow>02 · capabilities</Eyebrow>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold mt-4">
          Detection confidence
        </h2>
      </motion.div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl">
        {GROUPS.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: gi * 0.08 }}
          >
            <h3 className="font-mono text-xs tracking-widest uppercase text-[var(--cyan)] mb-6">
              {group.title}
            </h3>
            <div className="space-y-5">
              {group.items.map((item, i) => (
                <SkillBar key={item.name} {...item} delay={gi * 0.08 + i * 0.06} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SkillBar({ name, score, delay }) {
  return (
    <div>
      <div className="flex justify-between font-mono text-[13px] mb-1.5">
        <span>{name}</span>
        <span className="text-[var(--muted)]">{score}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${score}%` }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, var(--cyan), var(--lime))" }}
        />
      </div>
    </div>
  );
}
