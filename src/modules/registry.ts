// src/modules/registry.ts
import { TodoWidget } from './widgets/TodoWidget';
import { PomodoroWidget } from './widgets/PomodoroWidget';
import { StatsWidget } from './widgets/StatsWidget';
import { ListTodo, Timer, BarChart3, Sparkles, Trophy, BookOpen } from 'lucide-react';

export const MODULE_REGISTRY = [
  { id: 'todo', name: 'Úkoly', component: TodoWidget, size: 'col-span-1', icon: ListTodo, color: '#8b5cf6', locked: true },
  { id: 'timer', name: 'Pomodoro', component: PomodoroWidget, size: 'col-span-1', icon: Timer, color: '#06b6d4', locked: true },
  { id: 'stats', name: 'Statistiky', component: StatsWidget, size: 'col-span-2', icon: BarChart3, color: '#10b981', locked: true },
];

// Sloty pro budoucí miniaplikace - zatím uzamčené, čekají na implementaci.
// Až přidáš nový modul do MODULE_REGISTRY výše, automaticky se odemkne
// v launcheru a zmizí odsud.
export const PLANNED_MODULES = [
  { id: 'planned-goals', name: 'Cíle', icon: Trophy },
  { id: 'planned-notes', name: 'Poznámky', icon: BookOpen },
  { id: 'planned-more', name: 'Další brzy', icon: Sparkles },
];
