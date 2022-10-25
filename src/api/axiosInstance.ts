import axios from 'axios';

// endpoints
import { USER_API_ENDPOINT } from './endpoints';

// constants
import {
  SESSION_STORAGE_AUTH_PROVIDER,
  SESSION_STORAGE_AUTH_TOKENS,
  REQUEST_NOT_AUTHORIZED,
} from '../constants';

// utils
import { JSONSessionStorage } from '../utils';

// Create axios instance for api services
const axiosInstance = axios.create();

const USER_API_URLS = [
  `${USER_API_ENDPOINT}/identity/testbed/verify`,
  `${USER_API_ENDPOINT}/user`,
  `${USER_API_ENDPOINT}/code-sets/countries`,
  `${USER_API_ENDPOINT}/code-sets/occupations`,
  `${USER_API_ENDPOINT}/code-sets/languages`,
];

// Axios request interceptor. Pass token to request Authorization for selected routes, if found.
axiosInstance.interceptors.request.use(config => {
  const authTokens = JSONSessionStorage.get(SESSION_STORAGE_AUTH_TOKENS);

  if (config.url !== undefined && config.headers !== undefined) {
    if (authTokens) {
      // pass id token for all user api calls
      if (USER_API_URLS.includes(config.url)) {
        const idToken = authTokens.idToken;
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
    const authTokens = JSONSessionStorage.get(SESSION_STORAGE_AUTH_TOKENS);

    if (provider && authTokens && error?.response?.status === 401) {
      alert('Your session has expired, please authenticate to continue.');
      sessionStorage.clear();
      window.postMessage(REQUEST_NOT_AUTHORIZED);
      return new Promise(() => {});
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
