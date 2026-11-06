import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import { ORBITS } from "../data";
import { S, smooth, onScene } from "../scroll";
import { ACCENT, tint3d, useAccent } from "../theme";
import { pickTool, useTool } from "../pick";
import { ORBIT_Z } from "./stage";
import { FONT, useAccentMat } from "./parts";

const RADII = [2.7, 4.0, 5.3];
const TILT = [
  [1.2, 0, 0.25],
  [0.5, 0, -0.6],
  [-0.4, 0, 0.95],
];
const SPEED = [0.22, -0.15, 0.1];

function Orbit({ cfg, r, tilt, speed, k, narrow }) {
  const spin = useRef();
  useAccent();
  const col = tint3d(cfg.color);
  const tool = useTool();
  const line = useMemo(
    () => new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.4, toneMapped: false }),
    [col],
  );
  useFrame((state) => {
    spin.current.rotation.y = state.clock.elapsedTime * speed + S.u[4] * (k % 2 ? -2.4 : 2.4);
  });
  const n = cfg.words.length;
  return (
    <group rotation={tilt}>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={line}>
        <torusGeometry args={[r, 0.014, 6, 200]} />
      </mesh>
      <group ref={spin}>
        {cfg.words.map((w, i) => {
          const a = (i / n) * Math.PI * 2;
          const on = tool === w;
          return (
            <Billboard key={w} position={[Math.cos(a) * r, 0, Math.sin(a) * r]}>
              <mesh
                onClick={(e) => {
                  if (Math.abs(S.c - 4) > 0.3 || !onScene(e)) return;
                  e.stopPropagation();
                  pickTool(w);
                }}
                onPointerOver={(e) => {
                  if (Math.abs(S.c - 4) > 0.3 || !onScene(e)) return;
                  e.stopPropagation();
                  document.documentElement.dataset.scene = on ? "clear" : "show projects";
                }}
                onPointerOut={() => delete document.documentElement.dataset.scene}
              >
                {/* a bigger invisible target, the dot alone is too small to hit */}
                <planeGeometry args={[Math.max(0.9, w.length * 0.2), narrow ? 0.9 : 0.6]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
              </mesh>
              <mesh scale={on ? 2.2 : 1}>
                <circleGeometry args={[0.06, 12]} />
                <meshBasicMaterial color={on ? "#ffffff" : col} toneMapped={false} />
              </mesh>
              <Text
                font={FONT.sans}
                fontSize={narrow ? 0.34 : 0.25}
                color={on ? "#ffffff" : col}
                anchorX="center"
                anchorY="bottom"
                position={[0, 0.14, 0]}
                material-toneMapped={false}
              >
                {w}
              </Text>
            </Billboard>
          );
        })}
      </group>
    </group>
  );
}

export default function Orbits({ narrow }) {
  const root = useRef();
  const core = useRef();
  const inner = useRef();
  const coreMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#ece8df", wireframe: true, transparent: true, opacity: 0.5, toneMapped: false }),
    [],
  );
  const coreHot = useMemo(
    () => new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.9, toneMapped: false }),
    [],
  );
  useAccentMat(coreHot);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const ap = smooth(3.5, 4.0, S.c) * (1 - smooth(4.0, 4.5, S.c));
    root.current.visible = ap > 0.001;
    const s = (narrow ? 0.72 : 0.92) * ap;
    root.current.scale.setScalar(Math.max(0.0001, s));
    root.current.rotation.y = state.pointer.x * 0.35 + S.u[4] * 0.8;
    root.current.rotation.x = -state.pointer.y * 0.2;
    core.current.rotation.set(t * 0.3, t * 0.2, 0);
    inner.current.rotation.set(-t * 0.5, t * 0.35, 0);
  });

  return (
    <group ref={root} position={[0, 0, ORBIT_Z]}>
      <mesh ref={core} material={coreMat}>
        <icosahedronGeometry args={[1.05, 1]} />
      </mesh>
      <mesh ref={inner} material={coreHot}>
        <icosahedronGeometry args={[0.5, 0]} />
      </mesh>
      {ORBITS.map((cfg, k) => (
        <Orbit key={cfg.name} cfg={cfg} r={RADII[k]} tilt={TILT[k]} speed={SPEED[k]} k={k} narrow={narrow} />
      ))}
    </group>
  );
}
