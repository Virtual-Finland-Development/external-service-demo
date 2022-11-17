import axios from 'axios';
import { isPast, parseISO } from 'date-fns';

// endpoints
import { USER_API_BASE_URL } from './endpoints';

// constants
import {
  REQUEST_NOT_AUTHORIZED,
  SESSION_STORAGE_AUTH_PROVIDER,
  SESSION_STORAGE_AUTH_TOKENS,
} from '../constants';

// utils
import { JSONSessionStorage } from '../utils';

// Create axios instance for api services
const axiosInstance = axios.create();

const USER_API_URLS = [
  `${USER_API_BASE_URL}/identity/verify`,
  `${USER_API_BASE_URL}/user`,
  `${USER_API_BASE_URL}/user/consents`,
  `${USER_API_BASE_URL}/code-sets/countries`,
  `${USER_API_BASE_URL}/code-sets/occupations`,
  `${USER_API_BASE_URL}/code-sets/languages`,
];

// Axios request interceptor. Pass token to request Authorization for selected routes, if found.
axiosInstance.interceptors.request.use(config => {
  const loggedInState = JSONSessionStorage.get(SESSION_STORAGE_AUTH_TOKENS);

  if (config.url !== undefined && config.headers !== undefined) {
    if (loggedInState) {
      // pass id token for all user api calls
      if (USER_API_URLS.includes(config.url)) {
        const idToken = loggedInState.idToken;
        config.headers.Authorization = idToken ? `Bearer ${idToken}` : '';
      }
    }
  }

  return config;
});

// Axios response interceptor. Catch all 401 exceptions (unauthorized), post message to window for logging user out (AppContext)
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const provider = sessionStorage.getItem(SESSION_STORAGE_AUTH_PROVIDER);
    const loggedInState = JSONSessionStorage.get(SESSION_STORAGE_AUTH_TOKENS);
    const hasExpired = loggedInState?.expiresAt
      ? isPast(parseISO(loggedInState.expiresAt))
      : false;

    if (
      provider &&
      loggedInState &&
      error?.response?.status === 401 &&
      hasExpired
    ) {
      alert('Your session has expired, please authenticate to continue.');
      sessionStorage.clear();
      window.postMessage(REQUEST_NOT_AUTHORIZED);
      return new Promise(() => {});
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
