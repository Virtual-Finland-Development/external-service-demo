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

const applicationContextObj = {
  appName: 'access-to-finland-demo',
  redirectUrl: `${APP_BASE_URL}/auth-redirect`,
};
export const appContextUrlEncoded = (() => {
  const appContextBase64 = btoa(JSON.stringify(applicationContextObj));
  return encodeURIComponent(appContextBase64);
})();

export const REQUEST_NOT_AUTHORIZED = 'esd-request-not-authrorized';
