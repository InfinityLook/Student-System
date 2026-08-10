import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

// Nálada mazlíčka podle aktuálního streaku - roste s tebou
function getMood(streak: number) {
  if (streak <= 0) return { label: 'Čeká na tebe', color: '#5b5f75', bounce: 4 };
  if (streak < 3) return { label: 'Probouzí se', color: '#06b6d4', bounce: 8 };
  if (streak < 7) return { label: 'Ve formě!', color: '#8b5cf6', bounce: 12 };
  return { label: 'Nezastavitelný!', color: '#f59e0b', bounce: 16 };
}

export const PetWidget: React.FC = () => {
  const profile = useAppStore((state) => state.profile);
  const streak = profile?.streak ?? 0;
  const mood = getMood(streak);

  return (
    <div className="glass-panel rounded-2xl border border-studypilot-border p-4 flex items-center gap-4">
      <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
        {/* Jemná záře pod mazlíčkem */}
        <motion.div
          className="absolute inset-0 rounded-full blur-lg"
          style={{ backgroundColor: mood.color, opacity: 0.35 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Tělo mazlíčka */}
        <motion.div
          animate={{ y: [0, -mood.bounce, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: mood.color }}
        >
          {/* Oči */}
          <div className="flex gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white block" />
            <span className="w-1.5 h-1.5 rounded-full bg-white block" />
          </div>
        </motion.div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm">Tvůj studijní parťák</p>
        <p className="text-xs" style={{ color: mood.color }}>{mood.label}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">
          {streak > 0 ? `${streak}denní studijní šňůra` : 'Splň dnes úkol a probuď ho'}
        </p>
      </div>
    </div>
  );
};
