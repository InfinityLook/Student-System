import { create } from 'zustand';
import { db, Task, UserProfile } from '../db/db';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AppState {
  profile: UserProfile | null;
  tasks: Task[];
  isAuthenticated: boolean;
  pinnedModules: string[];
  
  // Akce
  initAuth: () => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loadData: () => Promise<void>;
  addTask: (title: string, priority?: 'low' | 'medium' | 'high') => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  toggleModule: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  profile: null,
  tasks: [],
  isAuthenticated: false, // Výchozí stav je "nepřihlášen"
  pinnedModules: ['todo', 'timer', 'stats'],

  // TATO FUNKCE SPUSTÍ POSLUCHAČE STAVU
  initAuth: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Uživatel je přihlášen, načteme jeho data
        const profile = await db.profile.get(user.uid);
        const tasks = await db.tasks.toArray();
        set({ isAuthenticated: true, profile, tasks });
      } else {
        // Uživatel je odhlášen
        set({ isAuthenticated: false, profile: null, tasks: [] });
      }
    });
  },

  loginWithGoogle: async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // O zbytek se postará onAuthStateChanged v initAuth
    } catch (error) {
      console.error("Chyba při přihlašování:", error);
    }
  },

  logout: async () => {
    await fbSignOut(auth);
  },

  loadData: async () => {
    const tasks = await db.tasks.toArray();
    set({ tasks });
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

  toggleModule: (id: string) => {
    set((state) => ({
      pinnedModules: state.pinnedModules.includes(id)
        ? state.pinnedModules.filter((m) => m !== id)
        : [...state.pinnedModules, id],
    }));
  },
}));
