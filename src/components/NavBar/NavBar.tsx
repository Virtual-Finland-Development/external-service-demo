import {
  Box,
  Flex,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

// types
import { AuthProvider } from '../../@types';

// constants
import { SESSION_STORAGE_AUTH_PROVIDER } from '../../constants';

// context
import { useAppContext } from '../../context/AppContext/AppContext';

// api
import api from '../../api';

export default function NavBar() {
  const { setLoading } = useAppContext();

  /**
   * Handle log out click.
   */
  const handleLogOutClick = () => {
    setLoading(true);

    const provider = localStorage.getItem(SESSION_STORAGE_AUTH_PROVIDER)!;
    api.auth.directToAuthGwLogout(provider as AuthProvider);
  };

  return (
    <Box bg="blue.900" px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box>
          <Text
            fontSize={{ base: 'md', md: 'xl' }}
            fontFamily="sans-serif"
            fontWeight="bold"
            color="white"
          >
            Foreigner Registration Service
          </Text>
        </Box>
        <Flex alignItems="center">
          <Menu>
            <MenuButton
              color="white"
              as={Button}
              rounded="full"
              variant="link"
              cursor="pointer"
              minW={0}
              _expanded={{ color: 'white' }}
              rightIcon={<ChevronDownIcon />}
            >
              <Text>Actions</Text>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleLogOutClick}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}
