import axios from 'axios';
import {
  appContextUrlEncoded,
  SESSION_STORAGE_AUTH_TOKENS,
} from '../../constants';
import { JSONSessionStorage } from '../../utils/JSONStorage';
import { AUTH_GW_BASE_URL } from '../endpoints';

export type ConsentSituation = {
  consentStatus: string;
  consentToken?: string;
  redirectUrl?: string;
};

export async function checkConsent(
  dataSourceUri: string,
  consentToken?: string
): Promise<ConsentSituation> {
  const idToken = JSONSessionStorage.get(SESSION_STORAGE_AUTH_TOKENS).idToken;

  const response = await axios.post(
    `${AUTH_GW_BASE_URL}/consents/testbed/consent-check`,
    JSON.stringify({
      appContext: appContextUrlEncoded,
      dataSources: [{ uri: dataSourceUri, consentToken: consentToken }],
    }),
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );

  return response.data;
}

export function directToConsentService(consentSituation: ConsentSituation) {
  if (!consentSituation.redirectUrl) {
    throw new Error('Invalid consent situation');
  }
  window.location.assign(consentSituation.redirectUrl);
}
