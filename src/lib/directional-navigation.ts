import { useEffect, type RefObject } from "react";

type Direction = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";
type Box = Pick<DOMRect, "left" | "top" | "width" | "height">;

/** Geometry only; DOM order breaks ties. No UA detection or platform APIs. */
export function directionalIndex(origin: Box, boxes: Box[], direction: Direction): number {
  const horizontal = direction === "ArrowLeft" || direction === "ArrowRight";
  const sign = direction === "ArrowLeft" || direction === "ArrowUp" ? -1 : 1;
  const center = (box: Box) => ({ x: box.left + box.width / 2, y: box.top + box.height / 2 });
  const start = center(origin);
  let best = -1;
  let score = Infinity;
  boxes.forEach((box, index) => {
    const end = center(box);
    const forward = sign * (horizontal ? end.x - start.x : end.y - start.y);
    if (forward <= 1) return;
    const cross = Math.abs(horizontal ? end.y - start.y : end.x - start.x);
    const crossSize = horizontal
      ? (origin.height + box.height) / 2
      : (origin.width + box.width) / 2;
    const distance = forward + Math.max(0, cross - crossSize) * 3 + cross * 0.25;
    if (distance < score) {
      best = index;
      score = distance;
    }
  });
  return best;
}

function editing(target: Element) {
  return !!target.closest(
    'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="combobox"], [role="slider"], [role="spinbutton"], [role="tablist"]',
  );
}

/** Opt-in reading navigation. Native widgets and browser shortcuts retain their keys. */
export function useDirectionalNavigation(
  enabled: boolean,
  root: RefObject<HTMLElement | null>,
  onReturn: () => void,
) {
  useEffect(() => {
    if (!enabled) return;
    const handle = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      )
        return;
      const target = event.target instanceof Element ? event.target : document.body;
      if (editing(target) || (target !== document.body && !root.current?.contains(target))) return;
      // Some remotes expose legacy codes; support in a physical TV is not assumed.
      if (
        ["Escape", "BrowserBack", "GoBack"].includes(event.key) ||
        event.keyCode === 10009 ||
        event.keyCode === 461
      ) {
        event.preventDefault();
        onReturn();
        return;
      }
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      if (target.closest('[role="region"][tabindex="0"]')) return;
      const candidates = Array.from(
        root.current?.querySelectorAll<HTMLElement>(
          'a[href], button, summary, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => {
        const box = element.getBoundingClientRect();
        return (
          element.tabIndex >= 0 &&
          !element.matches(":disabled") &&
          !element.closest('[inert], [aria-hidden="true"], [data-directional-skip]') &&
          !editing(element) &&
          getComputedStyle(element).visibility !== "hidden" &&
          box.width > 1 &&
          box.height > 1
        );
      });
      const active = document.activeElement as HTMLElement | null;
      const next =
        active && candidates.includes(active)
          ? candidates[
              directionalIndex(
                active.getBoundingClientRect(),
                candidates.map((el) => el.getBoundingClientRect()),
                event.key as Direction,
              )
            ]
          : candidates[0];
      // At an edge ordinary scrolling remains available. Enter stays native.
      if (!next) return;
      event.preventDefault();
      next.focus({ preventScroll: true });
      next.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [enabled, root, onReturn]);
}
