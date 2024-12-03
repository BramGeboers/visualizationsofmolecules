"use client";
import React, { useRef } from "react";
import * as THREE from "three";

interface CircleProps {
  radius: number;
  segments: number;
  center: Array<number>;
  color: string;
  P: { x: number; y: number; z: number };
  L: number;
  mobiusScalingTransform: (
    point: { x: number; y: number; z: number },
    P: { x: number; y: number; z: number },
    L: number
  ) => { x: number; y: number; z: number };
}

const Circle: React.FC<CircleProps> = ({
  radius,
  segments,
  center,
  P,
  L,
  color,
  mobiusScalingTransform,
}) => {
  const circleRef = useRef<THREE.Line>(null);
  const [centerX, centerY, centerZ] = center;

  // Generate transformed sphere points using the Möbius transformation
  const points = Array.from({ length: segments + 1 }, (_, i) => {
    const theta = (i / segments) * Math.PI; // θ angle in radians (0 to π)
    const phi = (i / segments) * Math.PI * 2; // φ angle in radians (0 to 2π)

    // Convert spherical coordinates (θ, φ) to Cartesian coordinates (x, y, z)
    const originalPoint = {
      x: centerX + radius * Math.sin(theta) * Math.cos(phi),
      y: centerY + radius * Math.sin(theta) * Math.sin(phi),
      z: centerZ + radius * Math.cos(theta),
    };

    const transformedPoint = mobiusScalingTransform(originalPoint, P, L);
    return new THREE.Vector3(
      transformedPoint.x, // x after transformation
      transformedPoint.y, // y after transformation
      transformedPoint.z // z after transformation
    );
  });

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <primitive
      object={
        new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: color }))
      }
      ref={circleRef}
    />
  );
};

export default Circle;
