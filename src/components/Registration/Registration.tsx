import { Flex, Stack, useToast } from '@chakra-ui/react';
import { useContext, useState } from 'react';

// context
import { useAppContext } from '../../context/AppContext/AppContext';

// hooks
import useCountries from '../../hooks/useCountries';
import useLanguages from '../../hooks/useLanguages';
import useOccupations from '../../hooks/useOccupations';

// components
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loading from '../Loading/Loading';
import RegistrationDataForm from '../RegistrationDataForm/RegistrationDataForm';

// api
import api from '../../api';

// consent context
import { ConsentDataSource } from '../../constants/ConsentDataSource';
import { getConsentContext } from '../../context/ConsentContext/ConsentContextFactory';

// Get context and provider for given data source
const { ConsentContext } = getConsentContext(ConsentDataSource.USER_PROFILE);

export default function Registration() {
  const { setUserProfile } = useAppContext();
  const {
    isConsentInitialized,
    isConsentGranted,
    redirectToConsentService,
    consentSituation,
  } = useContext(ConsentContext);

  const [isProfileDataUsed, setProfileDataUsed] = useState<boolean>(false);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);

  // User api provided lists and metadata
  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: occupations, isLoading: occupationsLoading } = useOccupations();
  const { data: languages, isLoading: languagesLoading } = useLanguages();

  const listsLoading =
    countriesLoading ||
    occupationsLoading ||
    languagesLoading ||
    !isConsentInitialized;

  const toast = useToast();

  /**
   * Fetch user profile.
   * User has given immigrationDataConsent already, profile can be fetched.
   */
  const fetchUserProfile = async () => {
    setProfileLoading(true);

    try {
      const response = await api.user.get(consentSituation.consentToken);
      setUserProfile(response.data);
      setProfileDataUsed(true);
    } catch (error: any) {
      toast({
        title: 'Error.',
        description:
          error?.message || 'Something went wrong, please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setProfileLoading(false);
    }
  };

  if (listsLoading) {
    return (
      <Flex justifyContent="center" mt={6}>
        <Loading />
      </Flex>
    );
  }

  if (!countries || !occupations || !languages) {
    return (
      <Flex justifyContent="center" mt={6}>
        <ErrorMessage
          error={{ title: 'Error', message: 'Something went wrong.' }}
        />
      </Flex>
    );
  }

  return (
    <Stack alignItems="center">
      <RegistrationDataForm
        fetchUserProfile={fetchUserProfile}
        lists={{
          countries,
          occupations,
          languages,
        }}
        isLoading={profileLoading}
        isProfileDataUsed={isProfileDataUsed}
        isConsentGranted={isConsentGranted}
        redirectToConsentService={redirectToConsentService}
      />
    </Stack>
  );
}
