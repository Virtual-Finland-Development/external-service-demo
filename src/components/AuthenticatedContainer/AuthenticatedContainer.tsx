import { Container } from '@chakra-ui/react';

// components
import NavBar from '../NavBar/NavBar';
import Registration from '../Registration/Registration';

export default function AuthenticatedContainer() {
  return (
    <>
      <NavBar />
      <Container maxW="container.lg" my={6}>
        <Registration />
      </Container>
    </>
  );
}
