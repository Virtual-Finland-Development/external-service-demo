// local storage
export const SESSION_STORAGE_AUTH_PROVIDER = 'esd-auth-provider';
export const SESSION_STORAGE_AUTH_TOKENS = 'esd-auth-tokens';
export const SESSION_STORAGE_AUTH_USER_ID = 'esd-auth-user-id';
export const SESSION_STORAGE_ROUTE_NAME = 'esd-route-name';

// appContext
const applicationBaseUrl =
  process.env.USER_API_BASE_URL || 'http://localhost:3001';
const applicationContextObj = {
  appName: 'access-to-finland-demo',
  redirectUrl: `${applicationBaseUrl}/auth-redirect`,
};
export const appContextUrlEncoded = (() => {
  const appContextBase64 = btoa(JSON.stringify(applicationContextObj));
  return encodeURIComponent(appContextBase64);
})();

export const REQUEST_NOT_AUTHORIZED = 'esd-request-not-authrorized';
