import { db } from "@/lib/db/schema";

/**
 * Updates any records that are missing a userId (or have a TEMP_USER_ID)
 * to belong to the newly logged-in user.
 */
export async function migrateLocalDataToUser(userId: string) {
  // We check for records that don't have the correct userId.
  // Since we don't know what TEMP_USER_ID is (if you used one), 
  // we just update any record that doesn't match the logged-in user.
  
  await db.transaction('rw', db.units, db.timetable, db.assignments, db.notes, db.gpaEntries, async () => {
    
    // Update Units
    const units = await db.units.toArray();
    for (const unit of units) {
      if (unit.userId !== userId) {
        await db.units.update(unit.id, { userId });
      }
    }

    // Update Timetable
    const timetable = await db.timetable.toArray();
    for (const entry of timetable) {
      if (entry.userId !== userId) {
        await db.timetable.update(entry.id, { userId });
      }
    }

    // Update Assignments
    const assignments = await db.assignments.toArray();
    for (const assignment of assignments) {
      if (assignment.userId !== userId) {
        await db.assignments.update(assignment.id, { userId });
      }
    }

    // Update Notes
    const notes = await db.notes.toArray();
    for (const note of notes) {
      if (note.userId !== userId) {
        await db.notes.update(note.id, { userId });
      }
    }

    // Update GPA Entries
    const gpaEntries = await db.gpaEntries.toArray();
    for (const gpa of gpaEntries) {
      if (gpa.userId !== userId) {
        await db.gpaEntries.update(gpa.id, { userId });
      }
    }
  });
}