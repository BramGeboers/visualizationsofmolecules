// fetchService.ts
const BASE_URL_PUBCHEM = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound";
const BASE_URL_CHEMSPIDER = "https://api.rsc.org/compounds/v1";

// Fetch 3D molecule data from PubChem (SDF format), fallback to 2D if unavailable
export const fetchMolecule3D = async (cid: string): Promise<{ sdfData: string | null; is2D: boolean }> => {
  try {
    // Attempt to fetch 3D data
    const response3D = await fetch(`${BASE_URL_PUBCHEM}/cid/${cid}/SDF?record_type=3d`);
    if (response3D.ok) {
      return { sdfData: await response3D.text(), is2D: false }; // Return 3D SDF data
    } else {
      console.warn("3D data not available, attempting to fetch 2D data...");
    }

    // Fallback to fetch 2D data
    const response2D = await fetch(`${BASE_URL_PUBCHEM}/cid/${cid}/SDF?record_type=2d`);
    if (response2D.ok) {
      return { sdfData: await response2D.text(), is2D: true }; // Return 2D SDF data
    } else {
      throw new Error("Error fetching SDF data from PubChem (both 3D and 2D unavailable).");
    }
  } catch (error) {
    console.error("Error fetching SDF data from PubChem:", error);
    return { sdfData: null, is2D: false };
  }
};

export const fetchMolecule2D = async (cid: string): Promise<{ sdfData: string |  null  }> => {
  try {
    // Fallback to fetch 2D data
    const response2D = await fetch(`${BASE_URL_PUBCHEM}/cid/${cid}/SDF?record_type=2d`);
    if (response2D.ok) {
      return { sdfData: await response2D.text()}; // Return 2D SDF data
    } else {
      throw new Error("Error fetching SDF data from PubChem (both 3D and 2D unavailable).");
    }
  } catch (error) {
    console.error("Error fetching SDF data from PubChem:", error);
    return { sdfData: null};
  }
};



// Fetch molecule details (name, formula, etc.) from PubChem
export const fetchMoleculeDetails = async (cid: string): Promise<{ formula: string; name: string } | null> => {
  try {
    const response = await fetch(`${BASE_URL_PUBCHEM}/cid/${cid}/json`);
    if (!response.ok) {
      throw new Error("Error fetching molecule details from PubChem.");
    }
    const data = await response.json();
    const compound = data.PC_Compounds[0].props.reduce((acc: any, prop: any) => {
      if (prop.urn.label === "Molecular Formula") {
        acc.formula = prop.value.sval;
      } else if (prop.urn.label === "IUPAC Name") {
        acc.name = prop.value.sval;
      }
      return acc;
    }, { formula: "", name: "" });

    return compound.formula && compound.name ? compound : null;
  } catch (error) {
    console.error("Error fetching molecule details from PubChem:", error);
    return null;
  }
};

// Fetch molecule data from ChemSpider using Royal Society of Chemistry API
export const fetchChemSpiderMoleculeDetails = async (cid: string): Promise<any | null> => {
  const apiKey = "3lc0PVxhvI3CaTSMSqFssh1vhCG8W9o1iP8bWxpf"; // Use your ChemSpider API key here
  try {
    // First, filter compounds by CID
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const url = `${proxyUrl}https://api.rsc.org/compounds/v1/filter/name`;
    const filterResponse = await fetch(url, {
      method: "POST",
      headers: {
        "apikey": apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ name: cid, orderBy: "default", orderDirection: "default" })
    });
;

    const filterData = await filterResponse.json();
    const queryId = filterData.queryId;

    // Then, retrieve the results
    const resultResponse = await fetch(`${proxyUrl}${BASE_URL_CHEMSPIDER}/filter/${queryId}/results`, {
      headers: {
        "apikey": apiKey,
        "Accept": "application/json"
      }
    });

    const resultData = await resultResponse.json();
    const chemSpiderId = resultData.results[0];  // Assuming we get at least one result

    // Finally, fetch the detailed record for the ChemSpider ID
    const recordResponse = await fetch(`${BASE_URL_CHEMSPIDER}/records/${chemSpiderId}/details?fields=nominalMass,CommonName,formula,InChI,InChIkey,smiles`, {
      headers: {
        "apikey": apiKey,
        "Accept": "application/json"
      }
    });

    const recordData = await recordResponse.json();
    return recordData;
  } catch (error) {
    console.error("Error fetching ChemSpider data:", error);
    return null;
  }
};
