import React, { useRef, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader, PlaneGeometry, Mesh } from "three";
import { OrbitControls } from "@react-three/drei";

// Function to perform inversion around point P = (1, 0) with radius 1
function invert(
  z: { real: number; imag: number },
  P: { real: number; imag: number }
) {
  const dx = z.real - P.real;
  const dy = z.imag - P.imag;
  const denominator = dx ** 2 + dy ** 2;
  return {
    real: dx / denominator + P.real,
    imag: dy / denominator + P.imag,
  };
}

// Function to perform uniform scaling by factor L
function scale(z: { real: number; imag: number }, L: number) {
  return {
    real: L * z.real,
    imag: L * z.imag,
  };
}

// Möbius Scaling Transformation as per given structure
function mobiusScalingTransform(
  z: { real: number; imag: number },
  P: { real: number; imag: number },
  L: number
) {
  // First inversion around point P
  const firstInversion = invert(z, P);

  // Scaling
  const scaled = scale(firstInversion, L);

  // Second inversion around point P
  return invert(scaled, P);
}

interface MobiusPlaneProps {
  L: number; // Scaling factor
}

// MobiusPlane component with Möbius scaling transformation applied to a 2D plane
const MobiusPlane: React.FC<MobiusPlaneProps> = ({ L }) => {
  const texture = useLoader(TextureLoader, "/IMG102.jpg");
  const planeRef = useRef<Mesh>(null);
  const initialPositions = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (planeRef.current) {
      const geometry = planeRef.current.geometry as PlaneGeometry;

      // Save initial positions if not already saved
      if (!initialPositions.current) {
        initialPositions.current =
          geometry.attributes.position.array.slice() as Float32Array;
      } else {
        // Reset geometry to initial positions
        geometry.attributes.position.array.set(initialPositions.current);
      }

      geometry.attributes.position.needsUpdate = true;

      // Center of inversion (P = (1, 0))
      const P = { real: 1, imag: 0 };

      for (let i = 0; i < geometry.attributes.position.count; i++) {
        const x = geometry.attributes.position.getX(i);
        const y = geometry.attributes.position.getY(i);

        const z = { real: x, imag: y };
        const transformed = mobiusScalingTransform(z, P, L);

        geometry.attributes.position.setXY(
          i,
          transformed.real,
          transformed.imag
        );
      }
    }
  }, [L]);

  return (
    <mesh ref={planeRef} rotation={[-Math.PI / 4, 0, 0]}>
      <planeGeometry args={[5, 5, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

interface ModelViewerProps {
  L: number;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ L }) => {
  return (
    <Canvas
      style={{ height: "100vh", width: "100%" }}
      camera={{ position: [0, 0, 5] }}
      shadows
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <MobiusPlane L={L} />
      <OrbitControls />
      <gridHelper
        args={[10, 10]}
        position={[0, 0, 0]}
        rotation={[Math.PI / 4, 0, 0]}
      />
    </Canvas>
  );
};

export default MobiusPlane;
