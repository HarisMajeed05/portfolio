import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { answerQuestion, GREETING } from "../lib/knowledgeBase";

const SUGGESTIONS = ["What does Haris do?", "Tell me about the FYP", "What's his tech stack?"];

export default function AskBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: GREETING }]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text) => {
    const q = text.trim();
    if (!q) return;
    const answer = answerQuestion(q);
    setMessages((m) => [...m, { role: "user", text: q }, { role: "bot", text: answer }]);
    setInput("");
  };

  return (
    <>
      <motion.button
        data-cursor="ask"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 left-6 z-40 flex items-center justify-center w-12 h-12 rounded-full font-mono text-sm font-bold"
        style={{ background: "var(--lime)", color: "#0b0f14" }}
        aria-label="Ask about Haris"
      >
        {open ? "×" : "ai"}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-24 left-6 z-40 w-[90vw] max-w-sm rounded-lg border border-[var(--border)] bg-[var(--panel)] shadow-2xl overflow-hidden flex flex-col"
            style={{ height: "min(70vh, 460px)" }}
          >
            <div className="font-mono text-[11px] text-[var(--muted)] px-4 py-3 border-b border-[var(--border)] flex items-center justify-between shrink-0">
              <span>ask_about_haris.sh</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] pulse-glow" />
                scoped
              </span>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`font-mono text-xs leading-relaxed max-w-[85%] px-3 py-2 rounded-md ${
                    m.role === "user"
                      ? "ml-auto bg-[var(--lime)] text-[#0b0f14]"
                      : "bg-white/5 text-[var(--text)]"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="font-mono text-[10px] px-2 py-1 rounded-sm bg-white/5 text-[var(--muted)] hover:text-[var(--lime)] transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-[var(--border)] p-3 flex items-center gap-2 shrink-0"
            >
              <span className="font-mono text-xs text-[var(--lime)]">$</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ask about Haris..."
                className="flex-1 bg-transparent font-mono text-xs outline-none placeholder:text-[var(--muted)]"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
