import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ShoppingBag, Coins, Shield, Sparkles, Volume2 } from 'lucide-react';

export const StoreView: React.FC = () => {
  const profile = useAppStore((state) => state.profile);

  if (!profile) return null;

  const items = [
    {
      id: '1',
      name: 'Streak Freeze',
      description: 'Ochrana tvé série před propadnutím v případě vynechání dne.',
      price: 100,
      icon: Shield,
      category: 'Utility',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    },
    {
      id: '2',
      name: 'Cyberpunkový rámeček',
      description: 'Exkluzivní zářící neonový rámeček kolem tvého profilového avatara.',
      price: 250,
      icon: Sparkles,
      category: 'Vizuál',
      color: 'text-studypilot-primary bg-studypilot-primary/10 border-studypilot-primary/30'
    },
    {
      id: '3',
      name: 'ASMR Mechanická klávesnice',
      description: 'Uspokojivé zvuky mechanických spínačů při odškrtávání úkolů.',
      price: 150,
      icon: Volume2,
      category: 'Zvuky',
      color: 'text-studypilot-success bg-studypilot-success/10 border-studypilot-success/30'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Hlavička obchodu & zůstatek coinů */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex items-center justify-between">
        <div className="absolute top-0 right-0 w-64 h-64 bg-studypilot-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-studypilot-gold" />
            Obchod & Loot Economy
          </h3>
          <p className="text-sm text-gray-400">Utrácej poctivě vydělané coiny za vylepšení a exkluzivní předměty.</p>
        </div>
        <div className="flex items-center gap-2 bg-studypilot-card border border-studypilot-border px-4 py-2 rounded-xl">
          <Coins className="w-5 h-5 text-studypilot-gold" />
          <span className="font-bold text-studypilot-gold text-lg">{profile.coins}</span>
        </div>
      </div>

      {/* Seznam položek v obchodě */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => {
          const IconComponent = item.icon;
          const canAfford = profile.coins >= item.price;

          return (
            <div key={item.id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4 border border-studypilot-border">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${item.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-studypilot-card border border-studypilot-border text-gray-300">
                    {item.category}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{item.name}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-studypilot-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-studypilot-gold font-bold text-sm">
                  <Coins className="w-4 h-4" />
                  <span>{item.price}</span>
                </div>
                <button
                  disabled={!canAfford}
                  onClick={() => alert(`Zakoupeno: ${item.name}! 🎉`)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    canAfford
                      ? 'bg-studypilot-gold hover:bg-studypilot-gold/80 text-black shadow-lg shadow-studypilot-gold/20 cursor-pointer'
                      : 'bg-studypilot-card text-gray-500 border border-studypilot-border cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Koupit' : 'Nedostatek coinů'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
