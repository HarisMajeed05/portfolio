import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";
import "./index.css";
import { initScroll } from "./scroll";
import { initNav } from "./nav";
import { initAccent } from "./theme";
import { initLens } from "./lens";
import { initTrack } from "./track";

function hasWebGL() {
  try {
    const gl = document.createElement("canvas").getContext("webgl2") || document.createElement("canvas").getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

// ?view=plain, or a browser with no WebGL, gets the light page and never
// downloads three.js
// Search engines and link previews get the plain view: the same content as one
// fast page they can actually see, instead of a loader in front of a 3D scene.
// Speed tests like Lighthouse still get the full 3D site.
const crawler = /googlebot|google-inspectiontool|bingbot|duckduckbot|yandex|baiduspider|applebot|linkedinbot|twitterbot|facebookexternalhit|slurp/i.test(navigator.userAgent);
const plain = new URLSearchParams(location.search).get("view") === "plain" || crawler || !hasWebGL();

// saved accent and ?lens= links apply before anything renders
initAccent();
initLens();
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

(plain ? import("./plain") : import("./App")).then(({ default: Root }) => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <Root />
    </StrictMode>,
  );
  if (!plain) {
    // sections exist after the first render, measure them then
    requestAnimationFrame(() => {
      initScroll();
      initNav();
    });
  }
});