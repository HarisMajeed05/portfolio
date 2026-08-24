import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// GitHub Pages serves project sites from /<repo-name>/, so the base path
// must match your repo name exactly. Change this if you rename the repo.
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',
})
