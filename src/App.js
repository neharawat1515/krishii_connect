import React, { useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import KrishiConnect from './components/KrishiConnect';
import LoadingSpinner from './components/LoadingSpinner';

function AppContent() {
  const { loading } = useAppContext();

  useEffect(() => {
    // Pre-load voices
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      loadVoices();
      
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  return (
    <>
      <KrishiConnect />
      {loading && <LoadingSpinner />}
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

