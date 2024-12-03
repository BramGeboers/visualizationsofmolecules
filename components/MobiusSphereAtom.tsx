import React, { useRef, useMemo } from "react";
import * as THREE from "three";

interface MobiusSphereAtomProps {
  segments: number;
  center: Array<number>;
  P: { x: number; y: number; z: number };
  L: number;
  symbol: string;
  onClick: () => void;
  mobiusScalingTransform: (
    point: { x: number; y: number; z: number },
    P: { x: number; y: number; z: number },
    L: number
  ) => { x: number; y: number; z: number };
}

const MobiusSphereAtom: React.FC<MobiusSphereAtomProps> = ({
  segments,
  center,
  P,
  L,
  symbol,
  mobiusScalingTransform,
  onClick,
}) => {
  const sphereRef = useRef<THREE.Mesh>(null);

  // Destructure center for convenience
  const [centerX, centerY, centerZ] = center;

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

  const radius = 0.5 * atomicRadii[symbol] || 0.8; // Default to 0.8 if symbol is not in the dictionary
  const color = atomColors[symbol] || "gray"; // Default to gray if symbol is not in the dictionary

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

  const colorInstance = new THREE.Color(color);
  // Generate procedural texture
  // Apply the color to the material
  const material = new THREE.MeshStandardMaterial({
    color: colorInstance,
    emissive: new THREE.Color(color).multiplyScalar(0.2), // Slightly emit light to brighten up
    metalness: 0.6, // Makes the material look more metallic
    roughness: 0.5, // Controls how shiny the surface is (lower means shinier)
  });

  return (
    <mesh onClick={onClick} ref={sphereRef} geometry={geometry}>
      <primitive object={material} />
    </mesh>
  );
};

export default MobiusSphereAtom;
