import { useCallback, useEffect, useState } from "react";

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

function applyPending(base: Progress): Progress {
  return pending.reduce((progress, mutation) => {
    if (mutation.kind === "note")
      return { ...progress, notes: { ...progress.notes, [mutation.id]: mutation.value } };
    if (mutation.kind === "last")
      return { ...progress, last: { to: mutation.to, title: mutation.title } };
    const completed = progress.completed.filter((id) => id !== mutation.id);
    if (mutation.completed) completed.push(mutation.id);
    return { ...progress, completed };
  }, base);
}

function readStored(): Snapshot & { raw: string | null | undefined } {
  let raw: string | null;
  try {
    raw = localStorage.getItem(PROGRESS_KEY);
  } catch {
    return { progress: lastKnown, raw: undefined, storageError: READ_ERROR };
  }
  try {
    const progress = parseProgress(raw);
    lastKnown = progress;
    return { progress, raw, storageError: null };
  } catch {
    return { progress: lastKnown, raw, storageError: READ_ERROR };
  }
}

function read(): Snapshot {
  const stored = readStored();
  return {
    progress: applyPending(stored.progress),
    storageError: pending.length ? WRITE_ERROR : stored.storageError,
  };
}

export function useProgress() {
  const [snapshot, setSnapshot] = useState<Snapshot>({ progress: empty, storageError: null });
  useEffect(() => {
    setSnapshot(read());
    const changed = (event: Event) => setSnapshot((event as CustomEvent<Snapshot>).detail);
    const stored = (event: StorageEvent) => {
      if (event.key === PROGRESS_KEY || event.key === null) setSnapshot(read());
    };
    window.addEventListener(CHANGED, changed);
    window.addEventListener("storage", stored);
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
    const stored = readStored();
    const next = applyPending(stored.progress);
    let storageError: string | null = null;
    try {
      if (stored.raw === undefined) throw new Error("Cannot preserve unread storage");
      // Never replace an unreadable document without preserving its exact bytes.
      if (stored.storageError && stored.raw !== null)
        localStorage.setItem(`${PROGRESS_KEY}-recovery-${Date.now()}`, stored.raw);
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      pending = [];
      lastKnown = next;
    } catch {
      storageError = WRITE_ERROR;
    }
    const result = { progress: next, storageError };
    setSnapshot(result);
    window.dispatchEvent(new CustomEvent(CHANGED, { detail: result }));
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
    toggle,
    setLast,
    setNote,
  };
}
