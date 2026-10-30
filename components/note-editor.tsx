"use client";

import { useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/schema";
import { upsertNote } from "@/lib/db";
import { Card } from "@/components/ui/card";

export function NoteEditor({ unitId, userId }: { unitId: string; userId: string }) {
  const note = useLiveQuery(
    () => db.notes.where("unitId").equals(unitId).first(),
    [unitId]
  );

  const [text, setText] = useState("");
  const [saved, setSaved] = useState(true);
  const lastLoadedNoteId = useRef<string | null>(null);

  // When the note for this unit finishes loading (or changes to a different note),
  // hydrate the textarea with its content.
  useEffect(() => {
    if (!note) return;
    if (lastLoadedNoteId.current === note.id) return;
    lastLoadedNoteId.current = note.id;
    setText(note.content ?? "");
  }, [note]);

  // When the user switches units, clear the textarea so stale content doesn't linger.
  useEffect(() => {
    if (!note) {
      // No note exists yet for this unit — start empty
      setText("");
      lastLoadedNoteId.current = null;
    }
  }, [unitId, note]);

  // Debounced autosave
  useEffect(() => {
    // Skip if nothing typed yet and no note exists
    if (!note && text === "") return;
    // Skip if the current text matches what's already saved
    if (note?.content === text) return;

    setSaved(false);
    const t = setTimeout(async () => {
      await upsertNote({ userId, unitId, content: text });
      setSaved(true);
    }, 500);

    return () => clearTimeout(t);
  }, [text, unitId, userId, note]);   // <-- note added

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">Notes</h3>
        <span className="text-xs text-muted-foreground">
          {saved ? "Saved" : "Saving…"}
        </span>
      </div>
      <textarea
        className="w-full min-h-[200px] text-sm border rounded px-3 py-2 bg-background resize-y"
        placeholder="Write anything about this unit — formulas, reminders, links…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </Card>
  );
}