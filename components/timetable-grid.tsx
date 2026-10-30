"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/schema";
import { useUser } from "@/hooks/use-user";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function TimetableGrid() {
  const { user } = useUser();

  // useLiveQuery automatically updates the screen if the database changes!
  const entries = useLiveQuery(
    () => db.timetable.where("userId").equals(user?.id || "").toArray(),
    [user?.id]
  );

  const units = useLiveQuery(
    () => db.units.where("userId").equals(user?.id || "").toArray(),
    [user?.id]
  );

  // Map unit IDs to their actual data (so we can show "CSC 201" instead of a random ID)
  const unitMap = new Map(units?.map((u) => [u.id, u]) ?? []);

 if (!entries || !units) return <div className="text-muted-foreground">Loading…</div>;

if (entries.length === 0) {
  return (
    <div className="text-center py-12 border rounded-lg border-dashed">
      <p className="text-muted-foreground">No classes yet.</p>
      <p className="text-sm text-muted-foreground/70 mt-1">
        Click &quot;Add Class&quot; to build your weekly timetable.
      </p>
    </div>
  );
}

return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
      {DAYS.map((day, idx) => {
        const dayNum = idx + 1; // Monday = 1
        const dayEntries = entries
          .filter((e) => e.dayOfWeek === dayNum)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        return (
          <div key={day} className="border rounded-xl p-3 bg-card min-h-[150px] shadow-sm">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">{day}</h3>
            <div className="space-y-2">
              {dayEntries.length === 0 && (
                <p className="text-xs text-muted-foreground/40 text-center py-4">No classes</p>
              )}
              {dayEntries.map((entry) => {
                const unit = unitMap.get(entry.unitId);
                return (
                  <div
                    key={entry.id}
                    className="text-xs p-2 rounded-lg bg-primary/10 border border-primary/20"
                  >
                    <div className="font-semibold truncate">
                      {unit?.code ?? "Unknown Unit"}
                    </div>
                    <div className="text-muted-foreground mt-0.5">
                      {entry.startTime}–{entry.endTime}
                    </div>
                    {entry.room && (
                      <div className="text-muted-foreground truncate opacity-70">
                        📖 {entry.room}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}