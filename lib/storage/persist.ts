// lib/storage/persist.ts
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.storage?.persist) {
    return false;
  }
  const already = await navigator.storage.persisted();
  if (already) return true;
  return navigator.storage.persist();
}

export async function isStoragePersistent(): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.storage?.persisted) {
    return false;
  }
  return navigator.storage.persisted();
}