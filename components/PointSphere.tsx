interface PointSphereProps {
  x: number;
  y: number;
  z: number;
  color: string;
}

const PointSphere: React.FC<PointSphereProps> = ({ x, y, z, color }) => {
  return (
    <mesh position={[x, y, z]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default PointSphere;
