import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

interface MoleculeViewerProps {
  cid: number;
}

// Function to fetch molecule data from PubChem by CID
const fetchMolecule = async (cid: number): Promise<any> => {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/JSON`;
  const response = await fetch(url);
  const data = await response.json();
  return data.PropertyTable.Properties[0]; // Extracting the molecule data
};

// Molecule Viewer Component
const MoleculeViewer = ({ cid }: MoleculeViewerProps) => {
  const [atoms, setAtoms] = useState<THREE.Vector3[]>([]);

  useEffect(() => {
    // Fetch molecule data and parse atom coordinates
    const loadMoleculeData = async () => {
      try {
        const moleculeData = await fetchMolecule(cid);
        // Assuming atoms' positions are available in moleculeData (replace this with actual atom data structure)
        const atomPositions = moleculeData["atoms"]; // This is a placeholder; modify based on actual structure.
        const atomCoords = atomPositions.map(
          (atom: any) => new THREE.Vector3(atom.x, atom.y, atom.z)
        );
        setAtoms(atomCoords); // Store atom positions in state
      } catch (error) {
        console.error("Error loading molecule data:", error);
      }
    };

    loadMoleculeData();
  }, [cid]);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />

      {/* Render atoms as spheres */}
      {atoms.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="blue" />
        </mesh>
      ))}
    </Canvas>
  );
};

export default MoleculeViewer;
