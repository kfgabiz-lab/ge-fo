/**
 * Convert public/img jpg/jpeg/png files to sibling .webp
 * - high quality, preserve alpha & dimensions
 * - optionally rewrite repo refs from .jpg/.png to .webp
 *
 * Usage:
 *   node scripts/convert-img-to-webp.mjs
 *   node scripts/convert-img-to-webp.mjs --png-only
 *   node scripts/convert-img-to-webp.mjs --rewrite-refs
 *   node scripts/convert-img-to-webp.mjs --delete-originals
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IMG_ROOT = path.join(ROOT, "public", "img");
const pngOnly = process.argv.includes("--png-only");
const EXT_RE = pngOnly ? /\.png$/i : /\.(jpe?g|png)$/i;
const rewriteRefs = process.argv.includes("--rewrite-refs");
const deleteOriginals = process.argv.includes("--delete-originals");

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...(await walk(full)));
    else if (EXT_RE.test(ent.name)) out.push(full);
  }
  return out;
}

/** True if any pixel has alpha < 255 (real transparency). */
async function hasRealTransparency(src, meta) {
  if (!meta.hasAlpha) return false;
  const { channels } = await sharp(src).ensureAlpha().stats();
  const alpha = channels[3];
  return Boolean(alpha && alpha.min < 255);
}

async function convertOne(src) {
  const ext = path.extname(src);
  const dest = src.slice(0, -ext.length) + ".webp";
  const tmp = dest + ".tmp";
  const meta = await sharp(src).metadata();
  const keepAlpha = await hasRealTransparency(src, meta);

  let pipeline = sharp(src);
  if (keepAlpha) pipeline = pipeline.ensureAlpha();

  // PNG → quality 92 (alpha via alphaQuality 100); JPG → quality 95
  const isPng = /\.png$/i.test(ext);
  const webpOpts = {
    quality: isPng ? 92 : 95,
    alphaQuality: 100,
    effort: 6,
    smartSubsample: true,
  };

  await pipeline.webp(webpOpts).toFile(tmp);
  try {
    await fs.rename(tmp, dest);
  } catch (err) {
    // Windows: dest may be locked/exist from a prior run — overwrite via copy
    if (err && (err.code === "EPERM" || err.code === "EEXIST")) {
      await fs.copyFile(tmp, dest);
      await fs.unlink(tmp).catch(() => {});
    } else {
      await fs.unlink(tmp).catch(() => {});
      throw err;
    }
  }

  const outMeta = await sharp(dest).metadata();
  if (meta.width !== outMeta.width || meta.height !== outMeta.height) {
    throw new Error(
      `size mismatch ${path.relative(ROOT, src)}: ${meta.width}x${meta.height} → ${outMeta.width}x${outMeta.height}`,
    );
  }
  if (keepAlpha && !outMeta.hasAlpha) {
    throw new Error(`alpha lost: ${path.relative(ROOT, src)}`);
  }
  return {
    src,
    dest,
    width: outMeta.width,
    height: outMeta.height,
    hasAlpha: !!outMeta.hasAlpha,
    keepAlpha,
  };
}

async function rewriteCodeRefs(converted) {
  const map = new Map();
  for (const { src, dest } of converted) {
    const relSrc = "/" + path.relative(path.join(ROOT, "public"), src).replaceAll("\\", "/");
    const relDest = "/" + path.relative(path.join(ROOT, "public"), dest).replaceAll("\\", "/");
    map.set(relSrc, relDest);
    map.set(relSrc.slice(1), relDest.slice(1));
  }

  const scanRoots = [path.join(ROOT, "src"), path.join(ROOT, "public")];
  const codeExt = /\.(tsx?|jsx?|mjs|cjs|json|css|md|html)$/i;
  const files = [];
  async function walkCode(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      if (ent.name === "node_modules" || ent.name === ".next" || ent.name === ".git") continue;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) await walkCode(full);
      else if (codeExt.test(ent.name)) files.push(full);
    }
  }
  for (const r of scanRoots) await walkCode(r);

  const keys = [...map.keys()].sort((a, b) => b.length - a.length);
  let filesChanged = 0;
  let replacements = 0;

  for (const file of files) {
    let text = await fs.readFile(file, "utf8");
    let next = text;
    for (const key of keys) {
      if (!next.includes(key)) continue;
      const val = map.get(key);
      const parts = next.split(key);
      if (parts.length > 1) {
        replacements += parts.length - 1;
        next = parts.join(val);
      }
    }
    if (next !== text) {
      await fs.writeFile(file, next, "utf8");
      filesChanged += 1;
    }
  }
  return { filesChanged, replacements };
}

async function main() {
  const sources = await walk(IMG_ROOT);
  console.log(`Found ${sources.length} jpg/png under public/img`);

  const converted = [];
  const errors = [];
  let i = 0;
  for (const src of sources) {
    i += 1;
    const rel = path.relative(ROOT, src);
    try {
      // clean leftover tmp
      const ext = path.extname(src);
      const tmp = src.slice(0, -ext.length) + ".webp.tmp";
      await fs.unlink(tmp).catch(() => {});

      const result = await convertOne(src);
      converted.push(result);
      if (i % 25 === 0 || i === sources.length) {
        console.log(`[${i}/${sources.length}] ${rel} → webp${result.keepAlpha ? " (alpha)" : ""}`);
      }
    } catch (err) {
      errors.push({ src: rel, error: String(err?.message || err) });
      console.error(`FAIL ${rel}:`, err?.message || err);
    }
  }

  console.log(`Converted: ${converted.length}, failed: ${errors.length}`);

  if (rewriteRefs && converted.length) {
    const { filesChanged, replacements } = await rewriteCodeRefs(converted);
    console.log(`Refs updated: ${replacements} in ${filesChanged} files`);
  }

  if (deleteOriginals) {
    for (const { src } of converted) {
      await fs.unlink(src);
    }
    console.log(`Deleted ${converted.length} originals`);
  }

  if (errors.length) {
    console.error("Failures:");
    for (const e of errors) console.error(` - ${e.src}: ${e.error}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
