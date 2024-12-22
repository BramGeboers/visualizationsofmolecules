import React, { useEffect, useRef } from "react";
import { mobiusScalingTransform } from "@/utils/transformation";
import * as THREE from "three";

interface BondProps {
  start: [number, number, number];
  end: [number, number, number];
  type: number; // 1 for single, 2 for double, 3 for triple, etc.
  L: number; // Add L property
  P: { x: number; y: number; z: number }; // Add P property
}

const BondModel: React.FC<BondProps> = ({ start, end, type, L, P }) => {
  // Apply Möbius transformation to both start and end positions
  const transformedStart = mobiusScalingTransform(
    { x: start[0], y: start[1], z: start[2] },
    P,
    L
  );
  const transformedEnd = mobiusScalingTransform(
    { x: end[0], y: end[1], z: end[2] },
    P,
    L
  );

  // Midpoint and direction based on transformed positions
  const midPoint: [number, number, number] = [
    (transformedStart.x + transformedEnd.x) / 2,
    (transformedStart.y + transformedEnd.y) / 2,
    (transformedStart.z + transformedEnd.z) / 2,
  ];

  const direction = new THREE.Vector3(
    transformedEnd.x - transformedStart.x,
    transformedEnd.y - transformedStart.y,
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
