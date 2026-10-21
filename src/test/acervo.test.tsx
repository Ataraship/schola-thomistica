import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NEW_REFERENCES, EXISTING_REFERENCES } from "@/data/bibliography";
import { TRACKS } from "@/data/curriculum";
import { GERMAN_PATHS } from "@/data/language-paths";
import { ReferenceCard } from "@/routes/biblioteca";
import { LessonWorkshop } from "@/routes/formacao";
import { StudiumFontium } from "@/components/StudiumFontium";
import { PROGRESS_KEY } from "@/lib/progress";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("issue 1: bibliographic integrity", () => {
  it("adds exactly ten partially verified references and preserves the existing catalogue", () => {
    expect(NEW_REFERENCES.map((source) => source.id)).toEqual(
      Array.from({ length: 10 }, (_, index) => `REF-2026-${String(index + 1).padStart(2, "0")}`),
    );
    expect(EXISTING_REFERENCES).toHaveLength(9);
    for (const source of NEW_REFERENCES) {
      expect(source.statusDisponibilidade).toBe("referencia");
      expect(source.verificacao).toBe("parcial");
      expect(source.notasDeVerificacao.length).toBeGreaterThan(0);
      expect(source.direitos).not.toBe("");
    }
    expect(
      NEW_REFERENCES.filter((source) => source.papelCurricular === "complementar").map(
        (source) => source.id,
      ),
    ).toEqual(["REF-2026-09", "REF-2026-10"]);
  });
  it("identifies partial ethics coverage and canon law instead of relying on uploaded filenames", () => {
    const ethics = NEW_REFERENCES.find((source) => source.id === "REF-2026-02")!;
    expect(ethics.cobertura).toContain("VI–X");
    expect(ethics.cobertura).toContain("Não cobre os livros I–V");
    const canon = NEW_REFERENCES.find((source) => source.id === "REF-2026-08")!;
    render(<ReferenceCard source={canon} />);
    expect(screen.getByRole("heading")).toHaveTextContent("Codex iuris canonici");
    expect(canon.categoria).toBe("direito-canonico");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(/Catalogada · referência bibliográfica/)).toBeInTheDocument();
  });
  it("keeps the unmatched Teil 1 distinct from the planned intermediate Teil 3", () => {
    const source = NEW_REFERENCES.find((item) => item.id === "REF-2026-05")!;
    expect(source.titulo).toContain("Teil 3");
    expect(source.notasDeVerificacao.join(" ")).toContain("180 páginas");
    expect(GERMAN_PATHS.find((path) => path.id === "inicial")!.references).not.toContain(source.id);
    expect(GERMAN_PATHS.find((path) => path.id === "intermediario")!.references).toContain(
      source.id,
    );
    expect(GERMAN_PATHS.find((path) => path.id === "gotico")!.optional).toBe(true);
    expect(GERMAN_PATHS.find((path) => path.id === "gotico")!.references).toEqual(["REF-2026-07"]);
  });
});

describe("original logic sequence", () => {
  const lessons = TRACKS.find((track) => track.id === "logica")!.lessons;
  it("preserves legacy lessons and progresses from concepts to validity with unambiguous alternatives", () => {
    expect(lessons.map((lesson) => lesson.id)).toEqual([
      "log-1",
      "log-juizo",
      "log-definicao",
      "log-2",
      "log-validade",
    ]);
    const invalid = lessons[0]!;
    const valid = lessons.at(-1)!;
    expect(invalid.study!.argument.analysis).toContain("inferência é inválida");
    expect(invalid.study!.argument.analysis).toContain("proposições são verdadeiras");
    expect(valid.study!.argument.analysis).toContain("primeira premissa é falsa");
    expect(valid.study!.argument.analysis).toContain("é válido");
    for (const lesson of [invalid, valid])
      expect(lesson.options!.filter((option) => option.correct)).toHaveLength(1);
  });
  it("requires an attempt before guidance and preserves old notes, choices and revision", () => {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ completed: ["log-2"], notes: { "log-2": "Minha resposta antiga" } }),
    );
    const first = render(<LessonWorkshop lesson={lessons[0]!} />);
    const reveal = screen.getByRole("button", { name: "Conferir análise do argumento" });
    expect(reveal).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Seu raciocínio"), {
      target: { value: "Um cavalo é mortal e não é homem." },
    });
    fireEvent.click(reveal);
    expect(screen.getByRole("region", { name: "Análise orientadora" })).toBeVisible();
    fireEvent.click(
      screen.getByRole("radio", { name: "Não: o termo médio 'mortal' não é distribuído." }),
    );
    fireEvent.change(screen.getByLabelText("Sua revisão"), {
      target: { value: "Verdade e validade são avaliações distintas." },
    });
    first.unmount();
    render(<LessonWorkshop lesson={lessons[0]!} />);
    expect(screen.getByLabelText("Seu raciocínio")).toHaveValue(
      "Um cavalo é mortal e não é homem.",
    );
    expect(screen.getByLabelText("Sua revisão")).toHaveValue(
      "Verdade e validade são avaliações distintas.",
    );
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY)!);
    expect(saved.notes["log-2"]).toBe("Minha resposta antiga");
    expect(saved.notes["log-1:choice"]).toBe("1");
    expect(saved.completed).toEqual(["log-2"]);
  });
});

describe("Studium Fontium", () => {
  it("offers all five stages freely and retains replies and self-assessment after remounting", () => {
    const first = render(<StudiumFontium />);
    const stages = ["Lectio", "Quaestio", "Argumentatio", "Disputatio", "Iudicium"];
    for (const stage of stages) {
      const field = screen.getByLabelText(`Seu registro · ${stage}`);
      expect(field).toBeEnabled();
      fireEvent.change(field, { target: { value: `Rascunho ${stage}` } });
    }
    const criterion = screen.getAllByRole("checkbox")[0]!;
    fireEvent.click(criterion);
    fireEvent.click(screen.getByRole("button", { name: "Marcar atividade como concluída" }));
    first.unmount();
    render(<StudiumFontium />);
    for (const stage of stages)
      expect(screen.getByLabelText(`Seu registro · ${stage}`)).toHaveValue(`Rascunho ${stage}`);
    expect(screen.getAllByRole("checkbox")[0]).toBeChecked();
    expect(screen.getByRole("button", { name: "Reabrir atividade para revisão" })).toBeVisible();
    expect(screen.getByText(/não corrige automaticamente/)).toBeInTheDocument();
  });
});
