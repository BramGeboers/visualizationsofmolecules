"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, Text } from "@react-three/drei";
import Navbar from "@/components/Navbar";
import Circle from "@/components/Circle3D";
import MobiusSphere from "@/components/MobiusSphere";
import PointSphere from "@/components/PointSphere";
import { mobiusScalingTransform } from "@/utils/transformation";
import MobiusPlane from "@/components/MobiusPlane";
import TransformedPointSphere from "@/components/TransformedPointSphere";
import Circle2D from "@/components/Circle2D";

// Main Index component to render both the original and transformed images side-by-side
const Index: React.FC = () => {
  const [L, setL] = useState(0);
  const [xPosition, setXPosition] = useState(1.5);
  const [yPosition, setYPosition] = useState(0);
  const [zPosition, setZPosition] = useState(0); // Added z position for P

  const P = { x: xPosition, y: yPosition, z: zPosition };

  return (
    <div className="bg-[#242424] w-full min-h-[100vh]">
      <Navbar />

      <Canvas
        orthographic
        style={{ height: "100vh", width: "100%" }}
        camera={{ position: [0, 0, 200], zoom: 40 }}
      >
        <directionalLight position={[100, 100, 100]} intensity={1} />
        {/* <Circle
          radius={radius}
          segments={1024}
          center={[0, 0, 0]}
          L={L}
          P={P}
          color="blue"
          mobiusScalingTransform={mobiusScalingTransform}
        /> */}
        <ambientLight intensity={0.3} />
        <PointSphere x={xPosition} y={yPosition} z={zPosition} color="pink" />
        <MobiusPlane
          L={L}
          P={P}
          lineWidth={0.5}
          density={30}
          size={10}
          resolution={512}
        />
        {/* {Array.from({ length: 17 }, (_, i) => 1 + i * 1.5).map((radius) => (
          <Circle2D
            key={radius} // Add a unique key for each circle
            radius={radius}
            segments={1024}
            center={[0, 0]}
            color="blue"
            P={P}
            L={L}
            mobiusScalingTransform={mobiusScalingTransform}
          />
        ))} */}
        <MobiusSphere
          radius={1}
          segments={512}
          center={[0, 0, 0]}
          P={P}
          L={L}
          color={"red"}
          mobiusScalingTransform={mobiusScalingTransform}
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
                mobiusScalingTransform={mobiusScalingTransform}
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
          <div className="bg-[#DBD8D5] p-4 flex flex-col rounded-md lg:mb-12 mb-4 items-center ">
            <div className="flex justify-between w-full max-w-[300px]">
              <span className="mb-2 flex between">Z</span>
              <span>{zPosition.toFixed(1)}</span>
            </div>
            <input
              className="w-[300px] mb-2"
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={zPosition}
              onChange={(e) => setZPosition(parseFloat(e.target.value))}
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
