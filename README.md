# Haris Majeed Raja, 3D portfolio

Live: https://harismajeed05.github.io/portfolio/

One full screen WebGL scene sits behind the page. Scrolling flies the camera forward through six chapters: intro, brief, career tunnel, project ring, toolbox and contact. The page text is plain DOM on top, so it stays selectable and readable.

## What is in it

- Particle portrait with a scanline, career gates that ping when you reach them, a ring of 14 projects, orbiting toolbox, speed based colour fringing.
- Archive drawer with every repo from my GitHub, filterable and searchable.
- Plain view: the same content as one light page that never loads three.js. It also loads by itself when the browser has no WebGL.
- Detection box cursor on desktop, magnetic buttons, word reveals and label decoding.
- Auto quality: a performance monitor lowers pixel ratio and effects on weak GPUs.

## Keys and links

| Key | Does |
|---|---|
| Up, Down, J, K | next or previous stop |
| Left, Right | turn the project ring |
| 1 to 6 | jump to a chapter |
| A | open the archive |
| P | plain view |
| ? | show the shortcuts |

Links that work: `#work/scratchgpt` (any project id), `#timeline`, `#archive`, `?view=plain`, and `?quality=high` or `?quality=low` to pin the quality tier.

## Stack

React 19, Vite, three.js with React Three Fiber and drei, postprocessing (bloom, vignette, chromatic aberration), Lenis for smooth scroll. Fonts are self hosted with fontsource, so there are no external requests.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173/portfolio/ (the base path matters).

```bash
npm run build     # output in dist/
npm run preview   # serve the build locally
npm run lint
```

## Structure

```
public/            photo, favicon, social image, resume PDFs
src/
  data.js          all the content (edit this first)
  sections.jsx     DOM panels for each chapter
  hud.jsx          loader, progress bar, chapter rail, top right tools
  scroll.js        Lenis setup and the shared scroll state
  nav.js           keyboard shortcuts and deep links
  fx.jsx           cursor, word reveal, label decode
  archive.jsx      archive drawer
  plain.jsx        plain view
  scene/           the 3D world
    World.jsx      canvas, camera rig, post effects, auto quality
    stage.js       positions and camera poses per chapter
    Portrait.jsx   particle portrait, scanline, detection boxes
    Tunnel.jsx     career gates
    Gallery.jsx    project ring (cards drawn in cards.js)
    Orbit.jsx      toolbox rings
    Warp.jsx       star streaks
```

## Editing content

Everything you read on the site lives in `src/data.js`: profile, stats, roles, projects, the archive list, toolbox words and resume links. Add a project by adding an object to `PROJECTS`. Its `art` field picks the generated card artwork (see `src/scene/cards.js`), and its id for deep links is made from the title. Add a repo to the archive with one `R(...)` line in `ARCHIVE`. Swap the photo by replacing `public/haris.jpg`, and the resumes by replacing the PDFs in `public/resumes/`.

## Deploy

The site is served from GitHub Pages under `/portfolio/` (set as `base` in `vite.config.js`). Pushing to `main` runs `.github/workflows/deploy.yml`, which installs, builds and publishes `dist/`. If the repo is renamed, change `base` to match.
