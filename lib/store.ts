/**
 * lib/store.ts — the in-browser editing store for the Admin Panel (CMS).
 *
 * Architecture (matches the chosen "in-browser + export JSON" model):
 *
 *  • The PUBLIC site reads the committed, bundled data from /data/*.json
 *    via lib/data.ts. That never changes at runtime.
 *  • The CMS keeps a *working copy* of the whole dataset in localStorage,
 *    seeded from the bundled JSON on first use. All edits (add / edit /
 *    delete phones, brands, years; drafts; image uploads as base64) happen
 *    on that working copy — entirely in the browser, no backend.
 *  • "Preview" renders the public pages against the working copy.
 *  • "Publish" marks drafts as published and lets the admin download the
 *    updated phones.json / brands.json / years.json to drop into /data and
 *    redeploy. That is the single commit step.
 *
 * This module is framework-agnostic; the React binding (useSyncExternalStore)
 * lives in lib/useMuseum.ts.
 */

import type { Brand, Phone, PhoneShape } from "./types";
import bundledPhones from "@/data/phones.json";
import bundledBrands from "@/data/brands.json";
import bundledYears from "@/data/years.json";

export interface MuseumData {
  phones: Phone[];
  brands: Record<string, Brand>;
  years: Record<string, string>;
}

const STORAGE_KEY = "mtm-cms-working-copy-v1";
const AUTH_KEY = "mtm-cms-authed";

/** Soft gate only — this is a static site with no server, so this is NOT
 *  real authentication. It keeps the editor out of casual hands. Override
 *  with NEXT_PUBLIC_ADMIN_PASSWORD at build time. */
export const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "museum";

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------
export function seedData(): MuseumData {
  return {
    phones: structuredClone(bundledPhones) as unknown as Phone[],
    brands: structuredClone(bundledBrands) as unknown as Record<string, Brand>,
    years: structuredClone(bundledYears) as unknown as Record<string, string>,
  };
}

// ---------------------------------------------------------------------------
// Persistence + subscription (for useSyncExternalStore)
// ---------------------------------------------------------------------------
let cache: MuseumData | null = null;
const listeners = new Set<() => void>();

function isBrowser() {
  return typeof window !== "undefined";
}

export function getData(): MuseumData {
  if (cache) return cache;
  if (!isBrowser()) {
    cache = seedData();
    return cache;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as MuseumData) : seedData();
  } catch {
    cache = seedData();
  }
  return cache;
}

function commit(next: MuseumData) {
  cache = next;
  if (isBrowser()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      // Most likely the localStorage quota (base64 images are large).
      console.error("Failed to persist CMS working copy:", err);
      if (isBrowser()) {
        alert(
          "Could not save — browser storage is full. Large images stored as data URLs can exceed the limit. Try smaller images or export your data."
        );
      }
    }
  }
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): MuseumData {
  return getData();
}

/** Stable snapshot for SSR / first hydration (must not allocate per call). */
let serverSeed: MuseumData | null = null;
export function getServerSnapshot(): MuseumData {
  if (!serverSeed) serverSeed = seedData();
  return serverSeed;
}

/** Discard all local edits and re-seed from the committed bundled JSON. */
export function resetToPublished() {
  if (isBrowser()) window.localStorage.removeItem(STORAGE_KEY);
  cache = null;
  commit(seedData());
}

/** True when the working copy differs from the committed bundle. */
export function hasUnpublishedChanges(): boolean {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(STORAGE_KEY) !== null;
}

// ---------------------------------------------------------------------------
// Auth (soft gate)
// ---------------------------------------------------------------------------
export function login(password: string): boolean {
  const ok = password === ADMIN_PASSWORD;
  if (ok && isBrowser()) window.sessionStorage.setItem(AUTH_KEY, "1");
  return ok;
}
export function logout() {
  if (isBrowser()) window.sessionStorage.removeItem(AUTH_KEY);
}
export function isAuthed(): boolean {
  return isBrowser() && window.sessionStorage.getItem(AUTH_KEY) === "1";
}

// ---------------------------------------------------------------------------
// Phone CRUD
// ---------------------------------------------------------------------------
export function upsertPhone(phone: Phone) {
  const data = getData();
  const phones = [...data.phones];
  const idx = phones.findIndex((p) => p.id === phone.id);
  if (idx === -1) phones.push(phone);
  else phones[idx] = phone;
  commit({ ...data, phones });
}

export function deletePhone(id: string) {
  const data = getData();
  commit({ ...data, phones: data.phones.filter((p) => p.id !== id) });
}

export function setPhoneStatus(id: string, status: "draft" | "published") {
  const data = getData();
  commit({
    ...data,
    phones: data.phones.map((p) => (p.id === id ? { ...p, status } : p)),
  });
}

// ---------------------------------------------------------------------------
// Brand CRUD
// ---------------------------------------------------------------------------
export function upsertBrand(id: string, brand: Brand) {
  const data = getData();
  commit({ ...data, brands: { ...data.brands, [id]: brand } });
}

export function deleteBrand(id: string) {
  const data = getData();
  const brands = { ...data.brands };
  delete brands[id];
  commit({ ...data, brands });
}

// ---------------------------------------------------------------------------
// Year CRUD
// ---------------------------------------------------------------------------
export function upsertYear(year: string, intro: string) {
  const data = getData();
  commit({ ...data, years: { ...data.years, [year]: intro } });
}

export function deleteYear(year: string) {
  const data = getData();
  const years = { ...data.years };
  delete years[year];
  commit({ ...data, years });
}

export function renameYear(oldYear: string, newYear: string) {
  const data = getData();
  if (oldYear === newYear) return;
  const years = { ...data.years };
  years[newYear] = years[oldYear] ?? "";
  delete years[oldYear];
  commit({ ...data, years });
}

// ---------------------------------------------------------------------------
// Publish workflow
// ---------------------------------------------------------------------------
/** Promote every draft to published in the working copy. */
export function publishAllDrafts() {
  const data = getData();
  commit({
    ...data,
    phones: data.phones.map((p) => ({ ...p, status: "published" as const })),
  });
}

/** The three files to download and commit into /data. */
export function exportFiles(): { name: string; content: string }[] {
  const data = getData();
  const sortedPhones = [...data.phones].sort(
    (a, b) => a.year - b.year || a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name)
  );
  return [
    { name: "phones.json", content: JSON.stringify(sortedPhones, null, 2) + "\n" },
    { name: "brands.json", content: JSON.stringify(data.brands, null, 2) + "\n" },
    { name: "years.json", content: JSON.stringify(data.years, null, 2) + "\n" },
  ];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** A blank phone template with every field present and sensible defaults. */
export function blankPhone(brandId = ""): Phone {
  return {
    id: "",
    brand: brandId,
    name: "",
    year: new Date().getFullYear(),
    announced: "",
    released: "",
    price: "",
    colors: [],
    shape: "modern" as PhoneShape,
    desc: "",
    fact: "",
    series: "",
    history: "",
    wikipedia: "",
    source: "",
    image: "",
    images: [],
    specs: {
      display: "",
      processor: "",
      battery: "",
      camera: "",
      frontCamera: "",
      memory: "",
      storage: "",
      connectivity: "",
      dimensions: "",
      weight: "",
      network: "",
      os: "",
      package: "",
    },
    status: "draft",
  };
}

export function blankBrand(): Brand {
  return {
    name: "",
    founded: "",
    closed: "",
    country: "",
    history: "",
    description: "",
    logo: "",
    website: "",
    wikipedia: "",
  };
}

/** Read a File (from an <input type=file>) as a base64 data URL. */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
