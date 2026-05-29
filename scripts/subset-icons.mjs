/**
 * Subsets the Material Symbols Outlined variable font to only the icons the app
 * actually uses, keeping the output tiny (the full font is ~4MB).
 *
 * It scans `src/` for both literal ligatures (`<span class="material-symbols-outlined">home</span>`)
 * and dynamic icon arrays (`icon: 'home'`), so the subset stays in sync with the code.
 *
 * Run with: `bun run icons:subset`
 * Output: src/lib/assets/fonts/material-symbols-outlined-subset.woff2
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import subsetFont from 'subset-font';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');
const FONT_IN = join(ROOT, 'node_modules/material-symbols/material-symbols-outlined.woff2');
const FONT_OUT = join(ROOT, 'src/lib/assets/fonts/material-symbols-outlined-subset.woff2');

/** Recursively collect source files we may reference icons from. */
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (['.svelte', '.ts', '.js'].includes(extname(full))) out.push(full);
  }
  return out;
}

const LITERAL_RE = /material-symbols-outlined[^"]*"[^>]*>\s*([a-z0-9_]+)/g;
const ARRAY_RE = /icon:\s*'([a-z0-9_]+)'/g;

const icons = new Set();
for (const file of walk(SRC)) {
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(LITERAL_RE)) icons.add(m[1]);
  for (const m of text.matchAll(ARRAY_RE)) icons.add(m[1]);
}

const names = [...icons].sort();
if (names.length === 0) {
  console.error('No Material Symbols icons found — aborting to avoid an empty subset.');
  process.exit(1);
}

// Harfbuzz computes GSUB closure over the included characters, retaining the
// ligature glyphs for these icon names. Passing the names as the text is enough.
//
// Pin the variable axes we don't vary (wght 400, GRAD 0, opsz 24) to drop the
// variable-font payload from ~4MB to ~280KB. Keep the FILL axis so the `.filled`
// icon variant (FILL 1) still renders.
const text = names.join(' ');
const original = readFileSync(FONT_IN);
const subset = await subsetFont(original, text, {
  targetFormat: 'woff2',
  variationAxes: { wght: 400, GRAD: 0, opsz: 24 },
});
writeFileSync(FONT_OUT, subset);

console.log(`Subset ${names.length} icons (${(subset.length / 1024).toFixed(1)} KB):`);
console.log(names.join(', '));
