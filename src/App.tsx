import React from 'react';
import './App.css';
import RegistrationDataForm from './components/RegistrationDataForm/RegistrationDataForm';

export default function App() {
  let data;
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
