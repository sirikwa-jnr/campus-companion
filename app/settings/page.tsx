"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/use-user";
import { ReminderSettings } from "@/components/reminder-settings";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { isStoragePersistent } from "@/lib/storage/persist";

export default function SettingsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const supabase = createClient();
  
  const [isPersistent, setIsPersistent] = useState<boolean | null>(null);

  useEffect(() => {
    isStoragePersistent().then(setIsPersistent);
  }, []);

  if (loading || !user) return null;

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      
      <div className="bg-muted/50 p-4 rounded-lg text-sm">
        <p className="font-medium mb-1">Storage Protection</p>
        <p className="text-muted-foreground">
          {isPersistent === null
            ? "Checking..."
            : isPersistent
            ? "✅ Your data is protected from automatic deletion by the browser."
            : "⚠️ Your browser may delete offline data if storage is low. Consider installing the app to your home screen."}
        </p>
      </div>

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