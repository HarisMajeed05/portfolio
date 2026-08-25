import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_STEPS = [
  "mounting filesystem...",
  "loading weights...",
  "calibrating detection thresholds...",
  "warming up gpu...",
  "ready",
];

export default function BootSequence({ onDone }) {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step >= BOOT_STEPS.length) {
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 260);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    const pct = Math.min(100, Math.round((step / BOOT_STEPS.length) * 100));
    setProgress(pct);
  }, [step]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[var(--bg)]"
        >
          <div className="w-[280px] sm:w-[340px] font-mono text-xs">
            <div className="text-[var(--lime)] mb-4">$ boot haris-majeed-raja.sys</div>
            <div className="space-y-1.5 h-[110px]">
              {BOOT_STEPS.slice(0, step).map((s, i) => (
                <div key={i} className="text-[var(--muted)]">
                  <span className="text-[var(--lime)]">✓</span> {s}
                </div>
              ))}
            </div>
            <div className="h-1 rounded-full bg-white/5 overflow-hidden mt-2">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.25 }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--cyan), var(--lime))" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
