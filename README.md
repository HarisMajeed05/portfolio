# Haris Majeed Raja, 3D portfolio

Live: https://harismajeed05.github.io/portfolio/

One full screen WebGL scene sits behind the page. Scrolling flies the camera forward through six chapters: intro, brief, career tunnel, project ring, toolbox and contact. The page text is plain DOM on top, so it stays selectable and readable.

## What is in it

- Particle portrait with a scanline. It parts around the pointer and bursts apart when you click or tap it, then pulls itself back together.
- Intro sequence: a loader that ticks off fonts, portrait and scene, then the camera dollies in and the portrait assembles.
- Career gates that ping when you reach them, a ring of 14 projects, an orbiting toolbox, speed based colour fringing.
- Read me as: General, AI, Research or Software. It reorders the project ring, swaps the intro and brief lines and points the résumé link at the matching PDF.
- Click a tool on the orbit to light up the project cards that use it.
- A case study for every project (why it exists, how it works, what came out, honest limits). Click the front card, or use the Case study button.
- Lab notes: a few real results from my own work, with the numbers.
- Command palette (Ctrl K): jump to any chapter or project, switch the lens or colour, open a résumé, copy my email.
- Four accent colours that recolour the page and the 3D scene.
- Sound, synthesized in the browser and off by default.
- GitHub pulse in the contact chapter and "pushed ... ago" in the archive, from the public GitHub API. It is cached for 15 minutes and stays quiet if the request fails.
- Optional contact form (see below).
- Archive drawer with every repo from my GitHub, filterable and searchable.
- Plain view: the same content as one light page that never loads three.js. It also loads by itself when the browser has no WebGL.
- Detection box cursor on desktop, magnetic buttons, word reveals and label decoding.
- Auto quality: a performance monitor lowers pixel ratio and effects on weak GPUs.

## Keys and links

| Key | Does |
|---|---|
| Ctrl K (Cmd K), / | search and jump. Shift Enter on a project opens its case study |
| Up, Down, J, K | next or previous stop |
| Left, Right | turn the project ring |
| 1 to 6 | jump to a chapter |
| A | open the archive |
| N | open the lab notes |
| S | sound on or off |
| C | switch the colour |
| P | plain view |
| ? | show the shortcuts |
| Esc | close whatever is open |

Links that work:

- `#work/scratchgpt` (any project id), `#work/scratchgpt/story` for its case study
- `#timeline`, `#archive`, `#notes`
- `?lens=ai`, `?lens=research`, `?lens=software`, `?lens=general`
- `?accent=orange`, `lime`, `violet` or `rose`
- `?view=plain`
- `?quality=high` or `?quality=low` to pin the quality tier

They combine, for example `?lens=research#work/footfall-counter/story`.

## Contact form

The form is off until it has somewhere to send to. I use Formspree because it needs no server:

1. Make a free form at formspree.io and copy its endpoint, like `https://formspree.io/f/abcd1234`.
2. Paste it into the `form` line of `ME` at the top of `src/data.js`, or set it as `VITE_FORM_URL` when you build.
3. Rebuild. "Write a message" now shows up in the contact chapter and in the palette.

With the endpoint empty the button is not rendered at all, so there is never a dead form. The form has a hidden honeypot field, and if sending fails it offers a mailto link instead.

## Stack

React 19, Vite, three.js with React Three Fiber and drei, postprocessing (bloom, vignette, chromatic aberration), Lenis for smooth scroll. Fonts are self hosted with fontsource, so the only outside requests are the GitHub API call and the contact form, both optional.

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
  theme.js         accent colours
  lens.js          Read me as (General, AI, Research, Software)
  pick.js          tool picked on the orbit
  sound.js         synthesized sound
  pulse.js         GitHub API numbers
  sheet.jsx        shared drawer and popup shell
  archive.jsx      archive drawer
  story.jsx        case studies and lab notes
  palette.jsx      command palette
  compose.jsx      contact form
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

Everything you read on the site lives in `src/data.js`: profile, stats, roles, projects, the archive list, toolbox words, résumé links, the lenses, the case studies (`STORIES`) and the lab notes (`LAB`). Add a project by adding an object to `PROJECTS`, then add an entry to `STORIES`, keyed by the same id, so it gets a case study. Its `art` field picks the generated card artwork (see `src/scene/cards.js`), and its id for deep links is made from the title. Add a repo to the archive with one `R(...)` line in `ARCHIVE`. Swap the photo by replacing `public/haris.jpg`, and the résumés by replacing the PDFs in `public/resumes/`.

## Deploy

The site is served from GitHub Pages under `/portfolio/` (set as `base` in `vite.config.js`). Pushing to `main` runs `.github/workflows/deploy.yml`, which installs, builds and publishes `dist/`. If the repo is renamed, change `base` to match.
