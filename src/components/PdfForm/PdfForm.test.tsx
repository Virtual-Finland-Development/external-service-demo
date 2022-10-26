import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PdfForm from './PdfForm';
import { ProfileFormData } from '../../@types';

describe('<PdfForm />', () => {
  test('it should mount', () => {
    let data: ProfileFormData | undefined;
    render(
      <PdfForm
        profileData={data}
        disableModalClose={jest.fn()}
        sendCallback={jest.fn()}
      />
    );

    const pdfForm = screen.getByTestId('PdfForm');

    expect(pdfForm).toBeInTheDocument();
  });
});
