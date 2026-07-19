"use client";

import { useState } from "react";
import PhoneImage from "./PhoneImage";
import type { PhoneShape } from "@/lib/types";

/**
 * Exhibit image gallery: a large framed main image with a thumbnail strip
 * when more than one image exists. Falls back to the illustrated glyph when
 * there are no photos, so the layout is always complete.
 */
export default function PhoneGallery({
  images,
  alt,
  shape,
}: {
  images: string[];
  alt: string;
  shape: PhoneShape;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? null;

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full items-center justify-center rounded-xl3 border border-hairline bg-surface px-8 py-16 shadow-card">
        <PhoneImage
          key={active}
          src={current}
          alt={alt}
          shape={shape}
          className="max-h-[360px] w-auto animate-scalein md:max-h-[420px]"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={`flex h-16 w-16 items-center justify-center rounded-xl border bg-surface p-2 transition-all duration-300 ${
                i === active ? "border-accent shadow-subtle" : "border-hairline opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="max-h-full max-w-full object-contain" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
