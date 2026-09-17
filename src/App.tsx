// src/App.tsx
import React from 'react';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/shell/AppShell';
import { PwaInstallBanner } from './components/common/PwaInstallBanner';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppShell />
      <PwaInstallBanner />
    </AppProvider>
  );
};

export default App;

