import React, { useRef, useMemo } from "react";
import * as THREE from "three";

interface MobiusSphereProps {
  radius: number;
  segments: number;
  center: Array<number>;
  P: { x: number; y: number; z: number };
  L: number;
  color: string;
  mobiusScalingTransform: (
    point: { x: number; y: number; z: number },
    P: { x: number; y: number; z: number },
    L: number
  ) => { x: number; y: number; z: number };
}

const MobiusSphere: React.FC<MobiusSphereProps> = ({
  radius,
  segments,
  center,
  P,
  L,
  color,
  mobiusScalingTransform,
}) => {
  const sphereRef = useRef<THREE.Mesh>(null);

  // Destructure center for convenience
  const [centerX, centerY, centerZ] = center;

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

  // Use the color prop directly (e.g., "blue" or "#FF0000")
  const colorInstance = new THREE.Color(color);

  // Apply the color to the material
  const material = new THREE.MeshStandardMaterial({
    color: colorInstance,
    emissive: new THREE.Color(color).multiplyScalar(0.2), // Slightly emit light to brighten up
    metalness: 0.6, // Makes the material look more metallic
    roughness: 0.5, // Controls how shiny the surface is (lower means shinier)
  });

  return (
    <mesh ref={sphereRef} geometry={geometry}>
      <primitive object={material} />
    </mesh>
  );
};

export default MobiusSphere;
