import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ActivityWorkbench } from "@/components/ActivityWorkbench";
import { ActivityEditor } from "@/components/ActivityEditor";
import { MethodusDiscendi } from "@/components/MethodusDiscendi";
import { ACTIVITIES } from "@/data/activities";
import { PROGRESS_KEY, useProgress } from "@/lib/progress";
import { answerKey, eventPrefix, newActivityEvent, type Activity } from "@/lib/activities";

const vocab = ACTIVITIES[0]!;
const grammar = ACTIVITIES.find((item) => item.id === "de-lernen")!;
const argument = ACTIVITIES.find((item) => item.id === "phi-argument")!;
const renderActivity = (activity = vocab) =>
  render(<ActivityWorkbench activity={activity} now={Date.now()} onRecorded={() => {}} />);
const old = {
  completed: ["log-1", "pla-1", "studium-imagens"],
  notes: { "log-1": "Resposta antiga", "idiomas:course": "de" },
  future: { retain: true },
};
const fieldKey = (id: string) => `${PROGRESS_KEY}:field:${encodeURIComponent(`note:${id}`)}`;
const snapshot = () => JSON.parse(localStorage.getItem(PROGRESS_KEY)!);
let hydrated: Root | undefined;
beforeEach(() => {
  localStorage.clear();
  const reset = renderHook(useProgress);
  reset.unmount();
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(old));
  localStorage.setItem(
    "schola-disputatio-v1",
    '{"tese":"Antiga","premissas":"P","objecoes":"O","respostas":"R","reflexao":"F","future":1}',
  );
  localStorage.setItem(`${PROGRESS_KEY}-recovery-1`, "{backup antigo");
});
afterEach(() => {
  if (hydrated) act(() => hydrated!.unmount());
  hydrated = undefined;
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});

it("persists answers per field and keeps all legacy notes, completions, auxiliary records and backups", () => {
  const disputatio = localStorage.getItem("schola-disputatio-v1");
  const view = renderActivity(grammar);
  fireEvent.change(screen.getByLabelText("Forma de lernen com ich"), {
    target: { value: "lerne" },
  });
  expect(snapshot()).toMatchObject(old);
  expect(snapshot().notes[answerKey(grammar.id, "verb")]).toBe("lerne");
  expect(
    JSON.parse(localStorage.getItem(fieldKey(answerKey(grammar.id, "verb")))!).value.value,
  ).toBe("lerne");
  view.unmount();
  renderActivity(grammar);
  expect(screen.getByLabelText("Forma de lernen com ich")).toHaveValue("lerne");
  expect(localStorage.getItem("schola-disputatio-v1")).toBe(disputatio);
  expect(localStorage.getItem(`${PROGRESS_KEY}-recovery-1`)).toBe("{backup antigo");
});

it("retains a wrong attempt after correction and does not record repeated correct clicks", () => {
  renderActivity();
  fireEvent.click(screen.getByLabelText("Livro"));
  fireEvent.click(screen.getByRole("button", { name: "Conferir e registrar tentativa" }));
  expect(screen.getByRole("status")).toHaveTextContent("Pax significa paz");
  fireEvent.click(screen.getByLabelText("Paz"));
  fireEvent.click(screen.getByRole("button", { name: "Conferir e registrar tentativa" }));
  expect(screen.getByRole("button", { name: "Conferir e registrar tentativa" })).toBeDisabled();
  const events = Object.entries(snapshot().notes)
    .filter(([key]) => key.startsWith(eventPrefix(vocab.id)))
    .map(([, raw]) => JSON.parse(String(raw)));
  expect(events.map((event) => event.result)).toEqual(["incorrect", "correct"]);
  expect(events[0].answers.choice).toBe("book");
});

it("stores versions without grading prose and preserves the source within each revision", () => {
  const source = newActivityEvent(
    argument,
    { thesis: "Original", premises: "Reasons", inference: "Form", counterexample: "Test" },
    10,
  );
  const sourceKey = eventPrefix(argument.id) + source.id;
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({ ...old, notes: { ...old.notes, [sourceKey]: JSON.stringify(source) } }),
  );
  const revision = ACTIVITIES.find((item) => item.kind === "revision")!;
  renderActivity(revision);
  fireEvent.change(screen.getByLabelText("Juízo revisto com razões"), {
    target: { value: "A limited conclusion" },
  });
  fireEvent.change(screen.getByLabelText(/Qual objeção motivou/), {
    target: { value: "An objection to the universal" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Registrar esta versão" }));
  const raw = Object.entries(snapshot().notes).find(([key]) =>
    key.startsWith(eventPrefix(revision.id)),
  )![1];
  expect(JSON.parse(String(raw))).toMatchObject({
    result: "ungraded",
    source: { activityId: argument.id, eventId: source.id, answers: source.answers },
  });
  expect(snapshot().notes[sourceKey]).toBe(JSON.stringify(source));
  expect(screen.getByText("Versão registrada · sem nota automática")).toBeInTheDocument();
});

it("keeps corrupted/future activity records byte-for-byte and permits draft work without replacement", () => {
  const key = eventPrefix(vocab.id) + "future";
  const raw = '{"v":2,"student":"Preserve"}';
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({ ...old, notes: { ...old.notes, [key]: raw } }),
  );
  renderActivity();
  fireEvent.click(screen.getByLabelText("Paz"));
  expect(screen.getByRole("alert")).toHaveTextContent("bytes foram preservados");
  expect(screen.getByRole("button", { name: "Conferir e registrar tentativa" })).toBeDisabled();
  expect(snapshot().notes[key]).toBe(raw);
  expect(snapshot().notes[answerKey(vocab.id, "choice")]).toBe("peace");
});

it("fails closed when a generated event identity is already occupied", () => {
  vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
    (array as Uint32Array).fill(1);
    return array;
  });
  const saved = newActivityEvent(vocab, { choice: "book" }, 1);
  const key = eventPrefix(vocab.id) + saved.id;
  const raw = JSON.stringify(saved);
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({ ...old, notes: { ...old.notes, [key]: raw } }),
  );
  renderActivity();
  fireEvent.click(screen.getByLabelText("Paz"));
  fireEvent.click(screen.getByRole("button", { name: "Conferir e registrar tentativa" }));
  expect(screen.getByRole("alert")).toHaveTextContent("já está ocupada");
  expect(snapshot().notes[key]).toBe(raw);
});

it("retains pending work on quota and flushes it after storage recovers", () => {
  renderActivity(grammar);
  const original = localStorage.getItem(PROGRESS_KEY);
  const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new DOMException("Full", "QuotaExceededError");
  });
  fireEvent.change(screen.getByLabelText("Forma de lernen com ich"), {
    target: { value: "Pending" },
  });
  expect(screen.getByLabelText("Forma de lernen com ich")).toHaveValue("Pending");
  expect(screen.getByRole("alert")).toHaveTextContent("não conseguiu salvar");
  expect(localStorage.getItem(PROGRESS_KEY)).toBe(original);
  write.mockRestore();
  fireEvent.change(screen.getByLabelText("Forma de lernen com ich"), {
    target: { value: "lerne" },
  });
  expect(snapshot()).toMatchObject(old);
  expect(snapshot().notes[answerKey(grammar.id, "verb")]).toBe("lerne");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("preserves corrupt root bytes before recovering an activity draft", () => {
  const raw = "{damaged legacy student notes";
  localStorage.setItem(PROGRESS_KEY, raw);
  renderActivity(grammar);
  fireEvent.change(screen.getByLabelText("Forma de lernen com ich"), {
    target: { value: "lerne" },
  });
  expect(
    Object.keys(localStorage)
      .filter((key) => key.startsWith(`${PROGRESS_KEY}-recovery-`))
      .map((key) => localStorage.getItem(key)),
  ).toContain(raw);
  expect(localStorage.getItem(`${PROGRESS_KEY}-recovery-1`)).toBe("{backup antigo");
  expect(snapshot().notes[answerKey(grammar.id, "verb")]).toBe("lerne");
});

it("does not replace an unreadable journal and retries pending text after manual recovery", () => {
  const key = fieldKey(answerKey(grammar.id, "verb"));
  localStorage.setItem(key, "{damaged journal");
  const original = localStorage.getItem(PROGRESS_KEY);
  renderActivity(grammar);
  fireEvent.change(screen.getByLabelText("Forma de lernen com ich"), {
    target: { value: "Pending" },
  });
  expect(localStorage.getItem(key)).toBe("{damaged journal");
  expect(localStorage.getItem(PROGRESS_KEY)).toBe(original);
  // Simulated manual restoration in a disposable test fixture, not an app feature.
  localStorage.setItem(
    key,
    JSON.stringify({
      v: 1,
      value: { kind: "note", id: answerKey(grammar.id, "verb"), value: "Restored" },
    }),
  );
  fireEvent.change(screen.getByLabelText("Forma de lernen com ich"), {
    target: { value: "lerne" },
  });
  expect(snapshot().notes[answerKey(grammar.id, "verb")]).toBe("lerne");
});

it("synchronizes distinct activity fields from sidecars even when the whole-document mirror is stale", () => {
  renderActivity(argument);
  const id = answerKey(argument.id, "premises");
  const raw = JSON.stringify({ v: 1, value: { kind: "note", id, value: "Other tab reasons" } });
  localStorage.setItem(fieldKey(id), raw);
  act(() => window.dispatchEvent(new StorageEvent("storage", { key: fieldKey(id) })));
  fireEvent.change(screen.getByLabelText("Tese e conclusão de cada argumento"), {
    target: { value: "My thesis" },
  });
  expect(screen.getByLabelText("Premissas e verdade das afirmações")).toHaveValue(
    "Other tab reasons",
  );
  expect(localStorage.getItem(fieldKey(id))).toBe(raw);
  expect(snapshot().notes[answerKey(argument.id, "thesis")]).toBe("My thesis");
});

it("protects server-rendered controls until hydration loads legacy drafts and installs handlers", async () => {
  const id = answerKey(grammar.id, "verb");
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({ ...old, notes: { ...old.notes, [id]: "lerne" } }),
  );
  const view = <ActivityWorkbench activity={grammar} now={0} onRecorded={() => {}} />;
  const container = document.createElement("div");
  document.body.append(container);
  container.innerHTML = renderToString(view);
  const input = container.querySelector("input")!;
  expect(input).toBeDisabled();
  await act(async () => {
    hydrated = hydrateRoot(container, view);
  });
  expect(input).toBeEnabled();
  expect(input).toHaveValue("lerne");
  fireEvent.change(input, { target: { value: "First safe edit" } });
  expect(snapshot().notes[id]).toBe("First safe edit");
  act(() => hydrated!.unmount());
  hydrated = undefined;
  container.remove();
});

it("allows pending edits after initialization with denied reads, preserving old bytes until recovery", () => {
  const original = localStorage.getItem(PROGRESS_KEY);
  const read = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new DOMException("Denied", "SecurityError");
  });
  renderActivity(grammar);
  fireEvent.change(screen.getByLabelText("Forma de lernen com ich"), {
    target: { value: "Pending" },
  });
  expect(screen.getByRole("alert")).toHaveTextContent("não conseguiu salvar");
  read.mockRestore();
  expect(localStorage.getItem(PROGRESS_KEY)).toBe(original);
  fireEvent.change(screen.getByLabelText("Forma de lernen com ich"), {
    target: { value: "lerne" },
  });
  expect(snapshot()).toMatchObject(old);
  expect(snapshot().notes[answerKey(grammar.id, "verb")]).toBe("lerne");
});

it("restores selection, answers and explicit completion without changing lesson totals", () => {
  const view = render(<MethodusDiscendi course="la" />);
  fireEvent.click(screen.getByRole("button", { name: /Casos: rosa e rosae · Pendente/ }));
  fireEvent.change(screen.getByLabelText("Nominativo singular (a rosa)"), {
    target: { value: "rosa" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Concluir por decisão própria" }));
  view.unmount();
  render(<MethodusDiscendi course="la" />);
  expect(screen.getByLabelText("Nominativo singular (a rosa)")).toHaveValue("rosa");
  expect(screen.getByRole("button", { name: "Reabrir atividade" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(snapshot().completed).toEqual(old.completed);
});

it("renders progressive ordering and open-response kinds with native labelled controls", () => {
  const ordering: Activity = {
    id: "fixture",
    revision: 1,
    course: "en",
    title: "Order",
    prompt: "Order",
    provenance: "Fixture",
    kind: "ordering",
    items: [
      { id: "p", label: "Premise" },
      { id: "c", label: "Conclusion" },
    ],
    order: ["p", "c"],
    explanation: "Reason first",
  };
  const changed = vi.fn();
  const view = render(<ActivityEditor activity={ordering} answers={{}} onChange={changed} />);
  fireEvent.change(screen.getByLabelText("Posição 1"), { target: { value: "p" } });
  expect(changed).toHaveBeenCalledWith("0", "p");
  view.unmount();
  render(
    <ActivityEditor
      activity={{
        ...ordering,
        kind: "open-response",
        fields: [{ id: "reason", label: "Sua razão" }],
        criteria: ["Justifique"],
        guide: "Examine",
      }}
      answers={{}}
      onChange={changed}
    />,
  );
  expect(screen.getByLabelText("Sua razão").tagName).toBe("TEXTAREA");
});

it("does not replace the active activity when another tab changes the saved resume selection", () => {
  render(<MethodusDiscendi course="la" />);
  fireEvent.click(screen.getByRole("button", { name: /Casos: rosa e rosae · Pendente/ }));
  fireEvent.change(screen.getByLabelText("Nominativo singular (a rosa)"), {
    target: { value: "rosa" },
  });
  const id = "methodus:v1:selected:la";
  localStorage.setItem(
    fieldKey(id),
    JSON.stringify({ v: 1, value: { kind: "note", id, value: "la-pax" } }),
  );
  act(() => window.dispatchEvent(new StorageEvent("storage", { key: fieldKey(id) })));
  expect(screen.getByLabelText("Nominativo singular (a rosa)")).toHaveValue("rosa");
  expect(screen.getByRole("heading", { name: /^Casos: rosa e rosae$/ })).toBeInTheDocument();
  expect(snapshot().notes[answerKey("la-rosa", "nominative")]).toBe("rosa");
});
