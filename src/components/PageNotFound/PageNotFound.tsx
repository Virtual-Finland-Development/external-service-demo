import { Link as ReactRouterLink } from 'react-router-dom';
import { Box, Heading, Link } from '@chakra-ui/react';

export default function PageNotFound() {
  return (
    <Box textAlign="center">
      <Heading as="h2" size="lg" mb={6}>
        404 page not found
      </Heading>
      <Link as={ReactRouterLink} to="/" color="blue.400">
        Go to Home
      </Link>
    </Box>
  );
}
