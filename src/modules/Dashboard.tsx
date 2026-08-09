import React from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { MODULE_REGISTRY } from './registry';
import { motion, AnimatePresence } from 'framer-motion'; // Doporučuji instalovat pro smooth animace

export const Dashboard: React.FC = () => {
  const pinnedModules = useDashboardStore((state) => state.pinnedModules);

  return (
    <div className="p-4">
      {/* Grid plochy */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {pinnedModules.map((id) => {
            const module = MODULE_REGISTRY.find(m => m.id === id);
            if (!module) return null;
            
            return (
              <motion.div 
                key={id}
                layout // Toto je klíčové pro plynulé animace přesouvání
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${module.size} glass-panel p-5 rounded-2xl border border-studypilot-border hover:border-studypilot-primary transition-colors`}
              >
                <module.component />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Tlačítko pro přidání modulu */}
      <button className="fixed bottom-20 right-6 bg-studypilot-primary p-4 rounded-full shadow-neon-purple">
        +
      </button>
    </div>
  );
};
