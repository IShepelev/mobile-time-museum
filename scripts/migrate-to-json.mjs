#!/usr/bin/env node
/**
 * scripts/migrate-to-json.mjs
 *
 * ONE-TIME migration: reads the existing hand-written phone data out of
 * lib/phones/(brand)/(decade).ts and the brands out of lib/brands.ts, plus
 * the YEAR_INTROS map out of lib/data.ts, and writes them as plain JSON to
 * the /data folder:
 *
 *   data/phones.json  — array of Phone objects (exact runtime shape)
 *   data/brands.json  — Record<brandId, Brand>
 *   data/years.json   — Record<year, introText>
 *
 * After this runs, /data is the single source of truth for the whole app
 * and the CMS. The original .ts files are left untouched (kept as an
 * archival source) but are no longer imported anywhere.
 *
 * Zero dependencies — parses the literal source text with narrow regexes
 * tuned to our own known object format (not a general JS parser).
 *
 * Usage: node scripts/migrate-to-json.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PHONES_DIR = path.join(ROOT, "lib", "phones");
const BRANDS_FILE = path.join(ROOT, "lib", "brands.ts");
const DATA_FILE = path.join(ROOT, "lib", "data.ts");
const OUT_DIR = path.join(ROOT, "data");

const unescape = (s) =>
  s == null ? s : s.replace(/\\"/g, '"').replace(/\\\\/g, "\\").replace(/\\n/g, "\n");

// ---- Extract each `{ id:"..." ... }` object literal by brace matching ----
function extractObjectBlocks(src, marker) {
  const blocks = [];
  let i = 0;
  for (;;) {
    const idx = src.indexOf(marker, i);
    if (idx === -1) break;
    let depth = 0;
    let j = idx;
    let started = false;
    let inStr = false;
    let quote = "";
    while (j < src.length) {
      const ch = src[j];
      if (inStr) {
        if (ch === "\\") j++;
        else if (ch === quote) inStr = false;
      } else if (ch === '"' || ch === "'") {
        inStr = true;
        quote = ch;
      } else if (ch === "{") {
        depth++;
        started = true;
      } else if (ch === "}") {
        depth--;
        if (started && depth === 0) {
          j++;
          break;
        }
      }
      j++;
    }
    blocks.push(src.slice(idx, j));
    i = j;
  }
  return blocks;
}

function parsePhoneBlock(block) {
  const getStr = (key, scope = block) => {
    const m = scope.match(new RegExp(`${key}\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
    return m ? unescape(m[1]) : "";
  };
  const getNum = (key) => {
    const m = block.match(new RegExp(`${key}\\s*:\\s*(\\d+)`));
    return m ? Number(m[1]) : 0;
  };
  const getList = (key) => {
    const m = block.match(new RegExp(`${key}\\s*:\\s*\\[([^\\]]*)\\]`));
    if (!m) return [];
    return m[1]
      .split(",")
      .map((s) => unescape(s.trim().replace(/^"|"$/g, "")))
      .filter(Boolean);
  };

  const specsMatch = block.match(/specs\s*:\s*\{([\s\S]*)\}\s*\}\s*,?\s*$/);
  const specsBlock = specsMatch ? specsMatch[1] : "";
  const spec = (key) => getStr(key, specsBlock);

  return {
    id: getStr("id"),
    brand: getStr("brand"),
    name: getStr("name"),
    year: getNum("year"),
    announced: getStr("announced"),
    released: getStr("released"),
    price: getStr("price"),
    colors: getList("colors"),
    shape: getStr("shape"),
    desc: getStr("desc"),
    fact: getStr("fact"),
    specs: {
      display: spec("display"),
      processor: spec("processor"),
      battery: spec("battery"),
      camera: spec("camera"),
      memory: spec("memory"),
      connectivity: spec("connectivity"),
      dimensions: spec("dimensions"),
      weight: spec("weight"),
      network: spec("network"),
      os: spec("os"),
      package: spec("package"),
    },
    status: "published",
  };
}

function parseBrands(src) {
  const brands = {};
  const re = /^\s{2}([a-z0-9]+)\s*:\s*\{\s*$/gm;
  const positions = [];
  let match;
  while ((match = re.exec(src)) !== null) {
    positions.push({ key: match[1], index: match.index });
  }
  for (let k = 0; k < positions.length; k++) {
    const start = positions[k].index;
    const end = k + 1 < positions.length ? positions[k + 1].index : src.length;
    const chunk = src.slice(start, end);
    const name = chunk.match(/name\s*:\s*"((?:[^"\\]|\\.)*)"/);
    const founded = chunk.match(/founded\s*:\s*"((?:[^"\\]|\\.)*)"/);
    const history = chunk.match(/history\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (!name) continue;
    brands[positions[k].key] = {
      name: unescape(name[1]),
      founded: founded ? unescape(founded[1]) : "",
      history: history ? unescape(history[1]) : "",
    };
  }
  return brands;
}

function parseYears(src) {
  const years = {};
  const start = src.indexOf("YEAR_INTROS");
  const body = src.slice(start);
  const re = /(\d{4})\s*:\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    years[m[1]] = unescape(m[2]);
  }
  return years;
}

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full));
    else if (entry.name.endsWith(".ts") && entry.name !== "index.ts") results.push(full);
  }
  return results;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const phones = [];
  for (const file of walk(PHONES_DIR)) {
    const src = fs.readFileSync(file, "utf8");
    for (const block of extractObjectBlocks(src, '{ id:"')) {
      const parsed = parsePhoneBlock(block);
      if (parsed.id) phones.push(parsed);
    }
  }
  phones.sort((a, b) => a.year - b.year || a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));

  const brands = parseBrands(fs.readFileSync(BRANDS_FILE, "utf8"));
  const years = parseYears(fs.readFileSync(DATA_FILE, "utf8"));

  fs.writeFileSync(path.join(OUT_DIR, "phones.json"), JSON.stringify(phones, null, 2) + "\n");
  fs.writeFileSync(path.join(OUT_DIR, "brands.json"), JSON.stringify(brands, null, 2) + "\n");
  fs.writeFileSync(path.join(OUT_DIR, "years.json"), JSON.stringify(years, null, 2) + "\n");

  // ---- Sanity ----
  const ids = phones.map((p) => p.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  const brandIds = new Set(Object.keys(brands));
  const orphans = phones.filter((p) => !brandIds.has(p.brand));
  const emptyField = phones.filter(
    (p) => !p.id || !p.brand || !p.name || !p.year || !p.shape || !p.desc
  );

  console.log(`phones: ${phones.length}`);
  console.log(`brands: ${Object.keys(brands).length}`);
  console.log(`years:  ${Object.keys(years).length}`);
  console.log(`duplicate ids: ${dupes.length ? dupes.join(", ") : "none"}`);
  console.log(`orphan phones (unknown brand): ${orphans.length ? orphans.map((p) => p.id).join(", ") : "none"}`);
  console.log(`phones missing a required field: ${emptyField.length ? emptyField.map((p) => p.id).join(", ") : "none"}`);
}

main();
