import BrandMark from "./BrandMark";
import type { Brand } from "@/lib/types";

/**
 * Renders an uploaded brand logo when one exists (added via the CMS), and
 * otherwise falls back to the consistent monogram BrandMark. This keeps the
 * design coherent whether or not a licensed logo has been provided.
 */
export default function BrandLogo({
  brand,
  size = 44,
  rounded = true,
  className = "",
}: {
  brand: Brand;
  size?: number;
  rounded?: boolean;
  className?: string;
}) {
  if (brand.logo) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center overflow-hidden bg-surface ${
          rounded ? "rounded-xl border border-hairline" : ""
        } ${className}`}
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={brand.logo}
          alt={`${brand.name} logo`}
          className="h-full w-full object-contain p-1.5"
          loading="lazy"
        />
      </span>
    );
  }
  return <BrandMark name={brand.name} size={size} className={className} />;
}
