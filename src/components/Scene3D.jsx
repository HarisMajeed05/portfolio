import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// A field of points that drift like a scanning point-cloud, with a few
// connecting lines that flicker on/off like a live detection graph.
// Reacts subtly to pointer position for parallax depth.
// Kept deliberately lightweight (low point count, capped dpr, no
// per-frame material mutation) since this renders behind live text
// and animation, it must never compete with the main thread.
function ParticleField() {
  const pointsRef = useRef();
  const linesRef = useRef();
  const { mouse } = useThree();

  const COUNT = 150;
  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, []);

  const linePositions = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < 24; i++) {
      const a = Math.floor(Math.random() * COUNT);
      const b = Math.floor(Math.random() * COUNT);
      pairs.push(
        positions[a * 3], positions[a * 3 + 1], positions[a * 3 + 2],
        positions[b * 3], positions[b * 3 + 1], positions[b * 3 + 2]
      );
    }
    return new Float32Array(pairs);
  }, [positions]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const rotY = t * 0.02 + mouse.x * 0.15;
    const rotX = mouse.y * 0.08;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = rotY;
      pointsRef.current.rotation.x = rotX;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = rotY;
      linesRef.current.rotation.x = rotX;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.045} color="#a6ff00" transparent opacity={0.55} sizeAttenuation />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#33c7ff" transparent opacity={0.16} />
      </lineSegments>
    </group>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        dpr={1}
        frameloop="always"
      >
        <ParticleField />
        <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.8}>
          <mesh position={[3.2, 1.4, -1]}>
            <boxGeometry args={[1.1, 0.75, 0.5]} />
            <meshBasicMaterial color="#a6ff00" wireframe transparent opacity={0.22} />
          </mesh>
        </Float>
        <Float speed={0.9} rotationIntensity={0.4} floatIntensity={0.6}>
          <mesh position={[-4.6, 2, -2.5]}>
            <boxGeometry args={[0.7, 0.7, 0.35]} />
            <meshBasicMaterial color="#33c7ff" wireframe transparent opacity={0.18} />
          </mesh>
        </Float>
      </Canvas>
    </div>
  );
}
