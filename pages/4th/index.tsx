import { useState, useEffect } from "react";
import { fetchMolecule3D } from "@/utils/fetchmolecule";
import { parseSDF, Atom, Bond } from "@/utils/parseSDF";
import { ModelViewer } from "@/components/ModelViewer3";

const Home: React.FC = () => {
  const [atoms, setAtoms] = useState<Atom[]>([]);
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = async () => {
    if (!inputValue) return;
    setIsLoading(true);
    const sdfData = await fetchMolecule3D(inputValue);
    if (sdfData) {
      const { atoms: parsedAtoms, bonds: parsedBonds } = parseSDF(sdfData);
      setAtoms(parsedAtoms);
      setBonds(parsedBonds);
    } else {
      alert("Molecule not found or error fetching data.");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>3D Molecule Viewer</h1>
        <input
          type="text"
          placeholder="Enter compound CID or name"
          value={inputValue}
          onChange={handleInputChange}
          style={{ marginBottom: "10px", padding: "5px" }}
        />
        <button onClick={handleSearch} style={{ marginLeft: "10px" }}>
          Search
        </button>
      </div>
      {isLoading ? (
        <p>Loading molecule...</p>
      ) : atoms.length > 0 ? (
        <div className="h-[60vh] bg-gray-500">
          <ModelViewer atoms={atoms} bonds={bonds} />
        </div>
      ) : (
        <p>Enter a CID or name to view a molecule.</p>
      )}
    </div>
  );
};

export default Home;
