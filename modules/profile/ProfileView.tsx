import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Flame, Coins, Trophy, Award, Github } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const profile = useAppStore((state) => state.profile);

  if (!profile) return null;

  // Vygenerování mřížky pro GitHub-style heatmapu (posledních 35 dní)
  const days = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    count: Math.floor(Math.random() * 4), // 0 až 3 intenzita aktivity
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* --- Herní vizitka (Player Card) --- */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-studypilot-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Avatar s neonovým rámečkem podle levelu */}
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-studypilot-primary to-studypilot-accent p-1 shadow-neon-purple flex items-center justify-center">
            <div className="w-full h-full bg-studypilot-card rounded-xl flex items-center justify-center text-3xl font-bold text-white">
              {profile.name.charAt(0)}
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-studypilot-primary text-white text-xs px-2.5 py-0.5 rounded-full font-bold shadow">
            Lvl {profile.level}
          </div>
        </div>

        {/* Uživatelské info & XP Bar */}
        <div className="flex-1 text-center md:text-left w-full">
          <h3 className="text-2xl font-bold text-white mb-1">{profile.name}</h3>
          <p className="text-xs text-gray-400 mb-4 font-mono">{profile.email}</p>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Progres na Level {profile.level + 1}</span>
              <span className="text-studypilot-primary font-semibold">{profile.xp} / 500 XP</span>
            </div>
            <div className="w-full h-2.5 bg-studypilot-card rounded-full overflow-hidden border border-studypilot-border">
              <div 
                className="h-full bg-gradient-to-r from-studypilot-primary to-studypilot-accent transition-all duration-500"
                style={{ width: `${(profile.xp / 500) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Rychlé statistiky */}
        <div className="flex md:flex-col gap-3 w-full md:w-auto">
          <div className="flex-1 glass-panel px-4 py-2.5 rounded-xl flex items-center gap-3">
            <Flame className="w-5 h-5 text-orange-400 fill-orange-400/20" />
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Streak</div>
              <div className="text-sm font-bold text-orange-400">{profile.streak} dnů</div>
            </div>
          </div>
          <div className="flex-1 glass-panel px-4 py-2.5 rounded-xl flex items-center gap-3">
            <Coins className="w-5 h-5 text-studypilot-gold" />
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Coiny</div>
              <div className="text-sm font-bold text-studypilot-gold">{profile.coins}</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- GitHub-style Heatmapa aktivity --- */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-white" />
            <h4 className="font-bold text-sm text-white">Studijní Heatmapa aktivity</h4>
          </div>
          <span className="text-xs text-gray-400 font-mono">Posledních 35 dní</span>
        </div>
        
        <div className="grid grid-cols-7 sm:grid-cols-12 gap-2 pt-2">
          {days.map((day) => {
            let bgClass = 'bg-studypilot-card border border-studypilot-border';
            if (day.count === 1) bgClass = 'bg-studypilot-success/25 border border-studypilot-success/30';
            if (day.count === 2) bgClass = 'bg-studypilot-success/60 border border-studypilot-success/60';
            if (day.count === 3) bgClass = 'bg-studypilot-success border border-studypilot-success shadow-neon-cyan';

            return (
              <div
                key={day.id}
                className={`h-8 rounded-lg transition-all ${bgClass}`}
                title={`Aktivita: úroveň ${day.count}`}
              ></div>
            );
          })}
        </div>
      </div>

      {/* --- Sběratelské odznaky --- */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-studypilot-gold" />
          <h4 className="font-bold text-sm text-white">Odemčené odznaky</h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl border border-studypilot-primary/30 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-studypilot-primary/20 flex items-center justify-center text-studypilot-primary">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">Ranní ptáče</h5>
              <p className="text-[10px] text-gray-400">Aktivní před 8:00</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-studypilot-border opacity-40 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-500">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-gray-400">Exam Master</h5>
              <p className="text-[10px] text-gray-500">Aktivuj zkouškový mód</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
      
