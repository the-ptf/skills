#!/usr/bin/env node
// Builds the static site in dist/: one tab per category, read straight from the skills' frontmatter.
// Usage: node scripts/build-site.mjs [skills-dir] [out-dir]
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { categoryLabel, loadSkills } from "./skills.mjs";

const REPO = "https://github.com/the-ptf/ptfskills";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = resolve(process.argv[2] ?? join(root, "skills"));
const outDir = resolve(process.argv[3] ?? join(root, "dist"));

const { skills, problems } = loadSkills(skillsDir);
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const categories = [...new Set(skills.map((s) => s.category))].sort();

const tab = (slug, label, count, selected) =>
  `<button role="tab" aria-selected="${selected}" data-cat="${esc(slug)}">${esc(label)} <span>${count}</span></button>`;

const card = (s) => `<li data-cat="${esc(s.category)}">
  <h3><a href="${REPO}/blob/main/skills/${esc(s.name)}/SKILL.md">${esc(s.name)}</a></h3>
  <p>${esc(s.description)}</p>
  <p class="meta">${esc(categoryLabel(s.category))}${s.author ? ` · ${esc(s.author)}` : ""}</p>
</li>`;

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>PTF Skills</title>
<link rel="icon" href="logo.png">
<meta name="description" content="Skills open-source da comunidade PTF para agentes de código.">
<style>
:root { --bg: #fff; --fg: #111; --muted: #666; --line: #ddd; --chip: #f2f2f2; }
@media (prefers-color-scheme: dark) { :root { --bg: #111; --fg: #eee; --muted: #999; --line: #333; --chip: #1d1d1d; } }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--fg); font: 16px/1.5 system-ui, sans-serif; }
main { max-width: 960px; margin: 0 auto; padding: 48px 16px 64px; }
h1 { font-size: 2rem; margin: 0 0 8px; display: flex; align-items: center; gap: 12px; }
h1 img { border-radius: 12px; }
a { color: inherit; }
pre { background: var(--chip); border: 1px solid var(--line); border-radius: 8px; padding: 12px 16px; overflow-x: auto; }
[role="tablist"] { display: flex; flex-wrap: wrap; gap: 8px; margin: 32px 0 16px; }
[role="tab"] { font: inherit; border: 1px solid var(--line); background: var(--bg); color: var(--fg); border-radius: 999px; padding: 6px 14px; cursor: pointer; }
[role="tab"][aria-selected="true"] { background: var(--fg); color: var(--bg); }
[role="tab"] span { opacity: .6; }
ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
li { border: 1px solid var(--line); border-radius: 12px; padding: 16px; }
li[hidden] { display: none; }
h3 { margin: 0 0 6px; font-size: 1rem; font-family: ui-monospace, monospace; }
li p { margin: 0; }
.meta, .muted { color: var(--muted); font-size: .875rem; }
.meta { margin-top: 8px; }
</style>
</head>
<body>
<main>
<h1><img src="logo.png" alt="" width="56" height="56"> PTF Skills</h1>
<p class="muted">Skills open-source para agentes de código, feitas pela comunidade. <a href="${REPO}">Mande a sua</a>.</p>
<pre><code>/plugin marketplace add the-ptf/ptfskills
/plugin install ptf@ptf</code></pre>
${
  skills.length
    ? `<div role="tablist" aria-label="Categorias">
${tab("todas", "Todas", skills.length, true)}
${categories.map((c) => tab(c, categoryLabel(c), skills.filter((s) => s.category === c).length, false)).join("\n")}
</div>
<ul>
${skills.map(card).join("\n")}
</ul>`
    : `<p class="muted">Nenhuma skill ainda. <a href="${REPO}/blob/main/CONTRIBUTING.md">Seja a primeira pessoa a mandar uma</a>.</p>`
}
</main>
<script>
const tabs = document.querySelectorAll('[role="tab"]');
tabs.forEach((t) => t.addEventListener("click", () => {
  tabs.forEach((x) => x.setAttribute("aria-selected", x === t));
  document.querySelectorAll("li[data-cat]").forEach((li) => {
    li.hidden = t.dataset.cat !== "todas" && li.dataset.cat !== t.dataset.cat;
  });
}));
</script>
</body>
</html>
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "index.html"), html);
copyFileSync(join(root, "assets", "logo.png"), join(outDir, "logo.png"));
console.log(`site: ${skills.length} skill(s), ${categories.length} categoria(s) em ${outDir}`);
