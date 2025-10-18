"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sphere, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function SpaceField() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation animation instead of scroll-based
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Distant stars */}
      <Stars
        radius={300}
        depth={60}
        count={2000}
        factor={7}
        saturation={0}
        fade={true}
        speed={0.5}
      />

      {/* Closer star field */}
      <Stars
        radius={100}
        depth={50}
        count={1000}
        factor={4}
        saturation={0}
        fade={true}
        speed={1}
      />

      {/* Nebula-like clouds */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Sphere
          key={i}
          args={[50, 32, 32]}
          position={[
            (Math.random() - 0.5) * 1000,
            (Math.random() - 0.5) * 1000,
            (Math.random() - 0.5) * 1000,
          ]}
        >
          <meshBasicMaterial
            color={new THREE.Color().setHSL(
              0.6 + Math.random() * 0.2,
              0.3 + Math.random() * 0.3,
              0.1 + Math.random() * 0.1
            )}
            transparent
            opacity={0.1 + Math.random() * 0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      ))}

      {/* Floating particles */}
      {Array.from({ length: 200 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000,
          ]}
        >
          <sphereGeometry args={[0.5 + Math.random() * 2, 8, 8]} />
          <meshBasicMaterial
            color={new THREE.Color().setHSL(
              0.5 + Math.random() * 0.3,
              0.5 + Math.random() * 0.5,
              0.7 + Math.random() * 0.3
            )}
            transparent
            opacity={0.3 + Math.random() * 0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function CameraController() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(() => {
    if (cameraRef.current) {
      // Subtle camera movement for dynamic feel
      const time = Date.now() * 0.0005;
      cameraRef.current.position.x = Math.sin(time) * 2;
      cameraRef.current.position.y = Math.cos(time * 0.7) * 1;
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      position={[0, 0, 100]}
      fov={75}
      makeDefault
    />
  );
}

export default function SpaceBackground() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 100], fov: 75 }}
        style={{ width: "100%", height: "100%" }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <CameraController />
        <SpaceField />

        {/* Ambient lighting */}
        <ambientLight intensity={0.1} />

        {/* Point lights for depth */}
        <pointLight position={[100, 100, 100]} intensity={0.3} color="#ffd700" />
        <pointLight position={[-100, -100, -100]} intensity={0.2} color="#ff8c00" />
      </Canvas>
    </div>
  );
}
