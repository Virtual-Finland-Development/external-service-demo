import { Routes, Route, Outlet } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';

// components
/* import Login from '../Login/Login';
import Auth from '../Auth/Auth';
import Profile from '../Profile/Profile';
import PageNotFound from '../PageNotFound/PageNotFound'; */
import Login from '../Login/Login';
import Auth from '../Auth/Auth';
import AuthRedirect from '../AuthRedirect/AuthRedirect';

const PageNotFound = () => (
  <div>
    <h3>404 page not found component</h3>
  </div>
);

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
