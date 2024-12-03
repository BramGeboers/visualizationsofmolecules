"use client";
import React, { useRef } from "react";
import * as THREE from "three";

interface Circle2DProps {
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

const Circle2D: React.FC<Circle2DProps> = ({
  radius,
  segments,
  center,
  P,
  L,
  color,
  mobiusScalingTransform,
}) => {
  const circleRef = useRef<THREE.Line>(null);
  const [centerX, centerY] = center;

  // Generate transformed circle points using the Möbius transformation
  const points = Array.from({ length: segments + 1 }, (_, i) => {
    const angle = (i / segments) * Math.PI * 2; // Angle in radians
    const originalPoint = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      z: 0,
    };
    const transformedPoint = mobiusScalingTransform(originalPoint, P, L);
    return new THREE.Vector3(
      transformedPoint.x, // x after transformation
      transformedPoint.y // y after transformation
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

export default Circle2D;
