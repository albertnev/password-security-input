import React from 'react';
import './App.css';
import { SecurityInput } from './components/SecurityInput';

function App() {
  return (
    <div className="App">
      <SecurityInput
        label="Test"
        maskContent
        visibilityToggle
        errorMessage="HOLA"
      />
    </div>
  );
}

export default App;
