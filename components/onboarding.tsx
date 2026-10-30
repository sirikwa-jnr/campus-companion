"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Onboarding({ userId }: { userId: string }) {
  const [dismissed, setDismissed] = useState(
    typeof window !== "undefined" &&
      localStorage.getItem("onboarding_dismissed") === "1"
  );

  const unitCount = useLiveQuery(
    () => db.units.where("userId").equals(userId).count(),
    [userId]
  );

  if (dismissed || unitCount === undefined || unitCount > 0) return null;

  function dismiss() {
    localStorage.setItem("onboarding_dismissed", "1");
    setDismissed(true);
  }

  return (
    <Card className="p-5 bg-primary/5 border-primary/20">
      <div className="flex items-start gap-3">
        <span className="text-xl">👋</span>
        <div className="flex-1">
          <h3 className="font-semibold">Welcome to Campus Companion ✌️</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Get started in 3 steps:
          </p>
          <ol className="text-sm mt-2 space-y-1 list-decimal list-inside">
            <li>
              <Link href="/timetable" className="text-primary hover:underline">
                Add your first class
              </Link>{" "}
              to build your timetable
            </li>
            <li>Track assignments and deadlines</li>
            <li>
              <Link href="/gpa" className="text-primary hover:underline">
                Log your results
              </Link>{" "}
              to see your KAFU GPA
            </li>
          </ol>
          <Button size="sm" variant="ghost" onClick={dismiss} className="mt-3 -ml-2 text-xs">
            Got it, dismiss
          </Button>
        </div>
      </div>
    </Card>
  );
}