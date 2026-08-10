import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

// Kolik XP je potřeba na další úroveň (jednoduchý lineární vzorec)
const xpForLevel = (level: number) => level * 100;

export const ProfileSummaryCard: React.FC = () => {
  const profile = useAppStore((state) => state.profile);
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  if (!profile) return null;

  const needed = xpForLevel(profile.level);
  const progress = Math.min(100, Math.round((profile.xp / needed) * 100));
  const initial = profile.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <motion.button
      onClick={() => setActiveTab('profile')}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full glass-panel rounded-2xl border border-studypilot-border p-4 flex items-center gap-3 text-left"
    >
      {profile.photoURL ? (
        <img
          src={profile.photoURL}
          alt={profile.name}
          referrerPolicy="no-referrer"
          className="w-12 h-12 rounded-full border-2 border-studypilot-primary/50 object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-studypilot-primary to-studypilot-accent flex items-center justify-center text-lg font-bold flex-shrink-0">
          {initial}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-bold text-white truncate">{profile.name}</p>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-studypilot-primary/20 text-studypilot-primary font-semibold flex-shrink-0">
            Lv. {profile.level}
          </span>
        </div>
        <p className="text-xs text-gray-500 truncate">{profile.email}</p>

        <div className="mt-1.5 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-studypilot-primary to-studypilot-accent"
            />
          </div>
          <span className="flex items-center gap-0.5 text-[10px] text-gray-400 font-mono flex-shrink-0">
            <Zap className="w-3 h-3 text-studypilot-accent" />
            {profile.xp}/{needed}
          </span>
        </div>
      </div>
    </motion.button>
  );
};
