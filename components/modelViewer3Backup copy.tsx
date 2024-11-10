import React, { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Atom, Bond } from "@/utils/parseSDF";
import {
  PlaneGeometry,
  Mesh,
  ShaderMaterial,
  Color,
  GridHelper,
  Vector3,
} from "three";
import * as THREE from "three";

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
      <planeGeometry args={[10, 10, 64, 64]} />
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

const AtomModel: React.FC<{
  position: [number, number, number];
  symbol: string;
  L: number;
  P: { real: number; imag: number; z: number };
}> = ({ position, symbol, L, P }) => {
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
    <mesh position={[transformed.real, transformed.imag, transformed.z]}>
      <sphereGeometry args={[size, 32, 32]} />{" "}
      {/* Directly scale the geometry */}
      <meshStandardMaterial color={color} />
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

  // Adjust the offset distance based on bond type
  const baseOffsetDistance = 0.1; // Default offset for single bonds
  const spacingFactor = 0.15; // Increase the spacing for multiple bonds
  const offsetDistance =
    type > 1
      ? baseOffsetDistance + spacingFactor * (type - 1)
      : baseOffsetDistance;

  // Desired direction: align bond along the z-axis
  const desiredDirection = new THREE.Vector3(0, 1, 0).normalize();

  const bondGeometries = [];

  // Handle different bond types (single, double, triple)
  if (type === 1) {
    // Single bond logic: offset by a small amount in the X-axis
    const offset = offsetDistance; // Single bond offset

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
          midPoint[0], // Offset in X direction for single bond
          midPoint[1], // Keep Y-axis as is
          midPoint[2] // Keep Z-axis as is
        );

        ref.current.scale.set(1, 1, length); // Scale the bond mesh along Z-axis
      }
    }, [transformedStart, transformedEnd, midPoint, direction, offset]);

    bondGeometries.push(
      <mesh key={0} ref={ref}>
        <cylinderGeometry args={[0.05, 0.05, length, 128]} />
        <meshStandardMaterial color="white" transparent opacity={0.4} />
      </mesh>
    );
  } else if (type === 2) {
    // Double bond logic: create two bonds with opposite offsets for symmetry
    const offset1 = offsetDistance; // First bond offset in the negative direction
    const offset2 = offsetDistance; // Second bond offset in the positive direction

    // First bond (offset in negative direction)
    const ref1 = useRef<THREE.Mesh>(null);
    useEffect(() => {
      if (ref1.current) {
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
          ref1.current.rotation.setFromQuaternion(quaternion);
        }

        ref1.current.position.set(
          midPoint[0], // Offset along the X-axis
          midPoint[1], // Keep Y-axis as is
          midPoint[2] - offset1 * 0.35 // Apply offset in Z-axis
        );

        ref1.current.scale.set(1, 1, length); // Scale the bond mesh
      }
    }, [transformedStart, transformedEnd, midPoint, direction, offset1]);

    bondGeometries.push(
      <mesh key={0} ref={ref1}>
        <cylinderGeometry args={[0.05, 0.05, length, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
    );

    // Second bond (offset in positive direction)
    const ref2 = useRef<THREE.Mesh>(null);
    useEffect(() => {
      if (ref2.current) {
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
          ref2.current.rotation.setFromQuaternion(quaternion);
        }

        ref2.current.position.set(
          midPoint[0], // Offset along the X-axis
          midPoint[1], // Keep Y-axis as is
          midPoint[2] + offset2 * 0.35 // Apply offset in Z-axis
        );

        ref2.current.scale.set(1, 1, length); // Scale the bond mesh
      }
    }, [transformedStart, transformedEnd, midPoint, direction, offset2]);

    bondGeometries.push(
      <mesh key={1} ref={ref2}>
        <cylinderGeometry args={[0.05, 0.05, length, 128]} />
        <meshStandardMaterial color="white" transparent opacity={0.4} />
      </mesh>
    );
  } else if (type === 3) {
    // Triple bond logic: same as before
    for (let i = 0; i < type; i++) {
      const offset = (i - Math.floor(type / 2)) * offsetDistance;

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
            midPoint[0], // Offset in X direction for triple bond
            midPoint[1], // Keep Y-axis as is
            midPoint[2] - offset * 0.35 // Adjust Z-axis offset
          );

          ref.current.scale.set(1, 1, length); // Scale the bond mesh along Z-axis
        }
      }, [transformedStart, transformedEnd, midPoint, direction, offset]);

      bondGeometries.push(
        <mesh key={i} ref={ref}>
          <cylinderGeometry args={[0.05, 0.05, length, 128]} />
          <meshStandardMaterial color="white" transparent opacity={0.4} />
        </mesh>
      );
    }
  }

  return <>{bondGeometries}</>;
};

export const ModelViewer: React.FC<{ atoms: Atom[]; bonds: Bond[] }> = ({
  atoms,
  bonds,
}) => {
  const [L, setL] = useState(1.0);
  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);
  const [zPosition, setZPosition] = useState(0); // New Z position state
  const [pos1, setPos1] = useState(false);
  const [pos2, setPos2] = useState(false);

  const [P_x, setP_x] = useState(1); // New state for the x-coordinate of the point P
  const [P_y, setP_y] = useState(0); // New state for the y-coordinate of the point P
  const [P_z, setP_z] = useState(0); // New state for the z-coordinate of the point P

  const P = { real: P_x, imag: P_y, z: P_z };

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
    <div className="bg-gray-700 w-full h-full">
      <div className="w-[80vw h-[100vh]]">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {/* <MobiusPlane L={L} P={P} /> */}

          {/* <axesHelper args={[5]} /> */}

          {/* Axis labels */}
          {/* <Text position={[6, 0, 0]} fontSize={0.5} color="red">
          X
          </Text>
          <Text position={[0, 6, 0]} fontSize={0.5} color="green">
          Y
          </Text>
          <Text position={[0, 0, 6]} fontSize={0.5} color="blue">
          Z
          </Text> */}

          {atoms.map((atom, index) => (
            <AtomModel
              key={index}
              position={[atom.x, atom.y, atom.z]}
              symbol={atom.symbol}
              L={L} // Replace with the actual value of L
              P={P} // Replace with the actual value of P
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

      <div className="w-[20%] fixed right-0 top-0 flex flex-col gap-4 bg-gray-900 h-[100vh] text-white p-4">
        <div className="bg-black p-4 flex items-center rounded-xl  flex-col mb-6">
          <span className="mb-2">Zoom Factor: {L.toFixed(2)}</span>
          <input
            className="w-[300px] mr-4"
            type="range"
            min="-3"
            max="3"
            step="0.01"
            value={L}
            onChange={(e) => setL(parseFloat(e.target.value))}
          />
        </div>
        <div className="bg-black p-4 flex items-center rounded-xl  flex-col ">
          <span className="mb-2">X Position: {xPosition.toFixed(1)}</span>
          <input
            className="w-[300px] mr-4"
            type="range"
            min={-5}
            max={5}
            step="0.1"
            value={xPosition}
            onChange={(e) => setXPosition(parseFloat(e.target.value))}
          />
        </div>
        <div className="bg-black p-4 flex items-center rounded-xl  flex-col ">
          <span className="mb-2">Y Position: {yPosition.toFixed(1)}</span>
          <input
            className="w-[300px] mr-4"
            type="range"
            min={-5}
            max={5}
            step="0.1"
            value={yPosition}
            onChange={(e) => setYPosition(parseFloat(e.target.value))}
          />
        </div>
        <div className="bg-black p-4 flex items-center rounded-xl  flex-col mb-6">
          <span className="mb-2">Z Position: {zPosition.toFixed(1)}</span>
          <input
            className="w-[300px] mr-4"
            type="range"
            min={-5}
            max={5}
            step="0.1"
            value={zPosition}
            onChange={(e) => setZPosition(parseFloat(e.target.value))}
          />
        </div>

        <div className="bg-black p-4 flex items-center rounded-xl  flex-col mb-6">
          <button
            className={
              pos2
                ? `w-40 h-9 rounded-lg bg-gray-500`
                : `w-40 h-9 rounded-lg bg-gray-700`
            }
            onClick={handleButton2}
          >
            Select Origin
          </button>
        </div>

        <div className="bg-black p-4 flex items-center rounded-xl  flex-col ">
          <span className="mb-2">
            P.X (Center of Transformation): {P_x.toFixed(1)}
          </span>
          <input
            className="w-[300px] mr-4"
            type="range"
            min={-5}
            max={5}
            step="0.1"
            value={P_x}
            onChange={(e) => setP_x(parseFloat(e.target.value))}
          />
        </div>
        <div className="bg-black p-4 flex items-center rounded-xl  flex-col ">
          <span className="mb-2">
            P.Y (Center of Transformation): {P_y.toFixed(1)}
          </span>
          <input
            className="w-[300px] mr-4"
            type="range"
            min={-5}
            max={5}
            step="0.1"
            value={P_y}
            onChange={(e) => setP_y(parseFloat(e.target.value))}
          />
        </div>
        <div className="bg-black p-4 flex items-center rounded-xl  flex-col ">
          <span className="mb-2">
            P.Z (Center of Transformation): {P_z.toFixed(1)}
          </span>
          <input
            className="w-[300px] mr-4"
            type="range"
            min={-5}
            max={5}
            step="0.1"
            value={P_z}
            onChange={(e) => setP_z(parseFloat(e.target.value))}
          />
        </div>

        <div className="bg-black p-4 flex items-center rounded-xl  flex-col mb-6">
          <button
            className={
              pos1
                ? `w-40 h-9 rounded-lg bg-gray-500`
                : `w-40 h-9 rounded-lg bg-gray-700`
            }
            onClick={handleButton}
          >
            Select P
          </button>
        </div>
      </div>
    </div>
  );
};
