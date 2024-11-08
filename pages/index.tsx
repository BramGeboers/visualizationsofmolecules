import React, { useState, useRef, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader, PlaneGeometry, Mesh } from "three";
import { OrbitControls, Text } from "@react-three/drei";

// Function to perform inversion around point P with radius 1
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

// Möbius Scaling Transformation as per the structure provided
function mobiusScalingTransform(
  z: { real: number; imag: number },
  P: { real: number; imag: number },
  L: number
) {
  const firstInversion = invert(z, P);
  const scaled = scale(firstInversion, L);
  return invert(scaled, P);
}

// MobiusPlane component that applies Möbius scaling transformation to the right image
const MobiusPlane: React.FC<{
  L: number;
  P: { real: number; imag: number };
}> = ({ L, P }) => {
  const texture = useLoader(TextureLoader, "/circles.svg");
  const planeRef = useRef<Mesh>(null);
  const initialPositions = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (planeRef.current) {
      const geometry = planeRef.current.geometry as PlaneGeometry;

      if (!initialPositions.current) {
        initialPositions.current =
          geometry.attributes.position.array.slice() as Float32Array;
      } else {
        geometry.attributes.position.array.set(initialPositions.current);
      }

      geometry.attributes.position.needsUpdate = true;

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
  }, [L, P]);

  return (
    <mesh ref={planeRef} position={[3, 0, 0]}>
      <planeGeometry args={[5, 5, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

// OriginalPlane component for displaying the unscaled original image on the left
const OriginalPlane: React.FC = () => {
  const texture = useLoader(TextureLoader, "/circles.svg");

  return (
    <mesh position={[-3, 0, 0]}>
      <planeGeometry args={[5, 5, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

// Sphere component to represent the point P on the original image
const PointSphere: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <mesh position={[x, y, 0]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={"pink"} />
    </mesh>
  );
};

// Main Index component to render both the original and transformed images side-by-side
const Index: React.FC = () => {
  const [L, setL] = useState(1.0);
  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);

  const P = { real: xPosition, imag: yPosition };

  return (
    <div className="bg-gray-700 w-full h-full">
      <Canvas
        style={{ height: "100vh", width: "100%" }}
        camera={{ position: [0, 0, 10] }}
        shadows
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OriginalPlane />
        <MobiusPlane L={L} P={P} />
        <PointSphere x={xPosition - 3} y={yPosition} />

        {/* Text labels */}
        <Text position={[-3, 3, 0]} fontSize={0.5} color="black">
          Original
        </Text>
        <Text position={[3, 3, 0]} fontSize={0.5} color="black">
          Scaled
        </Text>

        <OrbitControls />
      </Canvas>
      <div className="fixed bottom-4 text-white p-2 rounded-lg flex justify-center w-full">
        <div className="bg-black p-4 flex items-center rounded-xl">
          <input
            className="w-[300px] mr-4"
            type="range"
            min="-10" // Allow negative zoom values
            max="10"
            step="0.01"
            value={L}
            onChange={(e) => setL(parseFloat(e.target.value))}
          />
          <span>Zoom Factor: {L.toFixed(1)}</span>
        </div>
        <div className="bg-black p-4 flex items-center rounded-xl ml-4">
          <input
            className="w-[300px] mr-4"
            type="range"
            min={-5}
            max={5}
            step="0.1"
            value={xPosition}
            onChange={(e) => setXPosition(parseFloat(e.target.value))}
          />
          <span>X Position: {xPosition.toFixed(1)}</span>
        </div>
        <div className="bg-black p-4 flex items-center rounded-xl ml-4">
          <input
            className="w-[300px] mr-4"
            type="range"
            min={-5}
            max={5}
            step="0.1"
            value={yPosition}
            onChange={(e) => setYPosition(parseFloat(e.target.value))}
          />
          <span>Y Position: {yPosition.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
