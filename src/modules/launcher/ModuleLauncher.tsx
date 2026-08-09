import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Lock, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { MODULE_REGISTRY, PLANNED_MODULES } from '../registry';

// Kolik dlaždic je kolem prostředního "+" tlačítka (3x3 mřížka minus střed)
const SLOT_COUNT = 8;

export const ModuleLauncher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pinnedModules = useAppStore((state) => state.pinnedModules);
  const toggleModule = useAppStore((state) => state.toggleModule);

  type TileKind = 'active' | 'available' | 'planned' | 'empty';
  type Tile = { id: string; name: string; icon: typeof Lock; color: string; kind: TileKind; locked?: boolean };

  // Dlaždice do mřížky: nejdřív připnuté moduly, pak zbylé dostupné, pak uzamčené "brzy" sloty
  const pinnedTiles: Tile[] = MODULE_REGISTRY.filter((m) => pinnedModules.includes(m.id)).map((m) => ({
    ...m,
    kind: 'active',
  }));
  const availableTiles: Tile[] = MODULE_REGISTRY.filter((m) => !pinnedModules.includes(m.id)).map((m) => ({
    ...m,
    kind: 'available',
  }));
  const filledCount = pinnedTiles.length + availableTiles.length;
  const plannedTiles: Tile[] = PLANNED_MODULES.slice(0, Math.max(0, SLOT_COUNT - filledCount)).map((m) => ({
    ...m,
    color: '#3a3f55',
    kind: 'planned',
  }));

  const tiles: Tile[] = [...pinnedTiles, ...availableTiles, ...plannedTiles].slice(0, SLOT_COUNT);
  // Doplníme prázdné dlaždice, pokud modulů i plánovaných slotů je málo
  while (tiles.length < SLOT_COUNT) {
    tiles.push({ id: `empty-${tiles.length}`, name: '', icon: Lock, color: '#20233350', kind: 'empty' });
  }

  // Vložíme "+" doprostřed 3x3 mřížky (pozice 4)
  const gridItems: Array<{ type: 'center' } | { type: 'tile'; tile: (typeof tiles)[number] }> = [
    ...tiles.slice(0, 4).map((t) => ({ type: 'tile' as const, tile: t })),
    { type: 'center' as const },
    ...tiles.slice(4).map((t) => ({ type: 'tile' as const, tile: t })),
  ];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-studypilot-border space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm text-white">Moje moduly</h4>
        <span className="text-[11px] text-gray-500 font-mono">{pinnedTiles.length} aktivní</span>
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {gridItems.map((item, idx) => {
          if (item.type === 'center') {
            return (
              <motion.button
                key="center-plus"
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="relative aspect-square rounded-2xl flex items-center justify-center bg-gradient-to-tr from-studypilot-primary to-studypilot-accent shadow-neon-purple cursor-pointer"
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-white/20"
                  animate={{ opacity: [0.15, 0.35, 0.15] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <Plus className="w-7 h-7 text-white relative z-10" />
              </motion.button>
            );
          }

          const { tile } = item;
          const Icon = tile.icon;
          const isActive = tile.kind === 'active';
          const isCoreLocked = isActive && tile.locked;
          const isFutureLocked = tile.kind === 'planned' || tile.kind === 'empty';
          const isNonInteractive = isCoreLocked || isFutureLocked;

          return (
            <motion.button
              key={tile.id + idx}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              whileHover={!isNonInteractive ? { scale: 1.08, y: -2 } : {}}
              whileTap={!isNonInteractive ? { scale: 0.94 } : {}}
              onClick={() => {
                if (tile.kind === 'available' || (tile.kind === 'active' && !tile.locked)) toggleModule(tile.id);
              }}
              disabled={isNonInteractive}
              className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 border transition-colors ${
                isActive
                  ? 'border-studypilot-primary/60 bg-studypilot-primary/10 shadow-neon-purple'
                  : isFutureLocked
                  ? 'border-white/5 bg-white/[0.02] cursor-default'
                  : 'border-studypilot-border bg-studypilot-card hover:border-studypilot-primary/40 cursor-pointer'
              } ${isCoreLocked ? 'cursor-default' : ''}`}
            >
              {isActive && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-studypilot-primary flex items-center justify-center">
                  {tile.locked ? <Lock className="w-2.5 h-2.5 text-white" /> : <Check className="w-2.5 h-2.5 text-white" />}
                </div>
              )}
              {isFutureLocked && !tile.name ? (
                <div className="w-4 h-4 rounded-full border border-dashed border-white/10" />
              ) : (
                <>
                  {Icon && (
                    <Icon
                      className="w-5 h-5"
                      style={{ color: isFutureLocked ? '#5b5f75' : tile.color }}
                    />
                  )}
                  <span className={`text-[9px] font-medium text-center leading-tight px-1 ${isFutureLocked ? 'text-gray-600' : 'text-gray-300'}`}>
                    {isFutureLocked && <Lock className="w-2.5 h-2.5 inline mr-0.5 -mt-0.5" />}
                    {tile.name}
                  </span>
                </>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Panel pro správu modulů, otevíraný prostředním "+" */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel w-full max-w-sm rounded-3xl p-6 space-y-5 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Spravovat moduly</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {MODULE_REGISTRY.map((m) => {
                  const active = pinnedModules.includes(m.id);
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => !m.locked && toggleModule(m.id)}
                      disabled={m.locked}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                        active
                          ? 'border-studypilot-primary/50 bg-studypilot-primary/10'
                          : 'border-studypilot-border bg-studypilot-card hover:border-studypilot-primary/30'
                      } ${m.locked ? 'cursor-default' : ''}`}
                    >
                      <Icon className="w-4 h-4" style={{ color: m.color }} />
                      <span className="text-sm text-white flex-1 text-left">{m.name}</span>
                      {m.locked ? (
                        <span className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                          <Lock className="w-3 h-3" /> Vždy aktivní
                        </span>
                      ) : active ? (
                        <Check className="w-4 h-4 text-studypilot-primary" />
                      ) : (
                        <Plus className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {PLANNED_MODULES.length > 0 && (
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">Připravujeme</p>
                  {PLANNED_MODULES.map((m) => {
                    const Icon = m.icon;
                    return (
                      <div key={m.id} className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] opacity-60">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-400 flex-1 text-left">{m.name}</span>
                        <Lock className="w-3.5 h-3.5 text-gray-600" />
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
