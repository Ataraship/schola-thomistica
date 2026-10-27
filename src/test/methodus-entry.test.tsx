import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it } from "vitest";
import { MethodusEntry } from "@/components/MethodusEntry";

let hydrated: Root | undefined;
afterEach(() => {
  if (hydrated) act(() => hydrated!.unmount());
  hydrated = undefined;
  cleanup();
  localStorage.clear();
});

it("keeps the unrequested workshop absent and loads it when the native disclosure opens", async () => {
  render(<MethodusEntry course="la" />);
  expect(screen.queryByLabelText("Methodus Discendi")).not.toBeInTheDocument();
  const details = document.getElementById("methodus") as HTMLDetailsElement;
  details.open = true;
  fireEvent(details, new Event("toggle"));
  await waitFor(() => expect(screen.getByLabelText("Paz")).toBeEnabled());
  details.open = false;
  fireEvent(details, new Event("toggle"));
  expect(screen.queryByLabelText("Methodus Discendi")).not.toBeInTheDocument();
});

it("honors a disclosure opened natively before hydration without accepting unsafe input", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  container.innerHTML = renderToString(<MethodusEntry course="de" />);
  const details = container.querySelector("details")!;
  details.open = true;
  expect(container.querySelector("input")).toBeNull();
  await act(async () => {
    hydrated = hydrateRoot(container, <MethodusEntry course="de" />);
  });
  await waitFor(() => expect(screen.getByLabelText("Forma de lernen com ich")).toBeEnabled());
  act(() => hydrated!.unmount());
  hydrated = undefined;
  container.remove();
});
