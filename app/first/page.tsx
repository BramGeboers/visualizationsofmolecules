"use client";
import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, Text } from "@react-three/drei";
import Navbar from "@/components/Navbar";
import Circle2D from "@/components/Circle2D";
import { mobiusScalingTransform } from "@/utils/transformation";
import MobiusPlane from "@/components/MobiusPlane";

// Function to perform inversion around point P with radius 1
const CircleUnaffected: React.FC<{
  radius: number;
  segments: number;
  center: Array<number>;
  color: string;
}> = ({ radius, segments, center, color }) => {
  const circleRef = useRef<THREE.Line>(null);
  const [centerX, centerY] = center;

  // Generate points for the circle (without transformation)
  const points = Array.from({ length: segments + 1 }, (_, i) => {
    const angle = (i / segments) * Math.PI * 2; // Angle in radians
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return new THREE.Vector3(x, y, 0); // z = 0 for a 2D circle
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

// Sphere component to represent the point P on the original image
const PointSphere: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <mesh position={[x, y, 0]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={"pink"} />
    </mesh>
  );
};

// Sphere component to represent a point on the circle, transformed by Möbius
const TransformedPointSphere: React.FC<{
  x: number;
  y: number;
  P: { x: number; y: number; z: number };
  L: number;
}> = ({ x, y, P, L }) => {
  const transformed = mobiusScalingTransform({ x: x, y: y, z: 0 }, P, L);
  return (
    <mesh position={[transformed.x, transformed.y, 0]}>
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

  const P = { x: xPosition, y: yPosition, z: 0 };

  const radius = 1; // Radius of the blue circle
  const segments = 8; // Number of spheres on the circle

  return (
    <div className="bg-[#242424] w-full min-h-[100vh]">
      <Navbar />
      <Canvas
        orthographic
        style={{ height: "100vh", width: "100%" }}
        camera={{ position: [0, 0, 10], zoom: 40 }}
      >
        <Circle2D
          radius={radius}
          segments={1024}
          center={[0, 0]}
          L={L}
          P={P}
          color="blue"
          mobiusScalingTransform={mobiusScalingTransform}
        />
        <Circle2D
          radius={radius}
          segments={1024}
          center={[3, 0]}
          L={L}
          P={P}
          color="gray"
          mobiusScalingTransform={mobiusScalingTransform}
        />
        {/* <CircleUnaffected
          radius={1.5}
          segments={1024}
          center={[1.5, 0]}
          color="red"
        /> */}
        <MobiusPlane
          L={L}
          P={P}
          lineWidth={0.5}
          density={30}
          size={10}
          resolution={512}
        />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <PointSphere x={xPosition} y={yPosition} />
        <PointSphere x={0} y={0} />
        {/* Generate spheres along the blue circle's radius */}
        {Array.from({ length: segments }).map((_, i) => {
          const angle = (i / segments) * Math.PI * 2;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          return <TransformedPointSphere key={i} x={x} y={y} P={P} L={L} />;
        })}
        {/* Text labels */}
        {/* <Text position={[-3, 3, 0]} fontSize={0.5} color="black">
          Original
        </Text>
        <Text position={[3, 3, 0]} fontSize={0.5} color="black">
          Scaled
        </Text> */}
        {/* <axesHelper /> */}
        <OrbitControls
          enableRotate={false} // Disable rotation
          enableZoom={true} // Disable zoom (optional, if needed)
          enablePan={true} // Allow panning
        />
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
              min="-3"
              max="3"
              step="0.01"
              value={L}
              onChange={(e) => setL(parseFloat(e.target.value))}
              style={{
                appearance: "none",
                height: "8px",
                borderRadius: "8px",
                background: "linear-gradient(to right, #4AC585, #242424)", // Static gradient from green to dark
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
                background: "linear-gradient(to right, #4AC585, #242424)", // Static gradient from green to dark
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
          <div className="bg-[#DBD8D5] p-4 flex flex-col rounded-md lg:mb-12 mb-4 items-center ">
            <div className="flex justify-between w-full max-w-[300px]">
              <span className="mb-2 flex between">Y</span>
              <span>{yPosition.toFixed(1)}</span>
            </div>
            <input
              className="w-[300px] mb-2"
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={yPosition}
              onChange={(e) => setYPosition(parseFloat(e.target.value))}
              style={{
                appearance: "none",
                height: "8px",
                borderRadius: "8px",
                background: "linear-gradient(to right, #4AC585, #242424)", // Static gradient from green to dark
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
