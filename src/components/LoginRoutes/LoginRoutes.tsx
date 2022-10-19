import { Routes, Route, Outlet } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';

// components
import Login from '../Login/Login';
import Auth from '../Auth/Auth';
import AuthRedirect from '../AuthRedirect/AuthRedirect';
import PageNotFound from '../PageNotFound/PageNotFound';

export default function LoginRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Flex minH="100vh" align="center" justify="center">
            <Outlet />
          </Flex>
        }
      >
        <Route index element={<Login />} />
        <Route path="auth" element={<Auth />} />
        <Route path="auth-redirect" element={<AuthRedirect />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}
