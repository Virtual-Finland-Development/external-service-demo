import userEvent from '@testing-library/user-event';
import {
  customRender1,
  customRender2,
  screen,
} from '../../testing/testing-library-utils';
import AppRoot from './AppRoot';

import * as AppContextExports from '../../context/AppContext/AppContext';

// endpoints
import { AUTH_GW_BASE_URL } from '../../api/endpoints';
import { generateAppContextHash } from '../../utils';

describe('Authentication based rendering', () => {
  beforeEach(() => {
    // mock 'validLoginState' function in AppContext, return true value
    const mockValidLoginState = jest.spyOn(
      AppContextExports,
      'validLoginState'
    );
    mockValidLoginState.mockImplementation(() => true);
  });

  test('Should direct to Auth GW login, when user clicks log in button', async () => {
    customRender1(<AppRoot />);

    const loginButton = screen.getByRole('button', {
      name: /login with testbed/i,
    });
    expect(loginButton).toBeInTheDocument();

    userEvent.click(loginButton);

    // user directed to auth GW login route when login button clicked
    expect(window.location.assign).toBeCalledWith(
      `${AUTH_GW_BASE_URL}/auth/openid/testbed/authentication-request?appContext=${generateAppContextHash()}`
    );
  });

  test('Should direct to Auth GW login, when user came from AtF app (auth provider in query params)', async () => {
    customRender2(<AppRoot />, {
      initialEntries: ['/auth?provider=testbed'],
    });

    // user directed to auth GW login route automatically
    expect(window.location.assign).toBeCalledWith(
      `${AUTH_GW_BASE_URL}/auth/openid/testbed/authentication-request?appContext=${generateAppContextHash()}`
    );
  });

  test('Should log in to the application, when login redirect from Auth GW', async () => {
    customRender2(<AppRoot />, {
      initialEntries: ['/auth-redirect?provider=testbed&loginCode=123'],
    });

    // form header visibile when user has authenticated
    const registerHeader = await screen.findByRole('heading', {
      name: /register foreigner/i,
    });
    expect(registerHeader).toBeInTheDocument();
  });
});
