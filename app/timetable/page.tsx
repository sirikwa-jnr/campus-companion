import { TimetableGrid } from "@/components/timetable-grid";
import { AddClassDialog } from "@/components/add-class-dialog";

export default function TimetablePage() {
  return (
    <div className="space-y-4">
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