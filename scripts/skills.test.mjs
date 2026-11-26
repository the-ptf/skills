import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { categoryLabel, loadSkills, parseFrontmatter } from "./skills.mjs";

const fixture = (name) => fileURLToPath(new URL(`fixtures/${name}`, import.meta.url));

test("valid skills load with their category", () => {
  const { skills, problems } = loadSkills(fixture("ok"));
  assert.deepEqual(problems, []);
  assert.deepEqual(
    skills.map((s) => [s.name, s.category]),
    [["ptf-ajusta-curriculo", "carreira"], ["ptf-revisa-pr", "desenvolvimento"]],
  );
});

test("broken skills are reported", () => {
  const { problems } = loadSkills(fixture("bad"));
  const text = problems.join("\n");
  assert.match(text, /skills\/revisa: a pasta deve se chamar ptf-/);
  assert.match(text, /revisa\/SKILL.md: description curta/);
  assert.match(text, /ptf-sem-categoria\/SKILL.md: name "ptf-outro-nome"/);
  assert.match(text, /ptf-sem-categoria\/SKILL.md: falta metadata.category/);
});

test("frontmatter reads nested metadata and quoted values", () => {
  const { data } = parseFrontmatter('---\nname: ptf-x\ndescription: "a: b"\nmetadata:\n  category: carreira\n---\nbody');
  assert.equal(data.description, "a: b");
  assert.equal(data.metadata.category, "carreira");
});

test("new categories get a readable label", () => {
  assert.equal(categoryLabel("performance"), "Performance");
  assert.equal(categoryLabel("dados-e-ia"), "Dados e ia");
});
