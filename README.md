# Haris Majeed Raja

My personal portfolio. I'm an AI engineer at MLBench in Lahore, working on computer vision, document AI and LLM/RAG systems. This site is where my projects, research and résumés live.

**Live:** https://harismajeed05.github.io/portfolio/

I wanted something that felt different from a normal portfolio page, so the whole site is one 3D scene you scroll through. A particle portrait of me sits in the middle of it, and the camera flies through my career, my projects and my toolbox as you scroll. The text is regular HTML on top, so it's still selectable, searchable and readable by Google.

## What it does

- Particle portrait built from my photo. It parts around the cursor, bursts when you click it and pulls itself back together.
- Six chapters: intro, brief, career tunnel, project ring, toolbox, contact.
- 14 projects, each with a short case study (why I built it, how it works, the result, the limits) and a few lab notes with real numbers.
- "Read me as" switch (General, AI, Research, Software) that reorders the projects and opens the matching résumé.
- Command palette on Ctrl K, four accent colours and an archive of all my GitHub repos.
- A plain, light version of the same content for crawlers, slow devices and anyone who prefers it (`?view=plain`).

## How it's built

React 19, Vite, three.js through React Three Fiber, postprocessing for the bloom and chromatic fringing, and Lenis for smooth scroll. Fonts are self-hosted, so the page itself makes no third-party requests.

The part I spent the most time on is making it work for search and for weak phones:

- **Prerendering.** `vite.config.js` renders the plain page into `index.html` at build time, so all the text is in the HTML before any JavaScript runs. It also writes a static page for each project under `/work/<id>/`, plus `sitemap.xml` and `llms.txt`.
- **Picking a version.** A small script in the `<head>` decides before first paint whether you get the 3D site or the plain one. Crawlers and browsers that would run WebGL in software get the plain page. Everyone else gets 3D.
- **Light on weak devices.** three.js loads as its own chunk after the text. The scene drops to 12 to 30 fps when nothing is moving, and the quality tier starts from the device's memory and core count.
- **Offline.** A service worker caches the site, and it can be installed as an app.
- **GitHub numbers.** Fetched once at build time, so visitors never hit the GitHub API.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173/portfolio/ (the base path matters).

```bash
npm run build     # output goes to dist/
npm run preview   # serve the build locally
npm run lint
```

## Editing the content

Nearly everything on the site comes from `src/data.js`: my details, projects, case studies, lab notes, toolbox, résumé links and the archive list.

- **New project:** add an object to `PROJECTS`, then a matching entry in `STORIES` with the same id. Its `art` field picks the card artwork (see `src/scene/cards.js`).
- **New repo in the archive:** add one `R(...)` line to `ARCHIVE`.
- **Photos:** `public/me.webp` is the cut-out used by the 3D portrait, `public/haris.jpg` (480x640) is for search engines and `public/haris-sm.webp` (210x280) is shown on the plain page.
- **Résumés:** replace the PDFs in `public/resumes/`.

## Optional extras

Both are off until set, and both are read at build time from repository variables, so no secrets live in the code.

| Variable | What it turns on |
|---|---|
| `FORM_URL` | A "Write a message" form in the contact chapter, sent through Formspree |
| `GOATCOUNTER` | Cookie-free visit counts and events (case studies opened, résumé downloads, outbound links) |

Set them under Settings, Secrets and variables, Actions, Variables. Locally, use `VITE_FORM_URL` and `VITE_GOATCOUNTER`.

## Deploying

The site is served from GitHub Pages under `/portfolio/`. Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/`. If the repo is renamed, change `BASE` in `vite.config.js`.

For search, I added the site to Google Search Console and submitted `/portfolio/sitemap.xml`. The verification file lives in `public/` so Vite copies it into the build.

## Shortcuts and links

| Key | Does |
|---|---|
| Ctrl K, / | search and jump |
| Up, Down, J, K | previous or next stop |
| Left, Right | turn the project ring |
| 1 to 6 | jump to a chapter |
| A, N | archive, lab notes |
| S, C | sound, accent colour |
| P | plain view |
| ? | list shortcuts |
| Esc | close whatever is open |

Deep links: `#work/scratchgpt` (any project id), `#work/scratchgpt/story` for its case study, `?lens=ai|research|software|general`, `?accent=orange|lime|violet|rose`, `?view=plain|3d`, `?quality=low|high`. They combine, for example `?lens=research#work/footfall-counter/story`.

## Structure

```
index.html         head tags and the script that picks plain or 3D
vite.config.js     build step: prerender, project pages, sitemap, llms.txt
public/            photos, icons, résumés, service worker
src/
  data.js          all the content
  main.jsx         entry point
  base.css         first-paint styles, inlined into the HTML
  index.css        styles for the 3D site
  sections.jsx     the page panels for each chapter
  plain.jsx        the plain version
  scene/           the 3D world (portrait, tunnel, project ring, toolbox)
```

The rest of `src/` is small single-purpose modules for scroll, navigation, the command palette, case studies, theme and so on.

## Contact

harismajeed0501@gmail.com, [GitHub](https://github.com/HarisMajeed05), [LinkedIn](https://www.linkedin.com/in/harismajeedraja)
