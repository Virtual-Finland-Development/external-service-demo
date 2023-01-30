import axiosInstance from '../axiosInstance';

// types
import { UserProfile, StatusRecord } from '../../@types';

// endpoints
import { TESTBED_API_BASE_URL, USERS_API_BASE_URL } from '../endpoints';

export async function verify() {
  return axiosInstance.get(`${USERS_API_BASE_URL}/identity/verify`);
}

// testbed-api / productizer call
export async function get(consentToken?: string) {
  if (!consentToken) {
    throw new Error('Consent token is required');
  }
  return axiosInstance.post(
    `${TESTBED_API_BASE_URL}/testbed/productizers/user-profile`,
    null,
    {
      headers: {
        'X-Consent-Token': consentToken,
      },
    }
  );
}

export async function getRegStatus(): Promise<StatusRecord> {
  const { data } = await axiosInstance.post(
    `${TESTBED_API_BASE_URL}/testbed/productizers/fetch-user-status-info`,
    { statusName: 'foreigner_reg_form' }
  );
  return data;
}

export function sendRegStatus(payload: {
  statusName: string;
  statusValue: string;
}) {
  return axiosInstance.post(
    `${TESTBED_API_BASE_URL}/testbed/productizers/update-user-status-info`,
    payload
  );
}

export async function getConsents() {
  return axiosInstance.get(`${USERS_API_BASE_URL}/user/consents`);
}

export async function patch(payload: Partial<UserProfile>) {
  return axiosInstance.patch(`${USERS_API_BASE_URL}/user`, payload);
}

// profile related codesets
export function getCountries() {
  return axiosInstance.get(`${USERS_API_BASE_URL}/code-sets/countries`);
}

export function getOccupations() {
  return axiosInstance.get(`${USERS_API_BASE_URL}/code-sets/occupations-flat`);
}

export function getLanguages() {
  return axiosInstance.get(`${USERS_API_BASE_URL}/code-sets/languages`);
}
