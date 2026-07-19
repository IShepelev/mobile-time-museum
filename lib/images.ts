/**
 * IMAGE PIPELINE
 * ---------------------------------------------------------------
 * Real product photography is sourced from Wikimedia Commons, where
 * files are published under CC BY-SA / CC BY licenses that permit
 * reuse with attribution. We link via Commons' stable
 * `Special:FilePath/<filename>` redirect, which always resolves to
 * the current file — no need to hardcode brittle upload.wikimedia.org
 * hashes.
 *
 * Coverage is intentionally partial: only entries below have a
 * verified, licensed source photo. Every other phone in the
 * collection falls back to its illustrated museum-plate glyph
 * (see components/PhoneGlyph.tsx) rather than showing a broken
 * image or an unlicensed placeholder.
 *
 * To extend coverage: find the file on commons.wikimedia.org,
 * copy its exact filename (including spaces/case), add it below,
 * and note the license + author for attribution in the phone
 * exhibit page.
 */

export interface PhotoSource {
  file: string; // exact Commons filename
  license: string; // short license label shown as attribution
  author?: string;
}

const COMMONS_BASE = "https://commons.wikimedia.org/wiki/Special:FilePath/";

export const PHONE_PHOTOS: Record<string, PhotoSource> = {
  "motorola-dynatac-8000x": { file: "DynaTAC8000X.jpg", license: "CC BY-SA 3.0" },
  "motorola-startac": { file: "MotorolaStarTAC.jpg", license: "CC BY-SA 3.0", author: "ProhibitOnions" },
  "nokia-3210": { file: "Nokia 3210.jpg", license: "CC BY-SA" },
  "nokia-3310": { file: "Nokia 3310 grey left side.jpg", license: "CC BY-SA" },
  "motorola-razr-v3": { file: "Motorola Razr V3.jpg", license: "CC BY-SA" },
  "apple-iphone": { file: "IPhone First Generation.jpg", license: "CC BY-SA 2.0" },
  "blackberry-bold-9900": { file: "BlackBerry Bold Touch 9900.jpg", license: "CC BY 4.0" },
  "apple-iphone-4": { file: "IPhone 4 Black.jpg", license: "CC BY-SA" },
  "samsung-galaxy-s": { file: "Samsung Galaxy S White.png", license: "CC BY-SA 3.0" },
  "samsung-galaxy-z-flip": { file: "Samsung Galaxy Z Flip.jpg", license: "CC BY-SA 4.0" },
  "apple-iphone-14-pro": { file: "IPhone 14 Pro.jpg", license: "CC BY-SA 4.0" },
  "apple-iphone-14-pro-max": { file: "Back of the iPhone 14 Pro Max.jpg", license: "CC BY-SA 4.0" },
};

export function photoUrl(phoneId: string): string | null {
  const src = PHONE_PHOTOS[phoneId];
  if (!src) return null;
  return COMMONS_BASE + encodeURIComponent(src.file);
}

export function photoAttribution(phoneId: string): PhotoSource | null {
  return PHONE_PHOTOS[phoneId] ?? null;
}

import type { Phone } from "./types";

/**
 * Resolve the best main image for a phone, in priority order:
 *   1. an explicit `image` set on the record (CMS upload or custom URL)
 *   2. the curated Wikimedia Commons photo (if one exists)
 *   3. null → the illustrated PhoneGlyph fallback is used by <PhoneImage>
 */
export function resolveMainImage(phone: Phone): string | null {
  if (phone.image && phone.image.trim()) return phone.image.trim();
  return photoUrl(phone.id);
}

/** All gallery images for a phone: the resolved main image first, then any
 *  extra CMS gallery images, de-duplicated. */
export function galleryImages(phone: Phone): string[] {
  const out: string[] = [];
  const main = resolveMainImage(phone);
  if (main) out.push(main);
  for (const img of phone.images ?? []) {
    if (img.src && !out.includes(img.src)) out.push(img.src);
  }
  return out;
}
