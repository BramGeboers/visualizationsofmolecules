"use client";
import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  PlaneGeometry,
  Mesh,
  ShaderMaterial,
  Color,
  GridHelper,
  Vector3,
} from "three";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import Navbar from "@/components/Navbar";
import { IoIosArrowForward } from "react-icons/io";

// Function to perform inversion around point P with radius 1 (in 3D)
function invert(
  z: { real: number; imag: number; z: number },
  P: { real: number; imag: number; z: number }
) {
  const dx = z.real - P.real;
  const dy = z.imag - P.imag;
  const dz = z.z - P.z;
  const denominator = dx ** 2 + dy ** 2 + dz ** 2;

  if (denominator === 0) {
    console.warn("Invert function: input point coincides with P, returning P.");
    return { real: P.real, imag: P.imag, z: P.z }; // or a fallback point
  }

  return {
    real: dx / denominator + P.real,
    imag: dy / denominator + P.imag,
    z: dz / denominator + P.z,
  };
}

// Function to perform uniform scaling by factor L in 3D
function scale(z: { real: number; imag: number; z: number }, L: number) {
  return {
    real: L * z.real,
    imag: L * z.imag,
    z: L * z.z,
  };
}

function distance(
  z: { real: number; imag: number; z: number },
  P: { real: number; imag: number; z: number }
) {
  return Math.sqrt(
    (z.real - P.real) ** 2 + (z.imag - P.imag) ** 2 + (z.z - P.z) ** 2
  );
}

function relativeScale(
  S: { real: number; imag: number; z: number }, // Sphere's position
  P: { real: number; imag: number; z: number }, // Point P's position
  L: number
) {
  const dist = distance(S, P); // Distance between sphere and point P

  // console.log("S: ", S, "P: ", P, "L: ", L, "Dist: ", dist);

  // Ensure maximum scaling when the sphere is at P
  if (dist === 0) {
    return scale(S, L * 0.8); // Directly apply maximum scaling when at P
  }

  // Apply scaling based on distance (exponential decay)
  const scalingFactor = 1 + (L - 1) * Math.exp(-dist); // Exponential scaling factor
  return scale(S, scalingFactor);
}

// Möbius Scaling Transformation in 3D with distance-based scaling
function mobiusScalingTransform(
  z: { real: number; imag: number; z: number },
  P: { real: number; imag: number; z: number },
  L: number
) {
  const firstInversion = invert(z, P);
  const scaled = relativeScale(firstInversion, P, L);
  return invert(scaled, P);
}

// MobiusPlane component that applies Möbius scaling transformation and renders an orthogonal grid in 3D
const MobiusPlane: React.FC<{
  L: number;
  P: { real: number; imag: number; z: number };
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
        const z = geometry.attributes.position.getZ(i);

        const point = { real: x, imag: y, z: z };
        const transformed = mobiusScalingTransform(point, P, L);

        geometry.attributes.position.setXYZ(
          i,
          transformed.real,
          transformed.imag,
          transformed.z
        );
      }
    }
  }, [L, P]);

  // Shader material for the infinite orthogonal grid (still in 2D projection)
  const gridMaterial = new ShaderMaterial({
    uniforms: {
      color: { value: new Color("black") },
      lineWidth: { value: 1 },
      scale: { value: 10 },
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
        if (alpha < 0.5) discard;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    transparent: true,
  });

  return (
    <mesh ref={planeRef} position={[0, 0, 0]} material={gridMaterial}>
      <planeGeometry args={[10, 10, 2048, 2048]} />
    </mesh>
  );
};

// Sphere component to represent the point P on the original image in 3D
const PointSphere: React.FC<{
  x: number;
  y: number;
  z: number;
  onClick: () => void;
}> = ({ x, y, z, onClick }) => {
  return (
    <mesh position={[x, y, z]} onClick={onClick}>
      <sphereGeometry args={[0.06, 32, 32]} />
      <meshStandardMaterial color={"red"} transparent={true} opacity={0.5} />
    </mesh>
  );
};

const CameraController: React.FC<{
  P: { real: number; imag: number; z: number };
  L: number;
}> = ({ P, L }) => {
  const { camera } = useThree();

  // Function to apply the Möbius scaling transformation to P
const mobiusScalingTransform = (
    P: { real: number; imag: number; z: number },
    L: number
  ) => {
    const firstInversion = invert(P, P); // Invert P
    const scaled = relativeScale(firstInversion, P, L); // Scale the inverted point
    return invert(scaled, P); // Invert again
  };

  useEffect(() => {
    // Apply the Möbius scaling transformation to P
    const transformedP = mobiusScalingTransform(P, L);

    // Set the camera position to follow the transformed P
    camera.position.set(
      transformedP.real,
      transformedP.imag,
      transformedP.z + 5
    ); // Adjust the offset for view
    camera.lookAt(transformedP.real, transformedP.imag, transformedP.z); // Make the camera look at the transformed P
  }, [P, L, camera]); // Re-run whenever P or L changes

  return null; // This component doesn't render anything visible
};

const PointSphereTransformed: React.FC<{
  x: number;
  y: number;
  z: number;
  L: number;
  P: { real: number; imag: number; z: number };
  color: string;
  onClick: () => void;
}> = ({ x, y, z, L, P, color, onClick }) => {
  // Apply Möbius scaling transformation
  const transformed = mobiusScalingTransform({ real: x, imag: y, z: z }, P, L);
  console.log("Transformed point:", transformed, "| Color: ", color);

  // Calculate distance between current point and P (center of transformation)
  const dist = distance({ real: x, imag: y, z: z }, P);

  // Determine if the current point is the same as P, and if so, apply maximum scaling
  const scalingFactor = 1 + 40 * (L - 1) * Math.exp(-dist * 0.5);
  const size = 1 * scalingFactor;
  console.log(
    "Dist: ",
    dist,
    "Color: ",
    color,
    "Scalingfactor: ",
    scalingFactor,
    "X: ",
    x,
    "Y: ",
    y,
    "Z: ",
    z,
    "Size: ",
    size
  );

  return (
    <mesh
      position={[transformed.real, transformed.imag, transformed.z]}
      onClick={onClick}
      scale={[size, size, size]} // Apply calculated size (scaled or max)
    >
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={color} transparent={true} opacity={0.5} />
    </mesh>
  );
};

// Update the Index component to include the new transformed point sphere
const Index: React.FC = () => {
  const [L, setL] = useState(1.0);
  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);
  const [zPosition, setZPosition] = useState(0); // New Z position state
  const [pos1, setPos1] = useState(false);
  const [pos2, setPos2] = useState(false);
  const [navActive, setNavActive] = useState(false);

  const [P_x, setP_x] = useState(1); // New state for the x-coordinate of the point P
  const [P_y, setP_y] = useState(0); // New state for the y-coordinate of the point P
  const [P_z, setP_z] = useState(0); // New state for the z-coordinate of the point P

  const P = { real: P_x, imag: P_y, z: P_z };

  const toggleNav = () => {
    setNavActive(!navActive);
    console.log("Nav Active: ", navActive);
  };

  const handleButton = () => {
    setPos1(!pos1);
  };

  const handleButton2 = () => {
    setPos2(!pos2);
  };
  // Define the click handler for the spheres
  const handleClick = (position: { x: number; y: number; z: number }) => {
    console.log(
      `Clicked sphere at position: (${position.x}, ${position.y}, ${position.z})`
    );

    if (pos1) {
      setP_x(position.x);
      setP_y(position.y);
      setP_z(position.z);
      setPos1(false);
      console.log("Updated P:", { P_x, P_y, P_z }); // Add a log to check the updated P
    }

    if (pos2) {
      setXPosition(position.x);
      setYPosition(position.y);
      setZPosition(position.z);
      setPos2(false);
    }
  };

  return (
    <div className="bg-[#242424] w-full h-full ">
      <Navbar />
      <div
        className={` h-[100vh] transition-all duration-300  ${
          navActive ? "w-[100vw]" : "w-[80vw]"
        }`}
      >
        <Canvas
          orthographic
          className="w-[100%] h-[100vh]"
          style={{ height: "100vh", width: "80%" }}
          camera={{ position: [0, 0, 10] }}
          shadows
        >
          {/* Add the CameraController to update the camera */}
          <CameraController P={P} L={L} />
          <ambientLight intensity={0.25} />
          <directionalLight
            position={[40, 40, 40]}
            intensity={2}
            castShadow
            shadow-mapSize-width={64}
            shadow-mapSize-height={64}
            shadow-bias={-0.01}
          />
          <MobiusPlane L={L} P={P} />
          <PointSphere
            x={P_x}
            y={P_y}
            z={P_z}
            onClick={() => handleClick({ x: P_x, y: P_y, z: P_z })}
          />
          <PointSphere
            x={xPosition}
            y={yPosition}
            z={zPosition}
            onClick={() =>
              handleClick({ x: xPosition, y: yPosition, z: zPosition })
            }
          />
          {/* Center of Transformation (Red Sphere) */}
          <PointSphereTransformed
            x={1}
            y={1}
            z={-2}
            L={L}
            P={P}
            color="green"
            onClick={() => handleClick({ x: 1, y: 1, z: -2 })}
          />
          {/* Transformed Point 1 (Blue Sphere) */}
          <PointSphereTransformed
            x={-1}
            y={-1}
            z={1}
            L={L}
            P={P}
            color="yellow"
            onClick={() => handleClick({ x: -1, y: -1, z: 1 })}
          />
          <PointSphereTransformed
            x={-1}
            y={1}
            z={-1}
            L={L}
            P={P}
            color="orange"
            onClick={() => handleClick({ x: -1, y: 1, z: -1 })}
          />
          {/* Transformed Point 1 (Blue Sphere) */}
          <PointSphereTransformed
            x={-3}
            y={-1}
            z={2}
            L={L}
            P={P}
            color="pink"
            onClick={() => handleClick({ x: -3, y: -1, z: 2 })}
          />
          {/* Transformed Point 2 (Blue Sphere) */}

          <OrbitControls />
        </Canvas>
      </div>
      {/* Control Sliders */}
      <button
        className={`w-8 h-8 fixed top-4 right-4 z-50  bg-[#4AC585] rounded-md cursor-pointer flex items-center justify-center transition-all duration-300 ${
          navActive
            ? "-translate-x-0"
            : "lg:-translate-x-[400px] -translate-x-[300px]"
        }`}
        onClick={toggleNav}
      >
        <IoIosArrowForward
          color="#111111"
          className={`transition-all duration-300 ${
            navActive ? "rotate-180 " : "rotate-0"
          }`}
        />
      </button>

      <div
        className={`lg:w-[400px] w-[300px] min-w-[300px] overflow-auto fixed z-50 right-0 top-0 flex flex-col justify-start gap-4 bg-[#242424] border-l border-[#DBD8D5] text-[#111111] h-[100vh] p-4 transition-all duration-300 ${
          navActive ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="bg-[#DBD8D5] p-4 flex flex-col rounded-md mb-12 items-center ">
          <div className="flex justify-between w-full max-w-[300px]">
            <span className="mb-2 flex between">Zoom</span>
            <span>{L.toFixed(2)}</span>
          </div>
          <input
            className="lg:w-[300px] w-[240px] mb-2"
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

        <div className="bg-[#DBD8D5] p-4 flex flex-col rounded-md items-center">
          {[
            { label: "O.x", value: xPosition, setter: setXPosition },
            { label: "O.y", value: yPosition, setter: setYPosition },
            { label: "O.z", value: zPosition, setter: setZPosition },
          ].map(({ label, value, setter }, idx) => (
            <div className="mb-4" key={idx}>
              <div className="flex justify-between w-full">
                <span className="mb-2">{label}</span>
                <span>{value.toFixed(1)}</span>
              </div>
              <input
                className="lg:w-[300px] w-[240px]"
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={value}
                onChange={(e) => setter(parseFloat(e.target.value))}
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
          ))}
        </div>

        <button
          className={`rounded-md mb-12 p-1 px-3 font-bold text-lg uppercase text-[#111111] transition-all duration-200 ${
            pos2
              ? "bg-[#4AC585] hover:bg-[#3faa73]"
              : "bg-[#3ca06d] hover:bg-[#31855a]"
          }`}
          onClick={handleButton2}
        >
          Select Origin
        </button>

        {/* P.x, P.y, P.z group */}
        <div className="bg-[#DBD8D5] p-4 flex flex-col rounded-md items-center">
          {[
            { label: "P.x", value: P_x, setter: setP_x },
            { label: "P.y", value: P_y, setter: setP_y },
            { label: "P.z", value: P_z, setter: setP_z },
          ].map(({ label, value, setter }, idx) => (
            <div className="mb-4" key={idx}>
              <div className="flex justify-between w-full">
                <span className="mb-2">{label}</span>
                <span>{value.toFixed(1)}</span>
              </div>
              <input
                className="lg:w-[300px] w-[240px]"
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={value}
                onChange={(e) => setter(parseFloat(e.target.value))}
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
          ))}
        </div>

        <button
          className={`rounded-md p-1 px-3 font-bold text-lg uppercase text-[#111111] transition-all duration-200 ${
            pos1
              ? "bg-[#4AC585] hover:bg-[#3faa73]"
              : "bg-[#3ca06d] hover:bg-[#31855a]"
          }`}
          onClick={handleButton}
        >
          Select P
        </button>
      </div>
    </div>
  );
};

export default Index;
