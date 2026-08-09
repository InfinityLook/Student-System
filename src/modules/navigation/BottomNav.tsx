import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, Zap, ShoppingBag, Settings } from 'lucide-react';
import { useAppStore, AppTab } from '../../store/useAppStore';

const NAV_ITEMS: { id: AppTab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'hub', label: 'Hub', icon: Zap },
  { id: 'store', label: 'Obchod', icon: ShoppingBag },
  { id: 'settings', label: 'Nastavení', icon: Settings },
];

export const BottomNav: React.FC = () => {
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 pb-4 pointer-events-none">
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260, delay: 0.15 }}
        className="pointer-events-auto glass-panel border border-white/10 rounded-full px-2 py-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex items-center gap-1"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          const isHub = item.id === 'hub';

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center focus:outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className={`absolute inset-0 rounded-full ${
                    isHub
                      ? 'bg-gradient-to-tr from-studypilot-primary to-studypilot-accent shadow-neon-purple'
                      : 'bg-studypilot-primary/15 border border-studypilot-primary/40'
                  }`}
                />
              )}

              <motion.div
                whileTap={{ scale: 0.88 }}
                animate={isActive ? { scale: isHub ? 1.08 : 1 } : { scale: 1 }}
                className={`relative z-10 flex items-center justify-center rounded-full transition-colors ${
                  isHub ? 'w-14 h-14' : 'w-11 h-11'
                }`}
              >
                {isActive && isHub && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white/25"
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <Icon
                  className={isHub ? 'w-6 h-6' : 'w-5 h-5'}
                  strokeWidth={isActive ? 2.4 : 2}
                  style={{ color: isActive ? '#ffffff' : '#8a8fa3' }}
                />
              </motion.div>

              <span
                className={`relative z-10 text-[9px] font-medium mt-0.5 transition-colors ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
};
                  
