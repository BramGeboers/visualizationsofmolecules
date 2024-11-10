import axios from 'axios';

// Function to fetch 3D molecule data (unchanged)
export async function fetchMolecule3D(cid: string): Promise<string | null> {
  try {
    const response = await axios.get(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF/?record_type=3d&response_type=display`,
      { responseType: 'text' }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error response:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
}

// New function to fetch molecule name and chemical formula
export async function fetchMoleculeDetails(cid: string): Promise<{ name: string; formula: string } | null> {
  try {
    const response = await axios.get(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/IUPACName,MolecularFormula/JSON`
    );

    const properties = response.data?.PropertyTable?.Properties[0];
    if (properties) {
      return {
        name: properties.IUPACName || 'Unknown Name',
        formula: properties.MolecularFormula || 'Unknown Formula',
      };
    } else {
      throw new Error('No data found for the given CID');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error response:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
}
