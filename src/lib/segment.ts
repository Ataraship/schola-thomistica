export const MAX_SEGMENT = 420;
export const MAX_TOTAL = 3500;

/** Split text into sentence-based segments of at most MAX_SEGMENT chars, total capped at MAX_TOTAL. */
export function segmentText(raw: string): { segments: string[]; truncated: boolean } {
  const clean = raw.replace(/\s+/g, " ").trim();
  const truncated = clean.length > MAX_TOTAL;
  const text = truncated ? clean.slice(0, MAX_TOTAL) : clean;
  const sentences = text.match(/[^.!?;:]+[.!?;:]*\s*/g) ?? [];
  const segments: string[] = [];
  let cur = "";
  const push = () => { if (cur.trim()) segments.push(cur.trim()); cur = ""; };
  for (const s of sentences) {
    if (s.length > MAX_SEGMENT) {
      push();
      let piece = "";
      for (const w of s.split(" ")) {
        if ((piece + " " + w).trim().length > MAX_SEGMENT) { segments.push(piece.trim()); piece = w; }
        else piece = (piece + " " + w).trim();
      }
      cur = piece + " ";
    } else if ((cur + s).trim().length > MAX_SEGMENT) { push(); cur = s; }
    else cur += s;
  }
  push();
  return { segments, truncated };
}
