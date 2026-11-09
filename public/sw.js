// Makes the site installable and quick on repeat visits.
// Pages: network first, so a new deploy shows up straight away, cache when offline.
// Built files have hashed names and never change, so those come from the cache.
const CACHE = "hmr-v2";
const BASE = new URL("./", self.location).pathname;

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([BASE, `${BASE}manifest.webmanifest`, `${BASE}favicon.svg`, `${BASE}me.webp`])));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

// the page sends the files it already loaded, so the first visit gets cached too
self.addEventListener("message", (e) => {
  // one at a time: addAll would throw everything away if a single file failed
  if (e.data?.type === "precache")
    e.waitUntil(caches.open(CACHE).then((c) => Promise.all(e.data.urls.map((u) => c.add(u).catch(() => {})))));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin || !url.pathname.startsWith(BASE)) return;

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          // each page under its own address, without the ?view= part
          caches.open(CACHE).then((c) => c.put(url.origin + url.pathname, copy));
          return res;
        })
        .catch(() =>
          caches.match(url.origin + url.pathname, { ignoreVary: true }).then((hit) => hit || caches.match(BASE, { ignoreVary: true })),
        ),
    );
    return;
  }

  const hashed = url.pathname.startsWith(`${BASE}assets/`);
  e.respondWith(
    // ignoreVary: script requests carry an Origin header the cached copy may not have
    caches.match(req, { ignoreVary: true }).then((hit) => {
      // hashed files never change, so a cached one is served as is
      if (hit && hashed) return hit;
      const net = fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      });
      // anything else: answer from the cache now, refresh it in the background
      if (hit) {
        net.catch(() => {});
        return hit;
      }
      return net;
    }),
  );
});
