/** Authoring model: stable IDs, explicit answer rules and no automatic grading of prose. */
export type ActivityField = { id: string; label: string; hint?: string };
type Base = {
  id: string;
  revision: number;
  course: "la" | "de" | "en" | "philosophy";
  title: string;
  prompt: string;
  provenance: string;
};
type Choice = Base & {
  kind: "multiple-choice" | "error-identification";
  options: readonly { id: string; label: string; explanation: string }[];
  correctId: string;
};
type Matching = Base & {
  kind: "matching";
  pairs: readonly { id: string; label: string; target: string }[];
  targets: readonly { id: string; label: string }[];
};
type Ordering = Base & {
  kind: "ordering";
  items: readonly { id: string; label: string }[];
  order: readonly string[];
  explanation: string;
};
type Gaps = Base & {
  kind: "gap-fill" | "grammar";
  gaps: readonly (ActivityField & { accepted: readonly string[]; explanation: string })[];
};
type Writing = Base & {
  kind: "reading" | "open-response" | "argument" | "objection" | "self-assessment";
  fields: readonly ActivityField[];
  criteria: readonly string[];
  guide: string;
};
type Revision = Omit<Writing, "kind"> & { kind: "revision"; sourceActivityId: string };
export type Activity = Choice | Matching | Ordering | Gaps | Writing | Revision;
export type ObjectiveActivity = Choice | Matching | Ordering | Gaps;
export type Answers = Record<string, string>;

export type LanguageCourse = {
  id: "la" | "de" | "en";
  title: string;
  levels: readonly {
    id: string;
    title: string;
    units: readonly {
      id: string;
      title: string;
      lessons: readonly {
        id: string;
        title: string;
        vocabulary: readonly { term: string; meaning: string }[];
        grammar: string;
        reading: string;
        activityIds: readonly string[];
      }[];
    }[];
  }[];
};

export function isObjective(activity: Activity): activity is ObjectiveActivity {
  return [
    "multiple-choice",
    "error-identification",
    "matching",
    "ordering",
    "gap-fill",
    "grammar",
  ].includes(activity.kind);
}

export function activityFields(activity: Activity): readonly ActivityField[] {
  switch (activity.kind) {
    case "multiple-choice":
    case "error-identification":
      return [{ id: "choice", label: "Sua escolha" }];
    case "matching":
      return activity.pairs;
    case "ordering":
      return activity.order.map((_, index) => ({
        id: String(index),
        label: `Posição ${index + 1}`,
      }));
    case "gap-fill":
    case "grammar":
      return activity.gaps;
    default:
      return activity.fields;
  }
}

const normalize = (text: string) => text.normalize("NFC").trim().toLocaleLowerCase("pt-BR");
export function evaluate(activity: ObjectiveActivity, answers: Answers) {
  const complete = activityFields(activity).every((field) => answers[field.id]?.trim());
  let correct: boolean;
  let feedback: string;
  switch (activity.kind) {
    case "multiple-choice":
    case "error-identification":
      correct = answers["choice"] === activity.correctId;
      feedback =
        activity.options.find((option) => option.id === answers["choice"])?.explanation ??
        "Escolha uma alternativa.";
      break;
    case "matching":
      correct = activity.pairs.every((pair) => answers[pair.id] === pair.target);
      feedback = activity.pairs
        .map(
          (pair) =>
            `${pair.label}: ${activity.targets.find((target) => target.id === pair.target)?.label}.`,
        )
        .join(" ");
      break;
    case "ordering":
      correct = activity.order.every((id, index) => answers[String(index)] === id);
      feedback = activity.explanation;
      break;
    default:
      correct = activity.gaps.every((gap) =>
        gap.accepted.some((value) => normalize(value) === normalize(answers[gap.id] ?? "")),
      );
      feedback = activity.gaps.map((gap) => gap.explanation).join(" ");
  }
  return { complete: !!complete, correct: !!complete && correct, feedback };
}

const PREFIX = "methodus:v1:";
export const answerKey = (id: string, field: string) => `${PREFIX}${id}:answer:${field}`;
export const completionKey = (id: string) => `${PREFIX}${id}:completed`;
export const selectionKey = (course: string) => `${PREFIX}selected:${course}`;
export const eventPrefix = (id: string) => `${PREFIX}${id}:event:`;
export type ActivityEvent = {
  v: 1;
  id: string;
  activityId: string;
  revision: number;
  at: number;
  ordinal: number;
  answers: Answers;
  result: "correct" | "incorrect" | "ungraded";
  source?: { activityId: string; eventId: string; answers: Answers };
};

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function strings(value: unknown): value is Answers {
  return record(value) && Object.values(value).every((item) => typeof item === "string");
}
/** Future/invalid records are reported, never rewritten or removed. */
export function parseActivityEvent(raw: string, activity: Activity, key: string): ActivityEvent {
  const value: unknown = JSON.parse(raw);
  if (
    !record(value) ||
    value["v"] !== 1 ||
    typeof value["id"] !== "string" ||
    !/^[a-f0-9]{32}$/.test(value["id"]) ||
    key !== eventPrefix(activity.id) + value["id"] ||
    value["activityId"] !== activity.id ||
    !Number.isSafeInteger(value["revision"]) ||
    Number(value["revision"]) < 1 ||
    !Number.isSafeInteger(value["ordinal"]) ||
    Number(value["ordinal"]) < 1 ||
    typeof value["at"] !== "number" ||
    !Number.isSafeInteger(value["at"]) ||
    value["at"] < 0 ||
    value["at"] > 8640000000000000 ||
    !strings(value["answers"]) ||
    !["correct", "incorrect", "ungraded"].includes(String(value["result"]))
  )
    throw new Error("Registro de atividade inválido ou de versão desconhecida");
  if (
    value["source"] !== undefined &&
    (!record(value["source"]) ||
      typeof value["source"]["activityId"] !== "string" ||
      typeof value["source"]["eventId"] !== "string" ||
      !strings(value["source"]["answers"]))
  )
    throw new Error("Versão de partida inválida");
  if (value["revision"] === activity.revision) {
    if (
      activity.kind === "revision" &&
      (!record(value["source"]) || value["source"]["activityId"] !== activity.sourceActivityId)
    )
      throw new Error("Versão de partida ausente ou incompatível");
    if (
      !activityFields(activity).every(
        (field) => value["answers"] && (value["answers"] as Answers)[field.id]?.trim(),
      )
    )
      throw new Error("Registro incompleto");
    const result = isObjective(activity)
      ? evaluate(activity, value["answers"]).correct
        ? "correct"
        : "incorrect"
      : "ungraded";
    if (value["result"] !== result) throw new Error("Resultado inconsistente");
  }
  return value as ActivityEvent;
}

export function activityHistory(notes: Answers, activity: Activity) {
  const events: ActivityEvent[] = [];
  const invalid: { key: string; raw: string }[] = [];
  for (const [key, raw] of Object.entries(notes)) {
    if (!key.startsWith(eventPrefix(activity.id))) continue;
    try {
      events.push(parseActivityEvent(raw, activity, key));
    } catch {
      invalid.push({ key, raw });
    }
  }
  // Order observed successors even when the clock repeats or moves backwards.
  // Truly concurrent ordinals use timestamp/identity as a deterministic tie-break.
  events.sort((a, b) => a.ordinal - b.ordinal || a.at - b.at || a.id.localeCompare(b.id));
  return { events, invalid };
}

const DAY = 86400000;
const INTERVALS = [1, 3, 7, 14, 30] as const;
/** Elapsed days, independent of timezone/DST. Early repeated correct clicks do not advance. */
export function reviewSchedule(activity: Activity, events: readonly ActivityEvent[]) {
  if (!isObjective(activity)) return null;
  let dueAt: number | null = null;
  let stage = 0;
  for (const event of events) {
    if (event.revision !== activity.revision || event.result === "ungraded") continue;
    if (event.result === "incorrect") {
      stage = 0;
      dueAt = event.at;
    } else if (dueAt === null || event.at >= dueAt) {
      const days = INTERVALS[Math.min(stage, INTERVALS.length - 1)]!;
      stage += 1;
      dueAt = Math.min(8640000000000000, event.at + days * DAY);
    }
  }
  return { dueAt, stage };
}

export function newActivityEvent(
  activity: Activity,
  answers: Answers,
  now: number,
  source?: ActivityEvent,
  ordinal = 1,
): ActivityEvent {
  if (!activityFields(activity).every((field) => answers[field.id]?.trim()))
    throw new Error("Preencha os campos antes de registrar uma versão.");
  if (activity.kind === "revision" && (!source || source.activityId !== activity.sourceActivityId))
    throw new Error("Registre primeiro uma versão da análise de partida.");
  const id = Array.from(crypto.getRandomValues(new Uint32Array(4)), (part) =>
    part.toString(16).padStart(8, "0"),
  ).join("");
  return {
    v: 1,
    id,
    activityId: activity.id,
    revision: activity.revision,
    at: now,
    ordinal,
    answers: { ...answers },
    result: isObjective(activity)
      ? evaluate(activity, answers).correct
        ? "correct"
        : "incorrect"
      : "ungraded",
    ...(activity.kind === "revision" && source
      ? {
          source: {
            activityId: source.activityId,
            eventId: source.id,
            answers: { ...source.answers },
          },
        }
      : {}),
  };
}
