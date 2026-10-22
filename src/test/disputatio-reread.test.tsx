import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { DISPUTATIO_KEY, useDisputatioDraft } from "@/lib/disputatio-draft";
import { storageFieldPrefix } from "@/lib/storage-lock";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});

it("preserves newly damaged root bytes after a field commit, then recovers all pending work on retry", () => {
  localStorage.clear();
  const legacy = { tese: "Tese anterior", respostas: "Resposta anterior", future: { keep: true } };
  const damaged = "{new damaged bytes from a noncooperating writer";
  const field = `${storageFieldPrefix(DISPUTATIO_KEY)}${encodeURIComponent("tese")}`;
  localStorage.setItem(DISPUTATIO_KEY, JSON.stringify(legacy));
  const { result } = renderHook(useDisputatioDraft);
  const set = Storage.prototype.setItem;
  let inject = true;
  const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
    this: Storage,
    key,
    value,
  ) {
    set.call(this, key, value);
    if (key === field && inject) {
      inject = false;
      // Store actual bytes between the first root read and the post-field re-read.
      set.call(this, DISPUTATIO_KEY, damaged);
    }
  });

  act(() => result.current.setField("tese", "Tese pendente"));
  expect(localStorage.getItem(DISPUTATIO_KEY)).toBe(damaged);
  expect(result.current.storageError).toContain("não conseguiu salvar");
  expect(result.current.values["tese"]).toBe("Tese pendente");
  expect(JSON.parse(localStorage.getItem(field)!).value).toBe("Tese pendente");
  const pending = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(pending);
  expect(pending.defaultPrevented).toBe(true);

  write.mockRestore();
  act(() => result.current.setField("respostas", "Resposta na retentativa"));
  expect(result.current.storageError).toBeNull();
  expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toEqual({
    ...legacy,
    tese: "Tese pendente",
    respostas: "Resposta na retentativa",
  });
  const copies = Object.keys(localStorage).filter((key) =>
    key.startsWith(`${DISPUTATIO_KEY}-recovery-`),
  );
  expect(copies.some((key) => localStorage.getItem(key) === damaged)).toBe(true);
  const saved = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(saved);
  expect(saved.defaultPrevented).toBe(false);
});
