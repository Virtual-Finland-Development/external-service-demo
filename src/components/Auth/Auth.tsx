import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// types
import { AuthProvider } from '../../@types';

// components
import Loading from '../Loading/Loading';

// api
import api from '../../api';

export default function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  // parse query params
  const { search } = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(search), [search]);
  const authProviderParam = queryParams.get('provider');

  /**
   * Direct to auth GW login with provided AuthProvider
   */
  const handleAuthLogin = useCallback((provider: AuthProvider) => {
    api.auth.directToAuthGwLogin(provider);
  }, []);

  /**
   * If user is directed from ATF app with provider query param.
   * If provider is one of accepted ones, try to log user in automatically.
   * Otherwise direct to root (manual login).
   */
  useEffect(() => {
    if (authProviderParam) {
      setLoading(true);

      if (
        Object.values(AuthProvider).includes(authProviderParam as AuthProvider)
      ) {
        handleAuthLogin(authProviderParam as AuthProvider);
      }
    } else {
      navigate('/');
    }
  }, [authProviderParam, handleAuthLogin, navigate]);

  if (loading) {
    return <Loading />;
  }

  return null;
}
