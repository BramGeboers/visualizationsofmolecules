import React from "react";

interface AtomModelProps {
  position: [number, number, number];
  symbol: string;
  L: number;
  P: { x: number; y: number; z: number };
  onClick: () => void;
  mobiusScalingTransform: (
    point: { x: number; y: number; z: number },
    P: { x: number; y: number; z: number },
    L: number
  ) => { x: number; y: number; z: number };
  distance: (
    point1: { x: number; y: number; z: number },
    point2: { x: number; y: number; z: number }
  ) => number;
}

const AtomModel: React.FC<AtomModelProps> = ({
  position,
  symbol,
  L,
  P,
  onClick,
  mobiusScalingTransform,
  distance,
}) => {
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
    { x: position[0], y: position[1], z: position[2] },
    P,
    L
  );

  // Calculate distance between atom position and P (center of transformation)
  const dist = distance({ x: position[0], y: position[1], z: position[2] }, P);

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
      position={[transformed.x, transformed.y, transformed.z]}
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

export default AtomModel;
