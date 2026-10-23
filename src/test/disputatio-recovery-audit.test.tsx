import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { DISPUTATIO_KEY, useDisputatioDraft } from "@/lib/disputatio-draft";

const prefix = `${DISPUTATIO_KEY}-recovery-1792700000000`;
const occupiedKey = `${prefix}-${"00000001".repeat(4)}`;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});

it("retains distinct damaged documents and existing backups when recovery timestamps collide", () => {
  localStorage.clear();
  vi.spyOn(Date, "now").mockReturnValue(1792700000000);
  localStorage.setItem(prefix, "Historical recovery");
  const firstRaw = "{first damaged student text";
  const secondRaw = "{second damaged student objection";
  localStorage.setItem(DISPUTATIO_KEY, firstRaw);
  const { result } = renderHook(useDisputatioDraft);
  act(() => result.current.setField("tese", "Recovered thesis"));
  expect(result.current.storageError).toBeNull();
  localStorage.setItem(DISPUTATIO_KEY, secondRaw);
  act(() => result.current.setField("objecoes", "Recovered objection"));
  expect(result.current.storageError).toBeNull();
  const copies = Object.keys(localStorage)
    .filter((key) => key.startsWith(`${DISPUTATIO_KEY}-recovery-`))
    .map((key) => localStorage.getItem(key));
  expect(copies).toEqual(expect.arrayContaining(["Historical recovery", firstRaw, secondRaw]));
  expect(copies).toHaveLength(3);
});

it("does not overwrite an occupied recovery identity and retains pending text until a safe retry", () => {
  localStorage.clear();
  vi.spyOn(Date, "now").mockReturnValue(1792700000000);
  const raw = "{damaged current work";
  localStorage.setItem(occupiedKey, "Prior recovery");
  localStorage.setItem(DISPUTATIO_KEY, raw);
  const { result } = renderHook(useDisputatioDraft);
  const random = vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
    (array as Uint32Array).fill(1);
    return array;
  });
  const write = vi.spyOn(Storage.prototype, "setItem");
  act(() => result.current.setField("tese", "Pending thesis"));
  expect(result.current.storageError).toContain("não conseguiu salvar");
  expect(result.current.values["tese"]).toBe("Pending thesis");
  expect(localStorage.getItem(DISPUTATIO_KEY)).toBe(raw);
  expect(localStorage.getItem(occupiedKey)).toBe("Prior recovery");
  expect(write).not.toHaveBeenCalled();
  random.mockRestore();
  act(() => result.current.setField("objecoes", "Retry objection"));
  expect(result.current.storageError).toBeNull();
  expect(localStorage.getItem(occupiedKey)).toBe("Prior recovery");
  expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toMatchObject({
    tese: "Pending thesis",
    objecoes: "Retry objection",
  });
});

it("keeps the corrupt root and pending text if reading recovery storage is denied", () => {
  localStorage.clear();
  vi.spyOn(Date, "now").mockReturnValue(1792700000000);
  const raw = "{damaged bytes to preserve";
  localStorage.setItem(prefix, "Prior recovery");
  localStorage.setItem(DISPUTATIO_KEY, raw);
  const { result } = renderHook(useDisputatioDraft);
  const get = Storage.prototype.getItem;
  const read = vi.spyOn(Storage.prototype, "getItem").mockImplementation(function (
    this: Storage,
    key,
  ) {
    if (key.startsWith(`${DISPUTATIO_KEY}-recovery-`))
      throw new DOMException("Denied", "SecurityError");
    return get.call(this, key);
  });
  const write = vi.spyOn(Storage.prototype, "setItem");
  act(() => result.current.setField("respostas", "Keep this response"));
  expect(result.current.storageError).toContain("não conseguiu salvar");
  expect(result.current.values["respostas"]).toBe("Keep this response");
  expect(localStorage.getItem(DISPUTATIO_KEY)).toBe(raw);
  expect(write).not.toHaveBeenCalled();
  read.mockRestore();
  act(() => result.current.setField("reflexao", "Retry after read access returns"));
  expect(result.current.storageError).toBeNull();
  expect(localStorage.getItem(prefix)).toBe("Prior recovery");
  expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toMatchObject({
    respostas: "Keep this response",
    reflexao: "Retry after read access returns",
  });
});

it("keeps the corrupt root and pending text if writing recovery bytes exceeds quota", () => {
  localStorage.clear();
  const raw = "{damaged bytes to preserve";
  localStorage.setItem(DISPUTATIO_KEY, raw);
  const { result } = renderHook(useDisputatioDraft);
  const set = Storage.prototype.setItem;
  const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
    this: Storage,
    key,
    value,
  ) {
    if (key.startsWith(`${DISPUTATIO_KEY}-recovery-`))
      throw new DOMException("Full", "QuotaExceededError");
    return set.call(this, key, value);
  });
  act(() => result.current.setField("respostas", "Pending response"));
  expect(result.current.storageError).toContain("não conseguiu salvar");
  expect(result.current.values["respostas"]).toBe("Pending response");
  expect(localStorage.getItem(DISPUTATIO_KEY)).toBe(raw);
  expect(write).toHaveBeenCalledTimes(1);
  expect(
    Object.keys(localStorage).filter((key) => key.startsWith(`${DISPUTATIO_KEY}:field:`)),
  ).toHaveLength(0);
  write.mockRestore();
  act(() => result.current.setField("reflexao", "Retry after storage recovers"));
  expect(result.current.storageError).toBeNull();
  expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toMatchObject({
    respostas: "Pending response",
    reflexao: "Retry after storage recovers",
  });
});

it("fails closed without a random identity instead of falling back to a shared timestamp", () => {
  localStorage.clear();
  const raw = "{original damaged bytes";
  localStorage.setItem(DISPUTATIO_KEY, raw);
  const { result } = renderHook(useDisputatioDraft);
  const random = vi.spyOn(crypto, "getRandomValues").mockImplementation(() => {
    throw new Error("Unavailable");
  });
  const write = vi.spyOn(Storage.prototype, "setItem");
  act(() => result.current.setField("objecoes", "Pending objection"));
  expect(result.current.storageError).toContain("não conseguiu salvar");
  expect(result.current.values["objecoes"]).toBe("Pending objection");
  expect(localStorage.getItem(DISPUTATIO_KEY)).toBe(raw);
  expect(write).not.toHaveBeenCalled();
  random.mockRestore();
  act(() => result.current.setField("reflexao", "Retry with randomness available"));
  expect(result.current.storageError).toBeNull();
});
