import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PROGRESS_KEY, useProgress } from "@/lib/progress";
import { storageFieldPrefix } from "@/lib/storage-lock";

const fieldKey = (field: string) =>
  `${storageFieldPrefix(PROGRESS_KEY)}${encodeURIComponent(field)}`;
const note = (id: string, value: string) => ({ v: 1, value: { kind: "note", id, value } });
beforeEach(() => {
  localStorage.clear();
  const empty = renderHook(useProgress);
  empty.unmount();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("field journal preserves progress across stale document snapshots", () => {
  it("merges the other tab's field despite a stale root and writes only its own stable field key", () => {
    const old = { completed: ["pla-1"], notes: { a: "old" }, future: { preserve: true } };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(old));
    const a = JSON.stringify(note("a", "new from tab A"));
    localStorage.setItem(fieldKey("note:a"), a);
    const { result } = renderHook(useProgress);
    expect(result.current.progress.notes["a"]).toBe("new from tab A");
    act(() => result.current.setNote("b", "new from tab B"));
    act(() => result.current.setNote("b", "latest from tab B"));
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!)).toEqual({
      ...old,
      notes: { a: "new from tab A", b: "latest from tab B" },
    });
    expect(localStorage.getItem(fieldKey("note:a"))).toBe(a);
    expect(
      Object.keys(localStorage).filter((key) => key.startsWith(storageFieldPrefix(PROGRESS_KEY))),
    ).toHaveLength(2);
  });

  it("reconciles a late stale mirror event and stops writing when only object-key order differs", () => {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ completed: [], notes: { a: "old", b: "old" } }),
    );
    localStorage.setItem(fieldKey("note:a"), JSON.stringify(note("a", "new A")));
    localStorage.setItem(fieldKey("note:b"), JSON.stringify(note("b", "new B")));
    const { result } = renderHook(useProgress);
    act(() => window.dispatchEvent(new StorageEvent("storage", { key: PROGRESS_KEY })));
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).notes).toEqual({
      a: "new A",
      b: "new B",
    });
    expect(result.current.progress.notes).toEqual({ a: "new A", b: "new B" });
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ notes: { b: "new B", a: "new A" }, completed: [] }),
    );
    const write = vi.spyOn(Storage.prototype, "setItem");
    act(() => {
      for (let n = 0; n < 10; n++)
        window.dispatchEvent(new StorageEvent("storage", { key: fieldKey("note:a") }));
    });
    expect(write).not.toHaveBeenCalled();
  });

  it("retains empty notes and completion false as field tombstones over a legacy mirror", () => {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ completed: ["log-1"], notes: { "log-1": "old" } }),
    );
    const { result } = renderHook(useProgress);
    act(() => result.current.setNote("log-1", ""));
    act(() => result.current.toggle("log-1"));
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ completed: ["log-1"], notes: { "log-1": "old" } }),
    );
    act(() => window.dispatchEvent(new StorageEvent("storage", { key: PROGRESS_KEY })));
    expect(result.current.progress.notes["log-1"]).toBe("");
    expect(result.current.progress.completed).toEqual([]);
    expect(JSON.parse(localStorage.getItem(fieldKey("completion:log-1"))!).value.completed).toBe(
      false,
    );
  });

  it("fails closed on corrupt auxiliary bytes and retains pending text until manual recovery", () => {
    const root = JSON.stringify({ completed: [], notes: { old: "preserve" } });
    localStorage.setItem(PROGRESS_KEY, root);
    localStorage.setItem(fieldKey("note:a"), "{damaged sidecar");
    const { result } = renderHook(useProgress);
    expect(result.current.storageError).toBeTruthy();
    act(() => result.current.setNote("b", "pending"));
    expect(localStorage.getItem(fieldKey("note:a"))).toBe("{damaged sidecar");
    expect(localStorage.getItem(PROGRESS_KEY)).toBe(root);
    expect(result.current.progress.notes["b"]).toBe("pending");
    localStorage.removeItem(fieldKey("note:a"));
    act(() => result.current.setNote("c", "recovered"));
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).notes).toEqual({
      old: "preserve",
      b: "pending",
      c: "recovered",
    });
    expect(result.current.storageError).toBeNull();
  });

  it("retains journaled text when quota fails between the field write and legacy mirror", () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ completed: [], notes: {} }));
    const first = renderHook(useProgress);
    const native = Storage.prototype.setItem;
    const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key,
      value,
    ) {
      if (key === PROGRESS_KEY) throw new Error("Mirror quota");
      return native.call(this, key, value);
    });
    act(() => first.result.current.setNote("a", "durable journal"));
    expect(first.result.current.storageError).toBeTruthy();
    expect(localStorage.getItem(fieldKey("note:a"))).toBeTruthy();
    first.unmount();
    const second = renderHook(useProgress);
    expect(second.result.current.progress.notes["a"]).toBe("durable journal");
    write.mockRestore();
    act(() => second.result.current.setNote("b", "retry"));
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).notes).toEqual({
      a: "durable journal",
      b: "retry",
    });
    expect(second.result.current.storageError).toBeNull();
  });

  it("rejects mismatched fields and unsafe resume URLs in auxiliary entries", () => {
    localStorage.setItem(
      fieldKey("last"),
      JSON.stringify({ v: 1, value: { kind: "last", to: "javascript:alert(1)", title: "bad" } }),
    );
    localStorage.setItem(fieldKey("note:a"), JSON.stringify(note("b", "wrong field")));
    const { result } = renderHook(useProgress);
    expect(result.current.progress.last).toBeUndefined();
    expect(result.current.progress.notes["b"]).toBeUndefined();
    expect(result.current.storageError).toBeTruthy();
    // No pending edits were made: corrupt bytes remain for explicit recovery.
  });
});
