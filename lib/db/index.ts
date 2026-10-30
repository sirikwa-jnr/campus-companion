// lib/db/index.ts
import { v4 as uuidv4 } from 'uuid';
import { db, type Unit, type TimetableEntry, type Assignment, type Note, type GpaEntry } from './schema';
import type { AppSettings } from './schema';

// ---- UNITS ----
export async function createUnit(input: {
  userId: string;
  name: string;
  code: string;
  credits: number;
}) {
  const now = new Date().toISOString();
  const unit: Unit = {
    id: uuidv4(),
    userId: input.userId,
    name: input.name,
    code: input.code,
    credits: input.credits,
    createdAt: now,
    updatedAt: now,
    syncStatus: 'pending',
  };
  await db.units.add(unit);
  return unit;
}

export async function getUnits(userId: string) {
  return db.units.where('userId').equals(userId).toArray();
}

// ---- TIMETABLE ----
export async function createTimetableEntry(input: Omit<TimetableEntry, 'id' | 'updatedAt' | 'syncStatus'>) {
  const entry: TimetableEntry = {
    ...input,
    id: uuidv4(),
    updatedAt: new Date().toISOString(),
    syncStatus: 'pending',
  };
  await db.timetable.add(entry);
  return entry;
}

export async function getTimetableForUser(userId: string) {
  return db.timetable.where('userId').equals(userId).toArray();
}

// ---- ASSIGNMENTS ----
export async function createAssignment(input: Omit<Assignment, 'id' | 'updatedAt' | 'syncStatus' | 'completed'>) {
  const assignment: Assignment = {
    ...input,
    id: uuidv4(),
    completed: false,
    updatedAt: new Date().toISOString(),
    syncStatus: 'pending',
  };
  await db.assignments.add(assignment);
  return assignment;
}

export async function getAssignmentsForUser(userId: string) {
  return db.assignments
    .where('userId')
    .equals(userId)
    .sortBy('dueDate');
}

// NEW: Toggle Assignment Complete
export async function toggleAssignmentComplete(id: string) {
  const existing = await db.assignments.get(id);
  if (!existing) return;
  await db.assignments.put({
    ...existing,
    completed: !existing.completed,
    updatedAt: new Date().toISOString(),
    syncStatus: 'pending',
  });
}

// NEW: Delete Assignment
export async function deleteAssignment(id: string) {
  await db.assignments.delete(id);
}

// ---- NOTES ----
export async function upsertNote(input: Omit<Note, 'id' | 'updatedAt' | 'syncStatus'>) {
  const existing = await db.notes.where('unitId').equals(input.unitId).first();
  if (existing) {
    const updated: Note = {
      ...existing,
      content: input.content,
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending',
    };
    await db.notes.put(updated);
    return updated;
  }
  const note: Note = {
    ...input,
    id: uuidv4(),
    updatedAt: new Date().toISOString(),
    syncStatus: 'pending',
  };
  await db.notes.add(note);
  return note;
}

export async function getNoteForUnit(unitId: string) {
  return db.notes.where('unitId').equals(unitId).first();
}

// ---- GPA ENTRIES ----
export async function upsertGpaEntry(input: {
  userId: string;
  unitId: string;
  percentage: number;
  credits: number;
  semester: string;
}) {
  const existing = await db.gpaEntries
    .where('unitId')
    .equals(input.unitId)
    .and((e) => e.semester === input.semester)
    .first();

  if (existing) {
    const updated: GpaEntry = {
      ...existing,
      percentage: input.percentage,
      credits: input.credits,
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending',
    };
    await db.gpaEntries.put(updated);
    return updated;
  }

  const entry: GpaEntry = {
    id: uuidv4(),
    ...input,
    updatedAt: new Date().toISOString(),
    syncStatus: 'pending',
  };
  await db.gpaEntries.add(entry);
  return entry;
}

export async function getGpaEntriesForSemester(userId: string, semester: string) {
  return db.gpaEntries
    .where('userId')
    .equals(userId)
    .and((e) => e.semester === semester)
    .toArray();
}

export async function deleteGpaEntry(id: string) {
  await db.gpaEntries.delete(id);
}

// ---- SYNC QUEUE ----
export async function getPendingRecords() {
  const [units, timetable, assignments, notes, gpaEntries] = await Promise.all([
    db.units.where('syncStatus').equals('pending').toArray(),
    db.timetable.where('syncStatus').equals('pending').toArray(),
    db.assignments.where('syncStatus').equals('pending').toArray(),
    db.notes.where('syncStatus').equals('pending').toArray(),
    db.gpaEntries.where('syncStatus').equals('pending').toArray(), // Added GPA to sync queue
  ]);
  return { units, timetable, assignments, notes, gpaEntries };
}

// ---- SETTINGS ----
const DEFAULT_SETTINGS: Omit<AppSettings, 'userId' | 'updatedAt'> = {
  remindersEnabled: true,
  reminderLeadMinutes: 10,
};

// 1. READ-ONLY function (safe for useLiveQuery)
export async function getSettings(userId: string): Promise<AppSettings | undefined> {
  return db.settings.get(userId);
}

// 2. INITIALIZATION function (call this once on mount)
export async function initSettings(userId: string): Promise<AppSettings> {
  const existing = await db.settings.get(userId);
  if (existing) return existing;

  const fresh: AppSettings = {
    userId,
    ...DEFAULT_SETTINGS,
    updatedAt: new Date().toISOString(),
  };
  await db.settings.put(fresh);
  return fresh;
}

export async function updateSettings(
  userId: string,
  patch: Partial<Omit<AppSettings, 'userId'>>
) {
  const current = await getSettings(userId);
  if (!current) return; // Safety check

  await db.settings.put({
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
}

// ---- NOTES (Aggregated) ----
export async function getNotesForUser(userId: string) {
  return db.notes.where('userId').equals(userId).toArray();
}

// ---- NEW UNIT MANAGEMENT FUNCTIONS ----
export async function updateUnit(
  id: string,
  patch: Partial<Pick<Unit, "name" | "code" | "credits">>
) {
  const existing = await db.units.get(id);
  if (!existing) return;
  await db.units.put({
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
    syncStatus: "pending",
  });
}

export async function deleteUnit(id: string) {
  await db.transaction(
    "rw",
    [db.units, db.timetable, db.assignments, db.notes], // <-- Removed db.gpaEntries
    async () => {
      await db.timetable.where("unitId").equals(id).delete();
      await db.assignments.where("unitId").equals(id).delete();
      await db.notes.where("unitId").equals(id).delete();
      await db.units.delete(id);
    }
  );
}