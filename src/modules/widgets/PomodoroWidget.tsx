import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

const formatTime = (s: number) => {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

export const PomodoroWidget: React.FC = () => {
  const completePomodoro = useAppStore((state) => state.completePomodoro);
  const pomodorosCompleted = useAppStore((state) => state.profile?.pomodorosCompleted ?? 0);

  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Kolo doběhlo
            if (mode === 'work') {
              completePomodoro();
              setMode('break');
              return BREAK_SECONDS;
            } else {
              setMode('work');
              return WORK_SECONDS;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, mode]);

  useEffect(() => {
    // Automaticky zastavíme běh, když kolo skončí, ať uživatel vědomě spustí další
    if (secondsLeft === WORK_SECONDS || secondsLeft === BREAK_SECONDS) {
      setIsRunning((wasRunning) => (wasRunning ? false : wasRunning));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const total = mode === 'work' ? WORK_SECONDS : BREAK_SECONDS;
  const progress = 1 - secondsLeft / total;
  const radius = 44;
  const circumference = 2 * Math.PI * radius;

  const reset = () => {
    setIsRunning(false);
    setMode('work');
    setSecondsLeft(WORK_SECONDS);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">⏱️ Pomodoro</h3>
        <span className="text-[11px] text-gray-500 font-mono">{pomodorosCompleted} kol dnes celkem</span>
      </div>

      <div className="flex flex-col items-center py-2">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={mode === 'work' ? '#8b5cf6' : '#10b981'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: circumference * (1 - progress) }}
              transition={{ duration: 0.4, ease: 'linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white font-mono">{formatTime(secondsLeft)}</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5">
              {mode === 'work' ? 'Soustředění' : 'Pauza'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={reset}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Reset"
          >
            <RotateCcw className="w-4 h-4 text-gray-300" />
          </button>
          <button
            onClick={() => setIsRunning((r) => !r)}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-studypilot-primary to-studypilot-accent flex items-center justify-center shadow-neon-purple"
          >
            {isRunning ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </button>
          <div className="w-9 h-9" />
        </div>
      </div>
    </div>
  );
};
    
