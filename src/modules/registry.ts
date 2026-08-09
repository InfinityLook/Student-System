// src/modules/registry.ts
import { TodoWidget } from './widgets/TodoWidget';
import { PomodoroWidget } from './widgets/PomodoroWidget';
import { StatsWidget } from './widgets/StatsWidget';

export const MODULE_REGISTRY = [
  { id: 'todo', name: 'Úkoly', component: TodoWidget, size: 'col-span-1' },
  { id: 'timer', name: 'Pomodoro', component: PomodoroWidget, size: 'col-span-1' },
  { id: 'stats', name: 'Statistiky', component: StatsWidget, size: 'col-span-2' },
];
