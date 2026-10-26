import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ActivityWorkbench } from "@/components/ActivityWorkbench";
import { ACTIVITIES } from "@/data/activities";
import { PROGRESS_KEY, useProgress } from "@/lib/progress";
import {
  activityHistory,
  answerKey,
  eventPrefix,
  reviewSchedule,
  newActivityEvent,
  activityFields,
} from "@/lib/activities";

const activity = ACTIVITIES.find((item) => item.id === "la-pax")!;
const DAY = 86400000;
const now = 1792948428281;
const fieldKey = (id: string) => `${PROGRESS_KEY}:field:${encodeURIComponent(`note:${id}`)}`;
const notes = Object.fromEntries(
  [1, 2].map((ordinal) => {
    const id = String(ordinal).repeat(32);
    return [
      eventPrefix(activity.id) + id,
      JSON.stringify({
        v: 1,
        id,
        activityId: activity.id,
        revision: 1,
        ordinal,
        at: now - (3 - ordinal) * DAY,
        answers: { choice: "book" },
        result: "incorrect",
      }),
    ];
  }),
);
const legacy = {
  completed: ["log-1"],
  notes: { "log-1": "Resposta anterior", ...notes },
  future: { keep: true },
};
const read = () => JSON.parse(localStorage.getItem(PROGRESS_KEY)!);

beforeEach(() => {
  localStorage.clear();
  const reset = renderHook(useProgress);
  reset.unmount();
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(legacy));
  for (const [id, value] of Object.entries(notes))
    localStorage.setItem(
      fieldKey(id),
      JSON.stringify({ v: 1, value: { kind: "note", id, value } }),
    );
  localStorage.setItem(`${PROGRESS_KEY}-recovery-1`, "{backup anterior");
  vi.spyOn(Date, "now").mockReturnValue(now);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  const reset = renderHook(useProgress);
  act(() => reset.result.current.refresh());
  reset.unmount();
  delete (navigator as { locks?: unknown }).locks;
  localStorage.clear();
});

it("keeps the draft editable but blocks recording unread history, then recovers before ordering the next correct attempt", () => {
  const original = localStorage.getItem(PROGRESS_KEY);
  const denied = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new DOMException("Denied", "SecurityError");
  });
  render(<ActivityWorkbench activity={activity} now={now} onRecorded={() => {}} />);
  const answer = screen.getByLabelText("Paz");
  expect(answer).toBeEnabled();
  fireEvent.click(answer);
  expect(answer).toBeChecked();
  const register = screen.getByRole("button", { name: "Conferir e registrar tentativa" });
  expect(register).toBeDisabled();
  fireEvent.click(register);
  denied.mockRestore();
  expect(localStorage.getItem(PROGRESS_KEY)).toBe(original);
  fireEvent.click(screen.getByRole("button", { name: "Tentar ler histórico novamente" }));
  expect(answer).toBeChecked();
  expect(register).toBeEnabled();
  fireEvent.click(register);
  const stored = read();
  const history = activityHistory(stored.notes, activity);
  expect(history.invalid).toEqual([]);
  expect(history.events.map((event) => event.ordinal)).toEqual([1, 2, 3]);
  expect(history.events.at(-1)).toMatchObject({
    answers: { choice: "peace" },
    result: "correct",
    at: now,
  });
  expect(reviewSchedule(activity, history.events)).toEqual({ dueAt: now + DAY, stage: 1 });
  expect(screen.getByText("Resposta registrada correta neste exercício")).toBeInTheDocument();
  expect(stored).toMatchObject(legacy);
  for (const [key, raw] of Object.entries(notes)) expect(stored.notes[key]).toBe(raw);
  expect(localStorage.getItem(`${PROGRESS_KEY}-recovery-1`)).toBe("{backup anterior");
});

it("rejects a stale enabled interface when reads fail immediately before the click", () => {
  render(<ActivityWorkbench activity={activity} now={now} onRecorded={() => {}} />);
  fireEvent.click(screen.getByLabelText("Paz"));
  const button = screen.getByRole("button", { name: "Conferir e registrar tentativa" });
  expect(button).toBeEnabled();
  const original = localStorage.getItem(PROGRESS_KEY);
  const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new DOMException("Denied", "SecurityError");
  });
  fireEvent.click(button);
  expect(
    screen.getAllByRole("alert").some((el) => el.textContent?.includes("histórico completo")),
  ).toBe(true);
  spy.mockRestore();
  expect(localStorage.getItem(PROGRESS_KEY)).toBe(original);
  expect(activityHistory(read().notes, activity).events).toHaveLength(2);
});

it("never releases registration while read denial persists through explicit recovery attempts", () => {
  const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new DOMException("Denied", "SecurityError");
  });
  render(<ActivityWorkbench activity={activity} now={now} onRecorded={() => {}} />);
  fireEvent.click(screen.getByLabelText("Paz"));
  fireEvent.click(screen.getByRole("button", { name: "Tentar ler histórico novamente" }));
  expect(screen.getByLabelText("Paz")).toBeEnabled();
  expect(screen.getByLabelText("Paz")).toBeChecked();
  expect(screen.getByRole("button", { name: "Conferir e registrar tentativa" })).toBeDisabled();
  spy.mockRestore();
  expect(activityHistory(read().notes, activity).events).toHaveLength(2);
});

it("schedules an incorrect attempt immediately after recovering the previous ordinals", () => {
  const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new DOMException("Denied", "SecurityError");
  });
  const view = render(<ActivityWorkbench activity={activity} now={now} onRecorded={() => {}} />);
  fireEvent.click(screen.getByLabelText("Paz"));
  spy.mockRestore();
  fireEvent.click(screen.getByRole("button", { name: "Tentar ler histórico novamente" }));
  fireEvent.click(screen.getByRole("button", { name: "Conferir e registrar tentativa" }));
  fireEvent.click(screen.getByLabelText("Livro"));
  fireEvent.click(screen.getByRole("button", { name: "Conferir e registrar tentativa" }));
  const history = activityHistory(read().notes, activity);
  expect(history.events.map((e) => e.ordinal)).toEqual([1, 2, 3, 4]);
  expect(history.events.at(-1)?.result).toBe("incorrect");
  expect(reviewSchedule(activity, history.events)).toEqual({ dueAt: now, stage: 0 });
  view.unmount();
  render(<ActivityWorkbench activity={activity} now={now} onRecorded={() => {}} />);
  expect(screen.getByLabelText("Livro")).toBeChecked();
  expect(screen.getByText("Resposta a revisar")).toBeInTheDocument();
  expect(activityHistory(read().notes, activity).events).toEqual(history.events);
});

it("recovers an ungraded prose version without replacing the original text", () => {
  const prose = ACTIVITIES.find((a) => a.id === "phi-argument")!;
  const answers = Object.fromEntries(activityFields(prose).map((f) => [f.id, "Original " + f.id]));
  const previous = newActivityEvent(prose, answers, now - DAY, undefined, 7);
  const key = eventPrefix(prose.id) + previous.id;
  const raw = JSON.stringify(previous);
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({ ...legacy, notes: { ...legacy.notes, [key]: raw } }),
  );
  const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new DOMException("Denied", "SecurityError");
  });
  render(<ActivityWorkbench activity={prose} now={now} onRecorded={() => {}} />);
  for (const field of activityFields(prose))
    fireEvent.change(screen.getByLabelText(field.label), {
      target: { value: "Revisado " + field.id },
    });
  expect(screen.getByRole("button", { name: "Registrar esta versão" })).toBeDisabled();
  spy.mockRestore();
  fireEvent.click(screen.getByRole("button", { name: "Tentar ler histórico novamente" }));
  fireEvent.click(screen.getByRole("button", { name: "Registrar esta versão" }));
  const history = activityHistory(read().notes, prose);
  expect(history.events.map((e) => e.ordinal)).toEqual([7, 8]);
  expect(history.events.at(-1)?.result).toBe("ungraded");
  expect(read().notes[key]).toBe(raw);
  expect(history.events[0]?.answers).toEqual(answers);
});

it("reads another tab's appended journal inside the lock and preserves timestamp ties with distinct identities", () => {
  const view = render(<ActivityWorkbench activity={activity} now={now} onRecorded={() => {}} />);
  fireEvent.click(screen.getByLabelText("Paz"));
  let release: (() => void) | undefined;
  const locks = {
    request: vi.fn((_name, _options, callback) => {
      release = callback;
      return Promise.resolve();
    }),
  };
  Object.defineProperty(navigator, "locks", { configurable: true, value: locks });
  fireEvent.click(screen.getByRole("button", { name: "Conferir e registrar tentativa" }));
  const other = newActivityEvent(activity, { choice: "book" }, now, undefined, 3);
  const key = eventPrefix(activity.id) + other.id;
  const raw = JSON.stringify(other);
  localStorage.setItem(
    fieldKey(key),
    JSON.stringify({ v: 1, value: { kind: "note", id: key, value: raw } }),
  );
  // Root deliberately remains stale. No storage event reaches this tab before the lock.
  act(() => release!());
  expect(locks.request.mock.calls[0]?.[0]).toBe(`schola:storage:${PROGRESS_KEY}`);
  const history = activityHistory(read().notes, activity);
  expect(history.events.map((e) => e.ordinal)).toEqual([1, 2, 3, 4]);
  expect(history.events.at(-1)).toMatchObject({ result: "correct", at: now });
  expect(history.events.at(-1)?.id).not.toBe(other.id);
  expect(read().notes[key]).toBe(raw);
  delete (navigator as { locks?: unknown }).locks;
  view.unmount();
  render(<ActivityWorkbench activity={activity} now={now} onRecorded={() => {}} />);
  expect(screen.getByText("Resposta registrada correta neste exercício")).toBeInTheDocument();
  expect(reviewSchedule(activity, activityHistory(read().notes, activity).events)).toEqual({
    dueAt: now + DAY,
    stage: 1,
  });
});

it.each(["{invalid", '{"v":2,"student":"future"}'])(
  "rejects newly discovered invalid/future bytes in the handler: %s",
  (raw) => {
    render(<ActivityWorkbench activity={activity} now={now} onRecorded={() => {}} />);
    fireEvent.click(screen.getByLabelText("Paz"));
    const button = screen.getByRole("button", { name: "Conferir e registrar tentativa" });
    expect(button).toBeEnabled();
    const key = eventPrefix(activity.id) + "future";
    localStorage.setItem(
      fieldKey(key),
      JSON.stringify({ v: 1, value: { kind: "note", id: key, value: raw } }),
    );
    fireEvent.click(button);
    expect(activityHistory(read().notes, activity).events).toHaveLength(2);
    expect(localStorage.getItem(fieldKey(key))).toContain(JSON.stringify(raw).slice(1, -1));
    expect(screen.getByRole("button", { name: "Conferir e registrar tentativa" })).toBeDisabled();
  },
);

it.each(["QuotaExceededError", "SecurityError"])(
  "retains a failed definitive record as one pending event, then saves it once after %s",
  (name) => {
    render(<ActivityWorkbench activity={activity} now={now} onRecorded={() => {}} />);
    fireEvent.click(screen.getByLabelText("Paz"));
    const previous = localStorage.getItem(PROGRESS_KEY);
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Unavailable", name);
    });
    fireEvent.click(screen.getByRole("button", { name: "Conferir e registrar tentativa" }));
    expect(screen.getByRole("button", { name: "Conferir e registrar tentativa" })).toBeDisabled();
    expect(screen.getByLabelText("Paz")).toBeEnabled();
    expect(localStorage.getItem(PROGRESS_KEY)).toBe(previous);
    spy.mockRestore();
    fireEvent.click(screen.getByRole("button", { name: "Tentar ler histórico novamente" }));
    const history = activityHistory(read().notes, activity);
    expect(history.events.map((e) => e.ordinal)).toEqual([1, 2, 3]);
    expect(history.events.at(-1)?.result).toBe("correct");
    expect(read()).toMatchObject(legacy);
    expect(localStorage.getItem(`${PROGRESS_KEY}-recovery-1`)).toBe("{backup anterior");
  },
);

it("fails the serialized creation callback without calling it on an unreadable store", () => {
  const hook = renderHook(useProgress);
  const create = vi.fn(() => ({ id: "methodus:v1:la-pax:event:new", value: "never" }));
  const rejected = vi.fn();
  const recorded = vi.fn();
  const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new DOMException("Denied", "SecurityError");
  });
  act(() => hook.result.current.recordNote(create, recorded, rejected));
  expect(create).not.toHaveBeenCalled();
  expect(recorded).not.toHaveBeenCalled();
  expect(rejected).toHaveBeenCalledOnce();
  spy.mockRestore();
  expect(activityHistory(read().notes, activity).events).toHaveLength(2);
});

it("does not enter a nested lock or leave the handler busy after lock rejection", async () => {
  render(<ActivityWorkbench activity={activity} now={now} onRecorded={() => {}} />);
  fireEvent.click(screen.getByLabelText("Paz"));
  const locks = { request: vi.fn(() => Promise.reject(new Error("Rejected"))) };
  Object.defineProperty(navigator, "locks", { configurable: true, value: locks });
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Conferir e registrar tentativa" }));
  });
  expect(locks.request).toHaveBeenCalledOnce();
  expect(activityHistory(read().notes, activity).events).toHaveLength(2);
  delete (navigator as { locks?: unknown }).locks;
  fireEvent.click(screen.getByRole("button", { name: "Conferir e registrar tentativa" }));
  expect(activityHistory(read().notes, activity).events).toHaveLength(3);
});
