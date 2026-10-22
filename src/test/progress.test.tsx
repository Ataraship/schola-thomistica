import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { parseProgress, PROGRESS_KEY, useProgress } from "@/lib/progress";

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("student progress compatibility", () => {
  it("loads old notes and completed IDs, and retains unknown data on updates", () => {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        completed: ["log-1", "pla-1"],
        notes: { "ari-1": "Minha objeção" },
        custom: "preserve",
        last: { to: "/formacao", title: "Lógica" },
      }),
    );
    const { result } = renderHook(useProgress);
    expect(result.current.progress.notes["ari-1"]).toBe("Minha objeção");
    act(() => result.current.setNote("lang-la-1", "Nova tradução"));
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY)!);
    expect(saved).toMatchObject({
      completed: ["log-1", "pla-1"],
      notes: { "ari-1": "Minha objeção", "lang-la-1": "Nova tradução" },
      custom: "preserve",
    });
  });

  it("updates all mounted consumers without losing another consumer's notes", () => {
    const first = renderHook(useProgress);
    const second = renderHook(useProgress);
    const stable = first.result.current.setLast;
    act(() => first.result.current.setNote("log-1", "Premissa"));
    act(() => second.result.current.setNote("lang-en-1", "Conclusion"));
    expect(first.result.current.progress.notes).toEqual({
      "log-1": "Premissa",
      "lang-en-1": "Conclusion",
    });
    expect(first.result.current.setLast).toBe(stable);
    act(() => second.result.current.toggle("log-1"));
    expect(first.result.current.progress.completed).toEqual(["log-1"]);
  });

  it("retains answers after unmounting and remounting", () => {
    const first = renderHook(useProgress);
    act(() => first.result.current.setNote("summa-I-2-3", "Uma objeção ao argumento"));
    first.unmount();
    const second = renderHook(useProgress);
    expect(second.result.current.progress.notes["summa-I-2-3"]).toBe("Uma objeção ao argumento");
  });

  it("backs up a malformed document before any write", () => {
    localStorage.setItem(PROGRESS_KEY, "{old damaged bytes");
    const { result } = renderHook(useProgress);
    expect(result.current.storageError).toBeTruthy();
    act(() => result.current.setNote("log-1", "Resposta nova"));
    const recovery = Object.keys(localStorage).find((key) =>
      key.startsWith(`${PROGRESS_KEY}-recovery-`),
    );
    expect(recovery).toBeDefined();
    expect(localStorage.getItem(recovery!)).toBe("{old damaged bytes");
  });

  it("synchronizes changes written by another tab", () => {
    const { result } = renderHook(useProgress);
    act(() => {
      localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({ completed: ["tom-1"], notes: { "tom-1": "Distingo" } }),
      );
      window.dispatchEvent(new StorageEvent("storage", { key: PROGRESS_KEY }));
    });
    expect(result.current.progress.completed).toEqual(["tom-1"]);
  });

  it("rejects unsafe resume URLs and tolerates malformed individual fields", () => {
    expect(
      parseProgress(
        JSON.stringify({
          completed: ["log-1", 2, "log-1"],
          notes: { good: "text", bad: {} },
          last: { to: "javascript:alert(1)", title: "bad" },
        }),
      ),
    ).toEqual({ completed: ["log-1"], notes: { good: "text" } });
  });

  it("keeps unsaved answers in memory and reports a failed browser write", () => {
    const { result } = renderHook(useProgress);
    const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota", "QuotaExceededError");
    });
    act(() => result.current.setNote("log-1", "Não perder"));
    expect(result.current.progress.notes["log-1"]).toBe("Não perder");
    expect(result.current.storageError).toContain("não conseguiu salvar");
    write.mockRestore();
    act(() => result.current.setNote("log-2", "Agora salvo"));
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).notes).toEqual({
      "log-1": "Não perder",
      "log-2": "Agora salvo",
    });
    expect(result.current.storageError).toBeNull();
  });

  it("merges queued local edits with newer work from another tab after a failed write", () => {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ completed: ["pla-1"], notes: { "ari-1": "Original" } }),
    );
    const { result } = renderHook(useProgress);
    const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota", "QuotaExceededError");
    });
    act(() => result.current.setNote("log-1", "Rascunho pendente"));
    act(() => result.current.setNote("log-1", "Rascunho revisado"));
    act(() => result.current.toggle("log-2"));
    write.mockRestore();

    act(() => {
      localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({
          completed: ["pla-1", "tom-1"],
          notes: { "ari-1": "Revisão da outra aba", "lang-en-1": "Outra resposta" },
          custom: "Dado novo da outra aba",
        }),
      );
      window.dispatchEvent(new StorageEvent("storage", { key: PROGRESS_KEY }));
    });
    expect(result.current.progress.notes).toEqual({
      "ari-1": "Revisão da outra aba",
      "lang-en-1": "Outra resposta",
      "log-1": "Rascunho revisado",
    });
    expect(result.current.storageError).toBeTruthy();

    act(() => result.current.setNote("log-3", "Gravação recuperada"));
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!)).toMatchObject({
      completed: ["pla-1", "tom-1", "log-2"],
      notes: {
        "ari-1": "Revisão da outra aba",
        "lang-en-1": "Outra resposta",
        "log-1": "Rascunho revisado",
        "log-3": "Gravação recuperada",
      },
      custom: "Dado novo da outra aba",
    });
    expect(result.current.storageError).toBeNull();
  });

  it("replays completion as a desired state instead of toggling another tab's completion", () => {
    const { result } = renderHook(useProgress);
    const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota", "QuotaExceededError");
    });
    act(() => result.current.toggle("log-1"));
    write.mockRestore();
    // No storage event is required: the next write must read the latest document.
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ completed: ["log-1", "lang-la-1"], notes: { "tom-1": "Outra aba" } }),
    );
    act(() => result.current.setLast("/formacao?track=logica&lesson=log-1", "Lógica"));
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY)!);
    expect(saved.completed).toEqual(["lang-la-1", "log-1"]);
    expect(saved.notes).toEqual({ "tom-1": "Outra aba" });
    expect(result.current.storageError).toBeNull();
  });

  it("does not overwrite a document it could not read, then recovers without losing old notes", () => {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ completed: ["log-1"], notes: { "ari-1": "Resposta antiga" } }),
    );
    const { result } = renderHook(useProgress);
    const read = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });
    act(() => result.current.setNote("log-2", "Resposta temporária"));
    expect(result.current.storageError).toBeTruthy();
    read.mockRestore();
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).notes).toEqual({
      "ari-1": "Resposta antiga",
    });
    act(() => result.current.setNote("log-2", "Resposta recuperada"));
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).notes).toEqual({
      "ari-1": "Resposta antiga",
      "log-2": "Resposta recuperada",
    });
  });
});
