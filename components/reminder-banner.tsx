"use client";

import { useClassReminders } from "@/hooks/use-class-reminders";

export function ReminderBanner({ userId }: { userId: string | null }) {
  const { upcoming, dismiss } = useClassReminders(userId);

  if (upcoming.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {upcoming.map((c) => (
        <div
          key={c.entryId}
          className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200 dark:bg-orange-950 dark:border-orange-900"
        >
          <span className="text-xl">⏰</span>
          <div className="flex-1">
            <p className="font-medium text-sm">
              {c.unitCode} starts in {c.minutesUntilStart} min
            </p>
            <p className="text-xs text-muted-foreground">
              {c.startTime}–{c.endTime}
              {c.room ? ` · ${c.room}` : ""}
              {c.unitName ? ` · ${c.unitName}` : ""}
            </p>
          </div>
          <button
            onClick={() => dismiss(c.entryId)}
            className="text-xs text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}