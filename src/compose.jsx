import { useEffect, useState } from "react";
import { ME } from "./data";
import Sheet from "./sheet";

export const openCompose = () => window.dispatchEvent(new Event("compose-open"));

// A small message form that posts to Formspree. It only exists when ME.form
// holds an endpoint, otherwise nothing renders and email stays the way in.
export default function Compose() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState("idle");

  useEffect(() => {
    const o = () => {
      setState("idle");
      setOpen(true);
    };
    window.addEventListener("compose-open", o);
    return () => window.removeEventListener("compose-open", o);
  }, []);

  if (!ME.form) return null;
  const close = () => setOpen(false);

  const send = async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    // a hidden field only bots fill in
    if (f.elements._gotcha.value) return setState("sent");
    setState("sending");
    try {
      const r = await fetch(ME.form, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(f) });
      setState(r.ok ? "sent" : "error");
      if (r.ok) f.reset();
    } catch {
      setState("error");
    }
  };

  return (
    <Sheet name="compose" open={open} onClose={close} label="Send me a message" className="compose">
      <form className="pop compose-box" onSubmit={send}>
        <header className="arc-head">
          <div>
            <p className="mono eyebrow">
              <i className="dot" /> Message
            </p>
            <h2 className="h2 sm">Say hello</h2>
          </div>
          <button type="button" className="btn" onClick={close} data-hit="close">
            Close <span aria-hidden="true">Esc</span>
          </button>
        </header>
        {state === "sent" ? (
          <p className="compose-done">Sent. I will reply to the address you gave.</p>
        ) : (
          <>
            <label className="mono">
              Name
              <input name="name" required autoComplete="name" data-autofocus />
            </label>
            <label className="mono">
              Email
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label className="mono">
              Message
              <textarea name="message" rows="5" required />
            </label>
            <input name="_gotcha" tabIndex="-1" autoComplete="off" className="hp" aria-hidden="true" />
            <div className="compose-row">
              <button className="btn hot" type="submit" disabled={state === "sending"}>
                {state === "sending" ? "Sending" : "Send"} <span aria-hidden="true">↗</span>
              </button>
              {state === "error" && (
                <p className="mono compose-err">
                  That did not go through. Email me at <a href={`mailto:${ME.email}`}>{ME.email}</a> instead.
                </p>
              )}
            </div>
          </>
        )}
      </form>
    </Sheet>
  );
}
