"use client";

import { useEffect } from "react";
import { requestPersistentStorage } from "@/lib/storage/persist";

export function StoragePersistence({ userId }: { userId: string | null }) {
  useEffect(() => {
    if (!userId) return;
    const key = `storage_persisted_${userId}`;
    if (localStorage.getItem(key) === "1") return;

    requestPersistentStorage().then((granted) => {
      console.log("[storage] persistent:", granted);
      // Fix for accuracy: only mark as checked if it actually succeeded.
      if (granted) {
        localStorage.setItem(key, "1");
      }
    });
  }, [userId]);

  return null;
}