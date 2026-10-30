import { createClient } from "@/lib/supabase/client";
import { db } from "@/lib/db/schema";
import { getPendingRecords } from "@/lib/db";

// Helper to generate the current ISO timestamp
const now = () => new Date().toISOString();

export async function syncPendingData(userId: string) {
  const supabase = createClient();
  const pending = await getPendingRecords();

  // 1. Sync Units
  if (pending.units.length > 0) {
    const { error } = await supabase.from("units").upsert(
      pending.units.map((u) => ({
        id: u.id,
        user_id: userId,
        name: u.name,
        code: u.code,
        credits: u.credits,
        created_at: u.createdAt,
        updated_at: u.updatedAt,
      }))
    );
    if (!error) {
      await db.units.bulkUpdate(
        pending.units.map((u) => ({ key: u.id, changes: { syncStatus: "synced" } }))
      );
    }
  }

  // 2. Sync Timetable
  if (pending.timetable.length > 0) {
    const { error } = await supabase.from("timetable").upsert(
      pending.timetable.map((t) => ({
        id: t.id,
        user_id: userId,
        unit_id: t.unitId,
        day_of_week: t.dayOfWeek,
        start_time: t.startTime,
        end_time: t.endTime,
        room: t.room,
        lecturer: t.lecturer,
        updated_at: t.updatedAt,
      }))
    );
    if (!error) {
      await db.timetable.bulkUpdate(
        pending.timetable.map((t) => ({ key: t.id, changes: { syncStatus: "synced" } }))
      );
    }
  }

  // 3. Sync Assignments
  if (pending.assignments.length > 0) {
    const { error } = await supabase.from("assignments").upsert(
      pending.assignments.map((a) => ({
        id: a.id,
        user_id: userId,
        unit_id: a.unitId,
        title: a.title,
        description: a.description,
        due_date: a.dueDate,
        completed: a.completed,
        updated_at: a.updatedAt,
      }))
    );
    if (!error) {
      await db.assignments.bulkUpdate(
        pending.assignments.map((a) => ({ key: a.id, changes: { syncStatus: "synced" } }))
      );
    }
  }

  // 4. Sync Notes
  if (pending.notes.length > 0) {
    const { error } = await supabase.from("notes").upsert(
      pending.notes.map((n) => ({
        id: n.id,
        user_id: userId,
        unit_id: n.unitId,
        content: n.content,
        updated_at: n.updatedAt,
      }))
    );
    if (!error) {
      await db.notes.bulkUpdate(
        pending.notes.map((n) => ({ key: n.id, changes: { syncStatus: "synced" } }))
      );
    }
  }

  // 5. Sync GPA Entries
  const pendingGpa = await db.gpaEntries.where("syncStatus").equals("pending").toArray();
  if (pendingGpa.length > 0) {
    const { error } = await supabase.from("gpa_entries").upsert(
      pendingGpa.map((g) => ({
        id: g.id,
        user_id: userId,
        unit_id: g.unitId,
        percentage: g.percentage,
        credits: g.credits,
        semester: g.semester,
        updated_at: g.updatedAt,
      }))
    );
    if (!error) {
      await db.gpaEntries.bulkUpdate(
        pendingGpa.map((g) => ({ key: g.id, changes: { syncStatus: "synced" } }))
      );
    }
  }

  // Update the last sync time
  await db.syncMeta.put({ table: "global", lastSyncedAt: now() });
}