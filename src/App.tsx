import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { Layout } from './components/Layout';
import { LoginView } from './modules/auth/LoginView';
import { ProfileView } from './modules/profile/ProfileView';
import { StoreView } from './modules/store/StoreView';
import { SocialView } from './modules/social/SocialView';
import { SettingsView } from './modules/settings/SettingsView';
import { Task } from './db/db';

export function App() {
  const loadData = useAppStore((state) => state.loadData);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const tasks = useAppStore((state) => state.tasks);
  const addTask = useAppStore((state) => state.addTask);
  const toggleTask = useAppStore((state) => state.toggleTask);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Pokud uživatel není přihlášen, zobrazíme přihlašovací obrazovku přes Gmail
  if (!isAuthenticated) {
    return <LoginView />;
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle);
    setNewTaskTitle('');
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* 1. Dashboard / Plocha */}
      {activeTab === 'dashboard' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-studypilot-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <h3 className="text-xl font-bold mb-2">🎯 Dnešní úkoly & Cíle</h3>
            <p className="text-sm text-gray-400 mb-6">Zde je tvůj aktuální přehled pro dnešní studijní blok.</p>

            <form onSubmit={handleCreateTask} className="flex gap-3 mb-6">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Přidej nový studijní úkol..."
                className="flex-1 bg-studypilot-card border border-studypilot-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-studypilot-primary transition-all text-white placeholder-gray-500"
              />
              <button
                type="submit"
                className="bg-studypilot-primary hover:bg-studypilot-primary/80 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-neon-purple cursor-pointer"
              >
                Přidat úkol
              </button>
            </form>

            <div className="space-y-3">
              {tasks.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">Zatím žádné úkoly. Jsi čistý jako sníh! ☕</p>
              ) : (
                tasks.map((task: Task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`glass-panel-interactive p-4 rounded-xl flex items-center justify-between cursor-pointer ${
                      task.completed ? 'opacity-50 line-through' : ''
                    }`}
                  >
                    <span className="text-sm font-medium">{task.title}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      task.completed ? 'bg-studypilot-success/20 text-studypilot-success' : 'bg-studypilot-primary/20 text-studypilot-primary'
                    }`}>
                      {task.completed ? 'Hotovo ✅' : 'Aktivní ⏱️'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Profil */}
      {activeTab === 'profile' && <ProfileView />}

      {/* 3. Obchod */}
      {activeTab === 'store' && <StoreView />}

      {/* 4. Social */}
      {activeTab === 'social' && <SocialView />}

      {/* 5. Nastavení & GitHub */}
      {activeTab === 'settings' && <SettingsView />}
    </Layout>
  );
      }
