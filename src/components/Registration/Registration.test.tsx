import {
  customRender1,
  waitFor,
  screen,
  act,
} from '../../testing/testing-library-utils';
import userEvent from '@testing-library/user-event';
import Registration from './Registration';

describe('<Registration />', () => {
  test('User gives consent, profile is fetched and form pre-filled with user data', async () => {
    customRender1(<Registration />);

    const consentButton = await screen.findByRole('button', {
      name: /pre-fill with your profile/i,
    });
    expect(consentButton).toBeInTheDocument();

    userEvent.click(consentButton);

    const approveButton = await screen.findByRole('button', {
      name: /approve/i,
    });
    expect(approveButton).toBeInTheDocument();

    userEvent.click(approveButton);

    const firstNameInput = screen.getByLabelText('Given names');
    const lastNameInput = screen.getByLabelText('Family name');

    await waitFor(() => {
      expect(firstNameInput).toHaveValue('Donald');
    });

    expect(lastNameInput).toHaveValue('Duck');
  });

  test('User opens form preview, sends the form, form has been sent.', async () => {
    customRender1(<Registration />);

    // use fake timers (setTimout calls)
    jest.useFakeTimers();

    const previewButton = await screen.findByRole('button', {
      name: /preview/i,
    });
    expect(previewButton).toBeInTheDocument();

    userEvent.click(previewButton);

    const sendButton = await screen.findByRole('button', {
      name: /send/i,
    });
    expect(sendButton).toBeInTheDocument();

    userEvent.click(sendButton);

    // to tell the unit test that timers will update component's state
    act(() => {
      jest.runAllTimers();
    });

    const sentHeader = await screen.findByRole('heading', {
      name: /registration sent!/i,
    });
    expect(sentHeader).toBeInTheDocument();

    // restore original JS timer behaviour
    jest.useRealTimers();
  });
});
