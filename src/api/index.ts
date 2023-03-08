import * as auth from './services/auth';
import * as codesets from './services/codesets';
import * as consent from './services/consent';
import * as user from './services/user';

const api = {
  auth,
  user,
  consent,
  codesets,
};

export default api;
