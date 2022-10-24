import { useState } from 'react';

// types
import { Stack } from '@chakra-ui/react';
import { ProfileFormData } from '../../@types';

// components
import RegistrationDataForm from '../RegistrationDataForm/RegistrationDataForm';

// api
import api from '../../api';

export default function Registration() {
  const [profileApiData, setProfileApiData] = useState<
    Partial<ProfileFormData> | undefined
  >(undefined);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);

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

  return (
    <Stack alignItems="center">
      <RegistrationDataForm
        profileApiData={profileApiData}
        saveUserConsent={saveUserConsent}
        isLoading={profileLoading}
      />
    </Stack>
  );
}
