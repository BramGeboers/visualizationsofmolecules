"use client";
import { useState, useEffect } from "react";
import {
  fetchChemSpiderMoleculeDetails,
  fetchMolecule3D,
  fetchMoleculeDetails,
} from "@/utils/fetchmolecule";
import { parseSDF, Atom, Bond } from "@/utils/parseSDF";
import { ModelViewer } from "@/components/activeModelViewerAdapt";
import Navbar from "@/components/Navbar";

const Home: React.FC = () => {
  const [atoms, setAtoms] = useState<Atom[]>([]);
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [is2D, setIs2D] = useState<boolean>(false); // Track if the data is 2D

  const [moleculeName, setMoleculeName] = useState<string>("");
  const [moleculeFormula, setMoleculeFormula] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = async () => {
    if (!inputValue) return;
    setIsLoading(true);

    // Fetch molecule data
    const { sdfData, is2D } = await fetchMolecule3D(inputValue);
    const details = await fetchMoleculeDetails(inputValue);

    if (sdfData && details) {
      const { atoms: parsedAtoms, bonds: parsedBonds } = parseSDF(sdfData);
      setAtoms(parsedAtoms);
      setBonds(parsedBonds);
      setMoleculeFormula(details.formula);
      setMoleculeName(details.name);
      setIs2D(is2D); // Update 2D status
    } else {
      alert("Molecule not found or error fetching data.");
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full h-[100vh] bg-[#242424] text-[#DBD8D5]">
      <Navbar />
      <div className="flex absolute z-50 left-[50vw] h-[56px] lg:pt-4 pt-28 items-center -translate-x-[50%]">
        <input
          className="p-1 w-[230px] text-center bg-[#242424] border-[##DBD8D5] border-2 rounded-md mr-4 bg-opacity-0 "
          type="text"
          placeholder="Enter a Pubchem CID"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button
          className="rounded-md bg-[#4AC585] hover:bg-[#3faa73] transition-all duration-200  text-[#111111] p-1 px-3 font-bold text-lg uppercase"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {isLoading ? (
        <p className="fixed top-[50vh] left-[50vw] -translate-x-1/2 -translate-y-1/2">
          Loading molecule...
        </p>
      ) : atoms.length > 0 ? (
        <div className="h-[100vh] bg-gray-500">
          <ModelViewer
            atoms={atoms}
            bonds={bonds}
            moleculeName={moleculeName}
            moleculeFormula={moleculeFormula}
            is2D={is2D}
          />
        </div>
      ) : (
        <p className="fixed top-[50vh] left-[50vw] -translate-x-1/2 -translate-y-1/2">
          Enter a Pubchem CID to view a molecule.
        </p>
      )}
    </div>
  );
};

export default Home;
