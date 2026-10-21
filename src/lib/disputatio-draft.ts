import { useCallback, useEffect, useRef, useState } from "react";

export const DISPUTATIO_KEY = "schola-disputatio-v1";
const CHANGED = "schola-disputatio-changed";
const READ_ERROR =
  "Não foi possível ler a disputatio salva. Os dados existentes foram preservados.";
const WRITE_ERROR =
  "O navegador não conseguiu salvar sua disputatio. O texto continua nesta página; copie-o antes de sair.";
type Draft = Record<string, unknown>;
type Snapshot = { values: Record<string, string>; storageError: string | null };

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

/** Keep the original flat v1 document and merge only the student's edited fields. */
export function useDisputatioDraft() {
  const known = useRef<Draft>({});
  const pending = useRef<Record<string, string>>({});
  const [snapshot, setSnapshot] = useState<Snapshot>({ values: {}, storageError: null });

  const refresh = useCallback(() => {
    const stored = readDraft(known.current);
    if (!stored.storageError) known.current = stored.document;
    setSnapshot({
      values: textFields({ ...stored.document, ...pending.current }),
      storageError: Object.keys(pending.current).length ? WRITE_ERROR : stored.storageError,
    });
  }, []);

  useEffect(() => {
    refresh();
    const changed = (event: StorageEvent) => {
      if (event.key === DISPUTATIO_KEY || event.key === null) refresh();
    };
    window.addEventListener("storage", changed);
    window.addEventListener(CHANGED, refresh);
    return () => {
      window.removeEventListener("storage", changed);
      window.removeEventListener(CHANGED, refresh);
    };
  }, [refresh]);

  const setField = useCallback((id: string, value: string) => {
    pending.current = { ...pending.current, [id]: value };
    const stored = readDraft(known.current);
    const next = { ...stored.document, ...pending.current };
    let storageError: string | null = null;
    try {
      // Do not overwrite bytes that could not be read or backed up.
      if (stored.raw === undefined) throw new Error("Cannot preserve unread draft");
      if (stored.storageError && stored.raw !== null)
        localStorage.setItem(`${DISPUTATIO_KEY}-recovery-${Date.now()}`, stored.raw);
      localStorage.setItem(DISPUTATIO_KEY, JSON.stringify(next));
      pending.current = {};
      known.current = next;
    } catch {
      storageError = WRITE_ERROR;
    }
    setSnapshot({ values: textFields(next), storageError });
    if (!storageError) window.dispatchEvent(new Event(CHANGED));
  }, []);

  return { ...snapshot, setField };
}
