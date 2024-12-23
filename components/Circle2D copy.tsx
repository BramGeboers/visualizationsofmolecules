"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { mobiusScalingTransform } from "@/utils/transformation";
import { Html, Point } from "@react-three/drei";
import PointSphere from "./PointSphere";

interface Circle2DProps {
  radius: number;
  segments: number;
  center: Array<number>;
  color: string;
  P: { x: number; y: number; z: number };
  L: number;
  onUpdate?: (circumcenter: { x: number; y: number }, radius: number) => void; // Callback to update the main component
}

const Circle2D: React.FC<Circle2DProps> = ({
  radius,
  segments,
  center,
  P,
  L,
  color,
  onUpdate, // Callback prop to pass back the circumcenter and radius
}) => {
  const circleRef = useRef<THREE.Line>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const [centerX, centerY] = center;

  // Generate transformed circle points using the Möbius transformation
  const transformedPoints = Array.from({ length: segments + 1 }, (_, i) => {
    const angle = (i / segments) * Math.PI * 2; // Angle in radians
    const originalPoint = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      z: 0,
    };
    return mobiusScalingTransform(originalPoint, P, L);
  });

  // Calculate the circumcenter
  const calculateCircumcenter = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number }
  ) => {
    const A = p2.x - p1.x;
    const B = p2.y - p1.y;
    const C = p3.x - p1.x;
    const D = p3.y - p1.y;
    const E = A * (p1.x + p2.x) + B * (p1.y + p2.y);
    const F = C * (p1.x + p3.x) + D * (p1.y + p3.y);
    const G = 2 * (A * (p3.y - p2.y) - B * (p3.x - p2.x));

    if (Math.abs(G) < 1e-10) {
      console.error("Points are collinear or too close together!");
      return { x: 0, y: 0 }; // Default to origin if calculation fails
    }

    const cx = (D * E - B * F) / G;
    const cy = (A * F - C * E) / G;

    return { x: cx, y: cy };
  };

  // Pick three non-collinear points (e.g., first, middle, last)
  const p1 = transformedPoints[0];
  const p2 = transformedPoints[Math.floor(transformedPoints.length / 2)];
  const p3 = transformedPoints[transformedPoints.length - 2]; // Avoid duplicate point at the end

  const circumcenter = calculateCircumcenter(
    { x: p1.x, y: p1.y },
    { x: p2.x, y: p2.y },
    { x: p3.x, y: p3.y }
  );

  // Calculate the radius as the distance from the circumcenter to any point
  const dx = p1.x - circumcenter.x;
  const dy = p1.y - circumcenter.y;
  const radiusFromCenter = Math.sqrt(dx * dx + dy * dy);

  // Log the circumcenter and radius
  useEffect(() => {
    console.log("Circumcenter:", circumcenter);
    console.log("Radius:", radiusFromCenter);
  }, [circumcenter, radiusFromCenter]);

  // Create geometry from transformed points
  const geometry = new THREE.BufferGeometry().setFromPoints(
    transformedPoints.map(
      (point) => new THREE.Vector3(point.x, point.y, point.z)
    )
  );

  useEffect(() => {
    // Log the circumcenter and radius
    console.log("Circumcenter:", circumcenter);
    console.log("Radius:", radiusFromCenter);

    // Pass the circumcenter and radius to the parent component via the onUpdate callback
    if (onUpdate) {
      onUpdate(circumcenter, radiusFromCenter);
    }
  }, [circumcenter, radiusFromCenter, onUpdate]);

  return (
    <>
      {/* Render the circle */}
      <primitive
        object={
          new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({ color: color })
          )
        }
        ref={circleRef}
      />

      <Html position={[circumcenter.x, circumcenter.y, 0]} center>
        <div
          style={{
            color: "white",
            background: "rgba(0, 0, 0, 0.2)",
            padding: "2px 5px",
            borderRadius: "4px",
            fontSize: "16px",
            whiteSpace: "nowrap", // Ensures text stays on one line
          }}
        >
          <p>Radius: {radiusFromCenter.toFixed(2)}</p>
          <p>
            Center: ({circumcenter.x.toFixed(2)}, {circumcenter.y.toFixed(2)})
          </p>
        </div>
      </Html>

      <PointSphere x={circumcenter.x} y={circumcenter.y} z={0} color={"red"} />
    </>
  );
};

export default Circle2D;
