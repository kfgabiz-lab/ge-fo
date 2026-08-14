/**
 * Recompress public webp files larger than 1MB.
 * Caps oversized photos; keeps alpha only when real transparency exists.
 *
 *   node scripts/optimize-large-webp.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_ROOT = path.join(ROOT, "public");
const MAX_BYTES = 1024 * 1024;

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...(await walk(full)));
      continue;
    }
    if (!/\.webp$/i.test(ent.name)) continue;
    if (/\.(opt|bak)\.webp$/i.test(ent.name)) continue;
    out.push(full);
  }
  return out;
}

async function hasRealTransparency(input, meta) {
  if (!meta.hasAlpha) return false;
  const { channels } = await sharp(input).ensureAlpha().stats();
  const alpha = channels[3];
  return Boolean(alpha && alpha.min < 255);
}

function maxEdgeFor(src, meta) {
  const base = path.basename(src).toLowerCase();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (base === "map.webp" || base.includes("hero_bg") || base.includes("mission-bg")) {
    return 2560;
  }
  if (Math.max(w, h) <= 1920) return Math.max(w, h);
  return 1920;
}

async function encodeWebp(input, dest, { width, height, keepAlpha, hasAlpha, quality }) {
  let pipeline = sharp(input);
  if (keepAlpha) pipeline = pipeline.ensureAlpha();
  else if (hasAlpha) pipeline = pipeline.removeAlpha();

  if (width && height) {
    pipeline = pipeline.resize({
      width,
      height,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const buf = await pipeline
    .webp({
      quality,
      alphaQuality: keepAlpha ? 90 : 100,
      effort: 6,
      smartSubsample: true,
    })
    .toBuffer();

  await fs.writeFile(dest, buf);
  pipeline.destroy();
  return buf.length;
}

async function replaceViaRename(from, to) {
  const bak = `${to}.bak`;
  await fs.unlink(bak).catch(() => {});
  await fs.rename(to, bak);
  try {
    await fs.copyFile(from, to);
  } catch (err) {
    await fs.rename(bak, to).catch(() => {});
    throw err;
  }
  await fs.unlink(bak).catch(() => {});
}

async function optimizeOne(src) {
  const input = await fs.readFile(src);
  const meta = await sharp(input).metadata();
  const keepAlpha = await hasRealTransparency(input, meta);
  const orig = input.length;
  const maxEdge = maxEdgeFor(src, meta);
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const scale = Math.min(1, maxEdge / Math.max(w, h));
  const width = Math.round(w * scale);
  const height = Math.round(h * scale);

  const tmpDest = `${src}.opt.webp`;
  let quality = 88;
  let size = orig;

  for (const q of [88, 82, 76]) {
    quality = q;
    size = await encodeWebp(input, tmpDest, {
      width,
      height,
      keepAlpha,
      hasAlpha: !!meta.hasAlpha,
      quality,
    });
    if (size <= MAX_BYTES) break;
  }

  if (size >= orig) {
    await fs.unlink(tmpDest).catch(() => {});
    return { skipped: true, reason: "not smaller", orig };
  }

  return {
    skipped: false,
    src,
    tmpDest,
    orig,
    next: size,
    quality,
    keepAlpha,
    from: `${w}x${h}`,
    width,
    height,
  };
}

async function main() {
  const files = await walk(PUBLIC_ROOT);
  const large = [];
  for (const f of files) {
    const st = await fs.stat(f);
    if (st.size > MAX_BYTES) large.push(f);
  }
  large.sort((a, b) => a.localeCompare(b));
  console.log(`Found ${large.length} webp > 1MB`);

  const ready = [];
  for (const src of large) {
    const rel = path.relative(ROOT, src);
    try {
      const result = await optimizeOne(src);
      if (result.skipped) {
        console.log(`SKIP encode ${rel} (${(result.orig / 1024).toFixed(0)}KB) — ${result.reason}`);
      } else {
        ready.push(result);
        console.log(
          `ENC  ${rel} ${(result.orig / 1024).toFixed(0)}KB → ${(result.next / 1024).toFixed(0)}KB  ${result.from} → ${result.width}x${result.height}  q${result.quality}${result.keepAlpha ? " alpha" : ""}`,
        );
      }
    } catch (err) {
      console.error(`FAIL encode ${rel}:`, err?.message || err);
      process.exitCode = 1;
    }
  }

  for (const item of ready) {
    const rel = path.relative(ROOT, item.src);
    try {
      await replaceViaRename(item.tmpDest, item.src);
      await fs.unlink(item.tmpDest).catch(() => {});
      const outMeta = await sharp(await fs.readFile(item.src)).metadata();
      console.log(`OK   ${rel} ${outMeta.width}x${outMeta.height} ${(item.next / 1024).toFixed(0)}KB`);
    } catch (err) {
      console.error(`FAIL replace ${rel}:`, err?.message || err);
      process.exitCode = 1;
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
