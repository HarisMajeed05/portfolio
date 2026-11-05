import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// GitHub Pages serves project sites from /<repo-name>/, so base must match
// the repo name. Change it if you rename the repo.
export default defineConfig({
  plugins: [react()],
  base: "/portfolio/",
  build: { chunkSizeWarningLimit: 1600 },
});
