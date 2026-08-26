import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          data-cursor="top"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-3 h-9 rounded-full border border-[var(--border)] bg-[var(--panel)]/80 backdrop-blur font-mono text-[11px] text-[var(--muted)] hover:text-[var(--lime)] hover:border-[var(--lime)] transition"
          aria-label="Back to top"
        >
          ↑ top
        </motion.button>
      )}
    </AnimatePresence>
  );
}
