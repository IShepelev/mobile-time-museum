/**
 * BrandMark — a monogram badge used in place of a real brand logo.
 *
 * We deliberately don't embed actual company logos (Nokia, Apple,
 * Motorola, etc.) since those are trademarked marks; reproducing them
 * as image assets in the codebase isn't something we do here. This
 * gives every brand a clean, consistent identifier that fits the
 * same illustrated, editorial style as the phone glyphs.
 */

function initials(name: string): string {
  // Already-short acronym brands (LG, NEC, HTC, IBM) read best as-is.
  if (name.length <= 4 && name === name.toUpperCase()) return name;

  const words = name.split(" ").filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function BrandMark({
  name,
  size = 44,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const mark = initials(name);
  const fontSize = mark.length > 2 ? size * 0.34 : size * 0.4;

  return (
    <div
      className={`shrink-0 rounded-xl bg-ink text-surface flex items-center justify-center font-semibold tracking-tight ${className}`}
      style={{ width: size, height: size, fontSize }}
      aria-hidden="true"
    >
      {mark}
    </div>
  );
}
