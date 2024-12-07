import { Html } from "@react-three/drei";
import { mobiusScalingTransform } from "@/utils/transformation";

interface TransformedPointSphereProps {
  x: number;
  y: number;
  z: number;
  color: string;
  label: string;
  P: { x: number; y: number; z: number };
  L: number;
}

const TransformedPointSphere: React.FC<TransformedPointSphereProps> = ({
  x,
  y,
  z,
  P,
  L,
  color,
  label,
}) => {
  const transformed = mobiusScalingTransform({ x: x, y: y, z: z }, P, L);
  return (
    <>
      <mesh position={[transformed.x, transformed.y, transformed.z]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Html
        position={[transformed.x, transformed.y + 0.25, transformed.z]}
        center
      >
        <div
          style={{
            color: "white",
            background: "rgba(0, 0, 0, 0.2)",
            padding: "2px 5px",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        >
          {label}
        </div>
      </Html>
    </>
  );
};

export default TransformedPointSphere;
