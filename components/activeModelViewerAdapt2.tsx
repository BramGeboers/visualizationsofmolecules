import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Atom, Bond } from "@/utils/parseSDF";
import { IoIosArrowForward } from "react-icons/io";
import PointSphere from "./PointSphere";
import PointSphereWithText from "./PointSphereWithText";
import MobiusSphereAtom from "./MobiusSphereAtom";
import BondModel from "./BondModel";
import { mobiusScalingTransform } from "@/utils/transformation";

export const ModelViewer: React.FC<{
  atoms: Atom[];
  bonds: Bond[];
  moleculeName: string;
  moleculeFormula: string;
}> = ({ atoms, bonds, moleculeName, moleculeFormula }) => {
  const [L, setL] = useState(0);
  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);
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
          <ambientLight intensity={0.25} />
          <directionalLight
            position={[40, 40, 40]}
            intensity={2}
            castShadow
            shadow-mapSize-width={64}
            shadow-mapSize-height={64}
            shadow-bias={-0.01}
          />
          <PointSphereWithText
            x={xPosition}
            y={yPosition}
            z={zPosition}
            color={"#111111"}
            label={"Origin"}
            visible={true}
          />
          <PointSphereWithText
            x={P_x}
            y={P_y}
            z={P_z}
            color={"#3faa73"}
            label="P"
            visible={true}
          />
          {atoms.map((atom, index) => (
            <MobiusSphereAtom
              key={index}
              center={[atom.x, atom.y, atom.z]}
              L={L}
              P={P}
              segments={30}
              symbol={atom.symbol}
              onClick={() => handleClick({ x: atom.x, y: atom.y, z: atom.z })}
              mobiusScalingTransform={mobiusScalingTransform}
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
              mobiusScalingTransform={mobiusScalingTransform}
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
            <span>{(parseFloat(L.toFixed(3)) * 100).toFixed(1)}%</span>
          </div>
          <input
            className="lg:w-[300px] w-[240px] mb-2"
            type="range"
            min="-.3"
            max=".3"
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
