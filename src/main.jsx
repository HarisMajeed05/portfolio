import "./base.css";
import { initTrack } from "./track";

// The build puts the whole plain page into index.html, and a tiny script in the
// head has already picked this visitor's version (html.x3d or html.plain).
// Crawlers, browsers without a GPU and ?view=plain keep the plain page as it is,
// so they run almost no JavaScript. Everyone else gets the 3D site on top.
const three = document.documentElement.classList.contains("x3d");
const q = new URLSearchParams(location.search);

initTrack();

// installable, and quick on repeat visits. Only on the built site, never in dev.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).then(async () => {
      const reg = await navigator.serviceWorker.ready;
      // hand over everything this first visit downloaded, once now and once more
      // after the late arrivals (fonts, the 3D chunk) have landed
      const send = () => {
        const urls = performance.getEntriesByType("resource").map((r) => r.name).filter((u) => u.startsWith(location.origin));
        reg.active?.postMessage({ type: "precache", urls });
      };
      send();
      setTimeout(send, 8000);
    }).catch(() => {});
  });
}

if (three) import("./App").then((m) => m.mount());
else {
  // the plain page only needs React when a link asks for another lens order,
  // or in dev where nothing is prerendered
  if (q.has("lens") || !document.querySelector(".pl")) import("./plain").then((m) => m.mount());
  // a saved accent is already applied by the head script, only a linked one needs this
  if (q.has("accent")) import("./theme").then((m) => m.initAccent());
}
