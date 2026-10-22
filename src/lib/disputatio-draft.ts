import { useCallback, useEffect, useState } from "react";
import {
  guardPendingStorage,
  readStorageFields,
  sameStoredJSON,
  storageFieldPrefix,
  writeStorageField,
  writeWithStorageLock,
} from "@/lib/storage-lock";

export const DISPUTATIO_KEY = "schola-disputatio-v1";
const CHANGED = "schola-disputatio-changed";
const READ_ERROR =
  "Não foi possível ler a disputatio salva. Os dados existentes foram preservados.";
const WRITE_ERROR =
  "O navegador não conseguiu salvar sua disputatio. O texto continua nesta sessão; copie-o antes de sair.";
type Draft = Record<string, unknown>;
type Snapshot = { values: Record<string, string>; storageError: string | null };
type Stored = {
  document: Draft;
  raw: string | null | undefined;
  rootInvalid: boolean;
  fieldsReadable: boolean;
  fieldsInvalid: boolean;
  hasFields: boolean;
};
let known: Draft = {};
let pending: Record<string, string> = {};
let writeFailed = false;
let releaseGuard: (() => void) | undefined;

function validField(field: string, value: unknown): value is string {
  return field.length > 0 && typeof value === "string";
}

function readDraft(fallback: Draft): Stored {
  let raw: string | null;
  try {
    raw = localStorage.getItem(DISPUTATIO_KEY);
  } catch {
    return {
      document: fallback,
      raw: undefined,
      rootInvalid: false,
      fieldsReadable: false,
      fieldsInvalid: false,
      hasFields: false,
    };
  }
  let document = fallback;
  let rootInvalid = false;
  try {
    const value: unknown = JSON.parse(raw ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error("Invalid disputatio document");
    document = value as Draft;
  } catch {
    rootInvalid = true;
  }
  const journal = readStorageFields(DISPUTATIO_KEY, validField);
  return {
    document: { ...document, ...journal.fields },
    raw,
    rootInvalid,
    fieldsReadable: journal.readable,
    fieldsInvalid: journal.invalid,
    hasFields: Object.keys(journal.fields).length > 0,
  };
}

function storageError(stored: Stored): string | null {
  return stored.raw === undefined ||
    stored.rootInvalid ||
    !stored.fieldsReadable ||
    stored.fieldsInvalid
    ? READ_ERROR
    : null;
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
  if (!storageError(stored)) known = stored.document;
  return {
    values: textFields({ ...stored.document, ...pending }),
    storageError: Object.keys(pending).length && writeFailed ? WRITE_ERROR : storageError(stored),
  };
}

/**
 * Reconcile only committed fields. A stale v1 mirror cannot erase another tab's
 * field journal, and repair never authors a new field or a student's pending edit.
 */
function repairMirror() {
  const stored = readDraft(known);
  if (
    !stored.hasFields ||
    storageError(stored) ||
    sameStoredJSON(stored.raw ?? null, stored.document)
  )
    return;
  try {
    localStorage.setItem(DISPUTATIO_KEY, JSON.stringify(stored.document));
    known = stored.document;
  } catch {
    // The durable fields remain readable; retry reconciliation on the next event/edit.
  }
}

/** Keep the original flat v1 mirror and pending text across SPA navigation. */
export function useDisputatioDraft() {
  const [snapshot, setSnapshot] = useState<Snapshot>({ values: {}, storageError: null });
  useEffect(() => {
    setSnapshot(read());
    repairMirror();
    const changed = (event: Event) => setSnapshot((event as CustomEvent<Snapshot>).detail);
    const stored = (event: StorageEvent) => {
      if (
        event.key === DISPUTATIO_KEY ||
        event.key === null ||
        event.key.startsWith(storageFieldPrefix(DISPUTATIO_KEY))
      ) {
        repairMirror();
        setSnapshot(read());
      }
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
    publish(read());
    writeWithStorageLock(
      DISPUTATIO_KEY,
      () => {
        if (!Object.keys(pending).length) return;
        const stored = readDraft(known);
        let next = { ...stored.document, ...pending };
        let error: string | null = null;
        try {
          if (stored.raw === undefined || !stored.fieldsReadable || stored.fieldsInvalid)
            throw new Error("Cannot preserve unread journal");
          // Preserve damaged legacy bytes before adding or mirroring new work.
          if (stored.rootInvalid && stored.raw !== null)
            localStorage.setItem(`${DISPUTATIO_KEY}-recovery-${Date.now()}`, stored.raw);
          for (const [field, text] of Object.entries(pending))
            writeStorageField(DISPUTATIO_KEY, field, text, validField);
          const committed = readDraft(known);
          if (
            committed.raw === undefined ||
            !committed.fieldsReadable ||
            committed.fieldsInvalid ||
            (committed.rootInvalid && committed.raw !== stored.raw)
          )
            throw new Error("Cannot reconcile unread journal");
          next = { ...committed.document, ...pending };
          if (!sameStoredJSON(committed.raw, next))
            localStorage.setItem(DISPUTATIO_KEY, JSON.stringify(next));
          pending = {};
          known = next;
          writeFailed = false;
          releaseGuard?.();
          releaseGuard = undefined;
        } catch {
          writeFailed = true;
          error = WRITE_ERROR;
        }
        publish({ values: textFields(next), storageError: error });
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
