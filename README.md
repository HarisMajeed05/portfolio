# Portfolio — Haris Majeed Raja

React + Vite portfolio built around a computer-vision detection theme.
Hovering a project draws an animated bounding box with a confidence score,
mirroring YOLO/RF-DETR inference output.

## Stack

- React 19 + Vite
- Tailwind CSS v4
- Framer Motion

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview   # test the production build locally
```

## Deployment (GitHub Pages)

This repo includes `.github/workflows/deploy.yml`, which builds and deploys
automatically on every push to `main`.

**One-time setup after pushing:**

1. Go to your repo's **Settings → Pages**
2. Under **Build and deployment → Source**, select **GitHub Actions**
3. Push to `main` (or re-run the workflow from the **Actions** tab)
4. Your site will be live at `https://<your-username>.github.io/portfolio/`

If you rename the repo, update the `base` path in `vite.config.js` to match.

## Structure

```
src/
  components/
    Navbar.jsx
    Hero.jsx
    About.jsx
    Skills.jsx
    Projects.jsx
    Experience.jsx
    Contact.jsx
    Footer.jsx
    DetectionBox.jsx   ← the signature hover interaction
  App.jsx
  index.css            ← design tokens + global styles
```

## Editing content

All copy lives directly in the component files, there's no separate CMS or
data file. To update projects, edit the `PROJECTS` array in
`src/components/Projects.jsx`. Same pattern for skills, experience, and
contact links in their respective files.
