import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { directionalIndex, useDirectionalNavigation } from "@/lib/directional-navigation";

const box = (left: number, top: number) => ({ left, top, width: 40, height: 40 });
const origin = box(100, 100);

it.each([
  ["ArrowUp", box(100, 0)],
  ["ArrowDown", box(100, 200)],
  ["ArrowLeft", box(0, 100)],
  ["ArrowRight", box(200, 100)],
] as const)("moves only toward %s", (direction, target) => {
  expect(directionalIndex(origin, [origin, target], direction)).toBe(1);
  expect(directionalIndex(origin, [origin], direction)).toBe(-1);
});
it("prefers a nearby aligned control over a diagonal one and breaks ties by DOM order", () => {
  expect(
    directionalIndex(origin, [box(160, 200), box(230, 100), box(230, 100)], "ArrowRight"),
  ).toBe(1);
});

function Harness({ enabled = true, back = () => {} }: { enabled?: boolean; back?: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  useDirectionalNavigation(enabled, root, back);
  return (
    <div ref={root}>
      <button id="a">A</button>
      <button id="b" disabled>
        B
      </button>
      <button id="hidden" style={{ visibility: "hidden" }}>
        Hidden
      </button>
      <a id="removed" href="#" tabIndex={-1}>
        Removed
      </a>
      <button id="c">C</button>
      <textarea aria-label="Draft" defaultValue="Texto legado" />
      <input aria-label="Choice" type="checkbox" />
      <select aria-label="Select">
        <option>Um</option>
      </select>
      <div contentEditable aria-label="Editable" suppressContentEditableWarning>
        Editar
      </div>
      <div role="region" tabIndex={0}>
        Quadro
      </div>
    </div>
  );
}
let previousScroll: PropertyDescriptor | undefined;
beforeEach(() => {
  previousScroll = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollIntoView");
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    value: vi.fn(),
    configurable: true,
  });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    return {
      ...box(
        ({ a: 0, b: 50, hidden: 60, removed: 70, c: 100 } as Record<string, number>)[this.id] ??
          500,
        0,
      ),
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON() {},
    } as DOMRect;
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  if (previousScroll)
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", previousScroll);
  else Reflect.deleteProperty(HTMLElement.prototype, "scrollIntoView");
});

describe("opt-in directional keys", () => {
  it("skips disabled, hidden and removed controls; scrolls the actual next focus target", () => {
    render(<Harness />);
    screen.getByText("A", { exact: true }).focus();
    expect(fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" })).toBe(false);
    expect(screen.getByText("C", { exact: true })).toHaveFocus();
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      block: "nearest",
      inline: "nearest",
      behavior: "auto",
    });
  });
  it("leaves normal keys alone while disabled and after unmount", () => {
    const { unmount } = render(<Harness enabled={false} />);
    screen.getByText("A", { exact: true }).focus();
    expect(fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" })).toBe(true);
    unmount();
    const back = vi.fn();
    const active = render(<Harness back={back} />);
    active.unmount();
    expect(fireEvent.keyDown(document.body, { key: "Escape" })).toBe(true);
    expect(back).not.toHaveBeenCalled();
  });
  it.each(["Draft", "Choice", "Select", "Editable"])(
    "preserves native editing keys in %s",
    (label) => {
      const back = vi.fn();
      render(<Harness back={back} />);
      const field = screen.getByLabelText(label);
      field.focus();
      for (const key of ["ArrowRight", "Backspace", "Enter", "Escape"])
        expect(fireEvent.keyDown(field, { key })).toBe(true);
      expect(back).not.toHaveBeenCalled();
      expect(field).toHaveFocus();
    },
  );
  it("preserves browser shortcuts and horizontal scrolling in comparison regions", () => {
    render(<Harness />);
    const a = screen.getByText("A", { exact: true });
    a.focus();
    expect(fireEvent.keyDown(a, { key: "ArrowRight", altKey: true })).toBe(true);
    const region = screen.getByRole("region");
    region.focus();
    expect(fireEvent.keyDown(region, { key: "ArrowRight" })).toBe(true);
    expect(region).toHaveFocus();
  });
  it.each([
    { key: "Escape" },
    { key: "BrowserBack" },
    { key: "GoBack" },
    { key: "Unidentified", keyCode: 10009 },
    { key: "Unidentified", keyCode: 461 },
  ])("returns on $key/$keyCode without browser history navigation", (event) => {
    const back = vi.fn();
    render(<Harness back={back} />);
    const a = screen.getByText("A", { exact: true });
    a.focus();
    expect(fireEvent.keyDown(a, event)).toBe(false);
    expect(back).toHaveBeenCalledOnce();
  });
  it("does not intercept native Enter, events already handled, or controls outside the shell", () => {
    render(<Harness />);
    const a = screen.getByText("A", { exact: true });
    a.focus();
    expect(fireEvent.keyDown(a, { key: "Enter" })).toBe(true);
    const handled = new KeyboardEvent("keydown", {
      key: "ArrowRight",
      bubbles: true,
      cancelable: true,
    });
    handled.preventDefault();
    a.dispatchEvent(handled);
    expect(a).toHaveFocus();
    const other = document.createElement("button");
    document.body.append(other);
    other.focus();
    expect(fireEvent.keyDown(other, { key: "ArrowRight" })).toBe(true);
    expect(other).toHaveFocus();
    other.remove();
  });
});
