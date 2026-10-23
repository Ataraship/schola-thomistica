import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  BIBLIOGRAPHY,
  EXISTING_REFERENCES,
  NEW_REFERENCES,
  STUDY_REFERENCES,
} from "@/data/bibliography";
import { TRACKS } from "@/data/curriculum";
import { PROGRESS_KEY } from "@/lib/progress";
import { ReferenceCard } from "@/routes/biblioteca";
import { LessonWorkshop } from "@/routes/formacao";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("Plato: reconstruction, objection and revision", () => {
  const lessons = TRACKS.find((track) => track.id === "platao")!.lessons;

  it.each(lessons)(
    "retains legacy work and independent revisions in $title, with feedback after a written attempt",
    (lesson) => {
      localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({
          completed: ["pla-1", "log-2", "studium-prudencia"],
          notes: {
            "pla-1": "Minha objeção aristotélica anterior",
            "log-2": "Barbara",
            "studium-prudencia:lectio": "Meu registro",
          },
          custom: { preserve: true },
        }),
      );
      const first = render(<LessonWorkshop lesson={lesson} />);
      expect(screen.getByLabelText("Seu raciocínio")).toHaveValue(
        lesson.id === "pla-1" ? "Minha objeção aristotélica anterior" : "",
      );
      const reveal = screen.getByRole("button", { name: "Conferir análise do argumento" });
      fireEvent.change(screen.getByLabelText("Seu raciocínio"), { target: { value: "   " } });
      expect(reveal).toBeDisabled();
      expect(screen.queryByRole("radio")).not.toBeInTheDocument();
      fireEvent.change(screen.getByLabelText("Seu raciocínio"), {
        target: { value: `Reconstrução própria: ${lesson.id}` },
      });
      fireEvent.click(reveal);
      const analysis = screen.getByRole("region", { name: "Análise orientadora" });
      expect(analysis).toBeVisible();
      const options = lesson.options!;
      expect(options.filter((option) => option.correct)).toHaveLength(1);
      const correct = options.find((option) => option.correct)!;
      fireEvent.click(screen.getByRole("radio", { name: correct.text }));
      expect(
        within(screen.getByRole("group", { name: "Confronte sua conclusão" })).getByRole("status"),
      ).toHaveTextContent(correct.why);
      fireEvent.change(screen.getByLabelText("Sua revisão"), {
        target: { value: `Revisão própria: ${lesson.id}` },
      });
      fireEvent.click(screen.getByLabelText(lesson.study!.criteria[0]!));
      const sources = within(screen.getByRole("navigation", { name: "Referências da aula" }));
      expect(sources.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual(
        lesson.study!.referenceIds.map((id) => `/biblioteca#${id}`),
      );
      expect(sources.queryByRole("link", { name: /Lógica e Dialética/ })).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: lesson.study!.practice!.label })).toHaveAttribute(
        "href",
        "/disputatio#sua-disputatio",
      );
      first.unmount();
      render(<LessonWorkshop lesson={lesson} />);
      expect(screen.getByLabelText("Seu raciocínio")).toHaveValue(
        `Reconstrução própria: ${lesson.id}`,
      );
      expect(screen.getByLabelText("Sua revisão")).toHaveValue(`Revisão própria: ${lesson.id}`);
      expect(screen.getByLabelText(lesson.study!.criteria[0]!)).toBeChecked();
      const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY)!);
      expect(saved.completed).toEqual(["pla-1", "log-2", "studium-prudencia"]);
      expect(saved.notes["log-2"]).toBe("Barbara");
      expect(saved.notes["studium-prudencia:lectio"]).toBe("Meu registro");
      expect(saved.custom).toEqual({ preserve: true });
      if (lesson.id === "pla-menon")
        expect(saved.notes["pla-1"]).toBe("Minha objeção aristotélica anterior");
    },
  );

  it("renders the four activities of the divided line as a named table with scoped headers", () => {
    render(<LessonWorkshop lesson={lessons.find((lesson) => lesson.id === "pla-1")!} />);
    const table = within(screen.getByRole("table", { name: /A linha dividida/ }));
    expect(table.getAllByRole("columnheader").map((header) => header.textContent)).toEqual([
      "Atividade",
      "O que considera",
      "Como procede",
    ]);
    expect(table.getAllByRole("rowheader").map((header) => header.textContent)).toEqual([
      "Eikasía · imagens",
      "Pístis · crença",
      "Diánoia · pensamento discursivo",
      "Nóesis · intelecção",
    ]);
    for (const header of table.getAllByRole("rowheader"))
      expect(header).toHaveAttribute("scope", "row");
    expect(screen.getByRole("region", { name: /A linha dividida/ })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByText(/não designa aqui a virtude teologal da fé/)).toBeVisible();
  });
});

describe("source integrity for Plato and existing lessons", () => {
  it("keeps the original catalogues and links every study to existing references", () => {
    expect(EXISTING_REFERENCES).toHaveLength(9);
    expect(NEW_REFERENCES).toHaveLength(10);
    expect(new Set(BIBLIOGRAPHY.map((source) => source.id)).size).toBe(BIBLIOGRAPHY.length);
    for (const track of TRACKS)
      for (const lesson of track.lessons)
        if (lesson.study) {
          expect(lesson.study.referenceIds.length).toBeGreaterThan(0);
          for (const id of lesson.study.referenceIds)
            expect(BIBLIOGRAPHY.some((source) => source.id === id)).toBe(true);
        }
    expect(TRACKS.find((track) => track.id === "platao")!.lessons[0]!.id).toBe("pla-1");
  });

  it("catalogues the private Meno as a partially checked excerpt without a download", () => {
    const meno = STUDY_REFERENCES.find((source) => source.id === "platao-menon")!;
    expect(meno.statusDisponibilidade).toBe("referencia");
    expect(meno.verificacao).toBe("parcial");
    render(<ReferenceCard source={meno} />);
    expect(screen.getByText(/34 páginas/)).toHaveTextContent("Não é o Mênon integral");
    expect(screen.getByText(/Catalogada · referência bibliográfica/)).toBeVisible();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(meno.notasDeVerificacao.join(" ")).toContain("97–98");
  });
});
