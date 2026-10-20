import { useCallback, useEffect, useState } from "react";

const KEY = "schola-progress-v1";
export type Progress = { completed: string[]; last?: { to: string; title: string }; notes: Record<string, string> };
const empty: Progress = { completed: [], notes: {} };

function read(): Progress {
  try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return empty; }
}

export function useProgress() {
  const [p, setP] = useState<Progress>(empty);
  useEffect(() => setP(read()), []);
  const update = useCallback((fn: (p: Progress) => Progress) => {
    setP(() => { const n = fn(read()); localStorage.setItem(KEY, JSON.stringify(n)); return n; });
  }, []);
  return {
    progress: p,
    toggle: (id: string) => update((x) => ({ ...x, completed: x.completed.includes(id) ? x.completed.filter((c) => c !== id) : [...x.completed, id] })),
    setLast: (to: string, title: string) => update((x) => ({ ...x, last: { to, title } })),
    setNote: (id: string, v: string) => update((x) => ({ ...x, notes: { ...x.notes, [id]: v } })),
  };
}
