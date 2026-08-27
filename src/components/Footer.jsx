export default function Footer() {
  return (
    <footer className="px-6 sm:px-10 lg:px-20 py-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-[var(--muted)]">
      <span>© {new Date().getFullYear()} Haris Majeed Raja</span>
      <span className="flex items-center gap-1.5">
        {/* <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)]" />
        built with react + framer-motion */}
      </span>
    </footer>
  );
}
