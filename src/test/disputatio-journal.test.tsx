import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DISPUTATIO_KEY, useDisputatioDraft } from "@/lib/disputatio-draft";
import { storageFieldPrefix } from "@/lib/storage-lock";

const fieldKey = (id: string) => `${storageFieldPrefix(DISPUTATIO_KEY)}${encodeURIComponent(id)}`;
const legacy = {
  tese: "Minha tese original",
  premissas: "P1",
  objecoes: "O1",
  respostas: "R1",
  reflexao: "F1",
  future: { preserve: [1, 2] },
};

beforeEach(() => {
  localStorage.clear();
  const empty = renderHook(useDisputatioDraft);
  empty.unmount();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});

function storageChanged(key: string) {
  window.dispatchEvent(new StorageEvent("storage", { key }));
}

describe("disputatio field journal and compatible mirror", () => {
  it("recovers both authors' fields after a stale whole-document write and repairs the v1 mirror", () => {
    localStorage.setItem(DISPUTATIO_KEY, JSON.stringify(legacy));
    const { result } = renderHook(useDisputatioDraft);
    act(() => result.current.setField("tese", "Autoria A"));
    // Another tab retained an old v1 snapshot but authored only its own field journal.
    act(() => {
      localStorage.setItem(fieldKey("respostas"), JSON.stringify({ v: 1, value: "Autoria B" }));
      localStorage.setItem(DISPUTATIO_KEY, JSON.stringify({ ...legacy, respostas: "Autoria B" }));
      storageChanged(fieldKey("respostas"));
    });
    expect(result.current.values).toMatchObject({ tese: "Autoria A", respostas: "Autoria B" });
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toEqual({
      ...legacy,
      tese: "Autoria A",
      respostas: "Autoria B",
    });
  });

  it("keeps one stable key per edited field and retains legacy fields and unknown metadata", () => {
    localStorage.setItem(DISPUTATIO_KEY, JSON.stringify(legacy));
    const first = renderHook(useDisputatioDraft);
    for (let index = 0; index < 15; index++)
      act(() => first.result.current.setField("juizo-revisto", `Revisão ${index}`));
    expect(
      Object.keys(localStorage).filter((key) => key.startsWith(storageFieldPrefix(DISPUTATIO_KEY))),
    ).toEqual([fieldKey("juizo-revisto")]);
    first.unmount();
    const second = renderHook(useDisputatioDraft);
    expect(second.result.current.values["juizo-revisto"]).toBe("Revisão 14");
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toMatchObject(legacy);
  });

  it("retains an intentionally empty answer instead of resurrecting the legacy text", () => {
    localStorage.setItem(DISPUTATIO_KEY, JSON.stringify(legacy));
    const { result } = renderHook(useDisputatioDraft);
    act(() => result.current.setField("tese", ""));
    act(() => {
      localStorage.setItem(DISPUTATIO_KEY, JSON.stringify(legacy));
      storageChanged(DISPUTATIO_KEY);
    });
    expect(result.current.values["tese"]).toBe("");
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!).tese).toBe("");
    expect(JSON.parse(localStorage.getItem(fieldKey("tese"))!).value).toBe("");
  });

  it("keeps a persisted field and in-memory pending text when the mirror hits quota, then retries", () => {
    localStorage.setItem(DISPUTATIO_KEY, JSON.stringify(legacy));
    const first = renderHook(useDisputatioDraft);
    const original = Storage.prototype.setItem;
    const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key,
      value,
    ) {
      if (key === DISPUTATIO_KEY) throw new DOMException("Full", "QuotaExceededError");
      return original.call(this, key, value);
    });
    act(() => first.result.current.setField("tese", "Já persistida no campo"));
    expect(JSON.parse(localStorage.getItem(fieldKey("tese"))!).value).toBe(
      "Já persistida no campo",
    );
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toEqual(legacy);
    expect(first.result.current.storageError).toBeTruthy();
    first.unmount();
    const second = renderHook(useDisputatioDraft);
    expect(second.result.current.values["tese"]).toBe("Já persistida no campo");
    write.mockRestore();
    act(() => second.result.current.setField("juizo-revisto", "Retentativa"));
    expect(second.result.current.storageError).toBeNull();
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toMatchObject({
      ...legacy,
      tese: "Já persistida no campo",
      "juizo-revisto": "Retentativa",
    });
  });

  it("preserves invalid auxiliary bytes and pending text until explicit recovery permits a retry", () => {
    localStorage.setItem(DISPUTATIO_KEY, JSON.stringify(legacy));
    const raw = '{"v":1,"value":{"unknown":"do not overwrite"}}';
    localStorage.setItem(fieldKey("tese"), raw);
    const { result } = renderHook(useDisputatioDraft);
    expect(result.current.storageError).toContain("preservados");
    const write = vi.spyOn(Storage.prototype, "setItem");
    act(() => result.current.setField("respostas", "Resposta em memória"));
    expect(write).not.toHaveBeenCalled();
    expect(localStorage.getItem(fieldKey("tese"))).toBe(raw);
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toEqual(legacy);
    expect(result.current.values["respostas"]).toBe("Resposta em memória");
    localStorage.removeItem(fieldKey("tese"));
    act(() => result.current.setField("reflexao", "Após recuperação manual"));
    expect(result.current.storageError).toBeNull();
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toMatchObject({
      ...legacy,
      respostas: "Resposta em memória",
      reflexao: "Após recuperação manual",
    });
  });

  it("does not write when auxiliary storage cannot be enumerated, and later saves all pending fields", () => {
    localStorage.setItem(DISPUTATIO_KEY, JSON.stringify(legacy));
    const { result } = renderHook(useDisputatioDraft);
    const enumerate = vi.spyOn(Storage.prototype, "key").mockImplementation(() => {
      throw new DOMException("Denied", "SecurityError");
    });
    const write = vi.spyOn(Storage.prototype, "setItem");
    act(() => result.current.setField("tese", "Edição pendente"));
    expect(write).not.toHaveBeenCalled();
    expect(result.current.storageError).toBeTruthy();
    enumerate.mockRestore();
    act(() => result.current.setField("premissas", "P2"));
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toMatchObject({
      ...legacy,
      tese: "Edição pendente",
      premissas: "P2",
    });
  });

  it("does not loop mirror writes when objects have different property order", () => {
    localStorage.setItem(fieldKey("tese"), JSON.stringify({ v: 1, value: "Autoria A" }));
    const raw = JSON.stringify({ future: { b: 2, a: 1 }, tese: "Autoria A" });
    localStorage.setItem(DISPUTATIO_KEY, raw);
    const write = vi.spyOn(Storage.prototype, "setItem");
    const { result } = renderHook(useDisputatioDraft);
    for (let index = 0; index < 10; index++)
      act(() => storageChanged(index % 2 ? DISPUTATIO_KEY : fieldKey("tese")));
    expect(result.current.values["tese"]).toBe("Autoria A");
    expect(write).not.toHaveBeenCalled();
    expect(localStorage.getItem(DISPUTATIO_KEY)).toBe(raw);
  });

  it("uses the last committed field value for same-field conflicts without changing other answers", () => {
    localStorage.setItem(DISPUTATIO_KEY, JSON.stringify(legacy));
    const { result } = renderHook(useDisputatioDraft);
    act(() => result.current.setField("tese", "A"));
    act(() => {
      localStorage.setItem(fieldKey("tese"), JSON.stringify({ v: 1, value: "B" }));
      storageChanged(fieldKey("tese"));
    });
    expect(result.current.values["tese"]).toBe("B");
    act(() => result.current.setField("tese", "A2"));
    expect(JSON.parse(localStorage.getItem(fieldKey("tese"))!).value).toBe("A2");
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toEqual({ ...legacy, tese: "A2" });
  });
});
