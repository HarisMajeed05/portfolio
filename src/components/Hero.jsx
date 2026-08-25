import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BOOT_LINES = [
  "$ initializing vision pipeline...",
  "$ loading model: haris-majeed-raja.pt",
  "$ device: cuda:0 | precision: fp16",
  "$ inference ready",
];

export default function Hero() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showFrame, setShowFrame] = useState(false);

  useEffect(() => {
    if (lineIndex >= BOOT_LINES.length) {
      const t = setTimeout(() => setShowFrame(true), 200);
      return () => clearTimeout(t);
    }
    const line = BOOT_LINES[lineIndex];
    if (charIndex < line.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), 14);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLineIndex((l) => l + 1);
      setCharIndex(0);
    }, 220);
    return () => clearTimeout(t);
  }, [lineIndex, charIndex]);

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center px-6 sm:px-10 lg:px-20 pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px circle at 20% 20%, rgba(166,255,0,0.06), transparent 60%), radial-gradient(500px circle at 85% 70%, rgba(51,199,255,0.07), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl w-full grid lg:grid-cols-[1fr_380px] gap-10 items-center">
      <div className="max-w-2xl">
        <div className="font-mono text-xs sm:text-sm text-[var(--muted)] mb-10 h-[92px] sm:h-[104px] space-y-1">
          {BOOT_LINES.slice(0, lineIndex).map((l, i) => (
            <div key={i} className="text-[var(--lime)]/70">
              {l}
            </div>
          ))}
          {lineIndex < BOOT_LINES.length && (
            <div>
              {BOOT_LINES[lineIndex].slice(0, charIndex)}
              <span className="cursor-blink">▌</span>
            </div>
          )}
        </div>

        <div className="relative inline-block mt-6">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: showFrame ? 1 : 0, y: showFrame ? 0 : 16 }}
            transition={{ duration: 0.5 }}
            className="font-display font-semibold text-[13vw] sm:text-[7vw] lg:text-[4.4rem] leading-[0.95] tracking-tight"
          >
            Haris Majeed
            <br />
            Raja
          </motion.h1>

          {showFrame && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="absolute -inset-3 sm:-inset-4 rounded-md pointer-events-none"
              style={{ border: "1.5px solid var(--lime)" }}
            >
              <span className="absolute -top-6 left-0 font-mono text-[10px] sm:text-xs px-2 py-0.5 rounded-sm bg-[var(--lime)] text-[#0b0f14] tracking-wide">
                class: ai_engineer · conf: 99.2%
              </span>
            </motion.div>
          )}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: showFrame ? 1 : 0, y: showFrame ? 0 : 10 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 sm:mt-12 max-w-xl text-base sm:text-lg text-[var(--muted)] leading-relaxed"
        >
          AI Engineer building computer vision systems, from OCR-based
          document field detection to multimodal deepfake detection,
          shipped end to end.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: showFrame ? 1 : 0, y: showFrame ? 0 : 10 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <a
            href="#projects"
            className="font-mono text-sm px-5 py-3 rounded-sm bg-[var(--lime)] text-[#0b0f14] font-medium hover:brightness-110 transition"
          >
            view projects
          </a>
          <a
            href="#contact"
            className="font-mono text-sm px-5 py-3 rounded-sm border border-[var(--border)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition"
          >
            get in touch
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: showFrame ? 1 : 0, x: showFrame ? 0 : 24 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="hidden lg:block rounded-lg border border-[var(--border)] bg-[var(--panel)]/80 backdrop-blur overflow-hidden float-slow"
      >
        <div className="font-mono text-[11px] text-[var(--muted)] px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
          <span>inference_stats.json</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] pulse-glow" />
        </div>
        <dl className="divide-y divide-[var(--border)]">
          <div className="px-5 py-4">
            <dt className="font-mono text-xs text-[var(--cyan)]">precision</dt>
            <dd className="text-2xl font-display font-semibold mt-1">0.9335</dd>
          </div>
          <div className="px-5 py-4">
            <dt className="font-mono text-xs text-[var(--cyan)]">model size reduction</dt>
            <dd className="text-2xl font-display font-semibold mt-1">&gt;80%</dd>
          </div>
          <div className="px-5 py-4">
            <dt className="font-mono text-xs text-[var(--cyan)]">real-frame accuracy</dt>
            <dd className="text-2xl font-display font-semibold mt-1">0% → 83%</dd>
          </div>
          <div className="px-5 py-4">
            <dt className="font-mono text-xs text-[var(--cyan)]">deployment</dt>
            <dd className="text-sm text-[var(--text)] mt-1">single consumer GPU</dd>
          </div>
        </dl>
      </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showFrame ? 1 : 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="absolute bottom-8 left-6 sm:left-10 lg:left-20 font-mono text-[10px] text-[var(--muted)] flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] pulse-glow" />
        scroll to explore
      </motion.div>
    </section>
  );
}
