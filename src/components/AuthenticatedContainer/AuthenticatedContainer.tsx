import { Container } from '@chakra-ui/react';

// components
import NavBar from '../NavBar/NavBar';
import RegistrationDataForm from '../RegistrationDataForm/RegistrationDataForm';
import { ProfileData } from '../../@types';

export default function AuthenticatedContainer() {
  let data: ProfileData | undefined;
  return (
    <>
      <NavBar />
      <Container maxW="container.xl" mt={6}>
        <RegistrationDataForm profileApiData={data} />
      </Container>
    </>
  );
}
