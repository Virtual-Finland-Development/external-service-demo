import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Link as ReactRouterLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Stack, Link, useToast } from '@chakra-ui/react';

// types
import { AuthProvider } from '../../@types';

// context
import { useAppContext } from '../../context/AppContext/AppContext';

// constants
import { appContextUrlEncoded } from '../../constants';

// components
import Loading from '../Loading/Loading';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

// api
import api from '../../api';

export default function AuthRedirect() {
  const { storeAuthKeysAndVerifyUser, logOut } = useAppContext();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  // parse query params
  const { search } = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(search), [search]);
  const authProviderParam = queryParams.get('provider');
  const loginCodeParam = queryParams.get('loginCode');
  const logOutParam = queryParams.get('logout');
  const errorParam = queryParams.get('error');
  const errorType = queryParams.get('type');
  const authError = errorParam && errorType === 'danger';

  /**
   * Catch any auth errors, on either LoginRequest / LogOutRequest intent
   */
  useEffect(() => {
    if (authError) {
      setError({ message: errorParam });
      toast({
        title: 'Error.',
        description: errorParam,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [authError, errorParam, toast]);

  /**
   * Handle authentication.
   */
  const handleAuthentication = useCallback(
    async (authProvider: AuthProvider) => {
      try {
        // get token
        const authTokens = await api.auth.getAuthTokens(
          {
            loginCode: loginCodeParam as string,
            appContext: appContextUrlEncoded,
          },
          authProvider
        );

        // get user 'autUserhId' after token retrieval, response differs between auth providers
        let authUserId;

        const userInfoResponse = await api.auth.getUserInfo(authProvider, {
          accessToken: authTokens.accessToken,
          appContext: appContextUrlEncoded,
        });

        if (authProvider === AuthProvider.TESTBED) {
          ({ sub: authUserId } = userInfoResponse.data);
        }

        if (authProvider === AuthProvider.SINUNA) {
          ({ inum: authUserId } = userInfoResponse.data);
        }

        if (authProvider === AuthProvider.SUOMIFI) {
          ({
            profile: { nameID: authUserId },
          } = userInfoResponse.data);
        }

        storeAuthKeysAndVerifyUser(
          authProviderParam as AuthProvider,
          authTokens,
          authUserId
        );
        navigate('/');
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [authProviderParam, storeAuthKeysAndVerifyUser, loginCodeParam, navigate]
  );

  /**
   * Handle user authentication, if Auth GW redirect occured.
   */
  useEffect(() => {
    if (authProviderParam && loginCodeParam) {
      setLoading(true);

      if (
        Object.values(AuthProvider).includes(authProviderParam as AuthProvider)
      ) {
        handleAuthentication(authProviderParam as AuthProvider);
      }
    } else if (!authError) {
      navigate('/');
    }
  }, [
    authError,
    authProviderParam,
    handleAuthentication,
    loginCodeParam,
    navigate,
  ]);

  /**
   * Handle user log out, if Auth GW log out redirect occured.
   */
  useEffect(() => {
    if (logOutParam) {
      if (logOutParam === 'success') {
        logOut();
        navigate('/');
      } else {
        setLoading(false);
        setError({ message: 'Logout request failed.' });
        toast({
          title: 'Error.',
          description: 'Logout request failed.',
          status: 'error',
          duration: 50000,
          isClosable: true,
        });
      }
    }
  }, [logOut, logOutParam, navigate, toast]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Stack w="full" maxW="md">
        <ErrorMessage
          error={error}
          addition={
            <Link as={ReactRouterLink} to="/" color="blue.500">
              Go to Home
            </Link>
          }
        />
      </Stack>
    );
  }

  return null;
}