// app/offline/page.tsx
export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-2xl font-semibold mb-2">You are offline</h1>
      <p className="text-muted-foreground">
        Check your internet connection. Your timetable, assignments, and GPA
        data are still available on this device.
      </p>
    </div>
  );
}