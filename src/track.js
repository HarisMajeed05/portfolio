// Privacy-friendly visit counts with GoatCounter: no cookies, no personal data.
// It only switches on when the GOATCOUNTER repo variable holds my site code.
const CODE = import.meta.env.VITE_GOATCOUNTER;

export function track(name) {
  window.goatcounter?.count?.({ path: name, title: name, event: true });
}

export function initTrack() {
  if (!CODE || location.hostname === "localhost") return;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.dataset.goatcounter = `https://${CODE}.goatcounter.com/count`;
  document.head.appendChild(s);

  // the things worth counting: which case studies get opened, résumé downloads, outbound links
  addEventListener("story-open", (e) => track(`open/${e.detail}`));
  document.addEventListener("click", (e) => {
    const a = e.target.closest?.("a[href]");
    if (!a) return;
    const h = a.getAttribute("href");
    if (h.endsWith(".pdf")) track(`resume/${h.split("/").pop()}`);
    else if (h.startsWith("mailto:")) track("email");
    else if (/github\.com|linkedin\.com/.test(h)) track(`out/${new URL(h).hostname}`);
  });
}
