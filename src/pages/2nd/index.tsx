import { useState, useEffect } from "react";
import { fetchMolecule3D } from "@/utils/fetchmolecule";
import { parseSDF, Atom, Bond } from "@/utils/parseSDF";
import { ModelViewer } from "@/src/components/modelViewer3Backup";

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
    <div className="bg-gray-700 w-full h-[100vh] text-white">
      <div className="flex w-full fixed flex-col items-center">
        <h1 className="uppercase text-4xl font-bold p-6">3D Molecule Viewer</h1>
        <input
          className="p-2 w-[300px] text-center text-white bg-gray-900 rounded-xl"
          type="text"
          placeholder="Enter compound CID or name"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button
          className="rounded-xl bg-gray-900 p-4 mt-3 w-[200px] font-bold text-lg uppercase"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {isLoading ? (
        <p>Loading molecule...</p>
      ) : atoms.length > 0 ? (
        <div className="h-[100vh] bg-gray-500">
          <ModelViewer atoms={atoms} bonds={bonds} />
        </div>
      ) : (
        <p>Enter a CID or name to view a molecule.</p>
      )}
    </div>
  );
};

export default Home;
