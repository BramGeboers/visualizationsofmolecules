import React, { useRef, useEffect } from "react";
import { PlaneGeometry, Mesh, ShaderMaterial, Color } from "three";
import { mobiusScalingTransform } from "@/utils/transformation";

// MobiusPlane component that applies Möbius scaling transformation and renders an orthogonal grid in 3D
const MobiusPlane: React.FC<{
  lineWidth: number;
  density: number;
  L: number;
  size: number;
  resolution: number;
  P: { x: number; y: number; z: number };
}> = ({ L, P, lineWidth, density, size, resolution }) => {
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

        const point = { x: x, y: y, z: z };
        const transformed = mobiusScalingTransform(point, P, L);

        geometry.attributes.position.setXYZ(
          i,
          transformed.x,
          transformed.y,
          transformed.z
        );
      }
    }
  }, [L, P]);

  // Shader material for the infinite orthogonal grid (still in 2D projection)
  const gridMaterial = new ShaderMaterial({
    uniforms: {
      color: { value: new Color("black") },
      lineWidth: { value: lineWidth },
      scale: { value: density },
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
      <planeGeometry args={[size, size, resolution, resolution]} />
    </mesh>
  );
};

export default MobiusPlane;
