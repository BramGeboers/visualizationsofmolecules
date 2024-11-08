import axios from 'axios';

export async function fetchMolecule3D(cid: string): Promise<string | null> {
  try {
    const response = await axios.get(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF/?record_type=3d&response_type=display`,
      { responseType: 'text' }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching molecule data:', error);
    return null;
  }
}
