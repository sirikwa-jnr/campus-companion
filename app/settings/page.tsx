"use client";

import { useUser } from "@/hooks/use-user";
import { ReminderSettings } from "@/components/reminder-settings";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const supabase = createClient();

  if (loading || !user) return null;

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <ReminderSettings userId={user.id} />
      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground mb-2">
          Signed in as {user.email}
        </p>
        <Button variant="outline" onClick={handleLogout}>
          Sign out
        </Button>
      </div>
    </div>
  );
}