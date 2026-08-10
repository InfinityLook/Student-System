import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Circle, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

type Priority = 'low' | 'medium' | 'high';

const PRIORITY_META: Record<Priority, { label: string; color: string }> = {
  low: { label: 'Nízká', color: '#6b7280' },
  medium: { label: 'Střední', color: '#06b6d4' },
  high: { label: 'Vysoká', color: '#f43f5e' },
};

export const TodoWidget: React.FC = () => {
  const tasks = useAppStore((state) => state.tasks);
  const addTask = useAppStore((state) => state.addTask);
  const toggleTask = useAppStore((state) => state.toggleTask);
  const deleteTask = useAppStore((state) => state.deleteTask);

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const pending = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask(title, priority);
    setTitle('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">🎯 Úkoly</h3>
        <span className="text-[11px] text-gray-500 font-mono">{pending.length} zbývá</span>
      </div>

      {/* Přidání nového úkolu */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Nový úkol..."
            className="flex-1 bg-studypilot-card border border-studypilot-border rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-studypilot-primary/50"
          />
          <button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="w-9 h-9 rounded-xl bg-studypilot-primary hover:opacity-90 disabled:opacity-30 flex items-center justify-center flex-shrink-0 transition-opacity"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="flex gap-1.5">
          {(Object.keys(PRIORITY_META) as Priority[]).map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className="text-[10px] px-2.5 py-1 rounded-full border font-medium transition-colors"
              style={{
                borderColor: priority === p ? PRIORITY_META[p].color : 'rgba(255,255,255,0.1)',
                color: priority === p ? PRIORITY_META[p].color : '#6b7280',
                backgroundColor: priority === p ? `${PRIORITY_META[p].color}1a` : 'transparent',
              }}
            >
              {PRIORITY_META[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* Seznam úkolů */}
      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {[...pending, ...done].map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-studypilot-card border border-studypilot-border"
            >
              <button onClick={() => toggleTask(task.id)} className="flex-shrink-0">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-studypilot-success" />
                ) : (
                  <Circle className="w-5 h-5" style={{ color: PRIORITY_META[task.priority].color }} />
                )}
              </button>
              <span
                className={`flex-1 text-sm truncate ${
                  task.completed ? 'text-gray-500 line-through' : 'text-gray-200'
                }`}
              >
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="flex-shrink-0 text-gray-600 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <p className="text-xs text-gray-500 text-center py-4">Zatím žádné úkoly. Přidej první!</p>
        )}
      </div>
    </div>
  );
};
      
