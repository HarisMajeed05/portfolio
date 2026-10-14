# Portfolio

Personal portfolio of Haris Majeed Raja, built with React and Vite. The theme follows computer vision: hovering over a project draws an animated bounding box with a confidence score, like YOLO or RF-DETR output.

Live site: https://harismajeed05.github.io/portfolio/

## Stack

- React 19 and Vite
- Tailwind CSS v4
- Framer Motion

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

`.github/workflows/deploy.yml` builds and deploys the site on every push to `main`.

One-time setup:

1. Go to **Settings > Pages** in the repository.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main`, or run the workflow from the **Actions** tab.

If you rename the repository, update `base` in `vite.config.js` to match.

## Structure

```
src/
  components/
    Navbar, Hero, About, Skills, Projects, Experience, Contact, Footer
    DetectionBox.jsx   the hover bounding box
  App.jsx
  index.css            design tokens and global styles
```

## Editing content

All text lives in the component files. To change projects, edit the `PROJECTS` array in `src/components/Projects.jsx`. Skills, experience and contact links work the same way in their own files.
