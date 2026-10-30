"use client";

import { useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { getSettings, initSettings, updateSettings } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function ReminderSettings({ userId }: { userId: string }) {
  // 1. Initialize settings safely in the background
  useEffect(() => {
    initSettings(userId);
  }, [userId]);

  // 2. Read settings (now safe and read-only)
  const settings = useLiveQuery(() => getSettings(userId), [userId]);

  if (!settings) return null; // Loading state

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold">Class Reminders</h3>

      <div className="flex items-center justify-between">
        <div>
          <Label>Enable reminders</Label>
          <p className="text-xs text-muted-foreground">
            Shows a banner before each class while the app is open.
          </p>
        </div>
        <input
          type="checkbox"
          checked={settings.remindersEnabled}
          onChange={(e) =>
            updateSettings(userId, { remindersEnabled: e.target.checked })
          }
          className="h-5 w-5"
        />
      </div>

      <div>
        <Label className="text-xs">Lead time</Label>
        <select
          className="w-full border rounded px-3 py-2 text-sm mt-1"
          value={settings.reminderLeadMinutes}
          onChange={(e) =>
            updateSettings(userId, {
              reminderLeadMinutes: Number(e.target.value),
            })
          }
          disabled={!settings.remindersEnabled}
        >
          <option value={5}>5 minutes before</option>
          <option value={10}>10 minutes before</option>
          <option value={15}>15 minutes before</option>
          <option value={30}>30 minutes before</option>
        </select>
      </div>
    </Card>
  );
}