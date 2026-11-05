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
const plain = new URLSearchParams(location.search).get("view") === "plain" || !hasWebGL();

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
