import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { MODULE_REGISTRY } from './registry';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const pinnedModules = useAppStore((state: any) => state.pinnedModules);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {pinnedModules.map((id: string) => {
            const module = MODULE_REGISTRY.find((m: any) => m.id === id);
            if (!module) return null;
            
            return (
              <motion.div 
                key={id}
                layout
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
    </div>
  );
};
