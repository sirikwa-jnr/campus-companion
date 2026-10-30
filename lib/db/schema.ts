// lib/db/schema.ts
import Dexie, { type Table } from 'dexie';

export interface Unit {
  id: string;              // UUID
  userId: string;          // Supabase auth user id
  name: string;
  code: string;
  credits: number;
  createdAt: string;
  updatedAt: string;
  syncStatus: 'synced' | 'pending';
}

export interface TimetableEntry {
  id: string;
  userId: string;
  unitId: string;
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

// NEW: GPA Entry interface
export interface GpaEntry {
  id: string;
  userId: string;
  unitId: string;        // FK to Unit.id
  percentage: number;    // 0–100
  credits: number;       // snapshot of credits at time of grading
  semester: string;      // e.g. "2025-S1"
  updatedAt: string;
  syncStatus: 'synced' | 'pending';
}

// NEW: SyncMeta interface
export interface SyncMeta {
  table: string;
  lastSyncedAt: string;
}

// NEW: AppSettings interface
export interface AppSettings {
  userId: string;            // primary key
  remindersEnabled: boolean;
  reminderLeadMinutes: number;  // 5, 10, 15, 30
  updatedAt: string;
}

export class CampusDB extends Dexie {
  units!: Table<Unit, string>;
  timetable!: Table<TimetableEntry, string>;
  assignments!: Table<Assignment, string>;
  notes!: Table<Note, string>;
  gpaEntries!: Table<GpaEntry, string>;   
  syncMeta!: Table<SyncMeta, string>;   
  settings!: Table<AppSettings, string>;   // <-- ADDED THIS LINE

  constructor() {
    super('CampusCompanionDB');

    this.version(1).stores({
      units: 'id, userId, syncStatus',
      timetable: 'id, userId, unitId, dayOfWeek, syncStatus',
      assignments: 'id, userId, unitId, dueDate, completed, syncStatus',
      notes: 'id, userId, unitId, syncStatus',
    });

    // Existing version block from your file
    this.version(2).stores({
      gpaEntries: 'id, userId, unitId, semester, syncStatus',
    });

    this.version(3).stores({
      syncMeta: 'table',
    });

    // ADDED THIS NEW VERSION BLOCK
    this.version(4).stores({
      settings: 'userId',
    });
  }
}

export const db = new CampusDB();