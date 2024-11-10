"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { TextureLoader } from "three";
import { Mesh } from "three";

interface ModelViewerProps {
  rotationSpeed: number;
}

export const ModelViewer: React.FC<ModelViewerProps> = ({ rotationSpeed }) => {
  return (
    <Canvas
      style={{ height: "1080px", width: "100%" }}
      camera={{ position: [0, 0, 5] }}
      gl={{ antialias: true }}
      shadows
    >
      <ImageOverlay rotationSpeed={rotationSpeed} />
    </Canvas>
  );
};

interface ImageOverlayProps {
  rotationSpeed: number;
}

export const ImageOverlay: React.FC<ImageOverlayProps> = ({
  rotationSpeed,
}) => {
  const texture = useLoader(TextureLoader, "/IMG101.jpg");
  const planeRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (planeRef.current) {
      planeRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

      <mesh ref={planeRef} receiveShadow castShadow>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </>
  );
};
