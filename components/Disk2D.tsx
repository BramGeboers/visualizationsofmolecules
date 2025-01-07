"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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

const Disk2D = forwardRef(
  ({ symbol, segments, center, P, L, onClick }: Disk2DProps, ref) => {
    const meshRef = useRef<THREE.Mesh>(null);

    const [centerX, setCenterX] = useState(center[0]);
    const [centerY, setCenterY] = useState(center[1]);
    const [radius1, setRadius1] = useState(0.65 * atomicRadii[symbol] || 0.8);

    const color = atomColors[symbol] || "gray"; // Default to gray if symbol is not in the dictionary

    // Generate transformed circle points using the Möbius transformation
    const points = Array.from({ length: segments }, (_, i) => {
      const angle = (i / segments) * Math.PI * 2; // Angle in radians
      const originalPoint = {
        x: centerX + radius1 * Math.cos(angle),
        y: centerY + radius1 * Math.sin(angle),
        z: 0,
      };
      const transformedPoint = mobiusScalingTransform(originalPoint, P, L);
      return new THREE.Vector2(transformedPoint.x, transformedPoint.y); // 2D points for Shape
    });

    // Create the Shape
    const shape = new THREE.Shape(points);

    // Create geometry for the filled disk
    const geometry = new THREE.ShapeGeometry(shape);

    // Transform center point using the Möbius transformation
    const transformedPoint = mobiusScalingTransform(
      { x: centerX, y: centerY, z: 0 },
      P,
      L
    );

    // Calculate the center of the disk after transformation
    const calculateCircumcenter = (
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      p3: { x: number; y: number }
    ): { x: number; y: number } => {
      const A = p2.x - p1.x;
      const B = p2.y - p1.y;
      const C = p3.x - p1.x;
      const D = p3.y - p1.y;
      const E = A * (p1.x + p2.x) + B * (p1.y + p2.y);
      const F = C * (p1.x + p3.x) + D * (p1.y + p3.y);
      const G = 2 * (A * (p3.y - p2.y) - B * (p3.x - p2.x));

      if (Math.abs(G) < 1e-10) {
        console.error("Points are collinear or too close together!");
        return { x: 0, y: 0 };
      }

      const cx = (D * E - B * F) / G;
      const cy = (A * F - C * E) / G;

      return { x: cx, y: cy };
    };

    const p1 = points[0];
    const p2 = points[Math.floor(points.length / 2)];
    const p3 = points[points.length - 1];

    const circumcenter = calculateCircumcenter(
      { x: p1.x, y: p1.y },
      { x: p2.x, y: p2.y },
      { x: p3.x, y: p3.y }
    );

    const dx = p1.x - circumcenter.x;
    const dy = p1.y - circumcenter.y;
    const radiusFromCenter = Math.sqrt(dx * dx + dy * dy);

    // Use imperative handle to expose functions for zoom and reset
    useImperativeHandle(ref, () => ({
      applyZoom: () => {
        setCenterX(circumcenter.x);
        setCenterY(circumcenter.y);
        setRadius1(radiusFromCenter);
      },
      applyReset: () => {
        setCenterX(center[0]);
        setCenterY(center[1]);
        setRadius1(0.65 * atomicRadii[symbol] || 0.8); // Reset radius based on symbol
      },
    }));

    return (
      <>
        <mesh ref={meshRef} onClick={onClick} geometry={geometry}>
          <meshBasicMaterial color={color} side={THREE.DoubleSide} />
        </mesh>

        <Html
          position={[
            transformedPoint.x,
            transformedPoint.y,
            transformedPoint.z,
          ]}
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
  }
);

export default Disk2D;
