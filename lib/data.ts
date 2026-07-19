/**
 * lib/data.ts — the public data façade for the whole site.
 *
 * SOURCE OF TRUTH IS NOW /data/*.json (migrated from the original
 * hand-written lib/phones/**.ts + lib/brands.ts by scripts/migrate-to-json.mjs).
 * The frontend reads exclusively from those JSON files, so new phones,
 * brands and years can be added through the in-browser Admin Panel and
 * exported back to /data — no TypeScript editing required.
 *
 * The exported API below is a SUPERSET of the original one: every symbol
 * that existed before (BRANDS, PHONES, YEARS, MIN_YEAR, MAX_YEAR,
 * YEAR_INTROS, getPhone, brandsInYear, yearsForBrand, phonesFor) still
 * exists with the same signature, so every existing page keeps working.
 */

import type { Brand, Phone, PhoneShape } from "./types";
import phonesJson from "@/data/phones.json";
import brandsJson from "@/data/brands.json";
import yearsJson from "@/data/years.json";

export type { PhoneShape, Brand, Phone, PhoneSpecs, ImageAsset } from "./types";

// ---- Raw data (all records, including any drafts) --------------------------
const ALL_PHONES = phonesJson as unknown as Phone[];

export const BRANDS = brandsJson as unknown as Record<string, Brand>;

/** Public collection: published records only (drafts are hidden from the
 *  live site but remain available to the CMS). */
export const PHONES: Phone[] = ALL_PHONES.filter((p) => (p.status ?? "published") === "published");

/** Every record regardless of status. */
export const ALL_PHONE_RECORDS: Phone[] = ALL_PHONES;

// ---- Derived ---------------------------------------------------------------
export const YEARS = [...new Set(PHONES.map((p) => p.year))].sort((a, b) => a - b);
export const MIN_YEAR = YEARS[0];
export const MAX_YEAR = YEARS[YEARS.length - 1];

export const YEAR_INTROS: Record<number, string> = Object.fromEntries(
  Object.entries(yearsJson as Record<string, string>).map(([y, intro]) => [Number(y), intro])
);

// ---- Lookups (original signatures preserved) -------------------------------
export function getPhone(id: string): Phone | undefined {
  return PHONES.find((p) => p.id === id);
}

export function getBrand(brandId: string): Brand | undefined {
  return BRANDS[brandId];
}

export function brandsInYear(year: number): string[] {
  return [...new Set(PHONES.filter((p) => p.year === year).map((p) => p.brand))];
}

export function yearsForBrand(brandId: string): number[] {
  return [...new Set(PHONES.filter((p) => p.brand === brandId).map((p) => p.year))].sort(
    (a, b) => a - b
  );
}

export function phonesFor(brandId: string, year: number): Phone[] {
  return PHONES.filter((p) => p.brand === brandId && p.year === year);
}

export function phonesForBrand(brandId: string): Phone[] {
  return PHONES.filter((p) => p.brand === brandId).sort((a, b) => a.year - b.year);
}

// ---- Relationships for the exhibit page ------------------------------------

/** Phones from the same brand, nearest in time — for "Related" and prev/next. */
export function relatedPhones(phone: Phone, limit = 4): Phone[] {
  return PHONES.filter((p) => p.brand === phone.brand && p.id !== phone.id)
    .sort(
      (a, b) =>
        Math.abs(a.year - phone.year) - Math.abs(b.year - phone.year) || a.year - b.year
    )
    .slice(0, limit);
}

/** Previous / next model within the same brand (chronological). */
export function siblingPhones(phone: Phone): { prev?: Phone; next?: Phone } {
  const line = phonesForBrand(phone.brand);
  const idx = line.findIndex((p) => p.id === phone.id);
  if (idx === -1) return {};
  return { prev: line[idx - 1], next: line[idx + 1] };
}

// ---- Facets (for filters) --------------------------------------------------
export const SHAPES: PhoneShape[] = [
  "brick",
  "candybar",
  "flip",
  "slider",
  "touch",
  "modern",
  "fold",
];

export function uniqueSorted<T>(values: T[]): T[] {
  return [...new Set(values)].sort();
}

/** Networks are stored as free text like "3G · Mini-SIM"; pull the leading
 *  generation token so filters group sensibly (2G/3G/4G/5G/GSM/NMT…). */
export function normalizeNetwork(raw: string): string {
  if (!raw) return "";
  const token = raw.split("·")[0].trim().split(" ")[0].trim();
  return token && token !== "N/A" ? token : "";
}

export const OPERATING_SYSTEMS = uniqueSorted(
  PHONES.map((p) => p.specs.os).filter((v) => v && v !== "N/A")
);
export const NETWORKS = uniqueSorted(
  PHONES.map((p) => normalizeNetwork(p.specs.network)).filter(Boolean)
);
export const ALL_COLORS = uniqueSorted(
  PHONES.flatMap((p) => p.colors).filter((c) => c && c !== "N/A")
);
export const ALL_SERIES = uniqueSorted(PHONES.map((p) => p.series ?? "").filter(Boolean));
