import { act, fireEvent, within } from "@testing-library/react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StudiumFontium } from "@/components/StudiumFontium";
import { LessonWorkshop } from "@/routes/formacao";
import { Idiomas } from "@/routes/idiomas";
import { TRACKS } from "@/data/curriculum";

const KEY = "schola-progress-v1";
let root: Root | undefined;
let container: HTMLDivElement;

beforeEach(() => {
  localStorage.clear();
  container = document.createElement("div");
  document.body.append(container);
});
afterEach(() => {
  if (root) act(() => root!.unmount());
  root = undefined;
  container.remove();
  vi.restoreAllMocks();
});

describe("progress initialization across server rendering and hydration", () => {
  const views = [
    {
      name: "Studium",
      view: <StudiumFontium />,
      controls: "textarea, input[type=checkbox], button[aria-pressed]",
    },
    {
      name: "lesson",
      view: <LessonWorkshop lesson={TRACKS[0]!.lessons[0]!} />,
      controls: "textarea, input, button.btn-green.mt-5",
    },
    {
      name: "language selection",
      view: <Idiomas />,
      controls: '[aria-label="Cursos de idiomas"] button',
    },
  ];

  it.each(views)(
    "does not accept $name progress input before the client is initialized",
    ({ view, controls }) => {
      container.innerHTML = renderToString(view);
      const inputs = container.querySelectorAll(controls);
      expect(inputs.length).toBeGreaterThan(0);
      for (const input of inputs) expect(input).toBeDisabled();
      expect(localStorage.getItem(KEY)).toBeNull();
    },
  );

  it("loads legacy work before enabling input, then journals the first edit and retains unrelated bytes", async () => {
    const legacy = {
      completed: ["log-1"],
      notes: { "studium-imagens:lectio": "Leitura antiga" },
      future: { retain: true },
    };
    localStorage.setItem(KEY, JSON.stringify(legacy));
    localStorage.setItem(`${KEY}-recovery-111`, "{backup antigo");
    localStorage.setItem("schola-disputatio-v1", '{"tese":"Tese alheia"}');
    container.innerHTML = renderToString(<StudiumFontium />);
    const field = container.querySelector<HTMLTextAreaElement>('[id="studium-imagens:lectio"]')!;
    expect(field).toBeDisabled();
    await act(async () => {
      root = hydrateRoot(container, <StudiumFontium />);
    });
    expect(field).toBeEnabled();
    expect(field).toHaveValue("Leitura antiga");
    const changed = vi.fn();
    window.addEventListener("schola-progress-changed", changed);
    try {
      fireEvent.change(field, { target: { value: "Primeira edição segura" } });
      expect(changed).toHaveBeenCalled();
      expect(JSON.parse(localStorage.getItem(KEY)!)).toMatchObject({
        ...legacy,
        notes: { "studium-imagens:lectio": "Primeira edição segura" },
      });
      expect(
        JSON.parse(localStorage.getItem(`${KEY}:field:note%3Astudium-imagens%3Alectio`)!),
      ).toEqual({
        v: 1,
        value: { kind: "note", id: "studium-imagens:lectio", value: "Primeira edição segura" },
      });
      expect(localStorage.getItem(`${KEY}-recovery-111`)).toBe("{backup antigo");
      expect(localStorage.getItem("schola-disputatio-v1")).toBe('{"tese":"Tese alheia"}');
    } finally {
      window.removeEventListener("schola-progress-changed", changed);
    }
  });

  it("still allows pending edits and recovery when storage cannot be read during initialization", async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ completed: ["log-1"], notes: { "log-1": "Anterior" } }),
    );
    container.innerHTML = renderToString(<StudiumFontium />);
    const read = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Denied", "SecurityError");
    });
    await act(async () => {
      root = hydrateRoot(container, <StudiumFontium />);
    });
    const field = container.querySelector<HTMLTextAreaElement>('[id="studium-imagens:lectio"]')!;
    expect(field).toBeEnabled();
    fireEvent.change(field, { target: { value: "Rascunho pendente" } });
    expect(field).toHaveValue("Rascunho pendente");
    expect(within(container).getByRole("alert")).toHaveTextContent("não conseguiu salvar");
    read.mockRestore();
    expect(JSON.parse(localStorage.getItem(KEY)!).notes).toEqual({ "log-1": "Anterior" });
    fireEvent.change(field, { target: { value: "Rascunho recuperado" } });
    expect(JSON.parse(localStorage.getItem(KEY)!)).toMatchObject({
      completed: ["log-1"],
      notes: { "log-1": "Anterior", "studium-imagens:lectio": "Rascunho recuperado" },
    });
    expect(within(container).queryByRole("alert")).not.toBeInTheDocument();
  });
});
