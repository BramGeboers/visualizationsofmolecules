import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Atom, Bond } from "@/utils/parseSDF";
import { IoIosArrowForward } from "react-icons/io";
import TransformedPointSphereWithText from "./TransformedPointSphereWithText";
import PointSphereWithText from "./PointSphereWithText";
import Disk2D from "./Disk2D";
import MobiusPlane from "./MobiusPlane";

export const ModelViewer2D: React.FC<{
  atoms: Atom[];
  bonds: Bond[];
  moleculeName: string;
  moleculeFormula: string;
}> = ({ atoms, bonds, moleculeName, moleculeFormula }) => {
  const initialL = 0;
  const initialXPosition = 1.5;
  const initialYPosition = 0;

  const [L, setL] = useState(initialL);
  const [xPosition, setXPosition] = useState(initialXPosition);
  const [yPosition, setYPosition] = useState(initialYPosition);
  const [zPosition, setZPosition] = useState(0); // New Z position state
  const [pos1, setPos1] = useState(false);
  const [pos2, setPos2] = useState(false);
  const [navActive, setNavActive] = useState(false);

  const [P_x, setP_x] = useState(1); // New state for the x-coordinate of the point P
  const [P_y, setP_y] = useState(0); // New state for the y-coordinate of the point P
  const [P_z, setP_z] = useState(0); // New state for the z-coordinate of the point P

  const P = { x: P_x, y: P_y, z: P_z };

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

    const epsilon = 1e-6; // Small constant to avoid division by zero

    if (pos1) {
      setP_x(position.x + epsilon);
      setP_y(position.y + epsilon);
      setP_z(position.z + epsilon);
      setPos1(false);
    }

    if (pos2) {
      setXPosition(position.x + epsilon);
      setYPosition(position.y + epsilon);
      setZPosition(position.z + epsilon);
      setPos2(false);
    }
  };

  const calculateCentroid = (atoms: Atom[]) => {
    let totalX = 0;
    let totalY = 0;
    let totalZ = 0;
    atoms.forEach((atom) => {
      totalX += atom.x;
      totalY += atom.y;
      totalZ += atom.z;
    });

    const numAtoms = atoms.length;
    return {
      x: totalX / numAtoms,
      y: totalY / numAtoms,
      z: totalZ / numAtoms,
    };
  };

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

  const [isCheckedP, setIsCheckedP] = useState(true);

  const [isCheckedOrigin, setIsCheckedOrigin] = useState(true);

  const handleToggleOrigin = () => {
    setIsCheckedOrigin((prev) => !prev);
  };

  const handleToggleP = () => {
    setIsCheckedP((prev) => !prev);
  };

  // Calculate centroid once atoms are loaded
  const centroid = calculateCentroid(atoms);
  const translateAtoms = (
    atoms: Atom[],
    centroid: { x: number; y: number; z: number }
  ) => {
    return atoms.map((atom) => ({
      ...atom,
      x: atom.x - centroid.x,
      y: atom.y - centroid.y,
      z: atom.z - centroid.z,
    }));
  };

  const centeredAtoms = translateAtoms(atoms, centroid);

  return (
    <div className="bg-[#242424] w-full h-full ">
      <div
        className={` h-[100vh] transition-all duration-300  ${
          navActive ? "w-[100vw]" : "w-[80vw]"
        }`}
      >
        <Canvas orthographic camera={{ position: [0, 0, 10], zoom: 40 }}>
          <ambientLight intensity={0.25} />
          <directionalLight
            position={[40, 40, 40]}
            intensity={2}
            castShadow
            shadow-mapSize-width={64}
            shadow-mapSize-height={64}
            shadow-bias={-0.01}
          />
          {isCheckedOrigin && (
            <TransformedPointSphereWithText
              x={xPosition}
              y={yPosition}
              z={zPosition}
              P={P}
              L={L}
              color={"orange"}
              label={"Origin"}
            />
          )}
          {isCheckedP && (
            <PointSphereWithText
              x={P_x}
              y={P_y}
              z={P_z}
              color={"#3faa73"}
              label="P"
            />
          )}
          {centeredAtoms.map((atom, index) => (
            <Disk2D
              key={index}
              center={[atom.x, atom.y, atom.z]}
              ref={(el: HTMLDivElement | null) => {
                circle2DRefs.current[index] = el;
              }} // Assign unique ref to each circle
              L={L}
              P={P}
              segments={256}
              symbol={atom.symbol}
              onClick={() => handleClick({ x: atom.x, y: atom.y, z: atom.z })}
            />
          ))}
          <MobiusPlane
            L={L}
            P={P}
            lineWidth={0.5}
            density={30}
            size={20}
            resolution={512}
          />
          <OrbitControls
            enableRotate={false} // Disable rotation
            enableZoom={true} // Disable zoom (optional, if needed)
            enablePan={true} // Allow panning
          />{" "}
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

      <div className="bottom-4 fixed left-4 text-2xl capitalize text-[#4AC585]">
        <p>
          {moleculeFormula} <br /> {moleculeName}
        </p>
      </div>

      <div
        className={`lg:w-[400px] w-[300px] min-w-[300px] overflow-auto fixed z-50 right-0 top-0 flex flex-col justify-start gap-4 bg-[#242424] border-l border-[#DBD8D5] text-[#111111] h-[100vh] p-4 transition-all duration-300 ${
          navActive ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="bg-[#DBD8D5] p-4 flex flex-col rounded-md items-center ">
          <div className="flex justify-between w-full max-w-[300px]">
            <span className="mb-2 flex between">Zoom</span>
            <span>{(parseFloat(L.toFixed(3)) * 100).toFixed(1)}%</span>
          </div>
          <input
            className="lg:w-[300px] w-[240px] mb-2"
            type="range"
            min="-3"
            max="3"
            step="0.001"
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

        <button
          className="rounded-md bg-[#4AC585] hover:bg-[#3faa73] transition-all duration-200 text-[#111111] p-1 px-3 font-bold text-lg uppercase"
          onClick={applyZoom}
        >
          Apply Zoom
        </button>
        <button
          className="rounded-md bg-[#4AC585] hover:bg-[#3faa73] mb-12 transition-all duration-200 text-[#111111] p-1 px-3 font-bold text-lg uppercase"
          onClick={resetValues}
        >
          Reset
        </button>

        <div className="bg-[#DBD8D5] p-4 flex flex-col rounded-md items-center">
          {[
            { label: "O.x", value: xPosition, setter: setXPosition },
            { label: "O.y", value: yPosition, setter: setYPosition },
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
            pos1
              ? "bg-[#4AC585] hover:bg-[#3faa73]"
              : "bg-[#3ca06d] hover:bg-[#31855a]"
          }`}
          onClick={handleButton}
        >
          Select P
        </button>
        <div className="text-[#111111] bg-[#DBD8D5] rounded-md justify-between flex flex-row p-4">
          Toggle P Sphere
          <div
            className={`relative inline-block w-12 h-6 rounded-md transition-all duration-200 ${
              isCheckedP ? "bg-[#4AC585]" : "bg-[#242424]"
            }`}
            onClick={handleToggleP}
          >
            <div
              className={`absolute top-0 left-0 w-6 h-6 bg-white border-[1px]   rounded-md transition-all duration-200 ${
                isCheckedP
                  ? "transform translate-x-6 border-[#4AC585]"
                  : "border-[#242424]"
              }`}
            />
          </div>
        </div>
        <div className="text-[#111111] bg-[#DBD8D5] rounded-md justify-between flex flex-row p-4">
          Toggle Origin Sphere
          <div
            className={`relative inline-block w-12 h-6 rounded-md transition-all duration-200 ${
              isCheckedOrigin ? "bg-[#4AC585]" : "bg-[#242424]"
            }`}
            onClick={handleToggleOrigin}
          >
            <div
              className={`absolute top-0 left-0 w-6 h-6 bg-white border-[1px] rounded-md transition-all duration-200 ${
                isCheckedOrigin
                  ? "transform translate-x-6 border-[#4AC585]"
                  : "border-[#242424]"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
