import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState(null);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    // only enable on devices with a real pointer (skip touch devices)
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;
    setEnabled(true);

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  useEffect(() => {
    if (!enabled) return;
    const onOver = (e) => {
      const target = e.target.closest("[data-cursor]");
      if (target) {
        setHovering(true);
        setLabel(target.getAttribute("data-cursor") || "select");
      } else {
        setHovering(false);
        setLabel(null);
      }
    };
    window.addEventListener("mouseover", onOver);
    return () => window.removeEventListener("mouseover", onOver);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
      <motion.div
        className="fixed top-0 left-0 z-[999] pointer-events-none"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          animate={{
            width: hovering ? 56 : 18,
            height: hovering ? 56 : 18,
            borderRadius: hovering ? 8 : 999,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative flex items-center justify-center"
          style={{ border: "1.5px solid var(--lime)" }}
        >
          {hovering && (
            <>
              <span className="absolute -top-1 -left-1 w-2 h-2 border-t border-l" style={{ borderColor: "var(--lime)" }} />
              <span className="absolute -top-1 -right-1 w-2 h-2 border-t border-r" style={{ borderColor: "var(--lime)" }} />
              <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l" style={{ borderColor: "var(--lime)" }} />
              <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r" style={{ borderColor: "var(--lime)" }} />
            </>
          )}
        </motion.div>
        {hovering && label && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap font-mono text-[10px] px-1.5 py-0.5 rounded-sm"
            style={{ background: "var(--lime)", color: "#0b0f14" }}
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
