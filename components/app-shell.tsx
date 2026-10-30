"use client";

import { useUser } from "@/hooks/use-user";
import { ReminderBanner } from "@/components/reminder-banner";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  return (
    <>
      <ReminderBanner userId={user?.id ?? null} />
      {children}
    </>
  );
}