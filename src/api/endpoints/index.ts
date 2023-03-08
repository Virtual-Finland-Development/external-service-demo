// utils
import { removeTrailingSlash } from '../../utils';

export const AUTH_GW_BASE_URL =
  process.env.REACT_APP_AUTH_GW_BASE_URL ||
  'https://virtualfinland-authgw.localhost';

export const USERS_API_BASE_URL = process.env.REACT_APP_USERS_API_BASE_URL
  ? removeTrailingSlash(process.env.REACT_APP_USERS_API_BASE_URL)
  : 'http://localhost:5001';

export const TESTBED_API_BASE_URL = process.env.REACT_APP_TESTBED_API_BASE_URL
  ? removeTrailingSlash(process.env.REACT_APP_TESTBED_API_BASE_URL)
  : 'http://localhost:3003';

export const STATUS_API_BASE_URL = process.env.REACT_APP_STATUS_API_BASE_URL
  ? removeTrailingSlash(process.env.REACT_APP_STATUS_API_BASE_URL)
  : 'http://0.0.0.0:5747';

export const CODESETS_BASE_URL = process.env.REACT_APP_CODESETS_BASE_URL
  ? removeTrailingSlash(process.env.REACT_APP_CODESETS_BASE_URL)
  : 'http://localhost:3166';