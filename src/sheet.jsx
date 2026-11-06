import { useEffect, useRef } from "react";
import { lock } from "./scroll";
import { sfx } from "./sound";

const FOCUSABLE = "a[href],button:not([disabled]),input,textarea,select";

// Shell shared by the archive, case studies, lab notes, search and the message
// form. It dims the page, freezes scroll, keeps Tab inside, closes on Esc and
// gives focus back to where it came from.
export default function Sheet({ name, open, onClose, label, className = "", children }) {
  const root = useRef();
  // the parent hands a fresh onClose every render, keep the latest in a ref
  const shut = useRef(onClose);
  shut.current = onClose;

  useEffect(() => {
    if (!open) return;
    const back = document.activeElement;
    const html = document.documentElement;
    html.dataset.modal = name;
    lock(true);
    sfx.open();
    // wait a frame so the sheet is visible before it takes focus
    const f = requestAnimationFrame(() => (root.current?.querySelector("[data-autofocus]") || root.current?.querySelector(FOCUSABLE))?.focus({ preventScroll: true }));
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        shut.current();
        return;
      }
      if (e.key !== "Tab") return;
      const els = [...root.current.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(f);
      window.removeEventListener("keydown", onKey);
      if (html.dataset.modal === name) delete html.dataset.modal;
      lock(false);
      back?.focus?.({ preventScroll: true });
    };
    // onClose changes every render, the open flag is what matters here
  }, [open, name]);

  return (
    <div className={`arc ${className} ${open ? "open" : ""}`} aria-hidden={!open} ref={root} role="dialog" aria-modal="true" aria-label={label}>
      <div className="arc-bg" onClick={onClose} />
      {children}
    </div>
  );
}
