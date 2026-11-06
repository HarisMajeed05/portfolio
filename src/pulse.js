import { useEffect, useState } from "react";
import { ME } from "./data";

// Live numbers straight from the GitHub API, so the page never goes stale.
// If GitHub is slow, blocked or rate limited, nothing shows and nothing breaks.
const USER = ME.github.split("/").pop();
const KEY = "hmr-pulse";
const TTL = 15 * 60 * 1000;

let data = null;
let started = false;
const listeners = new Set();

function publish(d) {
  data = d;
  listeners.forEach((f) => f(d));
}

async function load() {
  // the API only allows 60 calls an hour without a token, so reuse a recent answer
  try {
    const old = JSON.parse(sessionStorage.getItem(KEY) || "null");
    if (old && Date.now() - old.at < TTL) return publish(old.d);
  } catch {
    /* ignore */
  }
  try {
    const [u, r] = await Promise.all([
      fetch(`https://api.github.com/users/${USER}`),
      fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`),
    ]);
    if (!u.ok || !r.ok) return;
    const user = await u.json();
    const repos = await r.json();
    const own = repos.filter((x) => !x.fork);
    const count = {};
    own.forEach((x) => x.language && (count[x.language] = (count[x.language] || 0) + 1));
    const d = {
      repos: user.public_repos,
      last: own[0]?.pushed_at || null,
      langs: Object.entries(count)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([k]) => k),
      pushed: Object.fromEntries(own.map((x) => [x.name.toLowerCase(), x.pushed_at])),
    };
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), d }));
    } catch {
      /* ignore */
    }
    publish(d);
  } catch {
    /* offline or blocked, show nothing */
  }
}

export function usePulse() {
  const [d, setD] = useState(data);
  useEffect(() => {
    listeners.add(setD);
    if (!started) {
      started = true;
      load();
    }
    return () => listeners.delete(setD);
  }, []);
  return d;
}

export function ago(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 864e5);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const m = Math.floor(days / 30);
  return m < 12 ? `${m} month${m > 1 ? "s" : ""} ago` : `${Math.floor(m / 12)} yr ago`;
}
