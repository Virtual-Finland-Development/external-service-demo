import { useState } from 'react';
import { Flex } from '@chakra-ui/react';

// types
import { Stack } from '@chakra-ui/react';
import { ProfileFormData } from '../../@types';

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
  const [profileApiData, setProfileApiData] = useState<
    Partial<ProfileFormData> | undefined
  >(undefined);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);

  // User api provided lists and metadata
  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: occupations, isLoading: occupationsLoading } = useOccupations();
  const { data: languages, isLoading: languagesLoading } = useLanguages();

  const listsLoading =
    countriesLoading || occupationsLoading || languagesLoading;

  /**
   * Save user immigrationDataConsent.
   * Response returns full user profile to be used to pre-fill RegistrationDataForm
   */
  const saveUserConsent = async () => {
    setProfileLoading(true);

    try {
      const response = await api.user.patch({ immigrationDataConsent: true });
      setProfileApiData(response.data);
    } catch (error) {
      console.log(error);
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
        profileApiData={profileApiData}
        saveUserConsent={saveUserConsent}
        lists={{
          countries,
          occupations,
          languages,
        }}
        isLoading={profileLoading}
      />
    </Stack>
  );
}
