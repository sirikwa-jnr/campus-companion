"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/schema";
import { useUser } from "@/hooks/use-user";
import { updateUnit, deleteUnit } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UnitsPage() {
  const { user, loading } = useUser();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: "", code: "", credits: 3 });

  const units = useLiveQuery(
    () => (user ? db.units.where("userId").equals(user.id).toArray() : []),
    [user?.id]
  );

  if (loading || !user) return null;

  function startEdit(u: { id: string; name: string; code: string; credits: number }) {
    setEditingId(u.id);
    setDraft({ name: u.name, code: u.code, credits: u.credits });
  }

  async function saveEdit() {
    if (!editingId) return;
    await updateUnit(editingId, draft);
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this unit? Related timetable, assignments, notes and GPA entries will also be removed.")) return;
    await deleteUnit(id);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Units</h1>
      {!units || units.length === 0 ? (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          No units yet. Add one from the Timetable page.
        </Card>
      ) : (
        <Card className="p-4 divide-y">
          {units.map((u) =>
            editingId === u.id ? (
              <div key={u.id} className="py-3 space-y-2">
                <Input
                  value={draft.code}
                  onChange={(e) => setDraft({ ...draft, code: e.target.value })}
                  placeholder="Code"
                />
                <Input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Name"
                />
                <Input
                  type="number"
                  min={1}
                  value={draft.credits}
                  onChange={(e) =>
                    setDraft({ ...draft, credits: Number(e.target.value) })
                  }
                  placeholder="Credits"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div key={u.id} className="py-3 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {u.code} <span className="text-muted-foreground">{u.name}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{u.credits} credits</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => startEdit(u)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(u.id)}
                  className="text-red-600"
                >
                  Delete
                </Button>
              </div>
            )
          )}
        </Card>
      )}
    </div>
  );
}