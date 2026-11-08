import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { S, smooth, clamp01, ready } from "../scroll";
import { Bracket, Tag, lineMaterial, useAccentMat } from "./parts";
import { ACCENT, A } from "../theme";
import { sfx } from "../sound";

// my photo, cut out of its background, same size and framing as the original
const SRC = import.meta.env.BASE_URL + "me.webp";
const IMG_W = 768;
const IMG_H = 1024;
// portrait size in world units, 3:4 like the photo
const W = 5.0;
const H = (W * IMG_H) / IMG_W;

function boxBlur(src, w, h, r) {
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  const k = 2 * r + 1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let s = 0;
      for (let d = -r; d <= r; d++) s += src[y * w + Math.min(w - 1, Math.max(0, x + d))];
      tmp[y * w + x] = s / k;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let s = 0;
      for (let d = -r; d <= r; d++) s += tmp[Math.min(h - 1, Math.max(0, y + d)) * w + x];
      out[y * w + x] = s / k;
    }
  }
  return out;
}

// seeded random so the cloud is the same on every load
function rng(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildCloud(img, cols, rows) {
  const rand = rng(7);
  const c = document.createElement("canvas");
  c.width = cols;
  c.height = rows;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, cols, rows);
  const px = ctx.getImageData(0, 0, cols, rows).data;

  // the mask is the cut-out's own alpha, so the particles follow my real outline
  let mask = new Float32Array(cols * rows);
  for (let i = 0; i < mask.length; i++) mask[i] = px[i * 4 + 3] / 255;
  mask = boxBlur(mask, cols, rows, 1);

  const pos = [];
  const sph = [];
  const scat = [];
  const col = [];
  const rnd = [];
  const alp = [];
  const R = 2.3;
  let total = 0;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      if (mask[j * cols + i] * (1 - smooth(0.84, 1.0, j / rows)) >= 0.35) total++;
    }
  }

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const idx = j * cols + i;
      let m = mask[idx];
      // fade out the cut-off at the bottom of the photo
      m *= 1 - smooth(0.84, 1.0, j / rows);
      if (m < 0.35) continue;
      const u = (i + 0.5 + (rand() - 0.5) * 0.9) / cols;
      const v = (j + 0.5 + (rand() - 0.5) * 0.9) / rows;
      const rr = px[idx * 4];
      const gg = px[idx * 4 + 1];
      const bb = px[idx * 4 + 2];
      const lum = (0.2126 * rr + 0.7152 * gg + 0.0722 * bb) / 255;
      // fake depth: brighter and more central pixels sit closer to the camera
      const bulge = Math.exp(-(((u - 0.5) / 0.4) ** 2) - (((v - 0.42) / 0.6) ** 2));
      // kept shallow and mostly from the centre, so tilting never bends my face out of shape
      const z = (bulge * 0.6 + lum * 0.16 - 0.38) * 0.9;
      pos.push((u - 0.5) * W, (0.5 - v) * H, z);

      // every point also gets a slot on an even globe, so the portrait can fold into a sphere
      const k = alp.length + 0.5;
      const phi = Math.acos(1 - (2 * k) / total);
      const th = Math.PI * (1 + Math.sqrt(5)) * k;
      const rad = R * (1 + (rand() - 0.5) * 0.035);
      sph.push(rad * Math.sin(phi) * Math.cos(th), rad * Math.cos(phi), rad * Math.sin(phi) * Math.sin(th));

      const a = rand() * Math.PI * 2;
      const b = Math.acos(2 * rand() - 1);
      const d = 6 + rand() * 7;
      scat.push(d * Math.sin(b) * Math.cos(a), d * Math.sin(b) * Math.sin(a), d * Math.cos(b) * 0.7 + 2);

      // lift mids and the dark jacket so the face and scarf sit closer together
      const tone = (v) => {
        const g = Math.pow(Math.pow(v / 255, 0.78), 2.2) * 2.3;
        return g / (1 + g * 0.5);
      };
      col.push(tone(rr) + 0.03, tone(gg) + 0.045, tone(bb) + 0.075);
      rnd.push(rand(), rand());
      alp.push(Math.min(1, (m - 0.35) / 0.4 + 0.25));
    }
  }
  return {
    pos: new Float32Array(pos),
    sph: new Float32Array(sph),
    scat: new Float32Array(scat),
    col: new Float32Array(col),
    rnd: new Float32Array(rnd),
    alp: new Float32Array(alp),
    count: alp.length,
  };
}

const VERT = /* glsl */ `
  uniform float uTime, uResolve, uMorph, uPR, uSize, uFade, uSpin, uScan, uScanOn;
  uniform float uVel, uBurst, uBurstR, uGlitch, uGlitchY;
  uniform vec3 uPointer, uBurstAt;
  attribute vec3 aSphere, aScatter, aColor;
  attribute vec2 aRand;
  attribute float aAlpha;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vScan;

  mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
  float eio(float x){ return x < .5 ? 4.*x*x*x : 1. - pow(-2.*x + 2., 3.) * .5; }

  void main(){
    float seed = aRand.x;
    float r = clamp(uResolve * 1.7 - seed * .7, 0., 1.);
    r = 1. - pow(1. - r, 4.);
    float m = clamp(uMorph * 1.5 - seed * .5, 0., 1.);
    m = eio(m);

    vec3 sp = aSphere;
    sp.xz = rot(uSpin) * sp.xz;
    vec3 p = mix(position, sp, m);
    float t = sin(m * 3.14159);
    p += t * vec3(sin(uTime*.8 + seed*40.), cos(uTime*.7 + seed*23.), sin(uTime*.6 + seed*13.)) * 1.1;
    p.z += sin(uTime*.9 + position.x*1.7 + position.y*1.3) * .035 * (1. - m);
    p = mix(aScatter, p, r);

    // every few seconds a band of rows slips sideways, like a frame glitching
    float row = floor(position.y * 9.);
    float gb = step(abs(position.y - uGlitchY), .5) * uGlitch * (1. - m) * r;
    p.x += (fract(sin(row * 78.233) * 43758.5453) - .5) * 1.1 * gb;
    p.z += gb * .25;

    // the pointer pushes the dust away, harder and swirlier the faster it moves
    vec2 d = p.xy - uPointer.xy;
    float dist = length(d);
    float f = (1. - smoothstep(0., 1.15, dist)) * (1. - m * .6) * r;
    p.xy += normalize(d + 1e-4) * f * (.34 + uVel * .95);
    p.xy += vec2(-d.y, d.x) / (dist + .15) * f * uVel * .28;
    p.xy += vec2(sin(uTime * 3. + seed * 60.), cos(uTime * 2.6 + seed * 45.)) * f * uVel * .24;
    p.z += f * (.55 + uVel * .7);

    // a click or tap sends a ring outward, the cloud blows apart and settles back
    vec2 bd = p.xy - uBurstAt.xy;
    float ring = exp(-pow((length(bd) - uBurstR) * 1.5, 2.)) * uBurst * r * (1. - m);
    p.xy += normalize(bd + 1e-4) * ring * (.7 + seed) * 1.5;
    p.z += ring * (seed - .25) * 1.8;

    vec4 mv = modelViewMatrix * vec4(p, 1.);
    gl_Position = projectionMatrix * mv;
    // a scanline sweeps down the figure, like a detector reading it
    float sc = (1. - smoothstep(0., .34, abs(position.y - uScan))) * uScanOn * (1. - m);
    vScan = sc;
    gl_PointSize = uSize * uPR * (.72 + aRand.y * .7) * (10. / -mv.z) * (1. + sc * .55);

    vec3 cool = aColor * vec3(.85, 1.05, 1.3) + vec3(.06, .11, .2);
    vColor = mix(aColor, cool, m * .85);
    vAlpha = aAlpha * (.25 + .75 * r) * uFade;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uAccent;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vScan;
  void main(){
    float d = length(gl_PointCoord - .5);
    if (d > .5) discard;
    float a = 1. - smoothstep(.12, .5, d);
    gl_FragColor = vec4(vColor + uAccent * vScan * 1.1, a * vAlpha * (1. + vScan * .8));
    #include <colorspace_fragment>
  }
`;

const toLocal = (px, py) => [(px / IMG_W - 0.5) * W, (0.5 - py / IMG_H) * H];

function Box({ px, label, matRef, tagRef, below }) {
  const [x0, y0] = toLocal(px[0], px[1]);
  const [x1, y1] = toLocal(px[2], px[3]);
  const w = x1 - x0;
  const h = y0 - y1;
  const material = useMemo(() => lineMaterial(ACCENT, 0), []);
  useAccentMat(material);
  useEffect(() => {
    matRef.current = material;
  }, [matRef, material]);
  return (
    <group position={[(x0 + x1) / 2, (y0 + y1) / 2, 0.6]}>
      <Bracket w={w} h={h} len={0.34} thick={0.024} material={material} />
      <group ref={tagRef} position={[-w / 2, below ? -h / 2 - 0.16 : h / 2 + 0.16, 0]}>
        <Tag text={label} size={0.12} />
      </group>
    </group>
  );
}

// `end` is the second copy that closes the page: same cloud, resolves again
// when the camera arrives at the contact chapter.
export default function Portrait({ end = false, z = 0, narrow, q = 2 }) {
  const img = useLoader(THREE.ImageLoader, SRC);
  const size = useThree((s) => s.size);
  const group = useRef();
  const personMat = useRef();
  const faceMat = useRef();
  const personTag = useRef();
  const faceTag = useRef();
  const light = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  // pointer state for the scatter: where it was, how fast it moves, the last click
  const ptr = useRef({ moved: false, x: 0, y: 0, vel: 0, burstAt: -9, nx: 0, ny: 0, fresh: false });
  const seen = useRef(A.v);
  const born = useRef(-1);

  // fewer points on phones and weak GPUs
  // points are cheap, so the portrait stays dense everywhere, phones and the lightest tier thin it a little
  const [cols, rows] = q === 0 || light ? [160, 214] : [210, 280];
  const cloud = useMemo(() => buildCloud(img, cols, rows), [img, cols, rows]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uResolve: { value: 0 },
          uMorph: { value: 0 },
          uPR: { value: 1 },
          uSize: { value: 3.4 },
          uFade: { value: 1 },
          uSpin: { value: 0 },
          uScan: { value: -99 },
          uScanOn: { value: 0 },
          uPointer: { value: new THREE.Vector3(99, 99, 0) },
          uVel: { value: 0 },
          uBurst: { value: 0 },
          uBurstR: { value: 0 },
          uBurstAt: { value: new THREE.Vector3(99, 99, 0) },
          uGlitch: { value: 0 },
          uGlitchY: { value: 0 },
          uAccent: { value: new THREE.Color(ACCENT) },
        },
      }),
    [],
  );
  const uniforms = material.uniforms;

  // the first portrait is done loading, the loader ticks it off its list
  useEffect(() => {
    if (!end) ready("portrait");
  }, [end, cloud]);

  // a click or tap on the figure blows the cloud apart, it settles back by itself
  useEffect(() => {
    const onDown = (e) => {
      if (e.target.closest?.("a,button,input,textarea,[role=dialog]") || document.documentElement.dataset.modal) return;
      const here = end ? S.c > 4.6 : S.c < 0.6;
      if (!here) return;
      ptr.current.burstAt = performance.now() / 1000;
      ptr.current.nx = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.current.ny = -(e.clientY / window.innerHeight) * 2 + 1;
      ptr.current.fresh = true;
      sfx.burst();
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [end]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    uniforms.uTime.value = t;
    uniforms.uPR.value = state.gl.getPixelRatio();
    // fewer points get bigger ones, so the figure always reads as a solid picture
    uniforms.uSize.value = 2.8 * (210 / cols) * Math.min(1.5, Math.max(0.62, size.height / 900)) * (narrow ? 0.85 : 1);
    uniforms.uSpin.value = t * 0.22;
    // one pass every few seconds, top to bottom, then a pause
    const ph = (t * 0.2) % 1.7;
    uniforms.uScan.value = ph < 1 ? H / 2 - ph * H : -99;
    // the glitch: 0.35s every 8s, at a different height each time
    const gp = (t + 4) % 8;
    uniforms.uGlitch.value = S.reduced || gp > 0.35 ? 0 : Math.sin((Math.PI * gp) / 0.35);
    uniforms.uGlitchY.value = Math.sin(Math.floor((t + 4) / 8) * 12.9898) * H * 0.32;

    let resolve;
    let morph = 0;
    let visible = true;
    if (end) {
      resolve = smooth(4.25, 4.95, S.c);
      visible = S.c > 3.9;
    } else {
      // starts when the loader lifts, so you watch the face assemble
      // if the 3D arrives after the loader lifted, the fly-in starts when it arrives
      if (born.current < 0) born.current = performance.now() / 1000;
      const from = Math.max(S.t0, born.current);
      resolve = S.t0 < 0 ? 0 : clamp01((performance.now() / 1000 - from - 0.15) / 3.4);
      morph = smooth(0.05, 0.95, S.c);
      visible = S.c < 2.3;
    }
    g.visible = visible;
    uniforms.uResolve.value = resolve;
    uniforms.uMorph.value = morph;
    // on phones the closing portrait sits behind the heading, keep it soft
    uniforms.uFade.value = end ? (narrow ? 0.6 : 1) : 1 - smooth(1.7, 2.2, S.c);
    uniforms.uScanOn.value = clamp01((resolve - 0.9) / 0.1);

    // pointer, projected onto the portrait plane, in the group's own space
    const cam = state.camera;
    const dist = Math.abs(cam.position.z - z);
    const vh = 2 * dist * Math.tan((cam.fov * Math.PI) / 360);
    const vw = vh * (size.width / size.height);
    const project = (nx, ny) => [
      ((nx - 2 * S.shift) * (vw / 2) + cam.position.x - g.position.x) / g.scale.x,
      ((ny * (vh / 2)) + cam.position.y - g.position.y) / g.scale.x,
    ];
    const P = ptr.current;
    const [lx, ly] = project(state.pointer.x, state.pointer.y);
    // before the first real move the pointer sits at 0,0, keep it out of the way
    if (!P.moved && (Math.abs(state.pointer.x) > 0.001 || Math.abs(state.pointer.y) > 0.001)) P.moved = true;
    if (P.moved) {
      // speed comes from the pointer itself, so the camera drifting does not count
      const speed = Math.hypot(state.pointer.x - P.x, state.pointer.y - P.y) / Math.max(dt, 0.001);
      P.vel += (Math.min(1, speed / 3.2) - P.vel) * Math.min(1, dt * 7);
      P.x = state.pointer.x;
      P.y = state.pointer.y;
      uniforms.uPointer.value.set(lx, ly, 0);
    }
    uniforms.uVel.value = P.vel;
    if (P.fresh) {
      const [bx, by] = project(P.nx, P.ny);
      uniforms.uBurstAt.value.set(bx, by, 0);
      P.fresh = false;
    }
    const since = performance.now() / 1000 - P.burstAt;
    uniforms.uBurstR.value = since * 4.2;
    uniforms.uBurst.value = since < 1.8 ? Math.pow(1 - since / 1.8, 2) : 0;
    if (seen.current !== A.v) {
      seen.current = A.v;
      uniforms.uAccent.value.set(ACCENT);
    }

    // sway toward the pointer, a cheap parallax that sells the depth
    const ty = state.pointer.x * 0.28;
    const tx = -state.pointer.y * 0.14;
    g.rotation.y += (ty - g.rotation.y) * Math.min(1, dt * 3);
    g.rotation.x += (tx - g.rotation.x) * Math.min(1, dt * 3);

    // detection boxes, drawn once the figure has formed
    const boxes = clamp01((resolve - 0.82) / 0.14) * (1 - smooth(0.03, 0.22, morph));
    if (personMat.current) personMat.current.opacity = boxes;
    if (faceMat.current) faceMat.current.opacity = boxes;
    if (personTag.current) personTag.current.visible = boxes > 0.7;
    if (faceTag.current) faceTag.current.visible = boxes > 0.85;
  });

  const scale = narrow ? (end ? 0.5 : 0.68) : 1;
  const y = narrow ? (end ? 3.9 : 3.0) : 0;

  return (
    <group ref={group} position={[0, y, z]} scale={scale}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[cloud.pos, 3]} />
          <bufferAttribute attach="attributes-aSphere" args={[cloud.sph, 3]} />
          <bufferAttribute attach="attributes-aScatter" args={[cloud.scat, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[cloud.col, 3]} />
          <bufferAttribute attach="attributes-aRand" args={[cloud.rnd, 2]} />
          <bufferAttribute attach="attributes-aAlpha" args={[cloud.alp, 1]} />
        </bufferGeometry>
        <primitive object={material} attach="material" />
      </points>
      <Box px={[150, 126, 636, 1012]} label="person" matRef={personMat} tagRef={personTag} />
      <Box px={[268, 126, 466, 398]} label="face" matRef={faceMat} tagRef={faceTag} below />
    </group>
  );
}
