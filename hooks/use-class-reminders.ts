"use client";

import { useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/schema";
import { getSettings } from "@/lib/db";

export interface UpcomingClass {
  entryId: string;
  unitCode: string;
  unitName: string;
  startTime: string;
  endTime: string;
  room: string;
  minutesUntilStart: number;
}

const SHOWN_KEY = "reminder_shown";

function getShownSet(): Set<string> {
  try {
    const raw = sessionStorage.getItem(SHOWN_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function markShown(key: string) {
  const set = getShownSet();
  set.add(key);
  sessionStorage.setItem(SHOWN_KEY, JSON.stringify([...set]));
}

function reminderKey(entryId: string, date: Date) {
  return `${entryId}:${date.toISOString().slice(0, 10)}`;
}

export function useClassReminders(userId: string | null) {
  const [upcoming, setUpcoming] = useState<UpcomingClass[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const tickRef = useRef<number | null>(null);

  const settings = useLiveQuery(
    () => (userId ? getSettings(userId) : undefined),
    [userId]
  );

  const timetable = useLiveQuery(
    () => (userId ? db.timetable.where("userId").equals(userId).toArray() : []),
    [userId]
  );

  const units = useLiveQuery(
    () => (userId ? db.units.where("userId").equals(userId).toArray() : []),
    [userId]
  );

  useEffect(() => {
    if (!userId || !settings?.remindersEnabled || !timetable || !units) {
      setUpcoming([]);
      return;
    }

    const unitMap = new Map(units.map((u) => [u.id, u]));
    const lead = settings.reminderLeadMinutes;

    function check() {
      const now = new Date();
      const todayDow = now.getDay() === 0 ? 7 : now.getDay();
      const todayEntries = (timetable ?? []).filter(
        (e) => e.dayOfWeek === todayDow
      );

      const results: UpcomingClass[] = [];
      const shown = getShownSet();

      for (const entry of todayEntries) {
        const [h, m] = entry.startTime.split(":").map(Number);
        const start = new Date(now);
        start.setHours(h, m, 0, 0);

        const diffMin = (start.getTime() - now.getTime()) / 60000;

        if (diffMin > 0 && diffMin <= lead) {
          const key = reminderKey(entry.id, now);
          if (shown.has(key) || dismissed.has(key)) continue;

          const unit = unitMap.get(entry.unitId);
          results.push({
            entryId: entry.id,
            unitCode: unit?.code ?? "—",
            unitName: unit?.name ?? "",
            startTime: entry.startTime,
            endTime: entry.endTime,
            room: entry.room,
            minutesUntilStart: Math.ceil(diffMin),
          });

          markShown(key);
        }
      }

      setUpcoming(results);
    }

    check();
    tickRef.current = window.setInterval(check, 30_000);

    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [userId, settings, timetable, units, dismissed]);

  function dismiss(entryId: string) {
    const now = new Date();
    const key = reminderKey(entryId, now);
    setDismissed((prev) => new Set(prev).add(key));
    setUpcoming((prev) => prev.filter((u) => u.entryId !== entryId));
  }

  return { upcoming, dismiss, settings };
}