import {
  createContext,
  useEffect,
  useCallback,
  useReducer,
  useContext,
  Reducer,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { isPast, parseISO } from 'date-fns';
import { useToast } from '@chakra-ui/react';

// types
import { AuthProvider, AuthTokens, UserProfile } from '../../@types';

// constants
import {
  SESSION_STORAGE_AUTH_PROVIDER,
  SESSION_STORAGE_AUTH_TOKENS,
  SESSION_STORAGE_AUTH_USER_ID,
  REQUEST_NOT_AUTHORIZED,
} from '../../constants';

// utils
import { JSONSessionStorage } from '../../utils';

// reducers
import {
  AppState,
  Action,
  appStateReducer,
  initialState,
  ActionTypes,
} from './reducers/appStateReducer';

// api
import api from '../../api';

interface AppContextInterface {
  authenticated: boolean;
  userProfile: any;
  loading: boolean;
  storeAuthKeysAndVerifyUser: (
    authProvider: AuthProvider,
    autTokens: AuthTokens,
    userEmail: string
  ) => void;
  logIn: () => void;
  logOut: () => void;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  setLoading: (loading: boolean) => void;
  error: any;
}

interface AppProviderProps {
  children: React.ReactElement;
}

/**
 * Helper function to determine valid login state
 */
export function validLoginState(): boolean {
  const authProvider = sessionStorage.getItem(SESSION_STORAGE_AUTH_PROVIDER);
  const authTokens = JSONSessionStorage.get(SESSION_STORAGE_AUTH_TOKENS);
  const authUserId = sessionStorage.getItem(SESSION_STORAGE_AUTH_USER_ID);
  const tokenNotExpired = authTokens?.expiresAt
    ? !isPast(parseISO(authTokens.expiresAt))
    : false;
  return authProvider && authTokens && authUserId && tokenNotExpired;
}

/**
 * App Context
 */
const AppContext = createContext<AppContextInterface | undefined>(undefined);
const AppConsumer = AppContext.Consumer;

function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer<Reducer<AppState, Action>>(
    appStateReducer,
    initialState
  );
  const { authenticated, userProfile, loading, error } = state;
  const navigate = useNavigate();
  const toast = useToast();

  /**
   * Handle save user profile.
   */
  const setUserProfile = useCallback((userProfile: Partial<UserProfile>) => {
    dispatch({ type: ActionTypes.SET_PROFILE, userProfile });
  }, []);

  /**
   * Fetch user consents
   */
  const fetchUserConsents = useCallback(async () => {
    try {
      const response = await api.user.getConsents();
      setUserProfile(response.data);
    } catch (error: any) {
      dispatch({ type: ActionTypes.SET_ERROR, error });
      toast({
        title: 'Error.',
        description:
          error?.message || 'Something went wrong, please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [setUserProfile, toast]);

  /**
   * Verify api user after authentication.
   */
  const verifyUser = useCallback(async () => {
    try {
      await api.user.verify();
    } catch (error: any) {
      dispatch({ type: ActionTypes.SET_ERROR, error });
      toast({
        title: 'Error.',
        description:
          error?.message || 'Something went wrong, please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  /**
   * Store auth keys to session storage, continue to verify user after authentication (Auth.tsx).
   */
  const storeAuthKeysAndVerifyUser = useCallback(
    async (
      authProvider: AuthProvider,
      tokens: AuthTokens,
      authUserId: string
    ) => {
      sessionStorage.setItem(SESSION_STORAGE_AUTH_PROVIDER, authProvider);
      sessionStorage.setItem(SESSION_STORAGE_AUTH_USER_ID, authUserId);
      JSONSessionStorage.set(SESSION_STORAGE_AUTH_TOKENS, tokens);
      dispatch({ type: ActionTypes.SET_LOADING, loading: true });
      await verifyUser();
      await fetchUserConsents();
      dispatch({ type: ActionTypes.LOG_IN });
      dispatch({ type: ActionTypes.SET_LOADING, loading: false });
    },
    [fetchUserConsents, verifyUser]
  );

  /**
   * Handle login.
   */
  const logIn = () => {
    dispatch({ type: ActionTypes.LOG_IN });
    navigate('/');
  };

  /**
   * Handle log out.
   */
  const logOut = useCallback(() => {
    dispatch({ type: ActionTypes.LOG_OUT });
    sessionStorage.clear();
  }, []);

  /**
   * Handle set app state loading.
   */
  const setLoading = (loading: boolean) =>
    dispatch({ type: ActionTypes.SET_LOADING, loading });

  /**
   * Windows message event handler for logging user out, in case of unauthorized api calls.
   */
  const onWindowMessageEvent = useCallback(
    (event: MessageEvent) => {
      if (event.data === REQUEST_NOT_AUTHORIZED) {
        logOut();
        navigate('/');
      }
    },
    [logOut, navigate]
  );

  /**
   * If auth keys provided in session storage, and if token is not expired, fetch user consents, log in user.
   */
  useEffect(() => {
    async function fetchConsentsAndLogIn() {
      dispatch({ type: ActionTypes.SET_LOADING, loading: true });
      await fetchUserConsents();
      dispatch({ type: ActionTypes.LOG_IN });
      dispatch({ type: ActionTypes.SET_LOADING, loading: false });
    }

    if (validLoginState()) {
      fetchConsentsAndLogIn();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Add window event listener, used to track custom event message that is made from axios interceptor (axiosInstance.ts)
   */
  useEffect(() => {
    window.addEventListener('message', onWindowMessageEvent);
    return () => window.removeEventListener('message', onWindowMessageEvent);
  }, [onWindowMessageEvent]);

  return (
    <AppContext.Provider
      value={{
        authenticated,
        userProfile,
        loading,
        storeAuthKeysAndVerifyUser,
        logIn,
        logOut,
        setUserProfile,
        setLoading,
        error,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

/**
 * useAppContext hook
 */
function useAppContext() {
  const context = useContext(AppContext) as AppContextInterface;

  if (context === undefined || context === null) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}

export { AppContext, AppProvider, AppConsumer, useAppContext };
