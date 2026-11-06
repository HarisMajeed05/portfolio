// A small synthesized sound set, no audio files. It stays silent until the
// visitor flips the toggle, browsers want a click before any sound anyway.
export const sfx = {
  on: false,
  toggle,
  drive,
  tick: () => blip(1500, 0.05, "sine", 0.05),
  pass: () => sweep(240, 420, 0.3, 0.05),
  chapter: () => {
    blip(330, 0.22, "triangle", 0.05);
    blip(495, 0.3, "triangle", 0.04, 0.09);
  },
  pick: () => blip(920, 0.12, "sine", 0.06),
  open: () => noise(0.35, 400, 2400, 0.05),
  burst: () => {
    noise(0.7, 3200, 500, 0.07);
    blip(70, 0.45, "sine", 0.12);
  },
};

let ctx = null;
let master = null;
let hum = null;
let wind = null;
let buf = null;

function setup() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // low hum, two oscillators a little apart so it beats slowly
  hum = ctx.createGain();
  hum.gain.value = 0.05;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 260;
  [55, 82.6].forEach((f, i) => {
    const o = ctx.createOscillator();
    o.type = i ? "triangle" : "sine";
    o.frequency.value = f;
    o.detune.value = i ? 6 : 0;
    o.connect(lp);
    o.start();
  });
  lp.connect(hum).connect(master);

  // one second of noise, reused for the wind and every whoosh
  buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

  // wind rushes with the scroll speed
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 700;
  bp.Q.value = 0.6;
  wind = ctx.createGain();
  wind.gain.value = 0;
  src.connect(bp).connect(wind).connect(master);
  src.start();
  return true;
}

function toggle() {
  if (!ctx && !setup()) return false;
  sfx.on = !sfx.on;
  ctx.resume?.();
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.linearRampToValueAtTime(sfx.on ? 0.9 : 0, ctx.currentTime + 0.5);
  window.dispatchEvent(new Event("sound-change"));
  if (sfx.on) blip(660, 0.18, "sine", 0.07);
  return sfx.on;
}

// called every frame with the scroll speed in px/s
function drive(speed) {
  if (!sfx.on || !ctx) return;
  const k = Math.min(1, speed / 2600);
  wind.gain.setTargetAtTime(k * 0.06, ctx.currentTime, 0.12);
  hum.gain.setTargetAtTime(0.045 + k * 0.03, ctx.currentTime, 0.2);
}

function env(g, t, dur, peak) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
}

function blip(freq, dur, type, peak, delay = 0) {
  if (!sfx.on || !ctx) return;
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  env(g, t, dur, peak);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function sweep(from, to, dur, peak) {
  if (!sfx.on || !ctx) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "triangle";
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(to, t + dur);
  env(g, t, dur, peak);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.05);
}

// filtered noise that slides from one cutoff to another
function noise(dur, from, to, peak) {
  if (!sfx.on || !ctx) return;
  const t = ctx.currentTime;
  const s = ctx.createBufferSource();
  s.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 1.2;
  f.frequency.setValueAtTime(from, t);
  f.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = ctx.createGain();
  env(g, t, dur, peak);
  s.connect(f).connect(g).connect(master);
  s.start(t);
  s.stop(t + dur + 0.05);
}
