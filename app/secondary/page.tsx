"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, Text } from "@react-three/drei";
import Navbar from "@/components/Navbar";

// Function to perform inversion around point P with radius 1
function invert(
  z: { x: number; y: number; z: number },
  P: { x: number; y: number; z: number }
) {
  const dx = z.x - P.x;
  const dy = z.y - P.y;
  const dz = z.z - P.z;
  const denominator = dx ** 2 + dy ** 2 + dz ** 2;
  return {
    x: dx / denominator + P.x,
    y: dy / denominator + P.y,
    z: dz / denominator + P.z,
  };
}

// Function to perform uniform scaling by factor L
function scale(z: { x: number; y: number; z: number }, L: number) {
  return {
    x: L * z.x,
    y: L * z.y,
    z: L * z.z, // Apply scaling to the z-axis as well
  };
}

// Möbius Scaling Transformation as per the structure provided
function mobiusScalingTransform(
  z: { x: number; y: number; z: number },
  P: { x: number; y: number; z: number },
  L: number
) {
  const firstInversion = invert(z, P);
  const scaled = scale(firstInversion, Math.pow(2, L)); // Scaling with 2^L
  return invert(scaled, P);
}

const Circle: React.FC<{
  radius: number;
  segments: number;
  center: Array<number>;
  color: string;
  P: { x: number; y: number; z: number };
  L: number;
}> = ({ radius, segments, center, P, L, color }) => {
  const circleRef = useRef<THREE.Line>(null);
  const [centerX, centerY, centerZ] = center;

  // Generate transformed sphere points using the Möbius transformation
  const points = Array.from({ length: segments + 1 }, (_, i) => {
    const theta = (i / segments) * Math.PI; // θ angle in radians (0 to π)
    const phi = (i / segments) * Math.PI * 2; // φ angle in radians (0 to 2π)

    // Convert spherical coordinates (θ, φ) to Cartesian coordinates (x, y, z)
    const originalPoint = {
      x: centerX + radius * Math.sin(theta) * Math.cos(phi),
      y: centerY + radius * Math.sin(theta) * Math.sin(phi),
      z: centerZ + radius * Math.cos(theta),
    };

    const transformedPoint = mobiusScalingTransform(originalPoint, P, L);
    return new THREE.Vector3(
      transformedPoint.x, // x after transformation
      transformedPoint.y, // y after transformation
      transformedPoint.z // z after transformation
    );
  });

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <primitive
      object={
        new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: color }))
      }
      ref={circleRef}
    />
  );
};

const PointSphere: React.FC<{ x: number; y: number; z: number }> = ({
  x,
  y,
  z,
}) => {
  return (
    <mesh position={[x, y, z]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={"pink"} />
    </mesh>
  );
};

const MobiusSphere: React.FC<{
  radius: number;
  segments: number;
  center: Array<number>;
  P: { x: number; y: number; z: number };
  L: number;
  color: string; // Base color prompt
}> = ({ radius, segments, center, P, L, color }) => {
  const sphereRef = useRef<THREE.Mesh>(null);

  // Destructure center for convenience
  const [centerX, centerY, centerZ] = center;

  // Generate vertices and apply Möbius transformations
  const { vertices, uvs, indices } = useMemo(() => {
    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI; // θ angle in radians (0 to π)
      for (let j = 0; j <= segments; j++) {
        const phi = (j / segments) * 2 * Math.PI; // φ angle in radians (0 to 2π)

        // Original spherical coordinates to Cartesian
        const originalPoint = {
          x: centerX + radius * Math.sin(theta) * Math.cos(phi),
          y: centerY + radius * Math.sin(theta) * Math.sin(phi),
          z: centerZ + radius * Math.cos(theta),
        };

        // Apply Möbius scaling transformation
        const transformedPoint = mobiusScalingTransform(originalPoint, P, L);

        // Add transformed vertices
        vertices.push(
          transformedPoint.x,
          transformedPoint.y,
          transformedPoint.z
        );

        // Calculate UV coordinates (for texture mapping)
        uvs.push(j / segments, i / segments);

        // Create indices for triangles
        if (i < segments && j < segments) {
          const a = i * (segments + 1) + j;
          const b = a + segments + 1;

          // Two triangles per quad
          indices.push(a, b, a + 1);
          indices.push(a + 1, b, b + 1);
        }
      }
    }

    return { vertices, uvs, indices };
  }, [radius, segments, centerX, centerY, centerZ, P, L]);

  // Create geometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  // Generate procedural texture
  const texture = useMemo(() => {
    const size = 128; // Texture size
    const data = new Uint8Array(size * size * 3); // RGB format
    const colorInstance = new THREE.Color(color);

    for (let i = 0; i < size * size; i++) {
      const stride = i * 3;
      colorInstance.offsetHSL(0.01, 0, 0); // Add variation in hue for gradient
      data[stride] = colorInstance.r * 255; // Red channel
      data[stride + 1] = colorInstance.g * 255; // Green channel
      data[stride + 2] = colorInstance.b * 255; // Blue channel
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
    texture.needsUpdate = true;
    return texture;
  }, [color]);

  return (
    <mesh ref={sphereRef} geometry={geometry}>
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const TransformedPointSphere: React.FC<{
  x: number;
  y: number;
  z: number;
  P: { x: number; y: number; z: number };
  L: number;
}> = ({ x, y, z, P, L }) => {
  const transformed = mobiusScalingTransform({ x: x, y: y, z: z }, P, L);
  return (
    <mesh position={[transformed.x, transformed.y, transformed.z]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={"yellow"} />
    </mesh>
  );
};

// Main Index component to render both the original and transformed images side-by-side
const Index: React.FC = () => {
  const [L, setL] = useState(0);
  const [xPosition, setXPosition] = useState(1.5);
  const [yPosition, setYPosition] = useState(0);
  const [zPosition, setZPosition] = useState(0); // Added z position for P

  const P = { x: xPosition, y: yPosition, z: zPosition };

  const radius = 1; // Radius of the blue circle
  const segments = 30; // Number of spheres on the circle

  return (
    <div className="bg-[#242424] w-full min-h-[100vh]">
      <Navbar />
      <Canvas
        style={{ height: "80vh", width: "100%" }}
        camera={{ position: [0, 0, 10] }}
      >
        <Circle
          radius={radius}
          segments={1024}
          center={[0, 0, 0]}
          L={L}
          P={P}
          color="blue"
        />

        <directionalLight position={[5, 5, 5]} intensity={1} />

        <PointSphere x={xPosition} y={yPosition} z={zPosition} />

        <MobiusSphere
          radius={1}
          segments={20}
          center={[0, 0, 0]}
          P={P}
          L={L}
          color={"blue"}
        />

        {/* Generate spheres along the blue circle's radius */}
        {/* {Array.from({ length: segments }).map((_, i) => {
          const phi = (i / segments) * Math.PI; // Polar angle
          return Array.from({ length: segments }).map((_, j) => {
            const theta = (j / segments) * 2 * Math.PI; // Azimuthal angle
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            return (
              <TransformedPointSphere
                key={`${i}-${j}`}
                x={x}
                y={y}
                z={z}
                P={P}
                L={L}
              />
            );
          });
        })} */}

        <axesHelper />
        <OrbitControls />
      </Canvas>
      <div className="fixed bottom-0 p-2 rounded-lg flex justify-center w-full text-[#111111]">
        <div className="flex lg:flex-row flex-col lg:gap-12 gap-2">
          <div className="bg-[#DBD8D5] p-4 flex flex-col rounded-md lg:mb-12 mb-3 items-center ">
            <div className="flex justify-between w-full max-w-[300px]">
              <span className="mb-2 flex between">Zoom</span>
              <span>{L.toFixed(2)}</span>
            </div>
            <input
              className="w-[300px] mb-2"
              type="range"
              min="-2"
              max="2"
              step="0.01"
              value={L}
              onChange={(e) => setL(parseFloat(e.target.value))}
              style={{
                appearance: "none",
                height: "8px",
                borderRadius: "8px",
                background: "linear-gradient(to right, #4AC585, #242424)",
                outline: "none",
                opacity: 0.9,
              }}
            />
            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: #242424;
                cursor: pointer;
                box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
              }
            `}</style>
          </div>
          <div className="bg-[#DBD8D5] p-4 flex flex-col rounded-md lg:mb-12 mb-3 items-center ">
            <div className="flex justify-between w-full max-w-[300px]">
              <span className="mb-2 flex between">X</span>
              <span>{xPosition.toFixed(1)}</span>
            </div>
            <input
              className="w-[300px] mb-2"
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={xPosition}
              onChange={(e) => setXPosition(parseFloat(e.target.value))}
              style={{
                appearance: "none",
                height: "8px",
                borderRadius: "8px",
                background: "linear-gradient(to right, #4AC585, #242424)",
                outline: "none",
                opacity: 0.9,
              }}
            />
            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: #242424;
                cursor: pointer;
                box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
