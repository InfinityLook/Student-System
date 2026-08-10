import { create } from 'zustand';
import { db, Task, UserProfile } from '../db/db';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

export type AppTab = 'profile' | 'social' | 'hub' | 'store' | 'settings';

// Počet volných políček, do kterých si uživatel může přiřadit libovolnou miniaplikaci
export const SLOT_COUNT = 6;

// Kolik XP je potřeba na danou úroveň (sdíleno napříč appkou, ať se to nikde nerozejde)
export const xpForLevel = (level: number) => level * 100;

// Odměny za splnění úkolu podle priority
const TASK_REWARDS: Record<Task['priority'], { xp: number; coins: number }> = {
  low: { xp: 5, coins: 2 },
  medium: { xp: 10, coins: 5 },
  high: { xp: 20, coins: 10 },
};

// Odměna za dokončené Pomodoro kolo
const POMODORO_REWARD = { xp: 15, coins: 8 };

const todayStr = () => new Date().toISOString().slice(0, 10);
const yesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

// Aktualizuje studijní šňůru podle toho, kdy uživatel naposledy něco udělal
function withActivity(profile: UserProfile): UserProfile {
  const today = todayStr();
  if (profile.lastActiveDate === today) return profile;

  const streak = profile.lastActiveDate === yesterdayStr() ? profile.streak + 1 : 1;
  return { ...profile, streak, lastActiveDate: today };
}

// Přidá XP/mince a postará se o postup na další úroveň (i o více úrovní najednou)
function withReward(profile: UserProfile, xpGain: number, coinGain: number): UserProfile {
  let xp = profile.xp + xpGain;
  let level = profile.level;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level += 1;
  }
  return { ...profile, xp, level, coins: Math.max(0, profile.coins + coinGain) };
}

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
  deleteTask: (id: string) => Promise<void>;
  completePomodoro: () => Promise<void>;
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
            pomodorosCompleted: 0,
          };
          await db.profile.add(profile);
        } else {
          // Starší profily nemusí mít nová pole - doplníme bezpečné výchozí hodnoty
          if (profile.pomodorosCompleted === undefined) profile.pomodorosCompleted = 0;

          // Udržujeme jméno/e-mail/fotku v Dexie synchronizované s aktuálním Google účtem
          if (
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
          }
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
    const trimmed = title.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    };
    await db.tasks.add(newTask);
    set({ tasks: [...get().tasks, newTask] });
  },

  toggleTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const willComplete = !task.completed;
    const updatedTask: Task = {
      ...task,
      completed: willComplete,
      completedAt: willComplete ? new Date().toISOString() : undefined,
    };
    await db.tasks.put(updatedTask);
    set({ tasks: get().tasks.map((t) => (t.id === id ? updatedTask : t)) });

    // Odměna se připíše jen při dokončení, při zpětném odškrtnutí se stejnou částkou odečte
    const { xp, coins } = TASK_REWARDS[task.priority];
    const currentProfile = get().profile;
    if (!currentProfile) return;

    let nextProfile = willComplete
      ? withReward(withActivity(currentProfile), xp, coins)
      : { ...currentProfile, xp: Math.max(0, currentProfile.xp - xp), coins: Math.max(0, currentProfile.coins - coins) };

    await db.profile.put(nextProfile);
    set({ profile: nextProfile });
  },

  deleteTask: async (id) => {
    await db.tasks.delete(id);
    set({ tasks: get().tasks.filter((t) => t.id !== id) });
  },

  completePomodoro: async () => {
    const currentProfile = get().profile;
    if (!currentProfile) return;

    const rewarded = withReward(withActivity(currentProfile), POMODORO_REWARD.xp, POMODORO_REWARD.coins);
    const nextProfile: UserProfile = {
      ...rewarded,
      pomodorosCompleted: (rewarded.pomodorosCompleted || 0) + 1,
    };

    await db.profile.put(nextProfile);
    set({ profile: nextProfile });
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
      
