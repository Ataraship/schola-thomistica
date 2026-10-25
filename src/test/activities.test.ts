import { describe, expect, it, vi } from "vitest";
import { ACTIVITIES, LANGUAGE_COURSES } from "@/data/activities";
import {
  activityFields,
  activityHistory,
  answerKey,
  completionKey,
  evaluate,
  eventPrefix,
  isObjective,
  newActivityEvent,
  parseActivityEvent,
  reviewSchedule,
  type Activity,
  type ActivityEvent,
} from "@/lib/activities";

const vocab = ACTIVITIES[0]!;
const base = {
  id: "fixture",
  revision: 1,
  course: "en" as const,
  title: "Fixture",
  prompt: "Task",
  provenance: "Test fixture only",
};
const ordering: Activity = {
  ...base,
  kind: "ordering",
  items: [
    { id: "a", label: "Premise" },
    { id: "b", label: "Conclusion" },
  ],
  order: ["a", "b"],
  explanation: "Premise before conclusion in this reconstruction.",
};
const event = (
  at: number,
  result: "correct" | "incorrect" = "correct",
  revision = 1,
): ActivityEvent => ({
  v: 1,
  id: "0".repeat(32),
  activityId: vocab.id,
  revision,
  at,
  ordinal: 1,
  answers: { choice: result === "correct" ? "peace" : "book" },
  result,
});
const DAY = 86400000;

describe("typed activities and independent courses", () => {
  it("resolves every real demonstrative course activity without adding curriculum lessons", () => {
    expect(LANGUAGE_COURSES.map((course) => course.id)).toEqual(["la", "de", "en"]);
    expect(new Set(ACTIVITIES.map((activity) => activity.id)).size).toBe(ACTIVITIES.length);
    for (const course of LANGUAGE_COURSES)
      for (const level of course.levels)
        for (const unit of level.units)
          for (const lesson of unit.lessons) {
            expect(lesson.activityIds.length).toBeGreaterThan(0);
            for (const id of lesson.activityIds)
              expect(ACTIVITIES.find((activity) => activity.id === id)?.course).toBe(course.id);
          }
    for (const activity of ACTIVITIES) expect(activityFields(activity).length).toBeGreaterThan(0);
  });
  it("grades objective answers only and explains wrong choices", () => {
    if (!isObjective(vocab)) throw new Error("Expected objective");
    expect(evaluate(vocab, {})).toMatchObject({ complete: false, correct: false });
    expect(evaluate(vocab, { choice: "book" })).toMatchObject({ complete: true, correct: false });
    expect(evaluate(vocab, { choice: "peace" })).toMatchObject({ complete: true, correct: true });
    expect(evaluate(vocab, { choice: "book" }).feedback).toContain("Pax significa paz");
    expect(
      ACTIVITIES.filter((activity) => !isObjective(activity)).map((activity) => activity.kind),
    ).toContain("argument");
  });
  it("normalizes NFC, case and outer whitespace without discarding meaningful morphology", () => {
    const grammar = ACTIVITIES.find((activity) => activity.id === "de-lernen")!;
    if (!isObjective(grammar)) throw new Error("Expected objective");
    expect(evaluate(grammar, { verb: " LERNE " }).correct).toBe(true);
    expect(evaluate(grammar, { verb: "lernt" }).correct).toBe(false);
    const gaps = ACTIVITIES.find((activity) => activity.id === "la-rosa")!;
    if (!isObjective(gaps)) throw new Error("Expected objective");
    expect(evaluate(gaps, { nominative: "rosa", genitive: "rosa" }).correct).toBe(false);
  });
  it("assesses associations and sequences, including duplicated choices", () => {
    const match = ACTIVITIES.find((activity) => activity.kind === "matching")!;
    if (!isObjective(match)) throw new Error("Expected objective");
    expect(evaluate(match, { buch: "book", wahrheit: "truth" }).correct).toBe(true);
    expect(evaluate(match, { buch: "truth", wahrheit: "truth" }).correct).toBe(false);
    expect(evaluate(ordering, { "0": "a", "1": "b" }).correct).toBe(true);
    expect(evaluate(ordering, { "0": "a", "1": "a" }).correct).toBe(false);
  });
  it("supports prose without claiming that nonempty text is philosophically correct", () => {
    const open: Activity = {
      ...base,
      kind: "open-response",
      fields: [{ id: "text", label: "Reasoning" }],
      criteria: ["Give a reason"],
      guide: "Review reasons",
    };
    const saved = newActivityEvent(open, { text: "A disputable judgment" }, 1);
    expect(saved.result).toBe("ungraded");
    expect(reviewSchedule(open, [saved])).toBeNull();
  });
});

describe("review scheduling from immutable attempts", () => {
  it("starts pending and makes a wrong answer immediately due", () => {
    expect(reviewSchedule(vocab, [])).toEqual({ dueAt: null, stage: 0 });
    expect(reviewSchedule(vocab, [event(100, "incorrect")])).toEqual({ dueAt: 100, stage: 0 });
  });
  it("uses elapsed 1/3/7 day intervals and ignores early repeated correct clicks", () => {
    const history = [event(0), event(1), event(2), event(DAY), event(DAY + 1), event(4 * DAY)];
    expect(reviewSchedule(vocab, history)).toEqual({ dueAt: 11 * DAY, stage: 3 });
  });
  it("resets after an error and keeps old-revision attempts without scheduling them", () => {
    expect(reviewSchedule(vocab, [event(0), event(1, "incorrect"), event(2)])).toEqual({
      dueAt: DAY + 2,
      stage: 1,
    });
    expect(reviewSchedule(vocab, [event(0, "correct", 2)])).toEqual({ dueAt: null, stage: 0 });
  });
});

describe("compatible, recoverable records before UI integration", () => {
  it("adds separate answer and event identities, leaving legacy IDs outside the namespace", () => {
    expect(answerKey("la-pax", "choice")).toBe("methodus:v1:la-pax:answer:choice");
    expect(completionKey("la-pax")).not.toBe("la-pax");
    const answers = { choice: "peace" };
    const saved = newActivityEvent(vocab, answers, 10);
    answers.choice = "book";
    expect(saved.answers["choice"]).toBe("peace");
    expect(
      parseActivityEvent(JSON.stringify(saved), vocab, eventPrefix(vocab.id) + saved.id),
    ).toEqual(saved);
  });
  it("preserves unknown bytes and reports corrupt, future and inconsistent records", () => {
    const saved = newActivityEvent(vocab, { choice: "peace" }, 10);
    const key = eventPrefix(vocab.id) + saved.id;
    const raw = JSON.stringify({ ...saved, future: { retain: true } });
    const notes = {
      "log-1": "Resposta antiga",
      [key]: raw,
      [eventPrefix(vocab.id) + "future"]: '{"v":2}',
      [eventPrefix(vocab.id) + "broken"]: "{broken",
    };
    const original = JSON.stringify(notes);
    const history = activityHistory(notes, vocab);
    expect(history.events).toHaveLength(1);
    expect(history.events[0]).toHaveProperty("future", { retain: true });
    expect(history.invalid).toHaveLength(2);
    expect(JSON.stringify(notes)).toBe(original);
    expect(() =>
      parseActivityEvent(JSON.stringify({ ...saved, result: "incorrect" }), vocab, key),
    ).toThrow("inconsistente");
  });
  it("rejects malformed dates, answer maps, field sets and mismatched event keys", () => {
    const saved = newActivityEvent(vocab, { choice: "peace" }, 10);
    const key = eventPrefix(vocab.id) + saved.id;
    for (const change of [
      { at: -1 },
      { at: Infinity },
      { answers: [] },
      { answers: {} },
      { v: 2 },
      { revision: 0 },
    ])
      expect(() =>
        parseActivityEvent(JSON.stringify({ ...saved, ...change }), vocab, key),
      ).toThrow();
    expect(() => parseActivityEvent(JSON.stringify(saved), vocab, key + "x")).toThrow();
  });
  it("retains revision snapshots even when the original draft changes afterwards", () => {
    const sourceActivity = ACTIVITIES.find((activity) => activity.id === "phi-argument")!;
    const source = newActivityEvent(
      sourceActivity,
      { thesis: "Original thesis", premises: "Reasons", inference: "Form", counterexample: "Test" },
      10,
    );
    const revision = ACTIVITIES.find((activity) => activity.kind === "revision")!;
    const saved = newActivityEvent(
      revision,
      { revised: "Limited thesis", change: "Strong objection" },
      20,
      source,
    );
    source.answers["thesis"] = "Later change";
    expect(saved.source?.answers["thesis"]).toBe("Original thesis");
    expect(saved.result).toBe("ungraded");
    expect(() => newActivityEvent(revision, saved.answers, 20)).toThrow("versão");
  });
  it("does not substitute a timestamp identity when cryptographic randomness fails", () => {
    const random = vi.spyOn(crypto, "getRandomValues").mockImplementation(() => {
      throw new Error("Unavailable");
    });
    try {
      expect(() => newActivityEvent(vocab, { choice: "peace" }, 10)).toThrow("Unavailable");
    } finally {
      random.mockRestore();
    }
  });

  it("orders observed versions independently of repeated/backwards clock and random ID order", () => {
    const first = {
      ...newActivityEvent(vocab, { choice: "book" }, 10),
      id: "f".repeat(32),
      ordinal: 1,
    };
    const second = {
      ...newActivityEvent(vocab, { choice: "peace" }, 10),
      id: "0".repeat(32),
      ordinal: 2,
    };
    const third = {
      ...newActivityEvent(vocab, { choice: "book" }, 9),
      id: "1".repeat(32),
      ordinal: 3,
    };
    const notes = Object.fromEntries(
      [third, second, first].map((item) => [eventPrefix(vocab.id) + item.id, JSON.stringify(item)]),
    );
    expect(activityHistory(notes, vocab).events.map((item) => item.result)).toEqual([
      "incorrect",
      "correct",
      "incorrect",
    ]);
  });

  it("caps the interval at thirty days without awarding a mastery score", () => {
    const events: ActivityEvent[] = [];
    let at = 0;
    for (let n = 0; n < 8; n++) {
      events.push(event(at));
      const next = reviewSchedule(vocab, events)!;
      expect(next).not.toHaveProperty("mastery");
      if (n >= 4) expect(next.dueAt! - at).toBe(30 * DAY);
      at = next.dueAt!;
    }
  });
});
