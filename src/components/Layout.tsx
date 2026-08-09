import React, { ReactNode } from 'react';
import { useAppStore } from '../store/useAppStore';
import { LayoutDashboard, User, ShoppingBag, Users, Settings, Flame, Coins, Zap } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, setActiveTab }) => {
  const profile = useAppStore((state) => state.profile);

  return (
    <div className="flex h-screen bg-studypilot-bg text-gray-100 overflow-hidden">
      
      {/* --- Boční navigační panel (Sidebar) --- */}
      <aside className="w-64 glass-panel border-r border-studypilot-border flex flex-col justify-between p-4 hidden md:flex">
        <div>
          {/* Logo / Název */}
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-studypilot-primary to-studypilot-accent flex items-center justify-center shadow-neon-purple">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold tracking-wider text-lg bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                StudyPilot
              </h1>
              <span className="text-xs text-studypilot-accent font-mono">v2.0 PWA</span>
            </div>
          </div>

          {/* Navigační odkazy */}
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm hover:bg-studypilot-primary/10 hover:text-studypilot-primary group"
            >
              <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-studypilot-primary" />
              Adaptivní Plocha
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm hover:bg-studypilot-primary/10 hover:text-studypilot-primary group"
            >
              <User className="w-5 h-5 text-gray-400 group-hover:text-studypilot-primary" />
              Profil & Vizitka
            </button>
            <button 
              onClick={() => setActiveTab('store')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm hover:bg-studypilot-primary/10 hover:text-studypilot-primary group"
            >
              <ShoppingBag className="w-5 h-5 text-gray-400 group-hover:text-studypilot-primary" />
              Obchod (Store)
            </button>
            <button 
              onClick={() => setActiveTab('social')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm hover:bg-studypilot-primary/10 hover:text-studypilot-primary group"
            >
              <Users className="w-5 h-5 text-gray-400 group-hover:text-studypilot-primary" />
              Social & Chat
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm hover:bg-studypilot-primary/10 hover:text-studypilot-primary group"
            >
              <Settings className="w-5 h-5 text-gray-400 group-hover:text-studypilot-primary" />
              Nastavení & GitHub
            </button>
          </nav>
        </div>

        {/* Dolní status v sidebaru */}
        <div className="glass-panel p-3 rounded-xl text-xs text-gray-400 flex items-center justify-between">
          <span>GitHub Sync:</span>
          <span className="text-studypilot-success font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-studypilot-success animate-pulse"></span>
            Online
          </span>
        </div>
      </aside>

      {/* --- Hlavní pracovní oblast --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Horní lišta (Header) */}
        <header className="h-16 glass-panel border-b border-studypilot-border flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-gray-300">
              Vítej zpět, <span className="text-white">{profile?.name || 'Student'}</span>! 🚀
            </h2>
          </div>

          {/* Herní statistiky v hlavičce (Streak, Coiny, Level) */}
          <div className="flex items-center gap-4">
            {/* Streak */}
            <div className="flex items-center gap-1.5 bg-studypilot-card border border-studypilot-border px-3 py-1.5 rounded-full text-xs font-semibold text-orange-400">
              <Flame className="w-4 h-4 fill-orange-400 text-orange-500" />
              <span>{profile?.streak || 0} dnů</span>
            </div>

            {/* Coiny */}
            <div className="flex items-center gap-1.5 bg-studypilot-card border border-studypilot-border px-3 py-1.5 rounded-full text-xs font-semibold text-studypilot-gold">
              <Coins className="w-4 h-4 text-studypilot-gold" />
              <span>{profile?.coins || 0}</span>
            </div>

            {/* Level & XP */}
            <div className="flex items-center gap-2 bg-studypilot-primary/10 border border-studypilot-primary/30 px-3 py-1.5 rounded-full text-xs font-semibold text-studypilot-primary">
              <span>Lvl {profile?.level || 1}</span>
            </div>
          </div>
        </header>

        {/* Dynamický obsah podle vybrané záložky */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>

    </div>
  );
};
            
