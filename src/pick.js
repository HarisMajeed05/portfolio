import { useEffect, useState } from "react";
import { usesOf } from "./data";
import { S } from "./scroll";
import { sfx } from "./sound";

// Click a tool on the orbits: the project cards that list it light up on the
// ring, the rest dim. Click it again, or clear it, to put everything back.
export function pickTool(name) {
  if (!name || S.tool === name) return clearTool();
  S.tool = name;
  const ids = usesOf(name).cards.map((c) => c.id);
  S.hl = ids.length ? new Set(ids) : null;
  sfx.pick();
  window.dispatchEvent(new Event("tool-pick"));
}

export function clearTool() {
  S.tool = null;
  S.hl = null;
  window.dispatchEvent(new Event("tool-pick"));
}

export function useTool() {
  const [, bump] = useState(0);
  useEffect(() => {
    const on = () => bump((n) => n + 1);
    window.addEventListener("tool-pick", on);
    return () => window.removeEventListener("tool-pick", on);
  }, []);
  return S.tool;
}
