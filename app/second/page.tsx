"use client";
import { useState, useEffect } from "react";
import {
  fetchChemSpiderMoleculeDetails,
  fetchMolecule2D,
  fetchMolecule3D,
  fetchMoleculeDetails,
} from "@/utils/fetchmolecule";
import { parseSDF, Atom, Bond } from "@/utils/parseSDF";
import { ModelViewer2D } from "@/components/activeModelViewer2D";
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

    let sdfData: string | null = null;
    let is2D: boolean = false;
    let details: { formula: string; name: string } | null = null;

    try {
      // Attempt fetching from PubChem
      const pubChemResult = await fetchMolecule2D(inputValue);
      sdfData = pubChemResult.sdfData;
      details = await fetchMoleculeDetails(inputValue);

      if (!sdfData || !details) {
        console.warn("PubChem data unavailable, trying ChemSpider...");
        const chemSpiderData = await fetchChemSpiderMoleculeDetails(inputValue);

        if (chemSpiderData) {
          sdfData = chemSpiderData.sdfData; // Assuming ChemSpider provides SDF data
          details = {
            formula: chemSpiderData.formula || "N/A",
            name: chemSpiderData.name || "Unknown",
          };
          is2D = true; // Assume ChemSpider data is 2D
        }
      }

      if (sdfData && details) {
        const { atoms: parsedAtoms, bonds: parsedBonds } = parseSDF(sdfData);
        setAtoms(parsedAtoms);
        setBonds(parsedBonds);
        setMoleculeFormula(details.formula);
        setMoleculeName(details.name);
      } else {
        alert(
          "Molecule not found or error fetching data from both PubChem and ChemSpider."
        );
      }
    } catch (error) {
      console.error("Error during molecule search:", error);
      alert("An error occurred while fetching molecule data.");
    } finally {
      setIsLoading(false);
    }
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
          <ModelViewer2D
            atoms={atoms}
            bonds={bonds}
            moleculeName={moleculeName}
            moleculeFormula={moleculeFormula}
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
