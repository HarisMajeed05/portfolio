import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { S, clamp01 } from "../scroll";

const COUNT = 2600;
const LEN = 380;

const VERT = /* glsl */ `
  uniform float uCamZ, uStreak, uLen;
  attribute float aEnd;
  attribute float aRand;
  varying float vA;
  varying vec3 vC;
  void main(){
    float zz = mod(position.z - uCamZ, uLen) - uLen;
    vec3 p = vec3(position.xy, uCamZ + zz);
    p.z += aEnd * (.14 + uStreak * (.35 + aRand));
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    gl_Position = projectionMatrix * mv;
    float d = -zz;
    vA = smoothstep(6., 40., d) * (1. - smoothstep(uLen * .25, uLen * .95, d)) * (.22 + aRand * .5);
    vC = aRand > .9 ? vec3(1., .36, .18) : (aRand < .25 ? vec3(.56, .85, 1.) : vec3(.93, .91, .87));
  }
`;
const FRAG = /* glsl */ `
  varying float vA;
  varying vec3 vC;
  void main(){
    gl_FragColor = vec4(vC, vA);
    #include <colorspace_fragment>
  }
`;

// Dust that fills the whole flight path. It stays put in the world, so you read
// your own speed from it, and it stretches into streaks when you scroll fast.
export default function Warp() {
  const { geometry, material } = useMemo(() => {
    const pos = new Float32Array(COUNT * 2 * 3);
    const end = new Float32Array(COUNT * 2);
    const rnd = new Float32Array(COUNT * 2);
    let a = 12345;
    const r = () => {
      a = (a * 1664525 + 1013904223) % 4294967296;
      return a / 4294967296;
    };
    for (let i = 0; i < COUNT; i++) {
      const ang = r() * Math.PI * 2;
      const rad = 3.6 + Math.sqrt(r()) * 44;
      const x = Math.cos(ang) * rad * 1.35;
      const y = Math.sin(ang) * rad * 0.8;
      const z = r() * LEN;
      const k = r();
      for (let v = 0; v < 2; v++) {
        const o = (i * 2 + v) * 3;
        pos[o] = x;
        pos[o + 1] = y;
        pos[o + 2] = z;
        end[i * 2 + v] = v;
        rnd[i * 2 + v] = k;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aEnd", new THREE.BufferAttribute(end, 1));
    g.setAttribute("aRand", new THREE.BufferAttribute(rnd, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uCamZ: { value: 0 }, uStreak: { value: 0 }, uLen: { value: LEN } },
    });
    return { geometry: g, material: m };
  }, []);
  const uniforms = material.uniforms;

  useFrame((state) => {
    uniforms.uCamZ.value = state.camera.position.z;
    uniforms.uStreak.value = clamp01(S.speed / 3000) * 13;
  });

  return (
    <lineSegments geometry={geometry} frustumCulled={false}>
      <primitive object={material} attach="material" />
    </lineSegments>
  );
}
