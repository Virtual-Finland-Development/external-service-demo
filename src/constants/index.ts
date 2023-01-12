import { AppContextObj } from '../@types';

// local storage
export const SESSION_STORAGE_AUTH_PROVIDER = 'esd-auth-provider';
export const SESSION_STORAGE_AUTH_TOKENS = 'esd-auth-tokens';
export const SESSION_STORAGE_AUTH_USER_ID = 'esd-auth-user-id';
export const SESSION_STORAGE_ROUTE_NAME = 'esd-route-name';

// appContext
export const APP_BASE_URL = (() => {
  const {
    location: { protocol, hostname, port },
  } = window;

  if (process.env.NODE_ENV === 'development') {
    return `${protocol}//${hostname}:${port}`;
  } else {
    return `${protocol}//${hostname}`;
  }
})();

// base for appContext hash
export const baseAppContextObj: AppContextObj = {
  appName: 'register-foreigner-information',
  redirectUrl: `${APP_BASE_URL}/auth-redirect`,
};

export const REQUEST_NOT_AUTHORIZED = 'esd-request-not-authrorized';
