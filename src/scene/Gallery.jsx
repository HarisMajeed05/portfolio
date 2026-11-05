import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PROJECTS } from "../data";
import { S, hold, smooth, clamp01, goToProgress } from "../scroll";
import { RING_Z, RING_R } from "./stage";
import { makeCardTexture, CARD_W, CARD_H } from "./cards";

const N = PROJECTS.length;
const STEP = (Math.PI * 2) / N;
const CW = 4.1;
const CH = (CW * CARD_H) / CARD_W;

function Card({ p, i, tex, hover, narrow }) {
  const wrap = useRef();
  const mesh = useRef();
  const mat = useRef();

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const pos = hold(S.u[3], N);
    const act = clamp01(1 - Math.abs(pos - i) * 1.15);
    const ap = smooth(2.45 + i * 0.012, 2.95 + i * 0.012, S.c) * (1 - smooth(3.02, 3.45, S.c));
    const hov = hover.current === i ? 1 : 0;
    const k = 0.62 + act * 0.38 + hov * 0.12;
    mat.current.color.setScalar(k);
    const s = ap * (0.9 + act * 0.1 + hov * 0.04) * (narrow ? 1.04 : 1);
    wrap.current.scale.setScalar(Math.max(0.0001, s));
    wrap.current.rotation.x = (1 - ap) * 0.9;
    wrap.current.position.y = Math.sin(t * 0.7 + i * 1.7) * 0.07;
    // the active card leans toward the pointer
    const tx = act * -state.pointer.y * 0.12;
    const ty = act * state.pointer.x * 0.16;
    mesh.current.rotation.x += (tx - mesh.current.rotation.x) * Math.min(1, dt * 4);
    mesh.current.rotation.y += (ty - mesh.current.rotation.y) * Math.min(1, dt * 4);
  });

  const a = i * STEP;
  return (
    <group position={[Math.sin(a) * RING_R, 0, -Math.cos(a) * RING_R]} rotation={[0, -a, 0]}>
      <group ref={wrap}>
        <mesh
          ref={mesh}
          onPointerOver={(e) => {
            if (Math.abs(S.c - 3) > 0.12) return;
            e.stopPropagation();
            hover.current = i;
            // the reticle reads this and labels itself
            const front = Math.round(hold(S.u[3], N)) === i;
            document.documentElement.dataset.hit = !front ? "turn here" : p.href ? "open repo" : "no public repo";
          }}
          onPointerOut={() => {
            if (hover.current === i) hover.current = -1;
            delete document.documentElement.dataset.hit;
          }}
          onClick={(e) => {
            if (Math.abs(S.c - 3) > 0.12) return;
            if (e.nativeEvent.target.closest?.("a,button")) return;
            const pos = Math.round(hold(S.u[3], N));
            if (pos === i) {
              if (p.href) window.open(p.href, "_blank", "noopener");
            } else goToProgress(3, i / (N - 1));
          }}
        >
          <planeGeometry args={[CW, CH]} />
          <meshBasicMaterial ref={mat} map={tex} toneMapped={false} transparent />
        </mesh>
      </group>
    </group>
  );
}

export default function Gallery({ narrow }) {
  const root = useRef();
  const ring = useRef();
  const hover = useRef(-1);
  const [tex, setTex] = useState(null);

  useEffect(() => {
    let alive = true;
    const aniso = 8;
    Promise.all([
      document.fonts.load('76px "Instrument Serif"'),
      document.fonts.load('500 22px "Geist Mono"'),
    ])
      .catch(() => {})
      .then(() => {
        if (alive) setTex(PROJECTS.map((p, i) => makeCardTexture(p, i, N, aniso)));
      });
    return () => {
      alive = false;
    };
  }, []);

  const lineMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#ece8df", transparent: true, opacity: 0.16, toneMapped: false }),
    [],
  );
  const tickMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ff5b2e", toneMapped: false }), []);

  useFrame(() => {
    root.current.visible = S.c > 2.3 && S.c < 3.6;
    ring.current.rotation.y = hold(S.u[3], N) * STEP;
  });

  return (
    <group ref={root} position={[0, 0, RING_Z]}>
      <group ref={ring}>
        {[-3.1, 3.1].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={lineMat}>
            <torusGeometry args={[RING_R, 0.012, 6, 180]} />
          </mesh>
        ))}
        {Array.from({ length: N }, (_, i) => (
          <mesh
            key={i}
            position={[Math.sin(i * STEP) * RING_R, -3.1, -Math.cos(i * STEP) * RING_R]}
            rotation={[0, -i * STEP, 0]}
            material={tickMat}
          >
            <boxGeometry args={[0.5, 0.06, 0.06]} />
          </mesh>
        ))}
        {tex && PROJECTS.map((p, i) => <Card key={p.title} p={p} i={i} tex={tex[i]} hover={hover} narrow={narrow} />)}
      </group>
    </group>
  );
}
