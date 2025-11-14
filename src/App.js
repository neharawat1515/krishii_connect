import React from 'react';
import { AppProvider } from './context/AppContext';
import KrishiConnect from './components/KrishiConnect';

function App() {
  return (
    <AppProvider>
      <KrishiConnect />
    </AppProvider>
  );
}

export default App;
