"use client";

import { useUser } from "@/hooks/use-user";
import { ReminderBanner } from "@/components/reminder-banner";
import { StoragePersistence } from "@/components/storage-persistence"; // NEW

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  return (
    <>
      <StoragePersistence userId={user?.id ?? null} /> {/* NEW */}
      <ReminderBanner userId={user?.id ?? null} />
      {children}
    </>
  );
}