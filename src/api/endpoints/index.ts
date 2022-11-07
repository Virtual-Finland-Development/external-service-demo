export const AUTH_GW_BASE_URL =
  process.env.REACT_APP_AUTH_GW_BASE_URL ||
  'https://q88uo5prmh.execute-api.eu-north-1.amazonaws.com';

export const USER_API_BASE_URL =
  process.env.REACT_APP_USER_API_BASE_URL || 'http://localhost:5001';

// TODO: Removed these after testing stuff
const DUMMY_API_URL = process.env.REACT_APP_DUMMY_API_URL;

console.log(DUMMY_API_URL);
console.log(AUTH_GW_BASE_URL);
console.log(USER_API_BASE_URL);
