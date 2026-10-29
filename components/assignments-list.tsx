"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/schema";
import {
  createAssignment,
  toggleAssignmentComplete,
  deleteAssignment,
} from "@/lib/db";
import { TEMP_USER_ID } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export function AssignmentsList() {
  const [unitId, setUnitId] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const assignments = useLiveQuery(
    () => db.assignments.where("userId").equals(TEMP_USER_ID).sortBy("dueDate"),
    []
  );

  const units = useLiveQuery(
    () => db.units.where("userId").equals(TEMP_USER_ID).toArray(),
    []
  );

  const unitMap = new Map(units?.map((u) => [u.id, u]) ?? []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!unitId || !title || !dueDate) return;

    await createAssignment({
      userId: TEMP_USER_ID,
      unitId,
      title,
      description: "",
      dueDate: new Date(dueDate).toISOString(),
    });

    setTitle("");
    setDueDate("");
  }

  function dueLabel(iso: string) {
    const due = new Date(iso);
    const now = new Date();
    const days = Math.floor((due.getTime() - now.getTime()) / 86400000);
    if (due < now) return { text: "Overdue", className: "text-red-600" };
    if (days === 0) return { text: "Due today", className: "text-orange-600" };
    if (days <= 3) return { text: `Due in ${days}d`, className: "text-orange-600" };
    return { text: `Due in ${days}d`, className: "text-muted-foreground" };
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Add Assignment</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <Label className="text-xs">Unit</Label>
            <select
              className="w-full border rounded px-3 py-2 text-sm bg-transparent"
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              required
            >
              <option value="">Select unit…</option>
              {units?.map((u) => (
                <option key={u.id} value={u.id}>{u.code}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-xs">Title</Label>
            <Input
              placeholder="Lab report 2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="text-xs">Due</Label>
            <Input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full">Add</Button>
          </div>
        </form>
      </Card>

      {/* List */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Upcoming</h3>
        {!assignments || assignments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No assignments yet.</p>
        ) : (
          <ul className="space-y-2">
            {assignments.map((a) => {
              const due = dueLabel(a.dueDate);
              const unit = unitMap.get(a.unitId);
              return (
                <li
                  key={a.id}
                  className="flex items-center gap-3 border-b last:border-0 py-2"
                >
                  <input
                    type="checkbox"
                    checked={a.completed}
                    onChange={() => toggleAssignmentComplete(a.id)}
                    className="h-4 w-4 accent-primary"
                  />
                  <div className="flex-1">
                    <div className={a.completed ? "line-through text-muted-foreground" : ""}>
                      {a.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {unit?.code ?? "—"} ·{" "}
                      {new Date(a.dueDate).toLocaleString()}
                    </div>
                  </div>
                  <span className={`text-xs ${due.className}`}>{due.text}</span>
                  <button
                    onClick={() => deleteAssignment(a.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}