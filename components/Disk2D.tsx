"use client";
import React, { useRef } from "react";
import * as THREE from "three";
import { atomicRadii, atomColors } from "@/utils/atomdata";
import { mobiusScalingTransform } from "@/utils/transformation";
import { Html } from "@react-three/drei";

interface Disk2DProps {
  segments: number;
  center: Array<number>;
  P: { x: number; y: number; z: number };
  L: number;
  symbol: string;
  onClick: () => void;
}

const Disk2D: React.FC<Disk2DProps> = ({
  symbol,
  segments,
  center,
  P,
  L,
  onClick,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [centerX, centerY] = center;

  const radius = 0.65 * atomicRadii[symbol] || 0.8; // Default to 0.8 if symbol is not in the dictionary
  const color = atomColors[symbol] || "gray"; // Default to gray if symbol is not in the dictionary

  // Generate transformed circle points using the Möbius transformation
  const points = Array.from({ length: segments }, (_, i) => {
    const angle = (i / segments) * Math.PI * 2; // Angle in radians
    const originalPoint = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      z: 0,
    };
    const transformedPoint = mobiusScalingTransform(originalPoint, P, L);
    return new THREE.Vector2(transformedPoint.x, transformedPoint.y); // 2D points for Shape
  });

  // Create the Shape
  const shape = new THREE.Shape(points);

  // Create geometry for the filled disk
  const geometry = new THREE.ShapeGeometry(shape);

  const transformedPoint = mobiusScalingTransform(
    { x: centerX, y: centerY, z: 0 },
    P,
    L
  );

  return (
    <>
      <mesh ref={meshRef} onClick={onClick} geometry={geometry}>
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>

      <Html
        position={[transformedPoint.x, transformedPoint.y, transformedPoint.z]}
        center
      >
        <div
          style={{
            color: "black",
            textEmphasisColor: "white",
            fontSize: "24px",
          }}
        >
          {symbol}
        </div>
      </Html>
    </>
  );
};

export default Disk2D;
