import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { StudiumFontium } from "@/components/StudiumFontium";
import {
  IMAGES_STUDIUM,
  PRUDENCE_STUDIUM,
  STUDIUM_ACTIVITIES,
  studiumNoteKey,
} from "@/data/studium";
import { PROGRESS_KEY } from "@/lib/progress";
import { Biblioteca } from "@/routes/biblioteca";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

const workshop = (title: string) => within(screen.getByRole("region", { name: title }));

describe("two independent Studium Fontium workshops", () => {
  it("preserves legacy records and keeps all drafts, criteria and completion separate after remounting", () => {
    const original = {
      completed: ["log-2", IMAGES_STUDIUM.id],
      notes: {
        "log-2": "Minha análise anterior",
        "studium-imagens:lectio": "Encarnação e representação",
        "studium-imagens:criterion:objecao": "yes",
        "studium-prudencia:criterion:objecao": "no",
      },
      custom: { preserved: true },
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(original));
    const renderBoth = () => render(<Biblioteca />);
    const first = renderBoth();
    const images = workshop(IMAGES_STUDIUM.title);
    const prudence = workshop(PRUDENCE_STUDIUM.title);
    expect(images.getByLabelText("Seu registro · Lectio")).toHaveValue(
      "Encarnação e representação",
    );
    expect(prudence.getByLabelText("Seu registro · Lectio")).toHaveValue("");
    for (const stage of PRUDENCE_STUDIUM.stages) {
      const label = `Seu registro · ${stage.title.split(" · ")[0]}`;
      expect(prudence.getByLabelText(label)).toBeEnabled();
      fireEvent.change(prudence.getByLabelText(label), {
        target: { value: `Prudência: ${stage.id}` },
      });
    }
    expect(prudence.getByLabelText(PRUDENCE_STUDIUM.criteria[3]!.text)).not.toBeChecked();
    fireEvent.click(prudence.getByLabelText(PRUDENCE_STUDIUM.criteria[3]!.text));
    expect(images.getByLabelText(IMAGES_STUDIUM.criteria[3]!.text)).toBeChecked();
    fireEvent.click(prudence.getByRole("button", { name: "Marcar atividade como concluída" }));
    fireEvent.click(images.getByRole("button", { name: "Reabrir atividade para revisão" }));
    first.unmount();
    renderBoth();
    const restored = workshop(PRUDENCE_STUDIUM.title);
    for (const stage of PRUDENCE_STUDIUM.stages)
      expect(restored.getByLabelText(`Seu registro · ${stage.title.split(" · ")[0]}`)).toHaveValue(
        `Prudência: ${stage.id}`,
      );
    expect(restored.getByLabelText(PRUDENCE_STUDIUM.criteria[3]!.text)).toBeChecked();
    expect(
      restored.getByRole("button", { name: "Reabrir atividade para revisão" }),
    ).toHaveAttribute("aria-pressed", "true");
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY)!);
    expect(saved.completed).toEqual(["log-2", PRUDENCE_STUDIUM.id]);
    expect(saved.notes).toMatchObject({
      ...original.notes,
      "studium-prudencia:criterion:objecao": "yes",
    });
    expect(saved.custom).toEqual(original.custom);
    expect(workshop(IMAGES_STUDIUM.title).getByLabelText("Seu registro · Lectio")).toHaveValue(
      "Encarnação e representação",
    );
  });

  it("gives each stage a unique linked field and resolves accessible descriptions to its own prompt", () => {
    const { container } = render(<Biblioteca />);
    const ids = [...container.querySelectorAll("[id]")].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const activity of STUDIUM_ACTIVITIES) {
      const region = screen.getByRole("region", { name: activity.title });
      const jump = screen.getByRole("link", { name: activity.title });
      expect(jump.getAttribute("href")).toBe(`#${region.id}`);
      for (const stage of activity.stages) {
        const name = stage.title.split(" · ")[0]!;
        const field = within(region).getByLabelText(`Seu registro · ${name}`);
        const link = within(region).getByRole("link", { name });
        expect(link.getAttribute("href")).toBe(`#${field.id}`);
        expect(field).toHaveAccessibleDescription(stage.prompt);
        const prompt = document.getElementById(field.getAttribute("aria-describedby")!);
        expect(region.contains(prompt)).toBe(true);
      }
    }
  });

  it("keeps the older default workshop and its storage namespace compatible", () => {
    render(<StudiumFontium />);
    expect(screen.getByRole("heading", { name: IMAGES_STUDIUM.title })).toBeVisible();
    expect(screen.getByLabelText("Seu registro · Lectio").id).toBe("studium-imagens:lectio");
    expect(studiumNoteKey("lectio")).toBe("studium-imagens:lectio");
  });

  it("keeps workshops available when reference search has no matches", () => {
    render(<Biblioteca />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "sem-obra-correspondente" },
    });
    expect(screen.getByText(/Nenhuma referência encontrada/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: PRUDENCE_STUDIUM.caseStudy!.title })).toBeVisible();
    for (const activity of STUDIUM_ACTIVITIES) {
      const fields = workshop(activity.title).getAllByRole("textbox");
      expect(fields).toHaveLength(5);
      for (const field of fields) expect(field).toBeEnabled();
    }
  });
});
