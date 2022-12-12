// utils
import { removeTrailingSlash } from '../../utils';

export const AUTH_GW_BASE_URL =
  process.env.REACT_APP_AUTH_GW_BASE_URL ||
  'https://q88uo5prmh.execute-api.eu-north-1.amazonaws.com';

export const USERS_API_BASE_URL = process.env.REACT_APP_USERS_API_BASE_URL
  ? removeTrailingSlash(process.env.REACT_APP_USERS_API_BASE_URL)
  : 'http://localhost:5001';

export const TESTBED_API_BASE_URL = process.env.REACT_APP_TESTBED_API_BASE_URL
  ? removeTrailingSlash(process.env.REACT_APP_TESTBED_API_BASE_URL)
  : 'https://fnbyreu36buob6gy7spxxytnfi0tvjrl.lambda-url.eu-north-1.on.aws';
