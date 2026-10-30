"use client";

import { TimetableGrid } from "@/components/timetable-grid";
import { AddClassDialog } from "@/components/add-class-dialog";
import { Onboarding } from "@/components/onboarding";
import { useUser } from "@/hooks/use-user"; // We need this to pass the userId

export default function TimetablePage() {
  const { user } = useUser(); // Get the user

  return (
    <div className="space-y-4">
      {user && <Onboarding userId={user.id} />} {/* <-- ADD THIS */}
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Timetable</h1>
        <AddClassDialog />
      </div>
      <TimetableGrid />
      <p className="text-xs text-muted-foreground">
        All changes save instantly to your device. Sync to cloud will happen automatically when online.
      </p>
    </div>
  );
}