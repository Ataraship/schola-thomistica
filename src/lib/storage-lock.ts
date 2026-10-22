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

/** Keep the warning alive across SPA unmounts until the owning store saves. */
export function guardPendingStorage(hasPending: () => boolean): () => void {
  const leaving = (event: BeforeUnloadEvent) => {
    if (!hasPending()) return;
    event.preventDefault();
    event.returnValue = "";
  };
  window.addEventListener("beforeunload", leaving);
  return () => window.removeEventListener("beforeunload", leaving);
}

export function storageFieldPrefix(key: string): string {
  return `${key}:field:`;
}

type FieldValidator<T> = (field: string, value: unknown) => value is T;

function decodeField<T>(raw: string, field: string, valid: FieldValidator<T>): T {
  const entry: unknown = JSON.parse(raw);
  if (
    !entry ||
    typeof entry !== "object" ||
    Array.isArray(entry) ||
    !("v" in entry) ||
    entry.v !== 1 ||
    !("value" in entry) ||
    !valid(field, entry.value)
  )
    throw new Error("Invalid storage field document");
  return entry.value;
}

/** Sidecars own individual fields; a stale whole-document mirror cannot erase them. */
export function readStorageFields<T>(
  key: string,
  valid: FieldValidator<T>,
): {
  fields: Record<string, T>;
  readable: boolean;
  invalid: boolean;
} {
  const fields: Record<string, T> = Object.create(null);
  let invalid = false;
  try {
    const prefix = storageFieldPrefix(key);
    const keys = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
      .filter((item): item is string => !!item && item.startsWith(prefix))
      .sort();
    for (const item of keys) {
      const raw = localStorage.getItem(item);
      if (raw === null) continue;
      try {
        const field = decodeURIComponent(item.slice(prefix.length));
        fields[field] = decodeField(raw, field, valid);
      } catch {
        invalid = true;
      }
    }
    return { fields, readable: true, invalid };
  } catch {
    return { fields, readable: false, invalid };
  }
}

/** Stable key per field, never one key per keystroke. Invalid bytes need manual recovery. */
export function writeStorageField<T>(
  key: string,
  field: string,
  value: T,
  valid: FieldValidator<T>,
): void {
  if (!valid(field, value)) throw new Error("Invalid storage field value");
  const item = `${storageFieldPrefix(key)}${encodeURIComponent(field)}`;
  const existing = localStorage.getItem(item);
  if (existing !== null) decodeField(existing, field, valid);
  localStorage.setItem(item, JSON.stringify({ v: 1, value }));
}

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, canonical(item)]),
    );
  return value;
}

export function sameStoredJSON(raw: string | null, next: unknown): boolean {
  try {
    return JSON.stringify(canonical(JSON.parse(raw ?? "null"))) === JSON.stringify(canonical(next));
  } catch {
    return false;
  }
}
