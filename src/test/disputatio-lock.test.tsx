import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DISPUTATIO_KEY, useDisputatioDraft } from "@/lib/disputatio-draft";

beforeEach(() => {
  localStorage.clear();
  const empty = renderHook(useDisputatioDraft);
  empty.unmount();
});

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

describe("serialized disputatio writes", () => {
  it("keeps pending text and the unload warning across SPA unmount, then releases after save", async () => {
    const locks = controlledLocks();
    const first = renderHook(useDisputatioDraft);
    act(() => first.result.current.setField("tese", "Texto antes da navegação"));
    first.unmount();
    const pending = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(pending);
    expect(pending.defaultPrevented).toBe(true);
    const second = renderHook(useDisputatioDraft);
    expect(second.result.current.values["tese"]).toBe("Texto antes da navegação");
    await act(async () => locks.release());
    const saved = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(saved);
    expect(saved.defaultPrevented).toBe(false);
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!).tese).toBe("Texto antes da navegação");
  });

  it("retains a rejected write through unmount and remount until a subsequent edit saves all pending text", async () => {
    vi.stubGlobal("navigator", {
      locks: { request: vi.fn().mockRejectedValue(new Error("Denied")) },
    });
    const first = renderHook(useDisputatioDraft);
    await act(async () => first.result.current.setField("tese", "Pendente depois da falha"));
    first.unmount();
    const second = renderHook(useDisputatioDraft);
    expect(second.result.current.values["tese"]).toBe("Pendente depois da falha");
    expect(second.result.current.storageError).toBeTruthy();
    const locks = controlledLocks();
    act(() => second.result.current.setField("premissas", "Premissa nova"));
    await act(async () => locks.release());
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toEqual({
      tese: "Pendente depois da falha",
      premissas: "Premissa nova",
    });
    expect(second.result.current.storageError).toBeNull();
  });

  it("warns before leaving while a lock is pending and stops after the text is saved", async () => {
    const locks = controlledLocks();
    const { result } = renderHook(useDisputatioDraft);
    act(() => result.current.setField("tese", "Texto aguardando gravação"));
    const pending = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(pending);
    expect(pending.defaultPrevented).toBe(true);
    await act(async () => locks.release());
    const saved = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(saved);
    expect(saved.defaultPrevented).toBe(false);
  });

  it("merges queued cooperating writers and keeps immediate typing without stale callback overwrites", async () => {
    const locks = controlledLocks();
    const legacy = {
      tese: "Legado",
      premissas: "P1",
      objecoes: "O1",
      respostas: "R1",
      reflexao: "F1",
      future: { preserve: true },
    };
    localStorage.setItem(DISPUTATIO_KEY, JSON.stringify(legacy));
    const first = renderHook(useDisputatioDraft);
    const second = renderHook(useDisputatioDraft);
    act(() => first.result.current.setField("tese", "Tese revista"));
    act(() => second.result.current.setField("juizo-revisto", "Conclusão nova"));
    act(() => first.result.current.setField("tese", "Tese final"));
    expect(first.result.current.values["tese"]).toBe("Tese final");
    expect(second.result.current.values["juizo-revisto"]).toBe("Conclusão nova");
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toEqual(legacy);
    await act(async () => locks.release());
    await act(async () => locks.release());
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toEqual({
      ...legacy,
      tese: "Tese final",
      "juizo-revisto": "Conclusão nova",
    });
    expect(first.result.current.values["juizo-revisto"]).toBe("Conclusão nova");
    expect(second.result.current.values["tese"]).toBe("Tese final");
    const raw = JSON.stringify({ ...legacy, tese: "Edição remota posterior" });
    localStorage.setItem(DISPUTATIO_KEY, raw);
    await act(async () => locks.release());
    expect(localStorage.getItem(DISPUTATIO_KEY)).toBe(raw);
    expect(locks.request).toHaveBeenCalledWith(
      `schola:storage:${DISPUTATIO_KEY}`,
      { mode: "exclusive" },
      expect.any(Function),
    );
  });

  it("retains pending text on lock rejection and saves it after acquisition recovers", async () => {
    vi.stubGlobal("navigator", {
      locks: { request: vi.fn().mockRejectedValue(new Error("Lock denied")) },
    });
    localStorage.setItem(DISPUTATIO_KEY, JSON.stringify({ tese: "Legado", future: 3 }));
    const { result } = renderHook(useDisputatioDraft);
    const write = vi.spyOn(Storage.prototype, "setItem");
    await act(async () => result.current.setField("respostas", "Texto pendente"));
    expect(write).not.toHaveBeenCalled();
    expect(result.current.values["respostas"]).toBe("Texto pendente");
    expect(result.current.storageError).toContain("não conseguiu salvar");
    const locks = controlledLocks();
    act(() => result.current.setField("juizo-revisto", "Recuperação"));
    await act(async () => locks.release());
    expect(result.current.storageError).toBeNull();
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toEqual({
      tese: "Legado",
      future: 3,
      respostas: "Texto pendente",
      "juizo-revisto": "Recuperação",
    });
  });

  it("keeps malformed bytes and pending text when backup fails inside the lock, then retries safely", async () => {
    const locks = controlledLocks();
    const raw = "{old damaged bytes";
    localStorage.setItem(DISPUTATIO_KEY, raw);
    const { result } = renderHook(useDisputatioDraft);
    const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Full");
    });
    act(() => result.current.setField("tese", "Minha tese"));
    await act(async () => locks.release());
    expect(localStorage.getItem(DISPUTATIO_KEY)).toBe(raw);
    expect(result.current.values["tese"]).toBe("Minha tese");
    expect(result.current.storageError).toBeTruthy();
    write.mockRestore();
    act(() => result.current.setField("premissas", "Minha premissa"));
    await act(async () => locks.release());
    const recovery = Object.keys(localStorage).find((key) =>
      key.startsWith(`${DISPUTATIO_KEY}-recovery-`),
    );
    expect(localStorage.getItem(recovery!)).toBe(raw);
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toEqual({
      tese: "Minha tese",
      premissas: "Minha premissa",
    });
    expect(result.current.storageError).toBeNull();
  });
});
