import { TimetableGrid } from "@/components/timetable-grid";

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Timetable</h1>
        <p className="text-muted-foreground mt-1">Here is your week at a glance.</p>
      </div>
      
      <TimetableGrid />
    </div>
  );
}