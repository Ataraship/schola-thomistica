import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DISPUTATIO_CRITERIA, DISPUTATIO_FIELDS } from "@/data/disputatio";
import { DISPUTATIO_KEY, useDisputatioDraft } from "@/lib/disputatio-draft";
import { PROGRESS_KEY } from "@/lib/progress";
import { Disputatio } from "@/routes/disputatio";

beforeEach(() => {
  localStorage.clear();
  const empty = renderHook(useDisputatioDraft);
  empty.unmount();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("guided disputatio", () => {
  it("loads all five legacy fields without rewriting storage and retains them beside a revised judgment", () => {
    const legacy: Record<string, string> = {
      tese: "Minha tese inicial",
      premissas: "P1 antiga",
      objecoes: "Minha objeção",
      respostas: "Minha resposta",
      reflexao: "O que investigar",
    };
    const original = { ...legacy, future: { preserve: true } };
    const raw = JSON.stringify(original);
    localStorage.setItem(DISPUTATIO_KEY, raw);
    localStorage.setItem(PROGRESS_KEY, "{outro progresso intocado}");
    const first = render(<Disputatio />);
    expect(localStorage.getItem(DISPUTATIO_KEY)).toBe(raw);
    for (const field of DISPUTATIO_FIELDS.slice(0, 5))
      expect(screen.getByLabelText(field.label)).toHaveValue(legacy[field.id]);
    for (const field of DISPUTATIO_FIELDS) {
      expect(screen.getByLabelText(field.label)).toBeEnabled();
      expect(screen.getByLabelText(field.label)).toHaveAccessibleDescription(
        `Magister interrogat: ${field.question}`,
      );
    }
    fireEvent.change(screen.getByLabelText("Juízo revisto e motivo da mudança"), {
      target: { value: "Restrinjo a tese porque a objeção atinge P1." },
    });
    fireEvent.click(screen.getByLabelText(DISPUTATIO_CRITERIA[2]!.text));
    expect(screen.getByLabelText("Tese (Respondeo)")).toHaveValue(legacy["tese"]);
    first.unmount();
    render(<Disputatio />);
    expect(screen.getByLabelText("Juízo revisto e motivo da mudança")).toHaveValue(
      "Restrinjo a tese porque a objeção atinge P1.",
    );
    expect(screen.getByLabelText(DISPUTATIO_CRITERIA[2]!.text)).toBeChecked();
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toMatchObject(original);
    expect(localStorage.getItem(PROGRESS_KEY)).toBe("{outro progresso intocado}");
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("reports a write failure without interrupting the student's editing", () => {
    render(<Disputatio />);
    const failedWrite = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Full", "QuotaExceededError");
    });
    fireEvent.change(screen.getByLabelText("Premissas"), {
      target: { value: "Não perder este raciocínio" },
    });
    expect(screen.getByLabelText("Premissas")).toHaveValue("Não perder este raciocínio");
    expect(screen.getByRole("alert")).toHaveTextContent("copie-o antes de sair");
    failedWrite.mockRestore();
    fireEvent.change(screen.getByLabelText("Premissas"), {
      target: { value: "Raciocínio recuperado" },
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

describe("compatible disputatio storage", () => {
  it("merges edits with other mounted consumers and preserves future nontext fields", () => {
    localStorage.setItem(
      DISPUTATIO_KEY,
      JSON.stringify({ tese: "Antes", future: [1, 2], premissas: null }),
    );
    const first = renderHook(useDisputatioDraft);
    const second = renderHook(useDisputatioDraft);
    expect(first.result.current.values["premissas"]).toBeUndefined();
    act(() => first.result.current.setField("tese", "Depois"));
    expect(second.result.current.values["tese"]).toBe("Depois");
    act(() => second.result.current.setField("respostas", "Distingo"));
    expect(first.result.current.values["respostas"]).toBe("Distingo");
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toEqual({
      tese: "Depois",
      respostas: "Distingo",
      future: [1, 2],
      premissas: null,
    });
  });

  it("backs up the exact malformed document before replacing it and performs no write on mount", () => {
    const raw = "{texto antigo ilegível";
    localStorage.setItem(DISPUTATIO_KEY, raw);
    const { result } = renderHook(useDisputatioDraft);
    expect(result.current.storageError).toContain("preservados");
    expect(localStorage.getItem(DISPUTATIO_KEY)).toBe(raw);
    act(() => result.current.setField("tese", "Novo rascunho"));
    const recovery = Object.keys(localStorage).find((key) =>
      key.startsWith(`${DISPUTATIO_KEY}-recovery-`),
    );
    expect(recovery).toBeDefined();
    expect(localStorage.getItem(recovery!)).toBe(raw);
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toEqual({ tese: "Novo rascunho" });
  });

  it("does not replace malformed bytes when the recovery copy cannot be saved", () => {
    localStorage.setItem(DISPUTATIO_KEY, "[original incompatible document]");
    const { result } = renderHook(useDisputatioDraft);
    const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage full");
    });
    act(() => result.current.setField("tese", "Em memória"));
    expect(result.current.values["tese"]).toBe("Em memória");
    expect(result.current.storageError).toBeTruthy();
    expect(write).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(DISPUTATIO_KEY)).toBe("[original incompatible document]");
    write.mockRestore();
    act(() => result.current.setField("tese", "Recuperado"));
    expect(result.current.storageError).toBeNull();
  });

  it("keeps pending field edits across a quota failure and merges newer work from another tab", () => {
    localStorage.setItem(DISPUTATIO_KEY, JSON.stringify({ tese: "Inicial", objecoes: "Antiga" }));
    const { result } = renderHook(useDisputatioDraft);
    const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage full");
    });
    act(() => result.current.setField("tese", "Rascunho"));
    act(() => result.current.setField("tese", "Rascunho revisto"));
    act(() => result.current.setField("juizo-revisto", "Conclusão pendente"));
    write.mockRestore();
    act(() => {
      localStorage.setItem(
        DISPUTATIO_KEY,
        JSON.stringify({ tese: "Inicial", objecoes: "Outra aba", future: { preserve: true } }),
      );
      window.dispatchEvent(new StorageEvent("storage", { key: DISPUTATIO_KEY }));
    });
    expect(result.current.values).toMatchObject({
      tese: "Rascunho revisto",
      objecoes: "Outra aba",
      "juizo-revisto": "Conclusão pendente",
    });
    expect(result.current.storageError).toBeTruthy();
    act(() => result.current.setField("reflexao", "Próxima investigação"));
    expect(result.current.storageError).toBeNull();
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toEqual({
      tese: "Rascunho revisto",
      objecoes: "Outra aba",
      "juizo-revisto": "Conclusão pendente",
      reflexao: "Próxima investigação",
      future: { preserve: true },
    });
  });

  it("never overwrites unread storage and saves pending work after read access recovers", () => {
    localStorage.setItem(DISPUTATIO_KEY, JSON.stringify({ tese: "Existente", future: true }));
    const read = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Read denied");
    });
    const write = vi.spyOn(Storage.prototype, "setItem");
    const { result } = renderHook(useDisputatioDraft);
    act(() => result.current.setField("respostas", "Pendente"));
    expect(write).not.toHaveBeenCalled();
    expect(result.current.values["respostas"]).toBe("Pendente");
    read.mockRestore();
    act(() => result.current.setField("reflexao", "Novo registro"));
    expect(JSON.parse(localStorage.getItem(DISPUTATIO_KEY)!)).toEqual({
      tese: "Existente",
      future: true,
      respostas: "Pendente",
      reflexao: "Novo registro",
    });
  });

  it.each(["null", "[]", '"text"'])(
    "preserves an incompatible top-level document (%s) before accepting new work",
    (raw) => {
      localStorage.setItem(DISPUTATIO_KEY, raw);
      const { result } = renderHook(useDisputatioDraft);
      expect(result.current.values).toEqual({});
      expect(result.current.storageError).toBeTruthy();
      act(() => result.current.setField("tese", "Texto"));
      const recovery = Object.keys(localStorage).find((key) =>
        key.startsWith(`${DISPUTATIO_KEY}-recovery-`),
      );
      expect(localStorage.getItem(recovery!)).toBe(raw);
    },
  );
});
