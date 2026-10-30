"use client";

import { useSync } from "@/hooks/use-sync";
import { Cloud, CloudOff, RefreshCw } from "lucide-react";

export function SyncIndicator() {
  const { syncing } = useSync();
  // Note: for simplicity, we are just showing the syncing state
  // You can add an 'isOnline' state later if you want to show CloudOff

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground mr-4">
      {syncing ? (
        <>
          <RefreshCw className="h-3 w-3 animate-spin text-blue-500" />
          <span>Syncing...</span>
        </>
      ) : (
        <>
          <Cloud className="h-3 w-3 text-green-500" />
          <span>Synced</span>
        </>
      )}
    </div>
  );
}