// lib/db/index.ts
import { v4 as uuidv4 } from 'uuid';
import { db, type Unit, type TimetableEntry, type Assignment, type Note } from './schema';

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

// ---- SYNC QUEUE ----
export async function getPendingRecords() {
  const [units, timetable, assignments, notes] = await Promise.all([
    db.units.where('syncStatus').equals('pending').toArray(),
    db.timetable.where('syncStatus').equals('pending').toArray(),
    db.assignments.where('syncStatus').equals('pending').toArray(),
    db.notes.where('syncStatus').equals('pending').toArray(),
  ]);
  return { units, timetable, assignments, notes };
}