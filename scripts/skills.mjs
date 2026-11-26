// Reads every skills/<name>/SKILL.md and checks it against the repository rules.
// Shared by the validator (check-skills.mjs) and the site build (build-site.mjs).
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export const NAME = /^ptf-[a-z0-9]+(-[a-z0-9]+)*$/;
export const CATEGORY = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Labels for the categories we start with; any other slug becomes a tab with a label made from it.
const LABELS = { desenvolvimento: "Desenvolvimento", carreira: "Carreira", performance: "Performance" };
export const categoryLabel = (slug) => LABELS[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1).replaceAll("-", " ");

const unquote = (v) => v.trim().replace(/^(["'])(.*)\1$/, "$2");

// Flat `key: value` lines plus one level of nesting (for `metadata:`), which is all a SKILL.md needs.
export function parseFrontmatter(text) {
  const m = text.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return null;
  const data = {};
  let parent = null;
  for (const line of m[1].split("\n")) {
    const nested = line.match(/^\s+([A-Za-z0-9_-]+):\s*(.*)$/);
    if (nested && parent) {
      data[parent][nested[1]] = unquote(nested[2]);
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    if (kv[2].trim() === "") {
      parent = kv[1];
      data[parent] = {};
    } else {
      parent = null;
      data[kv[1]] = unquote(kv[2]);
    }
  }
  return { data, body: text.slice(m[0].length) };
}

export function loadSkills(skillsDir) {
  const skills = [];
  const problems = [];
  const names = existsSync(skillsDir) ? readdirSync(skillsDir).sort() : [];
  for (const name of names) {
    const dir = join(skillsDir, name);
    if (name.startsWith(".") || !statSync(dir).isDirectory()) continue;
    const where = `skills/${name}`;
    if (!NAME.test(name) || name.length > 64) {
      problems.push(`${where}: a pasta deve se chamar ptf-<nome> (minúsculas, números e hífens, até 64 caracteres)`);
    }
    const skillPath = join(dir, "SKILL.md");
    if (!existsSync(skillPath)) {
      problems.push(`${where}: falta o SKILL.md`);
      continue;
    }
    const fm = parseFrontmatter(readFileSync(skillPath, "utf8"));
    if (!fm) {
      problems.push(`${where}/SKILL.md: falta o frontmatter (bloco --- no topo)`);
      continue;
    }
    const { name: declared, description = "", metadata = {} } = fm.data;
    if (declared !== name) problems.push(`${where}/SKILL.md: name "${declared ?? ""}" deve ser igual ao nome da pasta`);
    if (description.length < 30) problems.push(`${where}/SKILL.md: description curta demais (${description.length} caracteres, mínimo 30)`);
    if (description.length > 1024) problems.push(`${where}/SKILL.md: description passa de 1024 caracteres`);
    const category = typeof metadata === "object" ? metadata.category : undefined;
    if (!category) problems.push(`${where}/SKILL.md: falta metadata.category (ex.: desenvolvimento, carreira, performance)`);
    else if (!CATEGORY.test(category)) problems.push(`${where}/SKILL.md: category "${category}" deve ser minúsculas e hífens`);
    if (fm.body.trim().length < 50) problems.push(`${where}/SKILL.md: o corpo da skill está vazio ou curto demais`);
    skills.push({ name, description, category: category ?? "outros", author: metadata.author ?? "" });
  }
  return { skills, problems };
}
