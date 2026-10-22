// Proposed repository path: scripts/check-quality.mjs
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { ESLint } from "eslint";
import prettier from "prettier";

const base = process.argv[2];
if (!base || !/^[a-f\d]{7,40}$/i.test(base)) {
  throw new Error("Pass an immutable Git base SHA.");
}
const root = process.cwd();
const changed = execFileSync(
  "git",
  ["diff", "--name-only", "--diff-filter=ACMR", "-z", `${base}...HEAD`],
  { encoding: "utf8" },
)
  .split("\0")
  .filter(Boolean);
const eslint = new ESLint();
const lintResults = await eslint.lintFiles(["."]);
const baseline = JSON.parse(readFileSync("scripts/lint-baseline.json", "utf8"));
if (baseline.version !== 1 || !Array.isArray(baseline.diagnostics))
  throw new Error("Invalid lint baseline");

function identity(item) {
  return JSON.stringify([item.file, item.rule, item.severity, item.message, item.sourceLine]);
}
const allowed = new Map(baseline.diagnostics.map((item) => [identity(item), item.count]));
const changedSet = new Set(changed);
const regressions = [];
let tolerated = 0;
for (const result of lintResults) {
  const file = path.relative(root, result.filePath).split(path.sep).join("/");
  const lines = (result.source ?? readFileSync(result.filePath, "utf8")).split(/\r?\n/);
  for (const message of result.messages) {
    const diagnostic = {
      file,
      rule: message.ruleId,
      severity: message.severity,
      message: message.message,
      sourceLine: lines[(message.line ?? 1) - 1] ?? "",
    };
    const key = identity(diagnostic);
    const remaining = allowed.get(key) ?? 0;
    if (changedSet.has(file) || remaining < 1 || message.fatal) regressions.push(diagnostic);
    else {
      allowed.set(key, remaining - 1);
      tolerated++;
    }
  }
}

const badFormat = [];
for (const file of changed) {
  const info = await prettier.getFileInfo(file, { ignorePath: ".prettierignore" });
  if (info.ignored || !info.inferredParser) continue;
  const options = await prettier.resolveConfig(file);
  if (!(await prettier.check(readFileSync(file, "utf8"), { ...options, filepath: file })))
    badFormat.push(file);
}
console.log(
  `Lint: ${tolerated} inherited diagnostics; ${regressions.length} regressions/changed-file diagnostics.`,
);
if (regressions.length) console.error(JSON.stringify(regressions, null, 2));
if (badFormat.length) console.error("Prettier failures:", badFormat);
if (regressions.length || badFormat.length) process.exitCode = 1;
