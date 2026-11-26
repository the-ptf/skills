#!/usr/bin/env node
// Validates every skill in skills/ and exits 1 listing each problem.
// Usage: node scripts/check-skills.mjs [skills-dir]
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadSkills } from "./skills.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { skills, problems } = loadSkills(resolve(process.argv[2] ?? join(root, "skills")));

if (problems.length) {
  console.error(problems.join("\n"));
  console.error(`\n${problems.length} problema(s)`);
  process.exit(1);
}
console.log(`ok: ${skills.length} skill(s)`);
