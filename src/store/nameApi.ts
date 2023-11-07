/*
const BASE_URL = 'http://127.0.0.1:9000/api/app';

export async function getEFOName(efoId: string): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/get_diseaseOrDrug_name?id=EFO_${efoId}`);
    if (response.ok) {
      const data = await response.json();
      return data.name;
    } else {
      console.error('Error fetching EFO name:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching EFO name:', error);
    return null;
  }
}

export async function getCHEBIName(chebiId: string): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/get_diseaseOrDrug_name?id=CHEBI_${chebiId}`);
    if (response.ok) {
      const data = await response.json();
      return data.name;
    } else {
      console.error('Error fetching CHEBI name:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching CHEBI name:', error);
    return null;
  }
}

export async function getMONDOName(mondoId: string): Promise<string | null> {
    try {
      const response = await fetch(`${BASE_URL}/get_diseaseOrDrug_name?id=MONDO_${mondoId}`);
      if (response.ok) {
        const data = await response.json();
        return data.name;
      } else {
        console.error('Error fetching MONDO name:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching MONDO name:', error);
      return null;
    }
  }
  
  export async function getHPName(hpoId: string): Promise<string | null> {
    try {
      const response = await fetch(`${BASE_URL}/get_diseaseOrDrug_name?id=HP_${hpoId}`);
      if (response.ok) {
        const data = await response.json();
        return data.name;
      } else {
        console.error('Error fetching HP name:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching HP name:', error);
      return null;
    }
  }
  
  export async function getGOName(goId: string): Promise<string | null> {
    try {
      const response = await fetch(`${BASE_URL}/get_diseaseOrDrug_name?id=GO_${goId}`);
      if (response.ok) {
        const data = await response.json();
        return data.name;
      } else {
        console.error('Error fetching GO name:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching GO name:', error);
      return null;
    }
  }
  
  export async function getNCITName(ncitId: string): Promise<string | null> {
    try {
      const response = await fetch(`${BASE_URL}/get_diseaseOrDrug_name?id=NCIT_${ncitId}`);
      if (response.ok) {
        const data = await response.json();
        return data.name;
      } else {
        console.error('Error fetching NCIT name:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching NCIT name:', error);
      return null;
    }
  }
  
  export async function getOrphanetName(orphanetId: string): Promise<string | null> {
    try {
      const response = await fetch(`${BASE_URL}/get_diseaseOrDrug_name?id=${orphanetId}`);
      if (response.ok) {
        const data = await response.json();
        return data.name;
      } else {
        console.error('Error fetching Orphanet name:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching Orphanet name:', error);
      return null;
    }
  }
  */