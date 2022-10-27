import {
  customRender1,
  waitForElementToBeRemoved,
  waitFor,
  screen,
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
});
