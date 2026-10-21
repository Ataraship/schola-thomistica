import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { BIBLIOGRAPHY, EXISTING_REFERENCES, NEW_REFERENCES } from "@/data/bibliography";
import { TRACKS } from "@/data/curriculum";
import { PROGRESS_KEY } from "@/lib/progress";
import { ReferenceCard } from "@/routes/biblioteca";
import { LessonWorkshop } from "@/routes/formacao";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

const lessons = TRACKS.flatMap((track) => track.lessons).filter((lesson) =>
  ["ari-1", "met-1"].includes(lesson.id),
);

describe("causal explanation and act/potency workshops", () => {
  it.each(lessons)(
    "retains legacy work and independently saves the argument and revision in $title",
    (lesson) => {
      const other = lessons.find((item) => item.id !== lesson.id)!;
      const originalNotes = {
        "ari-1": "Minha resposta antiga sobre a árvore",
        "met-1": "Minha reconstrução antiga de Parmênides",
        "ari-1:revision": "Revisão anterior das causas",
        "met-1:revision": "Revisão anterior da mudança",
        "pla-1": "Minha objeção platônica",
        "studium-prudencia:lectio": "Meu registro de leitura",
        [`${other.id}:criterion:0`]: "yes",
      };
      const completed = ["ari-1", "met-1", "pla-1", "studium-prudencia"];
      localStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({ completed, notes: originalNotes, custom: { keep: ["future", 2] } }),
      );
      const first = render(<LessonWorkshop lesson={lesson} />);
      expect(screen.getByLabelText("Seu raciocínio")).toHaveValue(
        originalNotes[lesson.id as "ari-1" | "met-1"],
      );
      expect(screen.getByLabelText("Sua revisão")).toHaveValue(
        originalNotes[`${lesson.id}:revision` as "ari-1:revision" | "met-1:revision"],
      );
      expect(screen.getByRole("button", { name: "Marcar como não concluída" })).toBeVisible();
      const reveal = screen.getByRole("button", { name: "Conferir análise do argumento" });
      fireEvent.change(screen.getByLabelText("Seu raciocínio"), { target: { value: "   " } });
      expect(reveal).toBeDisabled();
      expect(screen.queryByRole("radio")).not.toBeInTheDocument();
      fireEvent.change(screen.getByLabelText("Seu raciocínio"), {
        target: { value: `Meu argumento revisto: ${lesson.id}` },
      });
      fireEvent.click(reveal);
      expect(screen.getByRole("region", { name: "Análise orientadora" })).toBeVisible();
      const correct = lesson.options!.filter((option) => option.correct);
      expect(correct).toHaveLength(1);
      fireEvent.click(screen.getByRole("radio", { name: correct[0]!.text }));
      expect(
        within(screen.getByRole("group", { name: "Confronte sua conclusão" })).getByRole("status"),
      ).toHaveTextContent(correct[0]!.why);
      fireEvent.change(screen.getByLabelText("Sua revisão"), {
        target: { value: `Meu juízo após a objeção: ${lesson.id}` },
      });
      fireEvent.click(screen.getByLabelText(lesson.study!.criteria[0]!));
      const sources = within(screen.getByRole("navigation", { name: "Referências da aula" }));
      expect(sources.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual(
        lesson.study!.referenceIds.map((id) => `/biblioteca#${id}`),
      );
      expect(sources.queryByRole("link", { name: /Lógica e Dialética/ })).not.toBeInTheDocument();
      first.unmount();
      render(<LessonWorkshop lesson={lesson} />);
      expect(screen.getByLabelText("Seu raciocínio")).toHaveValue(
        `Meu argumento revisto: ${lesson.id}`,
      );
      expect(screen.getByLabelText("Sua revisão")).toHaveValue(
        `Meu juízo após a objeção: ${lesson.id}`,
      );
      expect(screen.getByLabelText(lesson.study!.criteria[0]!)).toBeChecked();
      const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY)!);
      expect(saved.completed).toEqual(completed);
      expect(saved.notes[other.id]).toBe(originalNotes[other.id as "ari-1" | "met-1"]);
      expect(saved.notes[`${other.id}:revision`]).toBe(
        originalNotes[`${other.id}:revision` as "ari-1:revision" | "met-1:revision"],
      );
      expect(saved.notes[`${other.id}:criterion:0`]).toBe("yes");
      expect(saved.notes["pla-1"]).toBe(originalNotes["pla-1"]);
      expect(saved.notes["studium-prudencia:lectio"]).toBe(
        originalNotes["studium-prudencia:lectio"],
      );
      expect(saved.custom).toEqual({ keep: ["future", 2] });
    },
  );

  it.each(lessons)("provides a named, keyboard-focusable comparison for $title", (lesson) => {
    render(<LessonWorkshop lesson={lesson} />);
    const caption = lesson.study!.comparison!.caption;
    const table = within(screen.getByRole("table", { name: caption }));
    expect(table.getAllByRole("columnheader")).toHaveLength(3);
    expect(table.getAllByRole("rowheader")).toHaveLength(4);
    for (const header of table.getAllByRole("columnheader"))
      expect(header).toHaveAttribute("scope", "col");
    for (const header of table.getAllByRole("rowheader"))
      expect(header).toHaveAttribute("scope", "row");
    expect(screen.getByRole("region", { name: caption })).toHaveAttribute("tabindex", "0");
  });
});

describe("bibliographic scope and curriculum compatibility", () => {
  it("identifies the private Physics as a partially consulted Spanish reference without a download", () => {
    const source = BIBLIOGRAPHY.find((item) => item.id === "aristoteles-fisica")!;
    expect(source.idioma).toBe("Espanhol");
    expect(source.verificacao).toBe("parcial");
    expect(source.origemVerificacao).toBe("anexo-inspecao-parcial");
    expect(source.statusDisponibilidade).toBe("referencia");
    render(<ReferenceCard source={source} />);
    expect(screen.getByText(/321 páginas/)).toHaveTextContent("Consulta parcial");
    expect(screen.getByText(/Catalogada · referência bibliográfica/)).toBeVisible();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("distinguishes the public consultation of Metaphysics IX from the private books I–III", () => {
    const source = BIBLIOGRAPHY.find((item) => item.id === "aristoteles-metafisica")!;
    expect(source.verificacao).toBe("parcial");
    expect(source.origemVerificacao).toBe("fonte-publica-consulta-parcial");
    expect(source.cobertura).toContain("Θ (IX)");
    expect(source.notasDeVerificacao.join(" ")).toContain("ANGAML-3 reúne livros I–III");
    render(<ReferenceCard source={source} />);
    expect(screen.getByText(/Catalogada · referência bibliográfica/)).toBeVisible();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("preserves existing lesson IDs and titles alongside the illumination lesson and reference sets", () => {
    expect(
      TRACKS.flatMap((track) => track.lessons.map((lesson) => [lesson.id, lesson.title])),
    ).toEqual([
      ["log-1", "Termo, proposição e argumento"],
      ["log-juizo", "Juízo e proposição: o que está sendo afirmado?"],
      ["log-definicao", "Definição: delimitar sem decidir por decreto"],
      ["log-2", "O silogismo categórico"],
      ["log-validade", "Validade, verdade e o alcance de uma prova"],
      ["log-falacias", "Falácias: diagnosticar e corrigir uma razão"],
      ["log-dialetica", "Dialética: da objeção ao juízo revisto"],
      ["pla-1", "Opinião e conhecimento"],
      ["pla-menon", "Mênon: como investigar o que ainda não sabemos?"],
      ["ari-1", "As quatro causas"],
      ["met-1", "Ato e potência"],
      ["pat-1", "Agostinho: crede ut intelligas"],
      ["pat-agostinho-iluminacao", "Iluminação: compreender não é recordar uma vida anterior"],
      ["tom-1", "Como ler um artigo da Suma"],
    ]);
    expect(EXISTING_REFERENCES).toHaveLength(9);
    expect(NEW_REFERENCES.map((source) => source.id)).toEqual(
      Array.from({ length: 10 }, (_, index) => `REF-2026-${String(index + 1).padStart(2, "0")}`),
    );
    expect(new Set(BIBLIOGRAPHY.map((source) => source.id)).size).toBe(BIBLIOGRAPHY.length);
  });
});
