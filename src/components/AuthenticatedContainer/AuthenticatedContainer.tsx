import { Container } from '@chakra-ui/react';
import { ConsentDataSource } from '../../constants/ConsentDataSource';
import getConsentContext from '../../context/ConsentContext/ConsentContext';

// components
import NavBar from '../NavBar/NavBar';
import Registration from '../Registration/Registration';

// Get context and provider for given data source
const { ConsentProvider } = getConsentContext(ConsentDataSource.USER_PROFILE);

export default function AuthenticatedContainer() {
  return (
    <>
      <NavBar />
      <Container maxW="container.lg" my={6}>
        <ConsentProvider>
          <Registration />
        </ConsentProvider>
      </Container>
    </>
  );
}
