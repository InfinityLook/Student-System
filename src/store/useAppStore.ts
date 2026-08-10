import { create } from 'zustand';
import { db, Task, UserProfile } from '../db/db';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

export type AppTab = 'profile' | 'social' | 'hub' | 'store' | 'settings';

// Počet volných políček, do kterých si uživatel může přiřadit libovolnou miniaplikaci
export const SLOT_COUNT = 6;

interface AppState {
  profile: UserProfile | null;
  tasks: Task[];
  isAuthenticated: boolean;
  // Každý slot obsahuje id modulu z MODULE_REGISTRY, nebo null (prázdné, volitelné políčko)
  moduleSlots: (string | null)[];
  authError: string | null;
  activeTab: AppTab;
  
  // Akce
  initAuth: () => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loadData: () => Promise<void>;
  addTask: (title: string, priority?: 'low' | 'medium' | 'high') => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  setSlotModule: (slotIndex: number, moduleId: string | null) => void;
  setActiveTab: (tab: AppTab) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  profile: null,
  tasks: [],
  isAuthenticated: false, // Výchozí stav je "nepřihlášen"
  // Výchozí obsazení: Úkoly, Pomodoro, Statistiky, zbytek volný - uživatel si je může kdykoliv přeskládat
  moduleSlots: ['todo', 'timer', 'stats', null, null, null],
  authError: null,
  activeTab: 'hub',

  // TATO FUNKCE SPUSTÍ POSLUCHAČE STAVU
  initAuth: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Uživatel je přihlášen, načteme jeho data
        let profile = await db.profile.get(user.uid);

        // Pokud se uživatel přihlašuje poprvé, profil v Dexie ještě neexistuje -> vytvoříme ho
        if (!profile) {
          profile = {
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'Student',
            email: user.email || '',
            photoURL: user.photoURL || undefined,
            xp: 0,
            level: 1,
            coins: 0,
            streak: 0,
          };
          await db.profile.add(profile);
        } else if (
          // Udržujeme jméno/e-mail/fotku v Dexie synchronizované s aktuálním Google účtem
          profile.name !== (user.displayName || profile.name) ||
          profile.email !== (user.email || profile.email) ||
          profile.photoURL !== (user.photoURL || profile.photoURL)
        ) {
          profile = {
            ...profile,
            name: user.displayName || profile.name,
            email: user.email || profile.email,
            photoURL: user.photoURL || profile.photoURL,
          };
          await db.profile.put(profile);
        }

        const tasks = await db.tasks.toArray();
        set({ isAuthenticated: true, profile, tasks });
      } else {
        // Uživatel je odhlášen
        set({ isAuthenticated: false, profile: null, tasks: [] });
      }
    });
  },

  loginWithGoogle: async () => {
    set({ authError: null });
    try {
      await signInWithPopup(auth, googleProvider);
      // O zbytek se postará onAuthStateChanged v initAuth
    } catch (error: any) {
      console.error("Chyba při přihlašování:", error);

      // Uživatel klikl mimo popup nebo ho zavřel - nejde o skutečnou chybu
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        return;
      }

      const message =
        error?.code === 'auth/popup-blocked'
          ? 'Prohlížeč zablokoval přihlašovací okno. Povol vyskakovací okna a zkus to znovu.'
          : 'Přihlášení přes Google se nepovedlo. Zkus to prosím znovu.';

      set({ authError: message });
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

  // Přiřadí (nebo vyprázdní) konkrétní políčko - uživatel si tak sám poskládá, co chce mít po ruce
  setSlotModule: (slotIndex, moduleId) => {
    set((state) => {
      const slots = [...state.moduleSlots];
      // Pokud je modul už v jiném slotu, tak ho odtamtud odebereme (jeden modul = jedno políčko)
      if (moduleId) {
        for (let i = 0; i < slots.length; i++) {
          if (slots[i] === moduleId) slots[i] = null;
        }
      }
      slots[slotIndex] = moduleId;
      return { moduleSlots: slots };
    });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
}));
        
