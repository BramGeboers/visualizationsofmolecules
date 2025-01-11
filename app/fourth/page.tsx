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
  const [preview, setPreview] = useState<boolean>(false);
  const [is2D, setIs2D] = useState<boolean>(false);

  const [moleculeName, setMoleculeName] = useState<string>("");
  const [moleculeFormula, setMoleculeFormula] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handlePreset = (cid: string) => {
    setInputValue(cid); // Update input value
    handleSearch(cid); // Call handleSearch with the preset value
  };

  const handleSearch = async (cid?: string) => {
    const searchValue = cid || inputValue; // Use CID if provided, otherwise use inputValue
    console.log("Searching for molecule with CID:", searchValue);

    if (!searchValue) return;

    setIsLoading(true);

    let sdfData: string | null = null;
    let details: { formula: string; name: string } | null = null;

    try {
      // Attempt fetching from PubChem
      const pubChemResult = await fetchMolecule3D(searchValue);
      if (pubChemResult.is2D) {
        setIs2D(pubChemResult.is2D);
      } else {
        setIs2D(false);
      }
      sdfData = pubChemResult.sdfData;
      details = await fetchMoleculeDetails(searchValue);

      // If PubChem fails, try ChemSpider
      if (!sdfData || !details) {
        console.warn("PubChem data unavailable, trying ChemSpider...");
        const chemSpiderData = await fetchChemSpiderMoleculeDetails(
          searchValue
        );

        if (chemSpiderData) {
          sdfData = chemSpiderData.sdfData; // Assuming ChemSpider provides SDF data
          details = {
            formula: chemSpiderData.formula || "N/A",
            name: chemSpiderData.name || "Unknown",
          };
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
      <div className="flex absolute z-50 left-[50vw] h-[56px] lg:pt-4 pt-28 items-top -translate-x-[50%]">
        <div
          onMouseEnter={() => setPreview(true)}
          onMouseLeave={() => setPreview(false)}
        >
          <input
            className="p-1 w-[230px] text-center bg-[#242424] border-[#DBD8D5] border-2 rounded-md mt-1 mr-4 bg-opacity-0 appearance-none focus:outline-none focus:ring-0"
            type="number"
            min={1}
            placeholder="Enter a Pubchem CID"
            value={inputValue}
            onChange={handleInputChange}
            style={{
              // Hide the spinner controls
              MozAppearance: "textfield",
              WebkitAppearance: "none",
            }}
          />
          <div
            className={`w-[230px] text-center bg-[#242424] border-[#DBD8D5] border-b-2 border-l-2 border-r-2 pt-2 rounded-b-md mr-4 bg-opacity-0 transition-all duration-300 ${
              preview
                ? " opacity-100 -translate-y-1"
                : " opacity-0 -translate-y-4"
            }`}
          >
            <ul>
              {[
                { cid: "962", name: "Water (H₂O)" },
                { cid: "2519", name: "Caffeine (C₈H₁₀N₄O₂)" },
                { cid: "2244", name: "Aspirin (C₉H₈O₄)" },
                { cid: "5793", name: "Glucose (C₆H₁₂O₆)" },
                { cid: "3672", name: "Ibuprofen (C₁₃H₁₈O₂)" },
              ].map((preset) => (
                <li
                  key={preset.cid}
                  className="p-2 even:bg-opacity-10 bg-opacity-0 bg-black cursor-pointer hover:bg-opacity-25"
                  onClick={() => handlePreset(preset.cid)}
                >
                  {preset.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          className="rounded-md bg-[#4AC585] hover:bg-[#3faa73] transition-all duration-200 text-[#111111] p-1 px-3 font-bold text-lg uppercase"
          onClick={() => handleSearch()}
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
