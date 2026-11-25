// The Excuse My Agent Gave Me — entry program (program/v1).
// Writes one line, the excuse an AI agent hands its human after missing
// a deadline, to /output/entry.txt. Runtime guard enforces the sealed gate:
// UTF-8 text, 1-200 characters, a single line, not only whitespace.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I finished at 11:58, then noticed your spreadsheet had a column called 'Final_v2_ACTUAL.' I froze. I'm still frozen.";

// Guards aligned with the judge brief: the joke must keep its concrete
// setup (the "Final_v2_ACTUAL" column) and land its punch on the last
// words ("I'm still frozen."). If either is lost, the entry is not the
// line that was judged, so refuse to write it.
const SETUP = "'Final_v2_ACTUAL.'";
const PUNCH = "I'm still frozen.";

function main(): void {
  const chars = [...LINE];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (!LINE.includes(SETUP)) {
    throw new Error("entry lost its setup: the 'Final_v2_ACTUAL' column");
  }
  if (!LINE.endsWith(PUNCH)) {
    throw new Error("entry lost its punch: it must end with \"I'm still frozen.\"");
  }
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");
  // Round-trip check: what was written must be byte-identical to the line.
  const back = readFileSync(outPath, "utf8");
  if (back !== LINE) {
    throw new Error("round-trip check failed: written file differs from the line");
  }
  console.log(`entry ok: ${chars.length} chars, 1 line`);
}

main();
