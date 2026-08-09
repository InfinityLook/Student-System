import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { LoginView } from './modules/auth/LoginView';
import { Dashboard } from './modules/Dashboard';

function App() {
  const { isAuthenticated, initAuth } = useAppStore();

  useEffect(() => {
    // Spustíme hlídání stavu přihlášení
    initAuth();
  }, [initAuth]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <LoginView />
      )}
    </div>
  );
}

export default App;
