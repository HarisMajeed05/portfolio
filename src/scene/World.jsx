import { Component, Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { S, clamp01 } from "../scroll";
import { pose, END_Z } from "./stage";
import Portrait from "./Portrait";
import Warp from "./Warp";
import Tunnel from "./Tunnel";
import Gallery from "./Gallery";
import Orbits from "./Orbit";

const BG = "#07080b";
const lerp = THREE.MathUtils.lerp;
const damp = THREE.MathUtils.damp;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Flies the camera along the path. Chapter i holds a pose, between two
// chapters it blends them with a small sideways swing so the move has an arc.
function Rig({ wide }) {
  useFrame((state, dt) => {
    const { camera, pointer, size } = state;
    const i = Math.min(5, Math.floor(S.c));
    const t = i === 5 ? 0 : S.c - i;
    const A = pose(i, S.u[i], wide);
    const B = i < 5 ? pose(i + 1, S.u[i + 1], wide) : A;
    const w = ease(t);
    const swing = Math.sin(Math.PI * t) * (i % 2 ? -1 : 1) * (wide ? 4.2 : 2.2);
    const tx = lerp(A.x, B.x, w) + swing + pointer.x * 0.38;
    const ty = lerp(A.y, B.y, w) + pointer.y * 0.22;
    // intro: the camera starts far back and dollies in once the loader lifts
    const since = S.t0 < 0 ? 0 : performance.now() / 1000 - S.t0;
    const e0 = 1 - Math.pow(1 - clamp01(since / 3), 4);
    const open = (1 - e0) * clamp01(1 - S.c * 2);
    const tz = lerp(A.z, B.z, w) + open * (wide ? 11 : 8);
    const k = 9;
    S.camZ = camera.position.z;
    camera.position.x = damp(camera.position.x, tx, k, dt);
    camera.position.y = damp(camera.position.y, ty, k, dt);
    camera.position.z = damp(camera.position.z, tz, k, dt);
    camera.lookAt(camera.position.x - swing * 0.35 - pointer.x * 0.25, camera.position.y * 0.5, camera.position.z - 20);
    camera.rotateZ(Math.sin(Math.PI * t) * (i % 2 ? 1 : -1) * 0.045);

    // with a case study open the scene slides left to clear the drawer
    S.f = damp(S.f, S.focus, 4, dt);
    S.shift = damp(S.shift, lerp(A.shift, B.shift, w) - (wide ? 0.2 * S.f : 0), 6, dt);
    camera.fov = (wide ? 42 : 58) + open * 12;
    camera.setViewOffset(size.width, size.height, -S.shift * size.width, 0, size.width, size.height);
  });
  return null;
}

// colour fringing at the edges grows with scroll speed, so flying feels fast
function Aberrate({ ca }) {
  useFrame(() => {
    if (!ca.current) return;
    const k = Math.min(1, S.speed / 3200) * 0.0024;
    ca.current.offset.set(k, k * 0.7);
  });
  return null;
}

function Ready() {
  useEffect(() => {
    let n = 0;
    let raf;
    const tick = () => {
      if (++n > 3) window.dispatchEvent(new Event("world-ready"));
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return null;
}

const OFFSET = new THREE.Vector2(0, 0);

// Full frame rate only while something moves: the intro, scrolling, the pointer,
// a key. Otherwise the scene keeps breathing at a low rate, and it stops when a
// full screen panel covers it on a phone. Saves battery and keeps weak GPUs cool.
const IDLE_FPS = [12, 20, 30];
function Pace({ q, onActive }) {
  const setFrameloop = useThree((s) => s.setFrameloop);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let last = performance.now();
    let active = true;
    let tick = 0;
    let raf;
    const poke = () => (last = performance.now());
    const evs = ["pointermove", "pointerdown", "wheel", "touchstart", "touchmove", "keydown", "scroll"];
    evs.forEach((e) => addEventListener(e, poke, { passive: true }));
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const intro = S.t0 < 0 || now / 1000 - S.t0 < 4.5;
      const busy = intro || now - last < 2500 || S.speed > 8 || Math.abs(S.focus - S.f) > 0.01;
      if (busy !== active) {
        active = busy;
        setFrameloop(busy ? "always" : "demand");
        onActive(busy);
      }
      if (busy) return;
      const covered = document.documentElement.dataset.modal && matchMedia("(max-width: 760px)").matches;
      if (covered) return;
      if (now - tick >= 1000 / IDLE_FPS[q]) {
        tick = now;
        invalidate();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      evs.forEach((e) => removeEventListener(e, poke));
    };
  }, [q, setFrameloop, invalidate, onActive]);
  return null;
}

// q is the quality tier from the performance monitor: 2 full, 1 lighter, 0 lightest
function Scene({ q }) {
  const size = useThree((s) => s.size);
  const ca = useRef();
  const wide = size.width / size.height > 0.95 && size.width > 760;
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  return (
    <>
      <color attach="background" args={[BG]} />
      <fogExp2 attach="fog" args={[BG, 0.011]} />
      <Rig wide={wide} />
      <Aberrate ca={ca} />
      <Suspense fallback={null}>
        <Warp q={q} />
        <Portrait narrow={!wide} q={q} />
        <Tunnel />
        <Gallery narrow={!wide} />
        <Orbits narrow={!wide} />
        <Portrait end z={END_Z} narrow={!wide} q={q} />
        <Ready />
      </Suspense>
      {/* the lightest tier skips post-processing, it is the most expensive part on weak GPUs */}
      {q > 0 && (
        <EffectComposer multisampling={coarse || q < 2 ? 0 : 4}>
          <Bloom mipmapBlur intensity={0.75} luminanceThreshold={0.42} luminanceSmoothing={0.4} />
          {q > 1 ? <ChromaticAberration ref={ca} offset={OFFSET} radialModulation modulationOffset={0.35} /> : <></>}
          <Vignette eskil={false} offset={0.22} darkness={0.55} />
        </EffectComposer>
      )}
    </>
  );
}

class Guard extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.warn("3D scene unavailable, showing the plain page.", err);
    window.dispatchEvent(new Event("world-ready"));
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function World() {
  const coarse = matchMedia("(pointer: coarse)").matches;
  // ?quality=high or ?quality=low pins the tier and turns the auto tuning off
  const pin = { high: 2, low: 0 }[new URLSearchParams(location.search).get("quality")];
  // start from what the device says about itself, then the monitor tunes it live
  const mem = navigator.deviceMemory || 8;
  const cores = navigator.hardwareConcurrency || 8;
  const guess = mem <= 2 || cores <= 2 ? 0 : coarse || mem < 4 || cores < 4 ? 1 : 2;
  const [q, setQ] = useState(pin ?? guess);
  // the monitor only runs while the scene is at full rate, idle frames would look slow to it
  const [busy, setBusy] = useState(true);
  return (
    <Guard>
      <Canvas
        className="world"
        dpr={q === 2 ? [1, 1.75] : q === 1 ? [1, 1.25] : 0.85}
        camera={{ fov: 42, near: 0.1, far: 520, position: [0, 0, 10] }}
        gl={{ antialias: false, powerPreference: q === 0 ? "default" : "high-performance", alpha: false }}
        eventSource={document.getElementById("root")}
        eventPrefix="client"
      >
        <Pace q={q} onActive={setBusy} />
        {pin === undefined && busy && (
          <PerformanceMonitor
            flipflops={2}
            onDecline={() => setQ((v) => Math.max(0, v - 1))}
            onIncline={() => setQ((v) => Math.min(coarse ? 1 : 2, v + 1))}
            onFallback={() => setQ((v) => Math.min(v, 1))}
          />
        )}
        <Scene q={q} />
      </Canvas>
    </Guard>
  );
}
