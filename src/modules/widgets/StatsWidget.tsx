import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Flame, Coins, Timer, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const DAY_LABELS = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];

export const StatsWidget: React.FC = () => {
  const tasks = useAppStore((state) => state.tasks);
  const profile = useAppStore((state) => state.profile);

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.completed);
    const total = tasks.length;
    const rate = total > 0 ? Math.round((completed.length / total) * 100) : 0;

    // Posledních 7 dní - kolik úkolů bylo dokončeno každý den
    const days: { label: string; count: number; isToday: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const count = completed.filter((t) => t.completedAt?.slice(0, 10) === key).length;
      days.push({ label: DAY_LABELS[d.getDay()], count, isToday: i === 0 });
    }
    const maxCount = Math.max(1, ...days.map((d) => d.count));

    return { completed: completed.length, total, rate, days, maxCount };
  }, [tasks]);

  return (
    <div className="space-y-4">
      <h3 className="font-bold flex items-center gap-2">📊 Statistiky</h3>

      {/* Karty s klíčovými čísly */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard icon={CheckCircle2} color="#10b981" label="Splněno" value={`${stats.completed}/${stats.total}`} />
        <StatCard icon={TrendingUp} color="#06b6d4" label="Úspěšnost" value={`${stats.rate}%`} />
        <StatCard icon={Flame} color="#f59e0b" label="Šňůra" value={`${profile?.streak ?? 0} dní`} />
        <StatCard icon={Timer} color="#8b5cf6" label="Pomodoro" value={`${profile?.pomodorosCompleted ?? 0}×`} />
      </div>

      {/* Graf posledních 7 dní */}
      <div>
        <p className="text-[11px] text-gray-500 mb-2">Splněné úkoly - posledních 7 dní</p>
        <div className="flex items-end justify-between gap-1.5 h-20">
          {stats.days.map((d, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(6, (d.count / stats.maxCount) * 100)}%` }}
                transition={{ delay: idx * 0.05, duration: 0.4, ease: 'easeOut' }}
                className={`w-full rounded-md ${d.isToday ? 'bg-studypilot-primary' : 'bg-studypilot-primary/30'}`}
                style={{ minHeight: 6 }}
              />
              <span className={`text-[9px] ${d.isToday ? 'text-white font-semibold' : 'text-gray-600'}`}>
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <span className="text-xs text-gray-500">Úroveň {profile?.level ?? 1}</span>
        <span className="flex items-center gap-1 text-xs text-studypilot-gold font-medium">
          <Coins className="w-3.5 h-3.5" /> {profile?.coins ?? 0}
        </span>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: typeof CheckCircle2; color: string; label: string; value: string }> = ({
  icon: Icon,
  color,
  label,
  value,
}) => (
  <div className="rounded-xl bg-studypilot-card border border-studypilot-border p-2.5 flex items-center gap-2">
    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}22` }}>
      <Icon className="w-4 h-4" style={{ color }} />
    </div>
    <div className="min-w-0">
      <p className="text-sm font-bold text-white leading-tight">{value}</p>
      <p className="text-[10px] text-gray-500 leading-tight truncate">{label}</p>
    </div>
  </div>
);
      
