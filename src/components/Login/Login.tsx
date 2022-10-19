import { useState } from 'react';
import {
  Container,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  VStack,
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

// types
import { AuthProvider } from '../../@types';

// api
import api from '../../api';

enum LoginType {
  TESTBED,
  SINUNA,
  SUOMIFI,
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle login button click. Redirect user to auth gw login request route.
   */
  const handleLoginClick = (loginType: LoginType) => {
    setIsLoading(true);

    if (loginType === LoginType.TESTBED) {
      api.auth.directToAuthGwLogin(AuthProvider.TESTBED);
    } else if (loginType === LoginType.SINUNA) {
      api.auth.directToAuthGwLogin(AuthProvider.SINUNA);
    } else if (loginType === LoginType.SUOMIFI) {
      api.auth.directToAuthGwLogin(AuthProvider.SUOMIFI);
    }
  };

  return (
    <Container maxW="full" centerContent>
      <Box
        bg="#02054B"
        color="white"
        borderRadius="lg"
        m={{ sm: 4, md: 16, lg: 10 }}
        p={{ sm: 5, md: 5, lg: 16 }}
      >
        <Box p={{ base: 6, md: 4 }}>
          <Flex
            justifyContent={{ base: 'center', md: 'start' }}
            alignItems={{ base: 'center', md: 'start' }}
            flexDirection={{ base: 'column', md: 'row' }}
            gap={{ base: 10, md: 20 }}
          >
            <Box textAlign={{ base: 'center', md: 'left' }}>
              <Heading>Registration service</Heading>
              <Text mt={{ sm: 3, md: 3, lg: 5 }} color="gray.400">
                Choose one of the login types to continue
              </Text>
            </Box>
            <Box bg="white" borderRadius="lg" w={{ base: 'full', md: 'auto' }}>
              <Box m={8} color="#0B0E3F">
                <VStack spacing={5}>
                  <Button
                    justifyContent={isLoading ? 'center' : 'start'}
                    bg="blue.500"
                    color="white"
                    _hover={{
                      bg: 'blue.600',
                    }}
                    leftIcon={<ArrowForwardIcon />}
                    onClick={() => handleLoginClick(LoginType.TESTBED)}
                    isLoading={isLoading}
                    disabled={isLoading}
                    w="full"
                  >
                    Login with Testbed
                  </Button>
                  <Button
                    justifyContent={isLoading ? 'center' : 'start'}
                    bg="blue.500"
                    color="white"
                    _hover={{}}
                    leftIcon={<ArrowForwardIcon />}
                    w="full"
                    disabled
                  >
                    Login with Sinuna
                  </Button>
                  <Button
                    justifyContent={isLoading ? 'center' : 'start'}
                    bg="blue.500"
                    color="white"
                    _hover={{}}
                    leftIcon={<ArrowForwardIcon />}
                    w="full"
                    disabled
                  >
                    Login with Suomi.fi
                  </Button>
                </VStack>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Container>
  );
}
