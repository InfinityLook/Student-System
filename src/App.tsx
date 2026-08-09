import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import { LoginView } from './modules/auth/LoginView';
import { Dashboard } from './modules/Dashboard';
import { ProfileView } from './modules/profile/ProfileView';
import { SocialView } from './modules/social/SocialView';
import { StoreView } from './modules/store/StoreView';
import { SettingsView } from './modules/settings/SettingsView';
import { BottomNav } from './modules/navigation/BottomNav';

function App() {
  const { isAuthenticated, initAuth, activeTab } = useAppStore();

  useEffect(() => {
    // Spustíme hlídání stavu přihlášení
    initAuth();
  }, [initAuth]);

  if (!isAuthenticated) {
    return (
      <div className="app-shell bg-[#0B0F19] text-white">
        <LoginView />
      </div>
    );
  }

  return (
    <div className="app-shell bg-[#0B0F19] text-white">
      {/* Obsah aktivní záložky, s odsazením dole kvůli plovoucí navigaci */}
      <div className="pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'hub' && <Dashboard />}
            {activeTab === 'profile' && <div className="p-4"><ProfileView /></div>}
            {activeTab === 'social' && <div className="p-4"><SocialView /></div>}
            {activeTab === 'store' && <div className="p-4"><StoreView /></div>}
            {activeTab === 'settings' && <div className="p-4"><SettingsView /></div>}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}

export default App;
