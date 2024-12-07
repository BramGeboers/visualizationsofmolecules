import { Html } from "@react-three/drei";

interface PointSphereProps {
  x: number;
  y: number;
  z: number;
  color: string;
  label: string;
}

const PointSphere: React.FC<PointSphereProps> = ({ x, y, z, color, label }) => {
  return (
    <>
      {/* PointSphere */}
      <mesh position={[x, y, z]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <Html position={[x, y + 0.25, z]} center>
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

export default PointSphere;
