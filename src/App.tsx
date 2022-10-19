import React from 'react';
import './App.css';
import RegistrationDataForm from './components/RegistrationDataForm/RegistrationDataForm';
import { ProfileData } from './@types';

export default function App() {
  let data: ProfileData | undefined;

  return (
    <div className="App">
      {
        // TODO: Add header
      }
      <RegistrationDataForm profileApiData={data} />
      {
        // TODO: Add footer
      }
    </div>
  );
}
