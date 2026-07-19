/**
 * Shared type definitions for the phone collection.
 *
 * The original core fields are preserved EXACTLY as they were in the
 * first version of the museum, so every existing phone record and every
 * page/component keeps working without modification. New fields added for
 * the CMS / richer exhibit pages are all OPTIONAL — existing data that
 * doesn't have them stays perfectly valid.
 */

export type PhoneShape =
  | "brick"
  | "flip"
  | "slider"
  | "candybar"
  | "touch"
  | "modern"
  | "fold";

export type PublishStatus = "published" | "draft";

/** One image attached to a phone. Stored either as a remote URL or an
 *  inline base64 data URL (used by the in-browser CMS uploader). */
export interface ImageAsset {
  /** URL or data: URI */
  src: string;
  /** Optional short caption / role, e.g. "Front", "Box", "Advertisement" */
  caption?: string;
  /** Optional attribution / license note */
  credit?: string;
}

export interface PhoneSpecs {
  display: string;
  processor: string;
  battery: string;
  camera: string;
  memory: string;
  connectivity: string;
  dimensions: string;
  weight: string;
  network: string;
  os: string;
  package: string;
  /** New optional specs — safe to omit on legacy records. */
  frontCamera?: string;
  storage?: string;
  chipset?: string;
  sim?: string;
}

export interface Phone {
  // ---- Original core fields (unchanged) ----
  id: string;
  brand: string;
  name: string;
  year: number;
  announced: string;
  released: string;
  price: string;
  colors: string[];
  shape: PhoneShape;
  desc: string;
  fact: string;
  specs: PhoneSpecs;

  // ---- New optional fields (CMS / richer pages) ----
  /** Product line / family, e.g. "Galaxy S", "iPhone". */
  series?: string;
  /** Longer history / curator text beyond the short `desc`. */
  history?: string;
  /** Gallery images (in addition to the main resolved photo). */
  images?: ImageAsset[];
  /** Explicit main image override (else the Wikimedia pipeline is used). */
  image?: string;
  wikipedia?: string;
  source?: string;
  predecessorId?: string;
  successorId?: string;
  /** Editorial workflow — defaults to "published" when absent. */
  status?: PublishStatus;
}

export interface Brand {
  // ---- Original core fields (unchanged) ----
  name: string;
  founded: string;
  history: string;

  // ---- New optional fields ----
  country?: string;
  closed?: string;
  description?: string;
  /** Logo image (URL or base64 data URI). */
  logo?: string;
  website?: string;
  wikipedia?: string;
}
