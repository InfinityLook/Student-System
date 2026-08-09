import { create } from 'zustand';
import { db, Task, UserProfile } from '../db/db';

interface AppState {
  profile: UserProfile | null;
  tasks: Task[];
  loadData: () => Promise<void>;
  addTask: (title: string, priority?: 'low' | 'medium' | 'high') => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  profile: null,
  tasks: [],

  // Načtení dat při startu aplikace
  loadData: async () => {
    let profile = await db.profile.get('current-user');
    if (!profile) {
      // Výchozí profil pro nového uživatele
      profile = {
        id: 'current-user',
        name: 'Alex Student',
        email: 'alex@univerzita.cz',
        xp: 340,
        level: 3,
        coins: 250,
        streak: 5,
      };
      await db.profile.put(profile);
    }

    const tasks = await db.tasks.toArray();
    set({ profile, tasks });
  },

  // Přidání nového úkolu
  addTask: async (title, priority = 'medium') => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      priority,
    };
    await db.tasks.add(newTask);
    set({ tasks: [...get().tasks, newTask] });
  },

  // Odškrtnutí úkolu (s okamžitou odezvou)
  toggleTask: async (id) => {
    const tasks = get().tasks.map(t => {
      if (t.id === id) {
        const updated = { ...t, completed: !t.completed };
        db.tasks.put(updated); // Uložení do IndexedDB na pozadí
        return updated;
      }
      return t;
    });
    set({ tasks });
  },
}));
  
