import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { ROLES } from "../data";
import { S, hold, smooth, clamp01 } from "../scroll";
import { GATE_Z0, GATE_GAP, GX } from "./stage";
import { Bracket, Tag, FONT, lineMaterial, useAccentMat, PAPER } from "./parts";
import { ACCENT, A, useAccent } from "../theme";

const GW = 7.2;
const GH = 4.3;

function Gate({ role, i, mats }) {
  const g = useRef();
  const frame = useMemo(() => lineMaterial(PAPER, 0.5), []);
  const echo1 = useMemo(() => lineMaterial(PAPER, 0.14), []);
  const echo2 = useMemo(() => lineMaterial(PAPER, 0.07), []);
  const plane = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#07080b", transparent: true, opacity: 0.55, depthWrite: false }),
    [],
  );
  const ping = useMemo(() => lineMaterial(ACCENT, 0), []);
  useAccentMat(ping);
  const accent = useAccent();
  const pingG = useRef();
  const texts = useRef([]);
  useEffect(() => {
    mats.current[i] = { frame, echo1, echo2, plane, g, texts, ping, pingG };
  }, [mats, i, frame, echo1, echo2, plane, ping]);
  const z = GATE_Z0 - GATE_GAP * i;
  const label = `${role.title.split(",")[0]} ${role.conf}`;
  return (
    <group ref={g} position={[GX[i], 0, z]} rotation={[0, 0, (i % 2 ? -1 : 1) * 0.035]}>
      <mesh position={[0, 0, -0.05]} material={plane}>
        <planeGeometry args={[GW, GH]} />
      </mesh>
      <Bracket w={GW} h={GH} len={1.05} thick={0.055} material={frame} />
      <Bracket w={GW * 1.1} h={GH * 1.1} len={0.7} thick={0.03} material={echo1} position={[0, 0, -1.1]} />
      <Bracket w={GW * 1.22} h={GH * 1.22} len={0.5} thick={0.02} material={echo2} position={[0, 0, -2.3]} />
      <group ref={pingG} position={[0, 0, 0.1]}>
        <Bracket w={GW} h={GH} len={1.05} thick={0.035} material={ping} />
      </group>
      <Tag text={label} size={0.17} position={[-GW / 2, GH / 2 + 0.28, 0]} />
      <Text
        ref={(t) => (texts.current[0] = t)}
        font={FONT.serif}
        fontSize={role.big.length > 8 ? 1.05 : 1.45}
        color={PAPER}
        anchorX="center"
        anchorY="middle"
        position={[0, 0.15, 0.05]}
        material-toneMapped={false}
        letterSpacing={-0.01}
      >
        {role.big}
      </Text>
      <Text
        ref={(t) => (texts.current[1] = t)}
        font={FONT.mono}
        fontSize={0.17}
        color={PAPER}
        anchorX="left"
        anchorY="bottom"
        position={[-GW / 2 + 0.35, -GH / 2 + 0.3, 0.05]}
        material-toneMapped={false}
        letterSpacing={0.06}
      >
        {role.time.toUpperCase()}
      </Text>
      <Text
        ref={(t) => (texts.current[2] = t)}
        font={FONT.mono}
        fontSize={0.17}
        color={accent}
        anchorX="right"
        anchorY="bottom"
        position={[GW / 2 - 0.35, -GH / 2 + 0.3, 0.05]}
        material-toneMapped={false}
        letterSpacing={0.06}
      >
        {`0${i + 1} / 0${ROLES.length}`}
      </Text>
    </group>
  );
}

// Boxes drifting along the walls, the kind of thing a document model sees.
const AMBIENT = [
  ["field 0.93", 1.0, -8.5, 2.2, -62, 2.4, 1.1],
  ["checkbox 0.88", -1.0, 9.8, -2.6, -70, 0.9, 0.9],
  ["signature 0.91", 1.0, 11.5, 3.2, -84, 3.2, 1.2],
  ["text 0.95", -1.0, 8.0, 1.2, -92, 2.8, 0.8],
  ["table 0.87", 1.0, 13.0, -2.2, -101, 3.6, 2.2],
  ["field 0.90", -1.0, 12.5, 3.4, -108, 2.0, 1.0],
  ["grain 0.90", 1.0, 9.2, 0.4, -121, 1.0, 1.0],
  ["person 0.97", -1.0, 10.5, -1.4, -128, 1.8, 3.2],
  ["face 0.99", 1.0, 10.8, 2.6, -139, 1.3, 1.5],
  ["text 0.92", -1.0, 12.0, -3.2, -57, 2.6, 0.7],
];

function Ambient() {
  const mat = useMemo(() => lineMaterial(ACCENT, 0.5), []);
  useAccentMat(mat);
  return AMBIENT.map(([label, side, dx, y, z, w, h], i) => (
    <group key={i} position={[side * dx, y, z]} rotation={[0, -side * 0.5, 0]}>
      <Bracket w={w} h={h} len={0.3} thick={0.025} material={mat} />
      <Tag text={label} size={0.12} position={[-w / 2, h / 2 + 0.14, 0]} />
    </group>
  ));
}

// long rails and ribs so the tunnel has a sense of length
function Rails() {
  const rail = useMemo(() => lineMaterial(PAPER, 0.1), []);
  const L = GATE_GAP * (GX.length - 1) + 60;
  const mid = GATE_Z0 - (GATE_GAP * (GX.length - 1)) / 2 - 5;
  const ribs = useMemo(() => {
    const out = [];
    for (let z = GATE_Z0 + 18; z > GATE_Z0 - GATE_GAP * (GX.length - 1) - 25; z -= 8.5) out.push(z);
    return out;
  }, []);
  const ribGeo = useMemo(
    () =>
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-7.6, -4.6, 0),
        new THREE.Vector3(7.6, -4.6, 0),
        new THREE.Vector3(7.6, 4.6, 0),
        new THREE.Vector3(-7.6, 4.6, 0),
      ]),
    [],
  );
  const ribMat = useMemo(() => new THREE.LineBasicMaterial({ color: PAPER, transparent: true, opacity: 0.07 }), []);
  return (
    <group>
      {[
        [-7.6, -4.6],
        [7.6, -4.6],
        [7.6, 4.6],
        [-7.6, 4.6],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, mid]} material={rail}>
          <boxGeometry args={[0.03, 0.03, L]} />
        </mesh>
      ))}
      {ribs.map((z) => (
        <lineLoop key={z} geometry={ribGeo} material={ribMat} position={[0, 0, z]} />
      ))}
    </group>
  );
}

export default function Tunnel() {
  const mats = useRef([]);
  const root = useRef();
  const orange = useMemo(() => new THREE.Color(ACCENT), []);
  const paper = useMemo(() => new THREE.Color(PAPER), []);
  const seen = useRef(A.v);

  useFrame((state) => {
    if (seen.current !== A.v) {
      seen.current = A.v;
      orange.set(ACCENT);
    }
    root.current.visible = S.c > 1.3 && S.c < 3.5;
    const t = state.clock.elapsedTime;
    const p = hold(S.u[2], ROLES.length);
    mats.current.forEach((m, i) => {
      if (!m) return;
      const a = clamp01(1 - Math.abs(p - i) * 1.3);
      // fade out as the camera slides through the gate, so a giant letter never fills the screen
      const near = smooth(0.4, 5.5, S.camZ - (GATE_Z0 - GATE_GAP * i));
      m.frame.color.copy(paper).lerp(orange, a);
      m.frame.opacity = (0.4 + a * 0.6) * near;
      m.echo1.color.copy(paper).lerp(orange, a);
      m.echo1.opacity = (0.1 + a * 0.3) * near;
      m.echo2.color.copy(paper).lerp(orange, a);
      m.echo2.opacity = (0.05 + a * 0.18) * near;
      m.plane.opacity = 0.55 * near;
      const [big, small, num] = m.texts.current;
      if (big) big.fillOpacity = (0.1 + a * 0.9) * near;
      if (small) small.fillOpacity = (0.15 + a * 0.6) * near;
      if (num) num.fillOpacity = (0.15 + a * 0.85) * near;
      const sc = 1 + a * 0.04;
      m.g.current.scale.set(sc, sc, 1);
      // the gate you are at sends out a ping, like a radar locking on
      const ph = (t * 0.55) % 1;
      const grow = 1 + ph * 0.5;
      m.pingG.current.scale.set(grow, grow, 1);
      m.ping.opacity = a > 0.6 ? Math.pow(1 - ph, 2) * 0.6 * near : 0;
    });
  });

  return (
    <group ref={root}>
      <Rails />
      <Ambient />
      {ROLES.map((r, i) => (
        <Gate key={r.big} role={r} i={i} mats={mats} />
      ))}
    </group>
  );
}
