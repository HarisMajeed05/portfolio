import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollGauge() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  return (
    <div
      className="hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 z-40 w-px h-40"
      style={{ background: "var(--border)" }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute top-0 left-0 w-px origin-top"
        style={{ height: "100%", scaleY, background: "var(--lime)" }}
      />
    </div>
  );
}
