import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { BIBLIOGRAPHY } from "@/data/bibliography";
import { TRACKS } from "@/data/curriculum";
import { PATRISTICS_LESSONS } from "@/data/patristics";
import { PROGRESS_KEY } from "@/lib/progress";
import { ReferenceCard } from "@/routes/biblioteca";
import { LessonWorkshop } from "@/routes/formacao";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

const legacy = PATRISTICS_LESSONS.find((lesson) => lesson.id === "pat-1")!;
const illumination = PATRISTICS_LESSONS.find((lesson) => lesson.id === "pat-agostinho-iluminacao")!;
const completed = ["pat-1", "pla-1", "studium-prudencia"];
const legacyNotes = {
  "pat-1": "Minha comparação anterior entre si fallor, sum e o cogito",
  "pat-1:revision": "Minha revisão anterior",
  "pat-1:choice": "1",
  "pat-1:criterion:1": "yes",
  "pla-1": "Minha objeção sobre a linha dividida",
  "studium-prudencia:lectio": "Meu registro de leitura",
};

function seedLegacyProgress() {
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({ completed, notes: legacyNotes, custom: { preserve: ["future", 2] } }),
  );
}

describe("Augustine: independent reasoning, objection and revision", () => {
  it("retains the completed pat-1 answer and saves its revision, choice and criteria after remount", () => {
    seedLegacyProgress();
    const first = render(<LessonWorkshop lesson={legacy} />);
    expect(screen.getByLabelText("Seu raciocínio")).toHaveValue(legacyNotes["pat-1"]);
    expect(screen.getByLabelText("Sua revisão")).toHaveValue(legacyNotes["pat-1:revision"]);
    expect(screen.getByRole("button", { name: "Marcar como não concluída" })).toBeVisible();
    expect(screen.getByLabelText(legacy.study!.criteria[1]!)).toBeChecked();

    fireEvent.change(screen.getByLabelText("Sua revisão"), {
      target: { value: "A hipótese de erro não prova a imortalidade; explicitei esse limite." },
    });
    fireEvent.click(screen.getByLabelText(legacy.study!.criteria[0]!));
    fireEvent.click(screen.getByRole("button", { name: "Conferir análise do argumento" }));
    const correct = legacy.options!.find((option) => option.correct)!;
    expect(screen.getByRole("radio", { name: correct.text })).toBeChecked();

    first.unmount();
    render(<LessonWorkshop lesson={legacy} />);
    expect(screen.getByLabelText("Seu raciocínio")).toHaveValue(legacyNotes["pat-1"]);
    expect(screen.getByLabelText("Sua revisão")).toHaveValue(
      "A hipótese de erro não prova a imortalidade; explicitei esse limite.",
    );
    expect(screen.getByLabelText(legacy.study!.criteria[0]!)).toBeChecked();
    expect(screen.getByLabelText(legacy.study!.criteria[1]!)).toBeChecked();
    expect(screen.getByRole("button", { name: "Marcar como não concluída" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Conferir análise do argumento" }));
    expect(screen.getByRole("radio", { name: correct.text })).toBeChecked();

    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY)!);
    expect(saved.completed).toEqual(completed);
    expect(saved.notes).toMatchObject({
      ...legacyNotes,
      "pat-1:revision": "A hipótese de erro não prova a imortalidade; explicitei esse limite.",
      "pat-1:criterion:0": "yes",
    });
    expect(saved.custom).toEqual({ preserve: ["future", 2] });
  });

  it("stores the new illumination workshop independently without replacing pat-1 or other progress", () => {
    seedLegacyProgress();
    const first = render(<LessonWorkshop lesson={illumination} />);
    expect(screen.getByLabelText("Seu raciocínio")).toHaveValue("");
    expect(screen.getByLabelText("Sua revisão")).toHaveValue("");
    expect(screen.getByLabelText(illumination.study!.criteria[0]!)).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Marcar como concluída" })).toBeVisible();

    fireEvent.change(screen.getByLabelText("Seu raciocínio"), {
      target: { value: "A relação de áreas exige demonstração; a data exige documentos." },
    });
    fireEvent.change(screen.getByLabelText("Sua revisão"), {
      target: { value: "Reconstruí a aptidão criada e perguntei se ela explica a compreensão." },
    });
    fireEvent.click(screen.getByLabelText(illumination.study!.criteria[0]!));
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).completed).toEqual(completed);
    fireEvent.click(screen.getByRole("button", { name: "Marcar como concluída" }));

    first.unmount();
    render(<LessonWorkshop lesson={illumination} />);
    expect(screen.getByLabelText("Seu raciocínio")).toHaveValue(
      "A relação de áreas exige demonstração; a data exige documentos.",
    );
    expect(screen.getByLabelText("Sua revisão")).toHaveValue(
      "Reconstruí a aptidão criada e perguntei se ela explica a compreensão.",
    );
    expect(screen.getByLabelText(illumination.study!.criteria[0]!)).toBeChecked();
    expect(screen.getByRole("button", { name: "Marcar como não concluída" })).toBeVisible();

    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY)!);
    expect(saved.completed).toEqual([...completed, illumination.id]);
    expect(saved.notes).toMatchObject(legacyNotes);
    expect(saved.notes[`${illumination.id}:criterion:0`]).toBe("yes");
    expect(saved.custom).toEqual({ preserve: ["future", 2] });
  });

  it.each(PATRISTICS_LESSONS)(
    "requires an attempt before analysis and explains every option in $title",
    (lesson) => {
      render(<LessonWorkshop lesson={lesson} />);
      const reveal = screen.getByRole("button", { name: "Conferir análise do argumento" });
      expect(reveal).toBeDisabled();
      expect(reveal).toHaveAttribute("aria-expanded", "false");
      fireEvent.change(screen.getByLabelText("Seu raciocínio"), { target: { value: "   " } });
      expect(reveal).toBeDisabled();
      expect(screen.queryByRole("region", { name: "Análise orientadora" })).not.toBeInTheDocument();
      expect(screen.queryByRole("radio")).not.toBeInTheDocument();

      fireEvent.change(screen.getByLabelText("Seu raciocínio"), {
        target: { value: "Minha reconstrução identifica premissas, uma objeção e seu alcance." },
      });
      expect(reveal).toBeEnabled();
      fireEvent.click(reveal);
      expect(reveal).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByRole("region", { name: "Análise orientadora" })).toBeVisible();
      const options = lesson.options!;
      expect(options.filter((option) => option.correct)).toHaveLength(1);
      const confrontation = within(screen.getByRole("group", { name: "Confronte sua conclusão" }));
      expect(confrontation.getAllByRole("radio")).toHaveLength(options.length);
      for (const [index, option] of options.entries()) {
        expect(option.why.trim()).not.toBe("");
        fireEvent.click(confrontation.getByRole("radio", { name: option.text }));
        expect(confrontation.getByRole("radio", { name: option.text })).toBeChecked();
        expect(confrontation.getByRole("status")).toHaveTextContent(option.why);
        expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).notes[`${lesson.id}:choice`]).toBe(
          String(index),
        );
      }
    },
  );

  it.each(PATRISTICS_LESSONS)("provides an accessible comparison in $title", (lesson) => {
    render(<LessonWorkshop lesson={lesson} />);
    const comparison = lesson.study!.comparison!;
    const table = within(screen.getByRole("table", { name: comparison.caption }));
    expect(table.getAllByRole("columnheader").map((header) => header.textContent)).toEqual(
      comparison.columns,
    );
    expect(table.getAllByRole("rowheader").map((header) => header.textContent)).toEqual(
      comparison.rows.map((row) => row[0]),
    );
    for (const header of table.getAllByRole("columnheader"))
      expect(header).toHaveAttribute("scope", "col");
    for (const header of table.getAllByRole("rowheader"))
      expect(header).toHaveAttribute("scope", "row");
    const region = screen.getByRole("region", { name: comparison.caption });
    expect(region).toHaveAttribute("tabindex", "0");
    region.focus();
    expect(region).toHaveFocus();
  });
});

describe("patristic sources and curriculum compatibility", () => {
  it("exposes both workshops in the curriculum and resolves their reference and disputatio links", () => {
    expect(TRACKS.find((track) => track.id === "patristica")!.lessons).toEqual(PATRISTICS_LESSONS);
    expect(legacy.title).toBe("Agostinho: crede ut intelligas");
    for (const lesson of PATRISTICS_LESSONS) {
      const view = render(<LessonWorkshop lesson={lesson} />);
      const references = lesson.study!.referenceIds;
      expect(references.length).toBeGreaterThan(0);
      for (const id of references)
        expect(BIBLIOGRAPHY.filter((source) => source.id === id)).toHaveLength(1);
      const navigation = within(screen.getByRole("navigation", { name: "Referências da aula" }));
      expect(navigation.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual(
        references.map((id) => `/biblioteca#${id}`),
      );
      expect(screen.getByRole("link", { name: lesson.study!.practice!.label })).toHaveAttribute(
        "href",
        "/disputatio#sua-disputatio",
      );
      view.unmount();
    }
  });

  it("identifies the 472-page Trinity as a partially consulted reference without a PDF link", () => {
    const source = BIBLIOGRAPHY.find((item) => item.id === "agostinho-trindade")!;
    expect(source.verificacao).toBe("parcial");
    expect(source.origemVerificacao).toBe("anexo-inspecao-parcial");
    expect(source.statusDisponibilidade).toBe("referencia");
    render(<ReferenceCard source={source} />);
    expect(screen.getByText(/472 páginas/)).toHaveTextContent(/consulta parcial/i);
    expect(screen.getByText(/472 páginas/)).toHaveTextContent("X, 10, 14");
    expect(screen.getByText(/472 páginas/)).toHaveTextContent("XII, 15, 24");
    expect(screen.getByText(/Catalogada · referência bibliográfica/)).toBeVisible();
    expect(screen.getByText(/O PDF não é disponibilizado nesta página/)).toBeVisible();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("marks Descartes as a complementary, partially consulted comparison without a PDF link", () => {
    const source = BIBLIOGRAPHY.find((item) => item.id === "descartes-metodo")!;
    expect(source.verificacao).toBe("parcial");
    expect(source.origemVerificacao).toBe("fonte-publica-consulta-parcial");
    expect(source.statusDisponibilidade).toBe("referencia");
    expect(source.papelCurricular).toBe("complementar");
    render(<ReferenceCard source={source} />);
    expect(screen.getByText(/Consulta parcial do início da parte IV/)).toBeVisible();
    expect(
      screen.getByText(/Leitura complementar: não constitui doutrina católica oficial/),
    ).toBeVisible();
    expect(screen.getByText(/O PDF não é disponibilizado nesta página/)).toBeVisible();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
