import { mobiusScalingTransform } from "@/utils/transformation";

interface TransformedPointSphereProps {
  x: number;
  y: number;
  z: number;
  P: { x: number; y: number; z: number };
  L: number;
}

const TransformedPointSphere: React.FC<TransformedPointSphereProps> = ({
  x,
  y,
  z,
  P,
  L,
}) => {
  const transformed = mobiusScalingTransform({ x: x, y: y, z: z }, P, L);
  return (
    <mesh position={[transformed.x, transformed.y, transformed.z]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={"yellow"} />
    </mesh>
  );
};

export default TransformedPointSphere;
