import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const SRC = path.join(ROOT, "src");

async function walk(dir, filter, out = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    if (["node_modules", ".next", ".git"].includes(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) await walk(full, filter, out);
    else if (filter(ent.name, full)) out.push(full);
  }
  return out;
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

const SKIP_NAME = new Set([
  "layout.tsx",
  "youtubeEmbed.ts",
  "GuideFieldIcons.tsx",
  "ContactUsForm.tsx",
]);

const webps = await walk(path.join(PUBLIC, "img"), (n) => n.toLowerCase().endsWith(".webp"));
const webpSet = new Set(webps.map((f) => "/" + toPosix(path.relative(PUBLIC, f))));

const codeFiles = await walk(SRC, (n) => /\.(tsx?|jsx?|css)$/i.test(n));

let filesChanged = 0;
let replacements = 0;
const missing = [];

for (const file of codeFiles) {
  if (SKIP_NAME.has(path.basename(file))) continue;
  let text = await fs.readFile(file, "utf8");
  const orig = text;

  const imgConsts = [...text.matchAll(/const\s+(IMG\w*)\s*=\s*["'](\/img\/[^"']+)["']/g)];
  const fnConsts = [
    ...text.matchAll(
      /const\s+(\w+)\s*=\s*\([^)]*file[^)]*\)\s*=>\s*[\n\s]*[`'"](\/img\/[^$`'"]+)\$\{file\}/g,
    ),
  ];

  text = text.replace(
    /\$\{(\w+)\}\/([^"'`\s]+?)\.(jpe?g|png)(\?[^"'`\s]*)?/g,
    (m, name, base, _ext, qs = "") => {
      const c = imgConsts.find((x) => x[1] === name);
      if (!c) return m;
      const key = `${c[2].replace(/\/$/, "")}/${base}.webp`;
      if (webpSet.has(key)) {
        replacements += 1;
        return `\${${name}}/${base}.webp${qs || ""}`;
      }
      missing.push({ file: toPosix(path.relative(ROOT, file)), from: m, tried: key });
      return m;
    },
  );

  text = text.replace(/(\w+)\(["']([^"']+?)\.(jpe?g|png)["']\)/g, (m, fn, base) => {
    const c = fnConsts.find((x) => x[1] === fn);
    if (!c) return m;
    const key = `${c[2].replace(/\/$/, "")}/${base}.webp`;
    if (webpSet.has(key)) {
      replacements += 1;
      return `${fn}("${base}.webp")`;
    }
    missing.push({ file: toPosix(path.relative(ROOT, file)), from: m, tried: key });
    return m;
  });

  text = text.replace(/(\/img\/[^"'`\s)]+?)\.(jpe?g|png)(\?[^"'`\s]*)?/g, (m, base, _ext, qs = "") => {
    const key = `${base}.webp`;
    if (webpSet.has(key)) {
      replacements += 1;
      return `${base}.webp${qs || ""}`;
    }
    return m;
  });

  if (text !== orig) {
    await fs.writeFile(file, text, "utf8");
    filesChanged += 1;
  }
}

console.log(`webp files: ${webpSet.size}`);
console.log(`filesChanged: ${filesChanged}, replacements: ${replacements}`);
console.log(`unresolved: ${missing.length}`);
for (const x of missing) {
  console.log(` - ${x.file}: ${x.from} -> ${x.tried}`);
}
