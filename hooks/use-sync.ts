"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "./use-user";
import { syncPendingData } from "@/lib/sync/engine";

export function useSync() {
  const { user } = useUser();
  const [syncing, setSyncing] = useState(false);

  const sync = useCallback(async () => {
    if (!user || !navigator.onLine) return;
    setSyncing(true);
    await syncPendingData(user.id);
    setSyncing(false);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Run migration FIRST, then sync
    const initSync = async () => {
      const { migrateLocalDataToUser } = await import("@/lib/sync/migrate");
      await migrateLocalDataToUser(user.id);
      sync();
    };
    
    initSync();

    const onOnline = () => sync();
    const onVisible = () => {
      if (document.visibilityState === "visible") sync();
    };

    window.addEventListener("online", onOnline);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.removeEventListener("online", onOnline);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [user, sync]);

  return { syncing };
}