import userEvent from '@testing-library/user-event';
import { ConsentDataSource } from '../../constants/ConsentDataSource';
import { getConsentContext } from '../../context/ConsentContext/ConsentContextFactory';
import {
  customRender1,
  screen,
  waitFor,
} from '../../testing/testing-library-utils';
import Registration from './Registration';
const { ConsentProvider } = getConsentContext(ConsentDataSource.USER_PROFILE);

describe('<Registration />', () => {
  // Mock window.location.assign
  let location: Location;
  beforeEach(() => {
    location = window.location;
    window.location.assign = jest.fn();
  });
  afterEach(() => {
    window.location = location;
    sessionStorage.clear();
  });

  test('No user profile consent given, user sees an approve button', async () => {
    customRender1(
      <ConsentProvider>
        <Registration />
      </ConsentProvider>
    );

    const consentButton = await screen.findByRole('button', {
      name: /pre-fill with your profile/i,
    });
    expect(consentButton).toBeInTheDocument();

    userEvent.click(consentButton);

    const approveButton = await screen.findByRole('button', {
      name: /approve/i,
    });
    expect(approveButton).toBeInTheDocument();
  });

  test('User has given consent, profile is fetched and form pre-filled with user data', async () => {
    // Mock consent granted situation
    sessionStorage.setItem('consent-USER_PROFILE', 'some-consent-token');

    customRender1(
      <ConsentProvider>
        <Registration />
      </ConsentProvider>
    );

    const consentButton = await screen.findByRole('button', {
      name: /pre-fill with your profile/i,
    });
    expect(consentButton).toBeInTheDocument();

    userEvent.click(consentButton);

    const prefillButton = await screen.findByRole('button', {
      name: /Pre-fill/i,
    });
    expect(prefillButton).toBeInTheDocument();

    userEvent.click(prefillButton);

    const firstNameInput = screen.getByLabelText('Given names');
    const lastNameInput = screen.getByLabelText('Family name');

    await waitFor(() => {
      expect(firstNameInput).toHaveValue('Donald');
    });

    expect(lastNameInput).toHaveValue('Duck');
  });

  test('User opens form preview, sends the form, form has been sent.', async () => {
    customRender1(
      <ConsentProvider>
        <Registration />
      </ConsentProvider>
    );

    // use fake timers (setTimout calls)
    jest.useFakeTimers();

    const previewButton = await screen.findByRole('button', {
      name: /preview/i,
    });
    expect(previewButton).toBeInTheDocument();

    userEvent.click(previewButton);

    const sendMenuToggle = await screen.findByRole('button', {
      name: /send/i,
    });

    expect(sendMenuToggle).toBeInTheDocument();

    userEvent.click(sendMenuToggle);

    const sendOnlyButton = await screen.findByText('Send only');
    expect(sendOnlyButton).toBeInTheDocument();
    userEvent.click(sendOnlyButton);

    const sentHeader = await screen.findByRole('heading', {
      name: /registration sent!/i,
    });

    expect(sentHeader).toBeInTheDocument();

    // restore original JS timer behaviour
    jest.useRealTimers();
  });
});
