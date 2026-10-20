import { describe, expect, it } from "vitest";
import { segmentText, MAX_SEGMENT } from "@/lib/segment";

describe("segmentText", () => {
  it("never exceeds 420 chars per segment", () => {
    const { segments } = segmentText("Lorem ipsum dolor sit amet. ".repeat(80));
    expect(segments.every((s) => s.length <= MAX_SEGMENT)).toBe(true);
  });
  it("caps total at 3500 chars", () => {
    const { segments, truncated } = segmentText("a".repeat(10) + " palavra".repeat(1000));
    expect(truncated).toBe(true);
    expect(segments.join(" ").length).toBeLessThanOrEqual(3500 + segments.length);
  });
});
