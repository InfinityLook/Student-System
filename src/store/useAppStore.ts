import { create } from 'zustand';
import { db, Task, UserProfile } from '../db/db';
import { signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AppState {
  // Data uživatele a úkoly
  profile: UserProfile | null;
  tasks: Task[];
  isAuthenticated: boolean;
  
  // Dashboard moduly
  pinnedModules: string[]; 

  // Akce (Authentication)
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  
  // Akce (Data & Moduly)
  loadData: () => Promise<void>;
  addTask: (title: string, priority?: 'low' | 'medium' | 'high') => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  toggleModule: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Výchozí stav
  profile: null,
  tasks: [],
  isAuthenticated: false,
  pinnedModules: ['todo', 'timer', 'stats'], // Výchozí dlaždice na ploše

  // REÁLNÉ GOOGLE PŘIHLÁŠENÍ
  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Zkontrolujeme, zda už uživatel má profil v lokální IndexedDB, jinak vytvoříme nový
      let profile = await db.profile.get(user.uid);
      if (!profile) {
        profile = {
          id: user.uid,
          name: user.displayName || 'Student',
          email: user.email || '',
          xp: 100,
          level: 1,
          coins: 50,
          streak: 1,
        };
        await db.profile.put(profile);
      }

      const tasks = await db.tasks.toArray();
      set({ isAuthenticated: true, profile, tasks });
    } catch (error) {
      console.error('Chyba při přihlašování:', error);
    }
  },

  // ODHLÁŠENÍ
  logout: async () => {
    await fbSignOut(auth);
    set({ isAuthenticated: false, profile: null, tasks: [] });
  },

  // NAČTENÍ DAT
  loadData: async () => {
    const tasks = await db.tasks.toArray();
    const profile = await db.profile.get('current-user'); // nebo podle aktuálního ID
    set({ tasks, profile });
  },

  // SPRÁVA ÚKOLŮ
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
  loginWithGoogle: async () => {
    console.log("Pokus o přihlášení spuštěn..."); // TADY TO UVIDÍŠ V CONSOLI
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Přihlášení úspěšné:", result.user);
      const user = result.user;

      let profile = await db.profile.get(user.uid);
      if (!profile) {
        // ... (zbytek kódu zůstává stejný)
      }
      set({ isAuthenticated: true, profile, tasks: await db.tasks.toArray() });
    } catch (error) {
      console.error("CHYBA PŘI PŘIHLAŠOVÁNÍ:", error); // TADY UVIDÍŠ PŘESNOU CHYBU
    }
  },
  
  // SPRÁVA DASHBOARDU
  toggleModule: (id: string) => {
    set((state) => ({
      pinnedModules: state.pinnedModules.includes(id)
        ? state.pinnedModules.filter((m) => m !== id)
        : [...state.pinnedModules, id],
    }));
  },
}));
        
