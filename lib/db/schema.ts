// lib/db/schema.ts
import Dexie, { type Table } from 'dexie';

export interface Unit {
  id: string;              // UUID
  userId: string;          // Supabase auth user id
  name: string;
  code: string;
  credits: number;
  createdAt: string;       // ISO string
  updatedAt: string;
  syncStatus: 'synced' | 'pending';
}

export interface TimetableEntry {
  id: string;
  userId: string;
  unitId: string;          // FK to Unit.id
  dayOfWeek: number;       // 1 = Monday ... 7 = Sunday
  startTime: string;       // "08:00"
  endTime: string;         // "10:00"
  room: string;
  lecturer: string;
  updatedAt: string;
  syncStatus: 'synced' | 'pending';
}

export interface Assignment {
  id: string;
  userId: string;
  unitId: string;
  title: string;
  description: string;
  dueDate: string;         // ISO string
  completed: boolean;
  updatedAt: string;
  syncStatus: 'synced' | 'pending';
}

export interface Note {
  id: string;
  userId: string;
  unitId: string;
  content: string;
  updatedAt: string;
  syncStatus: 'synced' | 'pending';
}

export class CampusDB extends Dexie {
  units!: Table<Unit, string>;
  timetable!: Table<TimetableEntry, string>;
  assignments!: Table<Assignment, string>;
  notes!: Table<Note, string>;

  constructor() {
    super('CampusCompanionDB');

    this.version(1).stores({
      units: 'id, userId, syncStatus',
      timetable: 'id, userId, unitId, dayOfWeek, syncStatus',
      assignments: 'id, userId, unitId, dueDate, completed, syncStatus',
      notes: 'id, userId, unitId, syncStatus',
    });
  }
}

export const db = new CampusDB();