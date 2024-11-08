import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PlaneGeometry, Mesh, ShaderMaterial, Color, GridHelper } from "three";
import { OrbitControls } from "@react-three/drei";

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

// Möbius Scaling Transformation
function mobiusScalingTransform(
  z: { real: number; imag: number },
  P: { real: number; imag: number },
  L: number
) {
  const firstInversion = invert(z, P);
  const scaled = scale(firstInversion, L);
  return invert(scaled, P);
}

// MobiusPlane component that applies Möbius scaling transformation and renders an orthogonal grid
const MobiusPlane: React.FC<{
  L: number;
  P: { real: number; imag: number };
}> = ({ L, P }) => {
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

  // Shader material for the infinite orthogonal grid
  const gridMaterial = new ShaderMaterial({
    uniforms: {
      color: { value: new Color("black") }, // Set the line color to black
      lineWidth: { value: 1 }, // Adjust line width as needed
      scale: { value: 400 }, // Controls the density of the grid
    },
    vertexShader: `
      varying vec2 vUv;
      uniform float scale;
      void main() {
        vUv = uv * scale;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float lineWidth;
      uniform vec3 color;
      void main() {
        vec2 grid = abs(fract(vUv - 0.5) - 0.5) / fwidth(vUv);
        float line = min(grid.x, grid.y);
        float alpha = 1.0 - smoothstep(lineWidth, lineWidth + 0.01, line);
        if (alpha < 0.5) discard; // Make spaces between lines transparent
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    transparent: true,
  });

  return (
    <mesh ref={planeRef} position={[0, 0, 0]} material={gridMaterial}>
      <planeGeometry args={[10, 10, 4096, 4096]} />
    </mesh>
  );
};

// Sphere component to represent the point P on the original image
const PointSphere: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <mesh position={[x, y, 0]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={"red"} transparent={true} opacity={0.5} />
    </mesh>
  );
};

const PointSphere2: React.FC = () => {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={"white"} transparent={true} opacity={0.5} />
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
        camera={{ position: [0, 4, 10] }}
        shadows
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <MobiusPlane L={L} P={P} />
        <PointSphere x={xPosition} y={yPosition} />
        <PointSphere2 />
        <OrbitControls />
      </Canvas>
      <div className="fixed bottom-4 text-white p-2 rounded-lg flex justify-center w-full">
        <div className="bg-black p-4 flex items-center rounded-xl">
          <input
            className="w-[300px] mr-4"
            type="range"
            min="-100"
            max="100"
            step="0.1"
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
