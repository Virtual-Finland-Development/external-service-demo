import { Container } from '@chakra-ui/react';

// components
import NavBar from '../NavBar/NavBar';
import PdfForm from '../PdfForm/PdfForm';

export default function AuthenticatedContainer() {
  return (
    <>
      <NavBar />
      <Container maxW="container.xl" mt={6}>
        <PdfForm />
      </Container>
    </>
  );
}
