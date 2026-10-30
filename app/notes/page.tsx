"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/schema";
import { useUser } from "@/hooks/use-user";
import { NoteEditor } from "@/components/note-editor";
import { Card } from "@/components/ui/card";

export default function NotesPage() {
  const { user, loading } = useUser();
  const [selected, setSelected] = useState<string | null>(null);

  const units = useLiveQuery(
    () => (user ? db.units.where("userId").equals(user.id).toArray() : []),
    [user?.id]
  );

  if (loading || !user) return null;

  if (!units || units.length === 0) {
    return (
      <Card className="p-6 text-center text-sm text-muted-foreground">
        Create a unit in the timetable first, then add notes here.
      </Card>
    );
  }

  const current = selected ?? units[0].id;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Notes</h1>
      <div className="flex flex-wrap gap-2">
        {units.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelected(u.id)}
            className={`text-xs px-3 py-1.5 rounded border ${
              current === u.id
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:bg-accent"
            }`}
          >
            {u.code}
          </button>
        ))}
      </div>
      <NoteEditor unitId={current} userId={user.id} />
    </div>
  );
}