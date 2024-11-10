"use client";
import { useState, useEffect } from "react";
import { fetchMolecule3D, fetchMoleculeDetails } from "@/utils/fetchmolecule";
import { parseSDF, Atom, Bond } from "@/utils/parseSDF";
import { ModelViewer } from "@/components/activeModelViewer";
import Image from "next/image";
import image1 from "@/public/logo.svg";
import Navbar from "@/components/Navbar";

const Home: React.FC = () => {
  const [atoms, setAtoms] = useState<Atom[]>([]);
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [moleculeName, setMoleculeName] = useState<string>("");
  const [moleculeFormula, setMoleculeFormula] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = async () => {
    if (!inputValue) return;
    setIsLoading(true);
    const [sdfData, details] = await Promise.all([
      fetchMolecule3D(inputValue),
      fetchMoleculeDetails(inputValue),
    ]);

    if (sdfData && details) {
      const { atoms: parsedAtoms, bonds: parsedBonds } = parseSDF(sdfData);
      setAtoms(parsedAtoms);
      setBonds(parsedBonds);
      setMoleculeFormula(details.formula);
      setMoleculeName(details.name);
    } else {
      alert("Molecule not found or error fetching data.");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full h-[100vh] bg-[#242424] text-[#DBD8D5]">
      <Navbar />
      <div className="flex absolute z-50 left-[50vw] h-[56px] pt-4 items-center -translate-x-[50%]">
        <input
          className="p-1 w-[230px] text-center bg-[#242424] border-[##DBD8D5] border-2 rounded-md mr-4 bg-opacity-0 "
          type="text"
          placeholder="Enter compound CID or name"
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
          />
        </div>
      ) : (
        <p className="fixed top-[50vh] left-[50vw] -translate-x-1/2 -translate-y-1/2">
          Enter a CID or name to view a molecule.
        </p>
      )}
    </div>
  );
};

export default Home;
