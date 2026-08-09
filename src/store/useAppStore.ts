import { create } from 'zustand';
import { db, Task, UserProfile } from '../db/db';

interface AppState {
  profile: UserProfile | null;
  tasks: Task[];
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  loadData: () => Promise<void>;
  addTask: (title: string, priority?: 'low' | 'medium' | 'high') => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  profile: null,
  tasks: [],
  isAuthenticated: false,

  loginWithGoogle: async () => {
    let profile = await db.profile.get('current-user');
    if (!profile) {
      profile = {
        id: 'current-user',
        name: 'Alex Student',
        email: 'alex.student@gmail.com',
        xp: 340,
        level: 3,
        coins: 250,
        streak: 5,
      };
      await db.profile.put(profile);
    }
    const tasks = await db.tasks.toArray();
    set({ isAuthenticated: true, profile, tasks });
  },

  logout: () => {
    set({ isAuthenticated: false });
  },

  loadData: async () => {
    let profile = await db.profile.get('current-user');
    const tasks = await db.tasks.toArray();
    if (profile) {
      set({ tasks });
    }
  },

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

  toggleTask: async (id) => {
    const tasks = get().tasks.map((t: Task) => {
      if (t.id === id) {
        const updated = { ...t, completed: !t.completed };
        db.tasks.put(updated);
        return updated;
      }
      return t;
    });
    set({ tasks });
  },
}));
