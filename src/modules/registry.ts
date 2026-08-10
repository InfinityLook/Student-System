import { lazy, ComponentType, LazyExoticComponent } from 'react';
import { ListTodo, Timer, BarChart3, Sparkles, Trophy, BookOpen } from 'lucide-react';

// Lazy loading modulů pro lepší výkon (Code Splitting)
const TodoWidget = lazy(() => import('./widgets/TodoWidget').then(m => ({ default: m.TodoWidget })));
const PomodoroWidget = lazy(() => import('./widgets/PomodoroWidget').then(m => ({ default: m.PomodoroWidget })));
const StatsWidget = lazy(() => import('./widgets/StatsWidget').then(m => ({ default: m.StatsWidget })));

export interface ModuleConfig {
  id: string;
  name: string;
  component: LazyExoticComponent<ComponentType<any>>;
  size: string;
  icon: any;
  color: string;
}

export const MODULE_REGISTRY: ModuleConfig[] = [
  { id: 'todo', name: 'Úkoly', component: TodoWidget, size: 'col-span-1', icon: ListTodo, color: '#8b5cf6' },
  { id: 'timer', name: 'Pomodoro', component: PomodoroWidget, size: 'col-span-1', icon: Timer, color: '#06b6d4' },
  { id: 'stats', name: 'Statistiky', component: StatsWidget, size: 'col-span-2', icon: BarChart3, color: '#10b981' },
];

// Sloty pro budoucí miniaplikace - zatím uzamčené, čekají na implementaci.
// Až přidáš nový modul do MODULE_REGISTRY výše, automaticky se odemkne
// v launcheru a zmizí odsud.
export const PLANNED_MODULES = [
  { id: 'planned-goals', name: 'Cíle', icon: Trophy },
  { id: 'planned-notes', name: 'Poznámky', icon: BookOpen },
  { id: 'planned-more', name: 'Další brzy', icon: Sparkles },
];
