/**
 * Serialize cooperating tabs before their read/modify/write of a v1 document.
 * Old browsers keep the synchronous fallback; it is not atomic across tabs.
 * A tab still running an older application version does not share this lock.
 */
export function writeWithStorageLock(key: string, write: () => void, failed: () => void): void {
  try {
    const locks = typeof navigator === "undefined" ? undefined : navigator.locks;
    if (!locks) {
      write();
      return;
    }
    // Never retry without the lock after rejection: that would reintroduce the race.
    void locks.request(`schola:storage:${key}`, { mode: "exclusive" }, write).catch(failed);
  } catch {
    failed();
  }
}
