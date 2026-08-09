import { create } from 'zustand';
import { db, Task, UserProfile } from '../db/db';
import { signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AppState {
  // Data
  profile: UserProfile | null;
  tasks: Task[];
  isAuthenticated: boolean;
  
  // Dashboard / Plocha
  pinnedModules: string[]; 

  // Akce (Auth)
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
  pinnedModules: ['todo', 'timer', 'stats'], // Výchozí dlaždice

  // 1. REÁLNÉ GOOGLE PŘIHLÁŠENÍ
  loginWithGoogle: async () => {
    console.log("Pokus o přihlášení spuštěn...");
    try {
      // Otevře popup okno Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Přihlášení úspěšné:", user.email);

      // Zkontrolujeme/vytvoříme profil v Dexie (lokální DB)
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

      // Načteme úkoly a nastavíme stav
      const tasks = await db.tasks.toArray();
      set({ isAuthenticated: true, profile, tasks });
    } catch (error) {
      console.error("CHYBA PŘI PŘIHLAŠOVÁNÍ:", error);
      alert("Přihlášení selhalo. Zkontroluj konzoli prohlížeče (F12).");
    }
  },

  // 2. ODHLÁŠENÍ
  logout: async () => {
    try {
      await fbSignOut(auth);
      set({ isAuthenticated: false, profile: null, tasks: [] });
    } catch (error) {
      console.error("Chyba při odhlašování:", error);
    }
  },

  // 3. NAČTENÍ DAT
  loadData: async () => {
    try {
      const tasks = await db.tasks.toArray();
      // Pokusíme se načíst profil, pokud je uživatel přihlášen
      const currentUser = auth.currentUser;
      if (currentUser) {
        const profile = await db.profile.get(currentUser.uid);
        set({ tasks, profile, isAuthenticated: true });
      } else {
        set({ tasks });
      }
    } catch (error) {
      console.error("Chyba při načítání dat:", error);
    }
  },

  // 4. SPRÁVA ÚKOLŮ
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

  // 5. SPRÁVA PLOCHY (MODULY)
  toggleModule: (id: string) => {
    set((state) => ({
      pinnedModules: state.pinnedModules.includes(id)
        ? state.pinnedModules.filter((m) => m !== id)
        : [...state.pinnedModules, id],
    }));
  },
}));
