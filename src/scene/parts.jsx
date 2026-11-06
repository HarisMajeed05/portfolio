import { useEffect, useMemo } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { useAccent } from "../theme";
import MONO from "@fontsource/geist-mono/files/geist-mono-latin-500-normal.woff?url";
import SERIF from "@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff?url";
import SANS from "@fontsource/geist-sans/files/geist-sans-latin-500-normal.woff?url";

export const FONT = { mono: MONO, serif: SERIF, sans: SANS };
export const PAPER = "#ece8df";
export const ICE = "#8fd8ff";

// Four corner brackets, the way a detector draws a box. One merged mesh.
export function Bracket({ w, h, len = 0.35, thick = 0.022, material, ...rest }) {
  const geo = useMemo(() => {
    const parts = [];
    const bar = (bw, bh, x, y) => {
      const g = new THREE.BoxGeometry(bw, bh, thick);
      g.translate(x, y, 0);
      parts.push(g);
    };
    const hx = w / 2;
    const hy = h / 2;
    const l = Math.min(len, w / 2, h / 2);
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        bar(l, thick, sx * (hx - l / 2), sy * hy);
        bar(thick, l, sx * hx, sy * (hy - l / 2));
      }
    }
    const merged = mergeGeometries(parts);
    parts.forEach((p) => p.dispose());
    return merged;
  }, [w, h, len, thick]);
  return <mesh geometry={geo} material={material} {...rest} />;
}

// keeps a material on the accent when the visitor switches colour
export function useAccentMat(mat) {
  const hex = useAccent();
  useEffect(() => {
    mat.color.set(hex);
  }, [mat, hex]);
}

// The little filled label a detector puts on a box: "person 0.98"
export function Tag({ text, size = 0.13, color, ink = "#0a0a0a", ...rest }) {
  const accent = useAccent();
  color = color ?? accent;
  const w = text.length * size * 0.62 + size * 1.5;
  const h = size * 1.9;
  return (
    <group {...rest}>
      <mesh position={[w / 2, 0, 0]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <Text
        font={MONO}
        fontSize={size}
        color={ink}
        anchorX="left"
        anchorY="middle"
        position={[size * 0.75, 0, 0.01]}
        material-toneMapped={false}
      >
        {text}
      </Text>
    </group>
  );
}

export function lineMaterial(color, opacity = 1) {
  return new THREE.MeshBasicMaterial({ color, transparent: true, opacity, toneMapped: false, depthWrite: false });
}
