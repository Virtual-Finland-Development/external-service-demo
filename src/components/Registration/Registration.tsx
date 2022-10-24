// types
import { Stack, Heading, Text } from '@chakra-ui/react';
import { UserProfile } from '../../@types';

// components
import RegistrationDataForm from '../RegistrationDataForm/RegistrationDataForm';

export default function Registration() {
  return (
    <Stack alignItems="center">
      <RegistrationDataForm profileApiData={undefined} />
    </Stack>
  );
}
