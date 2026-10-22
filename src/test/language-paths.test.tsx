import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Idiomas } from "@/routes/idiomas";
import { PROGRESS_KEY } from "@/lib/progress";

beforeEach(() => localStorage.clear());
afterEach(cleanup);
describe("German paths", () => {
  it("keeps intermediate and optional historical readings freely selectable with separate drafts", () => {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ completed: ["log-1"], notes: { "log-1": "Resposta legada" } }),
    );
    const first = render(<Idiomas />);
    fireEvent.click(screen.getByRole("button", { name: "Alemão" }));
    fireEvent.click(
      screen.getByRole("button", {
        name: "Alemão intermediário · leitura e argumento",
      }),
    );
    fireEvent.change(screen.getByLabelText("Sua análise do percurso"), {
      target: { value: "Weil apresenta uma oração causal." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Leitura gótica · eletiva histórica" }));
    expect(screen.getByLabelText("Sua análise do percurso")).toHaveValue("");
    fireEvent.change(screen.getByLabelText("Sua análise do percurso"), {
      target: { value: "Leſen é transcrito como lesen." },
    });
    first.unmount();
    render(<Idiomas />);
    expect(screen.getByLabelText("Sua análise do percurso")).toHaveValue(
      "Leſen é transcrito como lesen.",
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "Alemão intermediário · leitura e argumento",
      }),
    );
    expect(screen.getByLabelText("Sua análise do percurso")).toHaveValue(
      "Weil apresenta uma oração causal.",
    );
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY)!);
    expect(saved.notes["log-1"]).toBe("Resposta legada");
    expect(saved.completed).toEqual(["log-1"]);
  });
  it("distinguishes pedagogical references without exposing private files", () => {
    render(<Idiomas />);
    fireEvent.click(screen.getByRole("button", { name: "Alemão" }));
    expect(screen.getByRole("link", { name: "Ficha REF-2026-06 · referência" })).toHaveAttribute(
      "href",
      "/biblioteca#REF-2026-06",
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "Alemão intermediário · leitura e argumento",
      }),
    );
    expect(screen.getByText(/não é básico A1/)).toHaveTextContent(
      /direito canônico, não catecismo/,
    );
    expect(screen.queryByRole("link", { name: /baixar/i })).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Leitura gótica · eletiva histórica" }),
    ).toBeEnabled();
  });
});
