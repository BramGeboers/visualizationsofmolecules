"use client";
import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, Text } from "@react-three/drei";
import Navbar from "@/components/Navbar";
import Circle2D from "@/components/Circle2D";
import PointSphere from "@/components/PointSphere";
import TransformedPointSphere from "@/components/TransformedPointSphere";
import MobiusPlane from "@/components/MobiusPlane";
import { color } from "three/webgpu";

// Main Index component to render both the original and transformed images side-by-side
const Index: React.FC = () => {
  const initialL = 0;
  const initialXPosition = 1.5;
  const initialYPosition = 0;
  const initialCircles = [
    { center: [0, 0], radius: 1, color: "blue" },
    { center: [2, 2], radius: 1.5, color: "green" },
    { center: [-2, -2], radius: 1, color: "red" },
  ];
  const [L, setL] = useState(initialL);
  const [xPosition, setXPosition] = useState(initialXPosition);
  const [yPosition, setYPosition] = useState(initialYPosition);
  const [circles, setCircles] = useState(initialCircles); // Transformed circle
  const circle2DRefs = useRef<any[]>([]);

  // Function to apply zoom (composite zoom logic)
  const applyZoom = () => {
    // Loop through all circle refs and call applyZoom on each one
    circle2DRefs.current.forEach((circleRef) => {
      if (circleRef) {
        circleRef.applyZoom(); // Call applyZoom in Circle2D
      }
    });
    setL(0); // Reset L for incremental zooms
  };

  const resetValues = () => {
    setL(initialL);
    setXPosition(initialXPosition);
    setYPosition(initialYPosition);
    // Loop through all circle refs and call applyReset on each one
    circle2DRefs.current.forEach((circleRef) => {
      if (circleRef) {
        circleRef.applyReset(); // Call applyReset in Circle2D
      }
    });
    setL(0); // Reset L for incremental zooms
  };

  const P = { x: xPosition, y: yPosition, z: 0 };

  const segments = 8; // Number of spheres on the circle

  return (
    <div className="bg-[#242424] w-full min-h-[100vh]">
      <Navbar />
      <Canvas
        orthographic
        style={{ height: "100vh", width: "100%" }}
        camera={{ position: [0, 0, 10], zoom: 40 }}
      >
        {circles.map((circle, index) => (
          <Circle2D
            key={index}
            ref={(el: HTMLDivElement | null) => {
              circle2DRefs.current[index] = el;
            }} // Assign unique ref to each circle
            radius={circle.radius}
            segments={1024}
            center={[circle.center[0], circle.center[1]]}
            L={L}
            P={P}
            color={circle.color}
          />
        ))}
        <MobiusPlane
          L={L}
          P={P}
          lineWidth={0.5}
          density={30}
          size={10}
          resolution={512}
        />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <PointSphere x={xPosition} y={yPosition} z={0} color="blue" />
        <PointSphere x={0} y={0} z={0} color="orange" />
        <OrbitControls
          enableRotate={false} // Disable rotation
          enableZoom={true} // Disable zoom (optional, if needed)
          enablePan={true} // Allow panning
        />
      </Canvas>
      <div className="fixed bottom-0 p-2 rounded-lg flex justify-center w-full text-[#111111]">
        <div className="flex lg:flex-row flex-col lg:gap-12 gap-2">
          <div className="flex flex-col gap-2">
            <button
              className="rounded-md bg-[#4AC585] hover:bg-[#3faa73] transition-all duration-200 text-[#111111] p-1 px-3 font-bold text-lg uppercase"
              onClick={applyZoom}
            >
              Apply Zoom
            </button>
            <button
              className="rounded-md bg-[#4AC585] hover:bg-[#3faa73] transition-all duration-200 text-[#111111] p-1 px-3 font-bold text-lg uppercase"
              onClick={resetValues}
            >
              Reset
            </button>
          </div>
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
