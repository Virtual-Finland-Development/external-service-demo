import axiosInstance from '../axiosInstance';

// types
import { AuthProvider, AuthTokens } from '../../@types';

// endpoints
import { AUTH_GW_ENDPOINT } from '../endpoints';

// constants
import {
  appContextUrlEncoded,
  SESSION_STORAGE_AUTH_TOKENS,
} from '../../constants';

// utils
import { JSONSessionStorage } from '../../utils';

function getAuthRoute(authProvider: AuthProvider) {
  let route = '';

  switch (authProvider) {
    case AuthProvider.TESTBED:
    case AuthProvider.SINUNA:
      route = 'openid';
      break;
    case AuthProvider.SUOMIFI:
      route = 'saml2';
      break;
    default:
      route = 'openid';
  }

  return route;
}

export function directToAuthGwLogin(authProvider: AuthProvider) {
  const authRoute = getAuthRoute(authProvider);
  window.location.assign(
    `${AUTH_GW_ENDPOINT}/auth/${authRoute}/${authProvider}/login-request?appContext=${appContextUrlEncoded}`
  );
}

export function directToAuthGwLogout(authProvider: AuthProvider) {
  const authRoute = getAuthRoute(authProvider);
  const idToken = JSONSessionStorage.get(SESSION_STORAGE_AUTH_TOKENS).idToken;
  window.location.assign(
    `${AUTH_GW_ENDPOINT}/auth/${authRoute}/${authProvider}/logout-request?appContext=${appContextUrlEncoded}&idToken=${idToken}`
  );
}

export async function getAuthTokens(
  authPayload: {
    loginCode: string;
    appContext: string;
  },
  authProvider: AuthProvider
): Promise<AuthTokens> {
  const authRoute = getAuthRoute(authProvider);
  const response = await axiosInstance.post(
    `${AUTH_GW_ENDPOINT}/auth/${authRoute}/${authProvider}/auth-token-request`,
    authPayload,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function getUserInfo(
  authProvider: AuthProvider,
  payload: { accessToken: string; appContext: string }
) {
  const authRoute = getAuthRoute(authProvider);
  return axiosInstance.post(
    `${AUTH_GW_ENDPOINT}/auth/${authRoute}/${authProvider}/user-info-request`,
    payload,
    {
      withCredentials: true,
    }
  );
}