import { useCallback, useEffect, useState } from "react";
import {
  guardPendingStorage,
  readStorageFields,
  sameStoredJSON,
  storageFieldPrefix,
  writeStorageField,
  writeWithStorageLock,
} from "@/lib/storage-lock";

export const PROGRESS_KEY = "schola-progress-v1";
const CHANGED = "schola-progress-changed";
export type Progress = {
  completed: string[];
  last?: { to: string; title: string };
  notes: Record<string, string>;
};
const empty: Progress = { completed: [], notes: {} };
type Snapshot = { progress: Progress; storageError: string | null };
type Mutation =
  | { kind: "note"; id: string; value: string }
  | { kind: "last"; to: string; title: string }
  | { kind: "completion"; id: string; completed: boolean };
const WRITE_ERROR =
  "O navegador não conseguiu salvar. Sua resposta permanece nesta sessão; copie-a antes de sair.";
const READ_ERROR = "Não foi possível ler o progresso salvo. Os dados existentes foram preservados.";
let pending: Mutation[] = [];
let lastKnown: Progress = empty;
let writeFailed = false;
let releaseGuard: (() => void) | undefined;
let repairQueued = false;
let mirrorFailed = false;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/** Keep the v1 key, legacy lesson IDs, notes and unknown fields for compatibility. */
export function parseProgress(raw: string | null): Progress {
  const value: unknown = JSON.parse(raw ?? "{}");
  if (!isRecord(value)) throw new Error("Invalid progress document");
  const completed = Array.isArray(value["completed"])
    ? [...new Set(value["completed"].filter((id): id is string => typeof id === "string"))]
    : [];
  const notes = isRecord(value["notes"])
    ? Object.fromEntries(
        Object.entries(value["notes"]).filter(([, note]) => typeof note === "string"),
      )
    : {};
  const last =
    isRecord(value["last"]) &&
    typeof value["last"]["to"] === "string" &&
    /^\/(?:formacao|suma|idiomas|disputatio)(?:\?|$)/.test(value["last"]["to"]) &&
    typeof value["last"]["title"] === "string"
      ? { to: value["last"]["to"], title: value["last"]["title"] }
      : undefined;
  const result = { ...value, completed, notes } as Progress;
  delete result.last;
  if (last) result.last = last;
  return result;
}

function applyMutations(base: Progress, mutations: Mutation[]): Progress {
  return mutations.reduce((progress, mutation) => {
    if (mutation.kind === "note")
      return { ...progress, notes: { ...progress.notes, [mutation.id]: mutation.value } };
    if (mutation.kind === "last")
      return { ...progress, last: { to: mutation.to, title: mutation.title } };
    const completed = progress.completed.filter((id) => id !== mutation.id);
    if (mutation.completed) completed.push(mutation.id);
    return { ...progress, completed };
  }, base);
}

function mutationField(mutation: Mutation): string {
  return mutation.kind === "last" ? "last" : `${mutation.kind}:${mutation.id}`;
}

function isMutation(field: string, value: unknown): value is Mutation {
  if (!isRecord(value)) return false;
  if (value["kind"] === "note")
    return (
      typeof value["id"] === "string" &&
      typeof value["value"] === "string" &&
      field === `note:${value["id"]}`
    );
  if (value["kind"] === "completion")
    return (
      typeof value["id"] === "string" &&
      typeof value["completed"] === "boolean" &&
      field === `completion:${value["id"]}`
    );
  return (
    field === "last" &&
    value["kind"] === "last" &&
    typeof value["to"] === "string" &&
    /^\/(?:formacao|suma|idiomas|disputatio)(?:\?|$)/.test(value["to"]) &&
    typeof value["title"] === "string"
  );
}

function readStored(): Snapshot & { raw: string | null | undefined; journalReady: boolean } {
  let raw: string | null;
  try {
    raw = localStorage.getItem(PROGRESS_KEY);
  } catch {
    return { progress: lastKnown, raw: undefined, journalReady: false, storageError: READ_ERROR };
  }
  let base = lastKnown;
  let rootError: string | null = null;
  try {
    base = parseProgress(raw);
  } catch {
    rootError = READ_ERROR;
  }
  const journal = readStorageFields(PROGRESS_KEY, isMutation);
  const progress = applyMutations(base, Object.values(journal.fields));
  const journalReady = journal.readable && !journal.invalid;
  if (!rootError) lastKnown = progress;
  return {
    progress,
    raw,
    journalReady,
    storageError: rootError || !journalReady ? READ_ERROR : null,
  };
}

function read(): Snapshot {
  const stored = readStored();
  return {
    progress: applyMutations(stored.progress, pending),
    storageError:
      (pending.length && writeFailed) || mirrorFailed ? WRITE_ERROR : stored.storageError,
  };
}

function notify(snapshot: Snapshot) {
  window.dispatchEvent(new CustomEvent(CHANGED, { detail: snapshot }));
}

/** Reconcile the legacy mirror, never another tab's field journal. */
function repairMirror() {
  if (repairQueued) return;
  repairQueued = true;
  writeWithStorageLock(
    PROGRESS_KEY,
    () => {
      repairQueued = false;
      const stored = readStored();
      // A background refresh must never replace malformed bytes.
      if (stored.storageError || stored.raw === undefined) return;
      try {
        if (!sameStoredJSON(stored.raw, stored.progress))
          localStorage.setItem(PROGRESS_KEY, JSON.stringify(stored.progress));
        mirrorFailed = false;
      } catch {
        mirrorFailed = true;
      }
      notify(read());
    },
    () => {
      repairQueued = false;
    },
  );
}

export function useProgress() {
  const [snapshot, setSnapshot] = useState<Snapshot>({ progress: empty, storageError: null });
  // SSR fields must not accept native input before React and the local store are ready.
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setSnapshot(read());
    const changed = (event: Event) => setSnapshot((event as CustomEvent<Snapshot>).detail);
    const stored = (event: StorageEvent) => {
      if (
        event.key === PROGRESS_KEY ||
        event.key?.startsWith(storageFieldPrefix(PROGRESS_KEY)) ||
        event.key === null
      ) {
        setSnapshot(read());
        repairMirror();
      }
    };
    window.addEventListener(CHANGED, changed);
    window.addEventListener("storage", stored);
    // Readiness is separate from storage success: failed writes still retain editable pending work.
    setIsReady(true);
    return () => {
      window.removeEventListener(CHANGED, changed);
      window.removeEventListener("storage", stored);
    };
  }, []);

  const update = useCallback((mutation: Mutation) => {
    // Retain only local field changes, not a stale copy of the entire document.
    // Replaying desired completion states is idempotent if another tab changes that ID.
    pending = pending.filter(
      (item) =>
        item.kind !== mutation.kind ||
        (item.kind !== "last" && mutation.kind !== "last" && item.id !== mutation.id),
    );
    pending.push(mutation);
    releaseGuard ??= guardPendingStorage(() => pending.length > 0);
    const publish = (result: Snapshot) => {
      setSnapshot(result);
      window.dispatchEvent(new CustomEvent(CHANGED, { detail: result }));
    };
    // Editing remains immediate while a different tab holds the asynchronous lock.
    publish(read());
    writeWithStorageLock(
      PROGRESS_KEY,
      () => {
        // Earlier callbacks may already have flushed all current mutations.
        if (!pending.length) return;
        // Read after acquiring the lock, never before waiting for another writer.
        const stored = readStored();
        let next = applyMutations(stored.progress, pending);
        let storageError: string | null = null;
        try {
          if (stored.raw === undefined || !stored.journalReady)
            throw new Error("Cannot preserve unread storage");
          // Never replace an unreadable document without preserving its exact bytes.
          if (stored.storageError && stored.raw !== null)
            localStorage.setItem(`${PROGRESS_KEY}-recovery-${Date.now()}`, stored.raw);
          for (const mutation of pending)
            writeStorageField(PROGRESS_KEY, mutationField(mutation), mutation, isMutation);
          // The journal is authoritative per field; root may be a stale Chromium cache.
          const refreshed = readStored();
          if (!refreshed.journalReady) throw new Error("Cannot read saved storage fields");
          if (
            refreshed.storageError &&
            refreshed.raw !== null &&
            refreshed.raw !== undefined &&
            refreshed.raw !== stored.raw
          )
            localStorage.setItem(`${PROGRESS_KEY}-recovery-${Date.now()}`, refreshed.raw);
          next = applyMutations(refreshed.progress, pending);
          if (!sameStoredJSON(refreshed.raw ?? null, next))
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
          pending = [];
          lastKnown = next;
          writeFailed = false;
          mirrorFailed = false;
          releaseGuard?.();
          releaseGuard = undefined;
        } catch {
          writeFailed = true;
          storageError = WRITE_ERROR;
        }
        publish({ progress: next, storageError });
      },
      () => {
        if (!pending.length) return;
        writeFailed = true;
        publish({ ...read(), storageError: WRITE_ERROR });
      },
    );
  }, []);

  const toggle = useCallback(
    (id: string) => {
      const completed = !read().progress.completed.includes(id);
      update({ kind: "completion", id, completed });
    },
    [update],
  );
  const setLast = useCallback(
    (to: string, title: string) => update({ kind: "last", to, title }),
    [update],
  );
  const setNote = useCallback(
    (id: string, value: string) => update({ kind: "note", id, value }),
    [update],
  );

  return {
    progress: snapshot.progress,
    storageError: snapshot.storageError,
    isReady,
    toggle,
    setLast,
    setNote,
  };
}
