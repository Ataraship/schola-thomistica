import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { TRACKS } from "@/data/curriculum";
import { PROGRESS_KEY } from "@/lib/progress";
import { LessonWorkshop } from "@/routes/formacao";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("fallacies and dialectic practice", () => {
  const lessons = TRACKS.find((track) => track.id === "logica")!.lessons;
  const fallacies = lessons.find((lesson) => lesson.id === "log-falacias")!;
  const dialectic = lessons.find((lesson) => lesson.id === "log-dialetica")!;

  it("requires a written diagnosis before revealing feedback and retains its revision separately from dialectic", () => {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        completed: ["log-2", "studium-prudencia"],
        notes: { "log-2": "Antigo", "log-dialetica": "Minha objeção" },
      }),
    );
    const first = render(<LessonWorkshop lesson={fallacies} />);
    const reveal = screen.getByRole("button", { name: "Conferir análise do argumento" });
    expect(reveal).toBeDisabled();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Seu raciocínio"), {
      target: { value: "Banco muda de sentido entre as premissas." },
    });
    fireEvent.click(reveal);
    expect(screen.getByRole("region", { name: "Análise orientadora" })).toHaveTextContent(
      "não ligam o assento a operações financeiras",
    );
    const correct = fallacies.options!.filter((option) => option.correct);
    expect(correct).toHaveLength(1);
    fireEvent.click(screen.getByRole("radio", { name: correct[0]!.text }));
    expect(
      within(screen.getByRole("group", { name: "Confronte sua conclusão" })).getByRole("status"),
    ).toHaveTextContent("um termo médio comum");
    fireEvent.change(screen.getByLabelText("Sua revisão"), {
      target: { value: "Refutar uma razão não demonstra a tese contrária." },
    });
    fireEvent.click(screen.getByLabelText(fallacies.study!.criteria[0]!));
    first.unmount();
    const second = render(<LessonWorkshop lesson={dialectic} />);
    expect(screen.getByLabelText("Seu raciocínio")).toHaveValue("Minha objeção");
    expect(screen.getByLabelText("Sua revisão")).toHaveValue("");
    expect(screen.getByRole("link", { name: "Escrever e revisar sua Disputatio" })).toHaveAttribute(
      "href",
      "/disputatio#sua-disputatio",
    );
    second.unmount();
    render(<LessonWorkshop lesson={fallacies} />);
    expect(screen.getByLabelText("Sua revisão")).toHaveValue(
      "Refutar uma razão não demonstra a tese contrária.",
    );
    expect(screen.getByLabelText(fallacies.study!.criteria[0]!)).toBeChecked();
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY)!);
    expect(saved.completed).toEqual(["log-2", "studium-prudencia"]);
    expect(saved.notes["log-2"]).toBe("Antigo");
    expect(saved.notes["log-dialetica"]).toBe("Minha objeção");
  });
});
