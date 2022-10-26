import {
  customRender1,
  screen,
  waitForElementToBeRemoved,
} from '../../testing/testing-library-utils';
import PdfForm from './PdfForm';
import { ProfileFormData } from '../../@types';

describe('<PdfForm />', () => {
  test('it should mount', async () => {
    const { container } = customRender1(
      <PdfForm
        profileData={{} as ProfileFormData}
        disableModalClose={jest.fn()}
        sendCallback={jest.fn()}
      />
    );

    const loadingText = screen.getByText('loading pdf', { exact: false });
    expect(loadingText).toBeInTheDocument();

    // eslint-disable-next-line testing-library/await-async-utils
    waitForElementToBeRemoved(loadingText);

    expect(
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      container.getElementsByClassName('react-pdf__Document').length
    ).toBe(1);
  });
});
