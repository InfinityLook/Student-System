import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Lock, Search, Trash2 } from 'lucide-react';
import { useAppStore, SLOT_COUNT } from '../../store/useAppStore';
import { MODULE_REGISTRY, PLANNED_MODULES } from '../registry';

export const ModuleLauncher: React.FC = () => {
  const moduleSlots = useAppStore((state) => state.moduleSlots);
  const setSlotModule = useAppStore((state) => state.setSlotModule);

  const [pickerForSlot, setPickerForSlot] = useState<number | null>(null);
  const [previewModuleId, setPreviewModuleId] = useState<string | null>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [search, setSearch] = useState('');

  const activeCount = moduleSlots.filter(Boolean).length;
  const usedIds = new Set(moduleSlots.filter(Boolean) as string[]);
  const unusedModules = MODULE_REGISTRY.filter((m) => !usedIds.has(m.id));

  const filteredCatalog = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MODULE_REGISTRY;
    return MODULE_REGISTRY.filter((m) => m.name.toLowerCase().includes(q));
  }, [search]);

  const previewModule = MODULE_REGISTRY.find((m) => m.id === previewModuleId) || null;
  const previewSlotIndex = previewModuleId ? moduleSlots.indexOf(previewModuleId) : -1;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-studypilot-border space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm text-white">Moje moduly</h4>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-gray-500 font-mono">{activeCount}/{SLOT_COUNT} aktivní</span>
          <button
            onClick={() => setCatalogOpen(true)}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Najít miniaplikaci"
          >
            <Search className="w-3.5 h-3.5 text-gray-300" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {/* 6 volných políček - uživatel si sem dá, co chce */}
        {moduleSlots.map((moduleId, idx) => {
          const mod = moduleId ? MODULE_REGISTRY.find((m) => m.id === moduleId) : null;
          const Icon = mod?.icon;

          if (!mod) {
            return (
              <motion.button
                key={`slot-${idx}`}
                layout
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setPickerForSlot(idx)}
                className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 border border-dashed border-white/15 bg-white/[0.02] hover:border-studypilot-primary/40 hover:bg-studypilot-primary/5 transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-500" />
                <span className="text-[9px] text-gray-500">Přidat</span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={mod.id}
              layout
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setPreviewModuleId(mod.id)}
              className="relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 border border-studypilot-primary/60 bg-studypilot-primary/10 shadow-neon-purple"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSlotModule(idx, null);
                }}
                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-black/40 hover:bg-red-500/80 flex items-center justify-center transition-colors"
                aria-label={`Odebrat ${mod.name}`}
              >
                <X className="w-2.5 h-2.5 text-white" />
              </button>
              {Icon && <Icon className="w-5 h-5" style={{ color: mod.color }} />}
              <span className="text-[9px] font-medium text-gray-300 text-center leading-tight px-1">{mod.name}</span>
            </motion.button>
          );
        })}

        {/* 3 spodní políčka - budoucí miniaplikace, zatím zamčené */}
        {PLANNED_MODULES.slice(0, 3).map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 border border-white/5 bg-white/[0.02]"
            >
              <Icon className="w-5 h-5 text-gray-600" />
              <span className="text-[9px] font-medium text-gray-600 text-center leading-tight px-1">
                <Lock className="w-2.5 h-2.5 inline mr-0.5 -mt-0.5" />
                {m.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Výběr modulu pro prázdný slot */}
      <AnimatePresence>
        {pickerForSlot !== null && (
          <Sheet onClose={() => setPickerForSlot(null)} title="Vyber miniaplikaci">
            {unusedModules.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">Všechny dostupné miniaplikace už používáš.</p>
            ) : (
              <div className="space-y-2">
                {unusedModules.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSlotModule(pickerForSlot, m.id);
                        setPickerForSlot(null);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-studypilot-border bg-studypilot-card hover:border-studypilot-primary/40 transition-colors"
                    >
                      <Icon className="w-4 h-4" style={{ color: m.color }} />
                      <span className="text-sm text-white flex-1 text-left">{m.name}</span>
                      <Plus className="w-4 h-4 text-gray-500" />
                    </button>
                  );
                })}
              </div>
            )}
          </Sheet>
        )}
      </AnimatePresence>

      {/* Katalog všech miniaplikací (vyhledávač) */}
      <AnimatePresence>
        {catalogOpen && (
          <Sheet onClose={() => { setCatalogOpen(false); setSearch(''); }} title="Všechny miniaplikace">
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Hledat..."
                className="w-full bg-studypilot-card border border-studypilot-border rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-studypilot-primary/50"
              />
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {filteredCatalog.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">Nic nenalezeno.</p>
              ) : (
                filteredCatalog.map((m) => {
                  const Icon = m.icon;
                  const isPinned = moduleSlots.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setCatalogOpen(false);
                        setSearch('');
                        setPreviewModuleId(m.id);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-studypilot-border bg-studypilot-card hover:border-studypilot-primary/40 transition-colors"
                    >
                      <Icon className="w-4 h-4" style={{ color: m.color }} />
                      <span className="text-sm text-white flex-1 text-left">{m.name}</span>
                      {isPinned && (
                        <span className="text-[10px] text-studypilot-primary font-medium">Na Hubu</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </Sheet>
        )}
      </AnimatePresence>

      {/* Náhled otevřeného modulu */}
      <AnimatePresence>
        {previewModule && (
          <Sheet onClose={() => setPreviewModuleId(null)} title={previewModule.name}>
            <div className="rounded-xl border border-studypilot-border bg-studypilot-card p-4 mb-4">
              <previewModule.component />
            </div>
            {previewSlotIndex >= 0 ? (
              <button
                onClick={() => {
                  setSlotModule(previewSlotIndex, null);
                  setPreviewModuleId(null);
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Odebrat z Hubu
              </button>
            ) : (
              <button
                onClick={() => {
                  const emptyIdx = moduleSlots.findIndex((s) => s === null);
                  if (emptyIdx >= 0) setSlotModule(emptyIdx, previewModule.id);
                  setPreviewModuleId(null);
                }}
                disabled={moduleSlots.every(Boolean)}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-studypilot-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                <Plus className="w-4 h-4" /> Přidat do Hubu
              </button>
            )}
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sdílený spodní panel (bottom sheet) pro výběr/náhled/vyhledávání
const Sheet: React.FC<{ onClose: () => void; title: string; children: React.ReactNode }> = ({
  onClose,
  title,
  children,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
  >
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.96 }}
      transition={{ type: 'spring', damping: 26, stiffness: 300 }}
      onClick={(e) => e.stopPropagation()}
      className="glass-panel w-full max-w-sm rounded-3xl p-6 space-y-4 border border-white/10 max-h-[80vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);
  
