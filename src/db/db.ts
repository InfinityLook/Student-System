import Dexie, { Table } from 'dexie';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  xp: number;
  level: number;
  coins: number;
  streak: number;
}

export class StudyPilotDB extends Dexie {
  tasks!: Table<Task, string>;
  profile!: Table<UserProfile, string>;

  constructor() {
    super('StudyPilotDB');
    this.version(1).stores({
      tasks: 'id, completed, dueDate',
      profile: 'id'
    });
  }
}

export const db = new StudyPilotDB();
