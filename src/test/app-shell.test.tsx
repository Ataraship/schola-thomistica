import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode, MouseEventHandler } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AppShell } from "@/components/AppShell";
vi.mock("@tanstack/react-router", () => ({
  Link: (props: {
    to: string;
    children: ReactNode;
    className?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
  }) => (
    <a
      href={props.to}
      className={props.className}
      onClick={(event) => {
        props.onClick?.(event);
        event.preventDefault();
      }}
    >
      {props.children}
    </a>
  ),
}));
beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
it("opens a labelled disclosure, focuses its first link and restores focus on Escape", () => {
  render(
    <AppShell>
      <h1>Conteúdo</h1>
    </AppShell>,
  );
  const button = screen.getByRole("button", { name: "Menu" });
  fireEvent.click(button);
  expect(button).toHaveAttribute("aria-expanded", "true");
  const menu = document.getElementById("menu-mobile")!;
  expect(within(menu).getByRole("link", { name: /Início/ })).toHaveFocus();
  fireEvent.keyDown(document.activeElement!, { key: "Escape" });
  expect(document.getElementById("menu-mobile")).toBeNull();
  expect(button).toHaveFocus();
  expect(button).toHaveAttribute("aria-expanded", "false");
});
it("moves focus to the persistent main landmark on navigation without stealing modified clicks", () => {
  render(
    <AppShell>
      <h1>Conteúdo</h1>
    </AppShell>,
  );
  const main = screen.getByRole("main");
  const link = screen.getAllByRole("link", { name: /Biblioteca/ })[0]!;
  link.focus();
  fireEvent.click(link, { ctrlKey: true });
  expect(link).toHaveFocus();
  fireEvent.click(link);
  expect(main).toHaveFocus();
});
it("TV reading is session-only and does not create or replace storage records", () => {
  const legacy = {
    "schola-progress-v1": '{"notes":{"log-1":"antiga"}}',
    "schola-disputatio-v1": '{"tese":"antiga"}',
    "schola-progress-v1-recovery-1": "{backup",
    "schola-disputatio-v1:field:tese": '{"v":1,"value":"antiga"}',
  };
  for (const [key, value] of Object.entries(legacy)) localStorage.setItem(key, value);
  const { unmount } = render(
    <AppShell>
      <h1>Conteúdo</h1>
    </AppShell>,
  );
  const button = screen.getByRole("button", { name: "Leitura para TV" });
  fireEvent.click(button);
  expect(button).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("status")).toHaveTextContent("Retorno");
  fireEvent.keyDown(button, { key: "Escape" });
  expect(button).toHaveAttribute("aria-pressed", "false");
  unmount();
  render(<AppShell>Novamente</AppShell>);
  expect(screen.getByRole("button", { name: "Leitura para TV" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  expect(
    Object.fromEntries(Object.keys(localStorage).map((k) => [k, localStorage.getItem(k)])),
  ).toEqual(legacy);
});

it("restores the visible reading toggle after activation in the mobile menu and a desktop resize", () => {
  render(<AppShell>Leitura</AppShell>);
  fireEvent.click(screen.getByRole("button", { name: "Menu" }));
  const mobile = within(document.getElementById("menu-mobile")!).getByRole("button", {
    name: "Leitura para TV",
  });
  fireEvent.click(mobile);
  const desktop = screen.getByRole("button", { name: "Sair da leitura para TV" });
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockImplementation(function (
    this: HTMLElement,
  ) {
    return (this === desktop ? [{}] : []) as unknown as DOMRectList;
  });
  const main = screen.getByRole("main");
  main.focus();
  fireEvent.keyDown(main, { key: "Escape" });
  expect(desktop).toHaveFocus();
  expect(desktop).toHaveAttribute("aria-pressed", "false");
});
