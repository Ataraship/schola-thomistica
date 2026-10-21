import { TRACKS } from "@/data/curriculum";

export type FormationSearch = { track?: string; lesson?: string };

/** Accept only actual track/lesson pairs. Old /formacao links still start with logic. */
export function parseFormationSearch(search: Record<string, unknown>): FormationSearch {
  const track = TRACKS.find((item) => item.id === search["track"]);
  if (!track) return {};
  const lesson = track.lessons.find((item) => item.id === search["lesson"]);
  return { track: track.id, ...(lesson ? { lesson: lesson.id } : {}) };
}
