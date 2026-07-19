/**
 * lib/search.ts — shared search + filtering used by /search and /browse.
 *
 * Search spans everything the spec asks for: brand, model, year, network,
 * OS, camera, series and free-text keyword. Filtering supports brand, year,
 * shape, OS, network, camera presence, color and series.
 */

import type { Brand, Phone, PhoneShape } from "./types";
import { normalizeNetwork } from "./data";

export interface PhoneFilters {
  brand?: string;
  year?: number;
  shape?: PhoneShape;
  os?: string;
  network?: string;
  color?: string;
  series?: string;
  hasCamera?: boolean;
}

const isMeaningful = (v?: string) => !!v && v.trim() !== "" && v.trim() !== "N/A";

/** Build the searchable text blob for a phone (brand/model/year/os/…). */
function haystack(phone: Phone, brands: Record<string, Brand>): string {
  const brand = brands[phone.brand];
  return [
    phone.name,
    brand?.name ?? phone.brand,
    String(phone.year),
    phone.series ?? "",
    phone.specs.os,
    phone.specs.camera,
    phone.specs.network,
    phone.shape,
    phone.desc,
    phone.colors.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

/** Full-text-ish search: every whitespace-separated token must match. */
export function searchPhones(
  phones: Phone[],
  query: string,
  brands: Record<string, Brand>
): Phone[] {
  const q = query.trim().toLowerCase();
  if (!q) return phones;
  const tokens = q.split(/\s+/).filter(Boolean);
  return phones.filter((p) => {
    const hay = haystack(p, brands);
    return tokens.every((t) => hay.includes(t));
  });
}

export function matchesFilters(phone: Phone, f: PhoneFilters): boolean {
  if (f.brand && phone.brand !== f.brand) return false;
  if (f.year && phone.year !== f.year) return false;
  if (f.shape && phone.shape !== f.shape) return false;
  if (f.series && phone.series !== f.series) return false;
  if (f.os && phone.specs.os !== f.os) return false;
  if (f.network && normalizeNetwork(phone.specs.network) !== f.network) return false;
  if (f.color && !phone.colors.some((c) => c.toLowerCase().includes(f.color!.toLowerCase())))
    return false;
  if (f.hasCamera && !isMeaningful(phone.specs.camera)) return false;
  if (f.hasCamera && /none|no camera/i.test(phone.specs.camera)) return false;
  return true;
}

export function applyFilters(phones: Phone[], f: PhoneFilters): Phone[] {
  return phones.filter((p) => matchesFilters(p, f));
}
