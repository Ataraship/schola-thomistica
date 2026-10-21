import { useCallback, useEffect, useState } from "react";
import { guardPendingStorage, writeWithStorageLock } from "@/lib/storage-lock";

export const DISPUTATIO_KEY = "schola-disputatio-v1";
const CHANGED = "schola-disputatio-changed";
const READ_ERROR =
  "Não foi possível ler a disputatio salva. Os dados existentes foram preservados.";
const WRITE_ERROR =
  "O navegador não conseguiu salvar sua disputatio. O texto continua nesta página; copie-o antes de sair.";
type Draft = Record<string, unknown>;
type Snapshot = { values: Record<string, string>; storageError: string | null };
let known: Draft = {};
let pending: Record<string, string> = {};
let writeFailed = false;
let releaseGuard: (() => void) | undefined;

function readDraft(fallback: Draft): {
  document: Draft;
  raw: string | null | undefined;
  storageError: string | null;
} {
  let raw: string | null;
  try {
    raw = localStorage.getItem(DISPUTATIO_KEY);
  } catch {
    return { document: fallback, raw: undefined, storageError: READ_ERROR };
  }
  try {
    const document: unknown = JSON.parse(raw ?? "{}");
    if (!document || typeof document !== "object" || Array.isArray(document))
      throw new Error("Invalid disputatio document");
    return { document: document as Draft, raw, storageError: null };
  } catch {
    return { document: fallback, raw, storageError: READ_ERROR };
  }
}

function textFields(document: Draft): Record<string, string> {
  return Object.fromEntries(
    Object.entries(document).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}

function read(): Snapshot {
  const stored = readDraft(known);
  if (!stored.storageError) known = stored.document;
  return {
    values: textFields({ ...stored.document, ...pending }),
    storageError: Object.keys(pending).length && writeFailed ? WRITE_ERROR : stored.storageError,
  };
}

/** Keep the original flat v1 document, including edits pending across SPA navigation. */
export function useDisputatioDraft() {
  const [snapshot, setSnapshot] = useState<Snapshot>({ values: {}, storageError: null });
  useEffect(() => {
    setSnapshot(read());
    const changed = (event: Event) => setSnapshot((event as CustomEvent<Snapshot>).detail);
    const stored = (event: StorageEvent) => {
      if (event.key === DISPUTATIO_KEY || event.key === null) setSnapshot(read());
    };
    window.addEventListener("storage", stored);
    window.addEventListener(CHANGED, changed);
    return () => {
      window.removeEventListener("storage", stored);
      window.removeEventListener(CHANGED, changed);
    };
  }, []);

  const setField = useCallback((id: string, value: string) => {
    pending = { ...pending, [id]: value };
    releaseGuard ??= guardPendingStorage(() => Object.keys(pending).length > 0);
    const publish = (result: Snapshot) => {
      setSnapshot(result);
      window.dispatchEvent(new CustomEvent(CHANGED, { detail: result }));
    };
    // Typing remains immediate while another tab holds the asynchronous lock.
    publish(read());
    writeWithStorageLock(
      DISPUTATIO_KEY,
      () => {
        if (!Object.keys(pending).length) return;
        // Re-read only after acquisition so another writer's new fields are retained.
        const stored = readDraft(known);
        const next = { ...stored.document, ...pending };
        let storageError: string | null = null;
        try {
          if (stored.raw === undefined) throw new Error("Cannot preserve unread draft");
          if (stored.storageError && stored.raw !== null)
            localStorage.setItem(`${DISPUTATIO_KEY}-recovery-${Date.now()}`, stored.raw);
          localStorage.setItem(DISPUTATIO_KEY, JSON.stringify(next));
          pending = {};
          known = next;
          writeFailed = false;
          releaseGuard?.();
          releaseGuard = undefined;
        } catch {
          writeFailed = true;
          storageError = WRITE_ERROR;
        }
        publish({ values: textFields(next), storageError });
      },
      () => {
        if (!Object.keys(pending).length) return;
        writeFailed = true;
        publish({ ...read(), storageError: WRITE_ERROR });
      },
    );
  }, []);

  return { ...snapshot, setField };
}
