import axiosInstance from '../axiosInstance';

// types
import { AuthProvider, LoggedInState } from '../../@types';

// endpoints
import { AUTH_GW_BASE_URL } from '../endpoints';

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
    `${AUTH_GW_BASE_URL}/auth/${authRoute}/${authProvider}/authentication-request?appContext=${appContextUrlEncoded}`
  );
}

export function directToAuthGwLogout(authProvider: AuthProvider) {
  const authRoute = getAuthRoute(authProvider);
  const idToken = JSONSessionStorage.get(SESSION_STORAGE_AUTH_TOKENS).idToken;

  // Clear local state before emitting a logout request
  JSONSessionStorage.clear();

  window.location.assign(
    `${AUTH_GW_BASE_URL}/auth/${authRoute}/${authProvider}/logout-request?appContext=${appContextUrlEncoded}&idToken=${idToken}`
  );
}

export async function logIn(
  authPayload: {
    loginCode: string;
    appContext: string;
  },
  authProvider: AuthProvider
): Promise<LoggedInState> {
  const authRoute = getAuthRoute(authProvider);
  const response = await axiosInstance.post(
    `${AUTH_GW_BASE_URL}/auth/${authRoute}/${authProvider}/login-request`,
    authPayload,
    {
      withCredentials: true,
    }
  );
  return response.data;
}
