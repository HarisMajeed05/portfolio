import { motion } from "framer-motion";
import { Eyebrow } from "./About";

const LINKS = [
  { label: "email", value: "harismajeed0501@gmail.com", href: "mailto:harismajeed0501@gmail.com" },
  { label: "github", value: "github.com/HarisMajeed05", href: "https://github.com/HarisMajeed05" },
  {
    label: "linkedin",
    value: "linkedin.com/in/haris-majeed-raja",
    href: "https://www.linkedin.com/in/haris-majeed-raja-390386267/",
  },
  {
    label: "resume",
    value: "view_resume.pdf",
    href: "https://drive.google.com/file/d/17BfmxrvdsJnaKDuiCunApBNM1tg35Ls3/view?usp=sharing",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="relative px-6 sm:px-10 lg:px-20 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <Eyebrow>05 · contact</Eyebrow>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold mt-4">
          Open a connection
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-12 max-w-2xl rounded-lg border border-[var(--border)] bg-[var(--panel)] overflow-hidden"
      >
        <div className="font-mono text-[11px] text-[var(--muted)] px-5 py-3 border-b border-[var(--border)] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2">contact.sh</span>
        </div>
        <div className="p-5 font-mono text-sm space-y-3">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 group"
            >
              <span className="text-[var(--lime)] shrink-0">$ open --{l.label}</span>
              <span className="text-[var(--muted)] group-hover:text-[var(--cyan)] transition-colors break-all">
                {l.value}
              </span>
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
