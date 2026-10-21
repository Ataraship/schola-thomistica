import { describe, expect, it } from "vitest";
import { TRACKS } from "@/data/curriculum";
import { parseFormationSearch } from "@/lib/formation-navigation";
import { parseProgress } from "@/lib/progress";

describe("resuming a particular philosophy lesson", () => {
  it("retains valid selections in every track and accepts their resume addresses in legacy progress", () => {
    for (const track of TRACKS)
      for (const lesson of track.lessons) {
        expect(parseFormationSearch({ track: track.id, lesson: lesson.id })).toEqual({
          track: track.id,
          lesson: lesson.id,
        });
        const to = `/formacao?track=${track.id}&lesson=${lesson.id}`;
        expect(parseProgress(JSON.stringify({ last: { to, title: lesson.title } })).last?.to).toBe(
          to,
        );
      }
    expect(
      parseProgress(JSON.stringify({ last: { to: "/formacao", title: "Anterior" } })).last?.to,
    ).toBe("/formacao");
  });

  it("falls back safely for missing, mismatched and malformed selections", () => {
    expect(parseFormationSearch({})).toEqual({});
    expect(parseFormationSearch({ track: "platao", lesson: "log-2" })).toEqual({ track: "platao" });
    expect(parseFormationSearch({ track: "inexistente", lesson: "pla-1" })).toEqual({});
    expect(parseFormationSearch({ track: ["platao"], lesson: { id: "pla-1" } })).toEqual({});
    expect(
      parseFormationSearch({
        track: "platao",
        lesson: "javascript:alert(1)",
        next: "https://invalid.example",
      }),
    ).toEqual({ track: "platao" });
  });
});
