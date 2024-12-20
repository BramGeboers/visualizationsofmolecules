import React, { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Atom, Bond } from "@/utils/parseSDF";
import * as THREE from "three";
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

const AtomModel: React.FC<{
  position: [number, number, number];
  symbol: string;
  L: number;
  P: { real: number; imag: number; z: number };
  onClick: () => void;
}> = ({ position, symbol, L, P, onClick }) => {
  // Atomic radii in angstroms (1 angstrom = 0.1 nm)
  const atomicRadii: { [key: string]: number } = {
    H: 0.25, // Hydrogen
    He: 0.31, // Helium
    Li: 1.52, // Lithium
    Be: 1.12, // Beryllium
    B: 0.87, // Boron
    C: 0.77, // Carbon
    N: 0.75, // Nitrogen
    O: 0.73, // Oxygen
    F: 0.64, // Fluorine
    Ne: 0.38, // Neon
    Na: 1.54, // Sodium
    Mg: 1.36, // Magnesium
    Al: 1.18, // Aluminum
    Si: 1.11, // Silicon
    P: 1.07, // Phosphorus
    S: 1.02, // Sulfur
    Cl: 0.99, // Chlorine
    Ar: 0.71, // Argon
    K: 2.03, // Potassium
    Ca: 1.97, // Calcium
    // Add more elements as needed...
  };

  // Define colors for different elements
  const atomColors: { [key: string]: string } = {
    H: "white", // Hydrogen
    He: "lightgray", // Helium
    Li: "gray", // Lithium
    Be: "gray", // Beryllium
    B: "brown", // Boron
    C: "gray", // Carbon
    N: "blue", // Nitrogen
    O: "red", // Oxygen
    F: "green", // Fluorine
    Ne: "lightblue", // Neon
    Na: "lightblue", // Sodium
    Mg: "green", // Magnesium
    Al: "gray", // Aluminum
    Si: "gray", // Silicon
    P: "orange", // Phosphorus
    S: "yellow", // Sulfur
    Cl: "green", // Chlorine
    Ar: "lightblue", // Argon
    K: "purple", // Potassium
    Ca: "violet", // Calcium
    // Add more colors as needed...
  };

  // Get the radius and color based on the symbol
  const radius = atomicRadii[symbol] || 0.8; // Default to 0.8 if symbol is not in the dictionary
  const color = atomColors[symbol] || "gray"; // Default to gray if symbol is not in the dictionary

  // Apply Möbius scaling transformation
  const transformed = mobiusScalingTransform(
    { real: position[0], imag: position[1], z: position[2] },
    P,
    L
  );

  // Calculate distance between atom position and P (center of transformation)
  const dist = distance(
    { real: position[0], imag: position[1], z: position[2] },
    P
  );

  // For default scaling, avoid applying exponential scaling
  let scalingFactor = 1;
  if (dist !== 0) {
    // Apply exponential scaling only when not at the center
    scalingFactor = 1 + (L - 1) * Math.exp(-dist * 0.5) * 4;
  }

  // Apply the scaling factor to the atomic radius
  //   const size = radius * scalingFactor; // Scale based on the distance and radius
  // Apply the scaling factor to the atomic radius
  const size = radius * 0.3 * scalingFactor; // Scale the radius directly instead of using scale property

  return (
    <mesh
      onClick={onClick}
      position={[transformed.real, transformed.imag, transformed.z]}
    >
      <sphereGeometry args={[size, 64, 64]} />{" "}
      {/* Directly scale the geometry */}
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.95}
        roughness={0.5} // Lower values make the surface shinier
        metalness={0.6} // Adds metallic effect; adjust as needed
      />
    </mesh>
  );
};
// BondProps now includes the bond type (single, double, triple, etc.)
interface BondProps {
  start: [number, number, number];
  end: [number, number, number];
  type: number; // 1 for single, 2 for double, 3 for triple, etc.
  L: number; // Add L property
  P: { real: number; imag: number; z: number }; // Add P property
}

const BondModel: React.FC<BondProps> = ({ start, end, type, L, P }) => {
  // Apply Möbius transformation to both start and end positions
  const transformedStart = mobiusScalingTransform(
    { real: start[0], imag: start[1], z: start[2] },
    P,
    L
  );
  const transformedEnd = mobiusScalingTransform(
    { real: end[0], imag: end[1], z: end[2] },
    P,
    L
  );

  // Midpoint and direction based on transformed positions
  const midPoint: [number, number, number] = [
    (transformedStart.real + transformedEnd.real) / 2,
    (transformedStart.imag + transformedEnd.imag) / 2,
    (transformedStart.z + transformedEnd.z) / 2,
  ];

  const direction = new THREE.Vector3(
    transformedEnd.real - transformedStart.real,
    transformedEnd.imag - transformedStart.imag,
    transformedEnd.z - transformedStart.z
  );
  const length = direction.length();
  direction.normalize(); // Normalize the direction vector

  // Desired direction: align bond along the z-axis
  const desiredDirection = new THREE.Vector3(0, 1, 0).normalize();

  const bondGeometries = [];

  // Function to create bonds with specified offsets
  const createBond = (offset: number, key: number) => {
    const ref = useRef<THREE.Mesh>(null);

    useEffect(() => {
      if (ref.current) {
        const rotationAxis = new THREE.Vector3().crossVectors(
          desiredDirection,
          direction
        );
        const rotationAngle = direction.angleTo(desiredDirection);

        if (rotationAxis.length() > 0) {
          rotationAxis.normalize();
          const quaternion = new THREE.Quaternion().setFromAxisAngle(
            rotationAxis,
            rotationAngle
          );
          ref.current.rotation.setFromQuaternion(quaternion);
        }

        ref.current.position.set(
          midPoint[0],
          midPoint[1],
          midPoint[2] + offset // Apply offset symmetrically
        );

        ref.current.scale.set(1, 1, length); // Scale the bond mesh
      }
    }, [transformedStart, transformedEnd, midPoint, direction, offset]);

    return (
      <mesh key={key} ref={ref}>
        <cylinderGeometry args={[0.05, 0.05, length, 16]} />
        <meshStandardMaterial
          color="white"
          transparent
          opacity={0.8}
          roughness={0.2} // Lower values make the surface shinier
          metalness={0.6} // Adds metallic effect; adjust as needed
        />
      </mesh>
    );
  };

  const spacingFactor = 0.145; // Distance between parallel bonds

  if (type === 1) {
    bondGeometries.push(createBond(0, 0)); // Single bond at the center
  } else if (type === 2) {
    // Double bond: two parallel bonds without a central bond
    bondGeometries.push(createBond(-spacingFactor, 0));
    bondGeometries.push(createBond(spacingFactor, 1));
  } else if (type === 3) {
    // Triple bond: create three bonds with equal spacing
    for (let i = 0; i < type; i++) {
      const offset = (i - 1) * spacingFactor; // -1, 0, 1 for triple bonds
      bondGeometries.push(createBond(offset, i));
    }
  }

  return <>{bondGeometries}</>;
};

export default BondModel;

const PointSphere: React.FC<{
  x: number;
  y: number;
  z: number;
  color: string;
}> = ({ x, y, z, color }) => {
  return (
    <mesh position={[x, y, z]}>
      <sphereGeometry args={[0.04, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.45}
        roughness={0.5} // Lower values make the surface shinier
        metalness={0.6} // Adds metallic effect; adjust as needed
      />{" "}
    </mesh>
  );
};

export const ModelViewer: React.FC<{
  atoms: Atom[];
  bonds: Bond[];
  moleculeName: string;
  moleculeFormula: string;
}> = ({ atoms, bonds, moleculeName, moleculeFormula }) => {
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
      <div
        className={` h-[100vh] transition-all duration-300  ${
          navActive ? "w-[100vw]" : "w-[80vw]"
        }`}
      >
        <Canvas>
          {" "}
          {/* Ensure the Canvas fills its container */}
          {/* <ambientLight intensity={0.5} /> */}
          {/* <axesHelper args={[5]} /> */}
          <ambientLight intensity={0.25} />
          <directionalLight
            position={[40, 40, 40]}
            intensity={2}
            castShadow
            shadow-mapSize-width={64}
            shadow-mapSize-height={64}
            shadow-bias={-0.01}
          />
          <PointSphere
            x={xPosition}
            y={yPosition}
            z={zPosition}
            color={"#111111"}
          />
          <PointSphere x={P_x} y={P_y} z={P_z} color={"#3faa73"} />
          {atoms.map((atom, index) => (
            <AtomModel
              key={index}
              position={[atom.x, atom.y, atom.z]}
              symbol={atom.symbol}
              L={L} // Replace with the actual value of L
              P={P} // Replace with the actual value of P
              onClick={() => handleClick({ x: atom.x, y: atom.y, z: atom.z })}
            />
          ))}
          {bonds.map((bond, index) => (
            <BondModel
              key={index}
              start={[
                atoms[bond.startAtomIndex].x,
                atoms[bond.startAtomIndex].y,
                atoms[bond.startAtomIndex].z,
              ]}
              end={[
                atoms[bond.endAtomIndex].x,
                atoms[bond.endAtomIndex].y,
                atoms[bond.endAtomIndex].z,
              ]}
              L={L} // Replace with the actual value of L
              P={P} // Replace with the actual value of P
              type={bond.type} // Type of bond (1, 2, 3, etc.)
            />
          ))}
          <OrbitControls />
        </Canvas>
      </div>

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

      <div className="bottom-4 fixed left-4 text-2xl uppercase text-[#4AC585]">
        <p>
          {moleculeFormula} <br /> {moleculeName}
        </p>
      </div>

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
