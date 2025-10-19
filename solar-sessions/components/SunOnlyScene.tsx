/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Environment,
  Bvh,
  Billboard,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useState } from "react";
import * as React from "react";
import RecordingModal from "./RecordingModal";
import { useThree } from "@react-three/fiber";

type Props = {
  headline: string;
  onRecordSession: () => void;
};

export default function SunOnlyScene({ headline, onRecordSession }: Props) {
  const [contextLost, setContextLost] = useState(false);
  const [key, setKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const cameraControllerRef = useRef<{ isAnimating: () => boolean } | null>(
    null
  );

  const handleContextLost = () => {
    console.warn("WebGL context lost, attempting to restore...");
    setContextLost(true);
  };

  const handleContextRestored = () => {
    console.log("WebGL context restored");
    setContextLost(false);
    setKey((prev) => prev + 1); // Force re-render
  };

  const handleSunClick = () => {
    // Prevent clicking if already animating or modal is open
    if (
      isAnimating ||
      isModalOpen ||
      (cameraControllerRef.current?.isAnimating() ?? false)
    )
      return;

    setIsAnimating(true);
    setIsZooming(true);
    // Wait for zoom animation to complete before opening modal
    setTimeout(() => {
      setIsModalOpen(true);
      setIsAnimating(false);
    }, 1500); // 1.5 second zoom animation
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsAnimating(true);
    // Start zoom out animation
    setTimeout(() => {
      setIsZooming(false);
      setIsAnimating(false);
    }, 100); // Small delay to ensure modal closes first
  };

  if (contextLost) {
    return (
      <div
        style={{
          height: "100dvh",
          background: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, marginBottom: 16 }}>
            WebGL Context Lost
          </div>
          <div style={{ fontSize: 14, opacity: 0.7 }}>
            Attempting to restore...
          </div>
          <button
            onClick={() => {
              setContextLost(false);
              setKey((prev) => prev + 1);
            }}
            style={{
              marginTop: 16,
              padding: "8px 16px",
              background: "#333",
              color: "white",
              border: "1px solid #555",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>

      {/* Enhanced HUD / overlay */}
      <div
        style={{
          position: "fixed",
          left: "24px",
          top: "104px", // Adjusted to account for navbar height (80px) + some spacing
          color: "white",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          zIndex: 10,
          userSelect: "none",
          background: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          animation: "fadeInUp 0.6s ease-out",
        }}
      >
        <div
          style={{
            opacity: 0.9,
            fontSize: "11px",
            letterSpacing: "2px",
            fontWeight: 600,
            textTransform: "uppercase",
            marginBottom: "8px",
            color: "#ffd27f",
          }}
        >
          Solar Sessions
        </div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "12px",
            background: "linear-gradient(135deg, #ffffff, #ffd27f)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {headline}
        </div>
        <div
          style={{
            marginTop: "12px",
            opacity: 0.8,
            fontSize: "13px",
            lineHeight: "1.5",
            maxWidth: "280px",
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            <span style={{ color: "#4ecdc4", fontWeight: 600 }}>
              No sessions
            </span>{" "}
            recorded today
          </div>
          <div style={{ marginBottom: "8px" }}>
            <span style={{ color: "#ff6b6b", fontWeight: 600 }}>Click</span> the
            sun to start your first session
          </div>
          <div style={{ fontSize: "11px", opacity: 0.6, fontStyle: "italic" }}>
            The sun awaits your emotional journey
          </div>
        </div>
      </div>

      <Canvas
        key={key}
        gl={{
          antialias: false,
          powerPreference: "default",
          failIfMajorPerformanceCaveat: false,
          preserveDrawingBuffer: false,
          alpha: false,
        }}
        camera={{ position: [0, 8, 24], fov: 40, near: 0.1, far: 2000 }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            handleContextLost();
          });
          gl.domElement.addEventListener("webglcontextrestored", () => {
            handleContextRestored();
          });
        }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 10, 2]} intensity={0.8} />
        <Environment preset="sunset" />
        <Stars radius={200} depth={50} factor={2} fade />
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={4}
          maxDistance={80}
          zoomSpeed={0.5}
          enabled={!isZooming}
        />
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>

        <Bvh>
          <SunOnlySystem
            onRecordSession={handleSunClick}
            isZooming={isZooming}
            controllerRef={cameraControllerRef}
          />
        </Bvh>
      </Canvas>

      {/* Recording Modal */}
      <RecordingModal isOpen={isModalOpen} onClose={handleModalClose} />
    </>
  );
}

function SunOnlySystem({
  onRecordSession,
  isZooming,
  controllerRef,
}: {
  onRecordSession: () => void;
  isZooming: boolean;
  controllerRef: React.RefObject<{ isAnimating: () => boolean } | null>;
}) {
  return (
    <group>
      <CameraController isZooming={isZooming} controllerRef={controllerRef} />
      <Sun onClick={onRecordSession} onHover={() => {}} isZooming={isZooming} />
    </group>
  );
}

function CameraController({
  isZooming,
  controllerRef,
}: {
  isZooming: boolean;
  controllerRef: React.RefObject<{ isAnimating: () => boolean } | null>;
}) {
  const { camera } = useThree();
  const animationIdRef = useRef<number | null>(null);
  const animationStateRef = useRef<"idle" | "zooming-in" | "zooming-out">(
    "idle"
  );

  // Expose animation state to parent
  React.useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.isAnimating = () =>
        animationStateRef.current !== "idle";
    }
  }, [controllerRef]);

  React.useEffect(() => {
    // Cancel any existing animation
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }

    if (isZooming && animationStateRef.current !== "zooming-in") {
      // Start zoom-in animation
      animationStateRef.current = "zooming-in";

      const startTime = Date.now();
      const startPosition = camera.position.clone();

      // Calculate target position based on current direction
      const currentDirection = startPosition.clone().normalize();
      const targetDistance = 16; // Distance from sun
      const targetPosition = currentDirection.multiplyScalar(targetDistance);
      targetPosition.y = Math.max(targetPosition.y, 2); // Keep minimum height

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const duration = 1500; // 1.5 seconds
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic

        // Interpolate camera position
        camera.position.lerpVectors(
          startPosition,
          targetPosition,
          easeProgress
        );
        camera.lookAt(0, 0, 0);

        if (progress < 1) {
          animationIdRef.current = requestAnimationFrame(animate);
        } else {
          // Animation complete
          camera.position.copy(targetPosition);
          camera.lookAt(0, 0, 0);
          animationStateRef.current = "idle";
        }
      };

      animate();
    } else if (!isZooming && animationStateRef.current !== "zooming-out") {
      // Start zoom-out animation
      animationStateRef.current = "zooming-out";

      const startTime = Date.now();
      const startPosition = camera.position.clone();

      // Calculate return position based on current direction
      const currentDirection = startPosition.clone().normalize();
      const returnDistance = 24; // Original distance
      const targetPosition = currentDirection.multiplyScalar(returnDistance);
      targetPosition.y = Math.max(targetPosition.y, 8); // Keep original height

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const duration = 1200; // 1.2 seconds
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress = 1 - Math.pow(1 - progress, 3);

        camera.position.lerpVectors(
          startPosition,
          targetPosition,
          easeProgress
        );
        camera.lookAt(0, 0, 0);

        if (progress < 1) {
          animationIdRef.current = requestAnimationFrame(animate);
        } else {
          // Animation complete
          camera.position.copy(targetPosition);
          camera.lookAt(0, 0, 0);
          animationStateRef.current = "idle";
        }
      };

      animate();
    }
  }, [isZooming, camera]);

  // Cleanup effect
  React.useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return null; // This component doesn't render anything
}

function Sun({
  onClick,
  onHover,
  isZooming,
}: {
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
  isZooming: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = clock.getElapsedTime() * 0.15;
  });

  const handlePointerOver = () => {
    setHovered(true);
    onHover?.(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover?.(false);
  };

  // Calculate scale based on zoom state
  const scale = isZooming ? 3 : 1;

  return (
    <group
      onClick={onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh ref={mesh} scale={[scale, scale, scale]}>
        <sphereGeometry args={[1.25, 32, 32]} />
        <meshStandardMaterial
          emissive={"#ffdf80"}
          emissiveIntensity={hovered ? 1.5 : 1.2}
          metalness={0.1}
          roughness={0.5}
          color={hovered ? "#ffed4e" : "#ffd27f"}
        />
      </mesh>

      {/* Enhanced glow effect when hovered or zooming */}
      {(hovered || isZooming) && (
        <mesh scale={[scale, scale, scale]}>
          <sphereGeometry args={[1.3125, 32, 32]} />
          <meshBasicMaterial
            color="#ffd700"
            transparent
            opacity={isZooming ? 0.5 : 0.3}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Floating particles around the sun */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 2.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <FloatingParticle
            key={i}
            position={[x, 0, z]}
            delay={i * 0.1}
            scale={scale}
          />
        );
      })}
    </group>
  );
}

function FloatingParticle({
  position,
  delay,
  scale,
}: {
  position: [number, number, number];
  delay: number;
  scale: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const time = clock.getElapsedTime() + delay;
    mesh.current.position.y = Math.sin(time * 2) * 0.3;
    mesh.current.rotation.y = time * 0.5;
  });

  return (
    <mesh ref={mesh} position={position} scale={[scale, scale, scale]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#ffd700" transparent opacity={0.6} />
    </mesh>
  );
}
