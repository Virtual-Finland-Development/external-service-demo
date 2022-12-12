import { useState } from 'react';
import { Flex, Stack } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

// context
import { useAppContext } from '../../context/AppContext/AppContext';

// hooks
import useCountries from '../../hooks/useCountries';
import useOccupations from '../../hooks/useOccupations';
import useLanguages from '../../hooks/useLanguages';

// components
import RegistrationDataForm from '../RegistrationDataForm/RegistrationDataForm';
import Loading from '../Loading/Loading';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

// api
import api from '../../api';

export default function Registration() {
  const { setUserProfile } = useAppContext();

  const [isProfileDataUsed, setProfileDataUsed] = useState<boolean>(false);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);

  // User api provided lists and metadata
  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: occupations, isLoading: occupationsLoading } = useOccupations();
  const { data: languages, isLoading: languagesLoading } = useLanguages();

  const listsLoading =
    countriesLoading || occupationsLoading || languagesLoading;

  const toast = useToast();

  /**
   * Save user immigrationDataConsent.
   * Response returns full user profile to be used to pre-fill RegistrationDataForm
   */
  const saveUserConsent = async (immigrationDataConsent: boolean) => {
    setProfileLoading(true);

    try {
      await api.user.patch({ immigrationDataConsent });
      const userProfileResponse = await api.user.get();
      setUserProfile({ ...userProfileResponse.data, immigrationDataConsent });

      if (immigrationDataConsent) {
        setProfileDataUsed(true);
      }
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

  /**
   * Fetch user profile.
   * User has given immigrationDataConsent already, profile can be fetched.
   */
  const fetchUserProfile = async () => {
    setProfileLoading(true);

    try {
      const response = await api.user.get();
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
        saveUserConsent={saveUserConsent}
        fetchUserProfile={fetchUserProfile}
        lists={{
          countries,
          occupations,
          languages,
        }}
        isLoading={profileLoading}
        isProfileDataUsed={isProfileDataUsed}
      />
    </Stack>
  );
}
