import React from 'react';
import { Settings, Github, HardDrive, RefreshCw } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
          <Settings className="text-white w-6 h-6" />
          Nastavení & GitHub Sync
        </h3>
        <p className="text-sm text-gray-400">Správa dat, úložiště a synchronizace s GitHub repozitářem.</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Github className="w-5 h-5 text-white" />
            <div>
              <h4 className="font-bold text-sm text-white">GitHub Repozitář</h4>
              <p className="text-xs text-gray-400">Zálohování dat v privátním repozitáři</p>
            </div>
          </div>
          <button className="bg-studypilot-card border border-studypilot-border hover:border-studypilot-primary px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all">
            Připojit účet
          </button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-studypilot-border">
          <div className="flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-studypilot-success" />
            <div>
              <h4 className="font-bold text-sm text-white">Lokální úložiště (IndexedDB)</h4>
              <p className="text-xs text-gray-400">Všechna data jsou uložena bezpečně u tebe</p>
            </div>
          </div>
          <button className="bg-studypilot-primary/20 text-studypilot-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Synchronizovat teď
          </button>
        </div>
      </div>
    </div>
  );
};
