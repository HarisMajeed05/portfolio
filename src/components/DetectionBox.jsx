import { motion, AnimatePresence } from "framer-motion";

// Draws an object-detection-style bounding box with a label + confidence
// score around its children on hover/focus. This is the site's signature
// interaction, echoing the YOLO/RF-DETR output Haris works with daily.
export default function DetectionBox({
  label,
  confidence,
  active,
  color = "var(--lime)",
  corner = true,
}) {
  return (
    <AnimatePresence>
      {active && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute inset-0 rounded-md"
            style={{ border: `1.5px solid ${color}`, boxShadow: `0 0 0 1px ${color}22, 0 0 18px -4px ${color}66` }}
          />
          {corner && (
            <>
              <Corner pos="top-left" color={color} />
              <Corner pos="top-right" color={color} />
              <Corner pos="bottom-left" color={color} />
              <Corner pos="bottom-right" color={color} />
            </>
          )}
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, delay: 0.05 }}
            className="pointer-events-none absolute -top-6 left-0 font-mono text-[10px] tracking-wide px-1.5 py-0.5 rounded-sm"
            style={{ background: color, color: "#0b0f14" }}
          >
            {label} {confidence != null && `· ${confidence}%`}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Corner({ pos, color }) {
  const base = "pointer-events-none absolute w-3 h-3";
  const map = {
    "top-left": "top-[-2px] left-[-2px] border-t-2 border-l-2",
    "top-right": "top-[-2px] right-[-2px] border-t-2 border-r-2",
    "bottom-left": "bottom-[-2px] left-[-2px] border-b-2 border-l-2",
    "bottom-right": "bottom-[-2px] right-[-2px] border-b-2 border-r-2",
  };
  return <div className={`${base} ${map[pos]}`} style={{ borderColor: color }} />;
}
