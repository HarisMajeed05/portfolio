import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { createServer, defineConfig } from "vite";

// GitHub Pages serves project sites from /<repo-name>/, so base must match
// the repo name. Change it if you rename the repo.
const BASE = "/portfolio/";
const SITE = "https://harismajeed05.github.io";
const HOME = SITE + BASE;
const GH_USER = "HarisMajeed05";

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;
// a meta description should stop near 155 characters, on a whole word
const clip = (s, n = 155) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)).replace(/[,.;:]$/, "") + "…");

// GitHub numbers for the contact chapter, fetched once at build time so visitors
// never wait on (or get rate limited by) the GitHub API. The Actions token lifts the limit.
async function pulse() {
  const headers = process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {};
  try {
    const [u, r] = await Promise.all([
      fetch(`https://api.github.com/users/${GH_USER}`, { headers }),
      fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`, { headers }),
    ]);
    if (!u.ok || !r.ok) return null;
    const user = await u.json();
    const own = (await r.json()).filter((x) => !x.fork);
    const count = {};
    own.forEach((x) => x.language && (count[x.language] = (count[x.language] || 0) + 1));
    return {
      repos: user.public_repos,
      last: own[0]?.pushed_at || null,
      langs: Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k),
      pushed: Object.fromEntries(own.map((x) => [x.name.toLowerCase(), x.pushed_at])),
    };
  } catch {
    return null;
  }
}

// After the bundle is written I render the plain page into index.html, inline the
// first-paint CSS, and write a static page per project plus the sitemap and llms.txt.
// Crawlers then read everything as plain HTML, and the first paint needs no JavaScript.
function prerender() {
  let root;
  let outDir;
  let define;
  return {
    name: "prerender",
    apply: "build",
    configResolved(c) {
      root = c.root;
      outDir = path.resolve(c.root, c.build.outDir);
      define = c.define;
    },
    async writeBundle(_, bundle) {
      const files = Object.values(bundle);
      const entry = files.find((f) => f.type === "chunk" && f.isEntry);
      const cssName = entry.viteMetadata.importedCss.values().next().value;
      const css = fs.readFileSync(path.join(outDir, cssName), "utf8");
      const font = (re) => files.find((f) => re.test(f.fileName))?.fileName;
      const fonts = [font(/instrument-serif-latin-400-normal-.*\.woff2$/), font(/geist-sans-latin-400-normal-.*\.woff2$/)]
        .filter(Boolean)
        .map((f) => `<link rel="preload" href="${BASE}${f}" as="font" type="font/woff2" crossorigin />`)
        .join("\n    ");

      // a throwaway dev server lets me import the real React components and data in Node
      const vs = await createServer({
        root,
        base: BASE,
        configFile: false,
        logLevel: "silent",
        appType: "custom",
        define,
        plugins: [react()],
        server: { middlewareMode: true, hmr: false, ws: false },
      });
      try {
        const { createElement } = await import("react");
        const { renderToStaticMarkup } = await import("react-dom/server");
        const { default: Plain } = await vs.ssrLoadModule("/src/plain.jsx");
        const data = await vs.ssrLoadModule("/src/data.js");
        const { ME, BRIEF, PROJECTS, LAB, ORBITS, RESUMES } = data;
        const today = new Date().toISOString().slice(0, 10);
        const workUrl = (p) => `${HOME}work/${p.id}/`;

        LAB.forEach((l) => PROJECTS.some((p) => p.id === l.project) || this.warn(`lab note ${l.id}: no project called ${l.project}`));

        const person = {
          "@type": "Person",
          "@id": `${HOME}#person`,
          name: ME.name,
          alternateName: "Haris Majeed",
          jobTitle: ME.role,
          description: `${ME.role} at ${ME.org} in ${ME.place}. ${BRIEF.body}`,
          url: HOME,
          image: `${HOME}haris.jpg`,
          email: `mailto:${ME.email}`,
          worksFor: { "@type": "Organization", name: ME.org },
          alumniOf: { "@type": "CollegeOrUniversity", name: "Information Technology University", address: "Lahore, Pakistan" },
          address: { "@type": "PostalAddress", addressLocality: "Lahore", addressCountry: "PK" },
          knowsAbout: [
            "Artificial Intelligence",
            "Computer Vision",
            "Object Detection",
            "Document AI",
            "OCR",
            "Large Language Models",
            "Retrieval-Augmented Generation",
            "Deepfake Detection",
            "Reinforcement Learning",
            ...new Set(ORBITS.flatMap((o) => o.words)),
          ],
          sameAs: [ME.github, ME.linkedin],
        };

        // home page
        let html = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
        html = html
          .replace(/<link rel="stylesheet"[^>]*href="[^"]*\.css"[^>]*>/, () => `<style>${css}</style>`)
          .replace("<!--fonts-->", () => fonts)
          .replace("<!--plain-->", () => renderToStaticMarkup(createElement(Plain)))
          .replace("<!--ld-->", () =>
            ld({
              "@context": "https://schema.org",
              "@graph": [
                { "@type": "WebSite", "@id": `${HOME}#website`, url: HOME, name: ME.name, inLanguage: "en", publisher: { "@id": `${HOME}#person` } },
                {
                  "@type": "ProfilePage",
                  "@id": `${HOME}#page`,
                  url: HOME,
                  name: `${ME.name} | AI Engineer`,
                  isPartOf: { "@id": `${HOME}#website` },
                  mainEntity: { "@id": `${HOME}#person` },
                  primaryImageOfPage: { "@type": "ImageObject", url: `${HOME}haris.jpg`, width: 480, height: 640 },
                  dateModified: today,
                  hasPart: { "@id": `${HOME}#projects` },
                },
                person,
                {
                  "@type": "ItemList",
                  "@id": `${HOME}#projects`,
                  name: "Selected projects",
                  itemListElement: PROJECTS.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: workUrl(p), name: p.title })),
                },
              ],
            }),
          );
        fs.writeFileSync(path.join(outDir, "index.html"), html);

        // one page per project, plain HTML with the same look, no 3D
        const STORY = [
          ["why", "The problem"],
          ["how", "How it works"],
          ["result", "Result"],
          ["limits", "Limits"],
        ];
        for (const p of PROJECTS) {
          const url = workUrl(p);
          const title = `${p.title} | ${ME.name}`;
          const desc = clip(p.desc);
          const notes = LAB.filter((l) => l.project === p.id);
          const others = PROJECTS.filter((x) => x !== p);
          const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#07080b" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}" />
    <meta name="author" content="${esc(ME.name)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <link rel="canonical" href="${url}" />
    <link rel="icon" type="image/svg+xml" href="${BASE}favicon.svg" />
    <link rel="apple-touch-icon" href="${BASE}apple-touch-icon.png" />
    <link rel="manifest" href="${BASE}manifest.webmanifest" />
    ${fonts}
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${esc(ME.name)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:image" content="${HOME}og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${HOME}og.jpg" />
    <style>${css}</style>
    ${ld({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": p.href ? "SoftwareSourceCode" : "CreativeWork",
          "@id": `${url}#work`,
          name: p.title,
          alternateName: p.short,
          description: p.desc,
          url,
          ...(p.href && { codeRepository: p.href }),
          keywords: p.stack.join(", "),
          genre: p.kind,
          author: { "@id": `${HOME}#person` },
          isPartOf: { "@id": `${HOME}#website` },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: ME.name, item: HOME },
            { "@type": "ListItem", position: 2, name: p.title, item: url },
          ],
        },
        { "@type": "Person", "@id": `${HOME}#person`, name: ME.name, url: HOME, jobTitle: ME.role, sameAs: [ME.github, ME.linkedin] },
      ],
    })}
    <script type="module" crossorigin src="${BASE}${entry.fileName}"></script>
  </head>
  <body>
    <div class="pl">
      <nav class="pl-crumbs mono" aria-label="Breadcrumb">
        <a href="${BASE}">${esc(ME.name)}</a><span class="sep">/</span><a href="${BASE}?view=plain#projects">Projects</a><span class="sep">/</span><span aria-current="page">${esc(p.short)}</span>
      </nav>
      <header>
        <p class="mono pl-kicker"><i class="dot"></i> ${esc(p.kind)} <span class="sep">/</span> ${esc(p.year)}</p>
        <h1>${esc(p.title)}</h1>
      </header>
      <main>
        <section>
          <p class="pl-lede">${esc(p.desc)}</p>
          <ul class="chips mono">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
          <p class="mono pl-links">${
            p.href
              ? `<a class="pl-link" href="${esc(p.href)}" target="_blank" rel="noreferrer noopener">${esc(p.hrefLabel || "View on GitHub")} ↗</a>`
              : `<span class="pl-note">${esc(p.note || "")}</span>`
          }<a class="pl-link" href="${BASE}?view=3d">See it in the 3D portfolio</a></p>
        </section>
        ${STORY.filter(([k]) => p.story?.[k])
          .map(([k, h]) => `<section><h2>${h}</h2><p>${esc(p.story[k])}</p></section>`)
          .join("\n        ")}
        ${
          notes.length
            ? `<section><h2>Lab notes</h2>${notes.map((l) => `<article class="pl-proj"><p class="mono pl-time">${esc(l.tag)}</p><h3>${esc(l.title)}</h3><p>${esc(l.text)}</p></article>`).join("")}</section>`
            : ""
        }
        <section>
          <h2>More projects</h2>
          <ul class="pl-more">${others.map((x) => `<li><a href="${BASE}work/${x.id}/">${esc(x.title)}</a><span>${esc(x.kind)}, ${esc(x.year)}</span></li>`).join("")}</ul>
        </section>
        <section>
          <h2>Let's build something <em>that sees.</em></h2>
          <p>${esc(ME.name)} is an ${esc(ME.role)} at ${esc(ME.org)} in ${esc(ME.place)}.</p>
          <p><a class="pl-mail" href="mailto:${ME.email}">${ME.email}</a></p>
          <p class="mono pl-links"><a href="${ME.github}" target="_blank" rel="noreferrer noopener">GitHub ↗</a><a href="${ME.linkedin}" target="_blank" rel="noreferrer noopener">LinkedIn ↗</a><a href="${BASE}">Home</a></p>
        </section>
      </main>
      <p class="foot mono">© 2026 ${esc(ME.name)}</p>
    </div>
  </body>
</html>
`;
          fs.mkdirSync(path.join(outDir, "work", p.id), { recursive: true });
          fs.writeFileSync(path.join(outDir, "work", p.id, "index.html"), page);
        }

        // sitemap with the photo, so it can show up in image search too
        const urls = [
          `  <url>\n    <loc>${HOME}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>1.0</priority>\n    <image:image><image:loc>${HOME}haris.jpg</image:loc></image:image>\n  </url>`,
          ...PROJECTS.map((p) => `  <url>\n    <loc>${workUrl(p)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>0.8</priority>\n  </url>`),
        ];
        fs.writeFileSync(
          path.join(outDir, "sitemap.xml"),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join("\n")}\n</urlset>\n`,
        );

        // llms.txt: a plain summary for AI search tools and assistants
        fs.writeFileSync(
          path.join(outDir, "llms.txt"),
          `# ${ME.name}

> ${ME.role} at ${ME.org} in ${ME.place}. ${BRIEF.body}

${BRIEF.ask}

## Projects

${PROJECTS.map((p) => `- [${p.title}](${workUrl(p)}): ${p.desc}`).join("\n")}

## Contact

- Email: ${ME.email}
- GitHub: ${ME.github}
- LinkedIn: ${ME.linkedin}
${RESUMES.map((r) => `- Résumé, ${r.label}: ${HOME}resumes/${r.file}`).join("\n")}
`,
        );
      } finally {
        await vs.close();
      }
    },
  };
}

export default defineConfig(async ({ command }) => ({
  plugins: [react(), prerender()],
  base: BASE,
  define: { "import.meta.env.PULSE": JSON.stringify(command === "build" ? await pulse() : null) },
  build: { chunkSizeWarningLimit: 1600, sourcemap: true },
}));
