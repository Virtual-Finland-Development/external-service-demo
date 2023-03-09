import axiosInstance from '../axiosInstance';

// endpoints
import { CODESETS_BASE_URL } from '../endpoints';


// profile related codesets
export function getCountries() {
  return axiosInstance.get(`${CODESETS_BASE_URL}/resources/ISO3166CountriesURL`);
}

export function getOccupations() {
  return axiosInstance.get(`${CODESETS_BASE_URL}/resources/OccupationsFlatURL`);
}

export function getLanguages() {
  return axiosInstance.get(`${CODESETS_BASE_URL}/resources/ISO639Languages`);
}
