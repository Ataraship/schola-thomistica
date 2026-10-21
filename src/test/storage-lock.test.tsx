import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PROGRESS_KEY, useProgress } from "@/lib/progress";
import { writeWithStorageLock } from "@/lib/storage-lock";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  localStorage.clear();
});

function controlledLocks() {
  const queue: Array<() => Promise<void>> = [];
  const request = vi.fn((_name: string, _options: unknown, callback: () => void) => {
    return new Promise<void>((resolve, reject) => {
      queue.push(async () => {
        try {
          callback();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });
  vi.stubGlobal("navigator", { locks: { request } });
  return { request, release: async () => queue.shift()!() };
}

describe("serialized storage writes", () => {
  it("keeps the pending-write warning after SPA unmount and releases it when storage saves", async () => {
    localStorage.clear();
    const locks = controlledLocks();
    const mounted = renderHook(useProgress);
    act(() => mounted.result.current.setNote("log-1", "Texto antes da navegação"));
    mounted.unmount();
    const pending = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(pending);
    expect(pending.defaultPrevented).toBe(true);
    await act(async () => locks.release());
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).notes["log-1"]).toBe(
      "Texto antes da navegação",
    );
    const saved = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(saved);
    expect(saved.defaultPrevented).toBe(false);
  });

  it("warns before leaving while a write waits for the lock and stops warning after it saves", async () => {
    localStorage.clear();
    const locks = controlledLocks();
    const { result } = renderHook(useProgress);
    act(() => result.current.setNote("log-1", "Não perder durante recarga"));
    const pending = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(pending);
    expect(pending.defaultPrevented).toBe(true);
    await act(async () => locks.release());
    const saved = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(saved);
    expect(saved.defaultPrevented).toBe(false);
  });

  it("reads inside the granted lock, keeps typing immediate and skips stale queued callbacks", async () => {
    localStorage.clear();
    const locks = controlledLocks();
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ completed: ["pla-1"], notes: {} }));
    const { result } = renderHook(useProgress);
    act(() => result.current.setNote("log-1", "Primeira versão"));
    expect(result.current.progress.notes["log-1"]).toBe("Primeira versão");
    expect(result.current.storageError).toBeNull();
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).notes).toEqual({});
    // A preceding lock holder commits after this tab has queued its update.
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ completed: ["pla-1", "tom-1"], notes: { "ari-1": "Outra aba" }, future: 7 }),
    );
    act(() => result.current.setNote("log-1", "Versão mais recente"));
    await act(async () => locks.release());
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!)).toEqual({
      completed: ["pla-1", "tom-1"],
      notes: { "ari-1": "Outra aba", "log-1": "Versão mais recente" },
      future: 7,
    });
    expect(locks.request).toHaveBeenCalledWith(
      `schola:storage:${PROGRESS_KEY}`,
      { mode: "exclusive" },
      expect.any(Function),
    );
    const raw = JSON.stringify({ completed: ["tom-1"], notes: { "log-1": "Nova edição remota" } });
    localStorage.setItem(PROGRESS_KEY, raw);
    await act(async () => locks.release());
    expect(localStorage.getItem(PROGRESS_KEY)).toBe(raw);
  });

  it("preserves unsaved edits when lock acquisition rejects and retries without an unsafe fallback", async () => {
    const request = vi.fn().mockRejectedValue(new Error("Lock unavailable"));
    vi.stubGlobal("navigator", { locks: { request } });
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ completed: [], notes: { old: "Legado" } }));
    const { result } = renderHook(useProgress);
    const write = vi.spyOn(Storage.prototype, "setItem");
    await act(async () => result.current.setNote("log-1", "Texto pendente"));
    expect(write).not.toHaveBeenCalled();
    expect(result.current.progress.notes["log-1"]).toBe("Texto pendente");
    expect(result.current.storageError).toContain("não conseguiu salvar");
    const locks = controlledLocks();
    act(() => result.current.setNote("log-2", "Recuperação"));
    await act(async () => locks.release());
    expect(result.current.storageError).toBeNull();
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).notes).toEqual({
      old: "Legado",
      "log-1": "Texto pendente",
      "log-2": "Recuperação",
    });
  });

  it("reports a synchronous lock exception without executing the write", () => {
    vi.stubGlobal("navigator", {
      locks: {
        request: () => {
          throw new Error("Denied");
        },
      },
    });
    const write = vi.fn();
    const failed = vi.fn();
    writeWithStorageLock("key", write, failed);
    expect(write).not.toHaveBeenCalled();
    expect(failed).toHaveBeenCalledOnce();
  });

  it("keeps the synchronous compatibility path when Web Locks are unavailable", () => {
    vi.stubGlobal("navigator", {});
    const write = vi.fn();
    const failed = vi.fn();
    writeWithStorageLock("key", write, failed);
    expect(write).toHaveBeenCalledOnce();
    expect(failed).not.toHaveBeenCalled();
  });
});
