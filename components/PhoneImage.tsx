"use client";

import { useState } from "react";
import PhoneGlyph from "./PhoneGlyph";
import type { PhoneShape } from "@/lib/data";

export default function PhoneImage({
  src,
  alt,
  shape,
  className = "",
}: {
  src: string | null;
  alt: string;
  shape: PhoneShape;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <PhoneGlyph shape={shape} className={className} />;
  }

  // Plain <img> is used deliberately: Commons' Special:FilePath endpoint
  // redirects to the resolved upload.wikimedia.org asset, which next/image
  // doesn't proxy cleanly without pre-resolving the final URL server-side.
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className} object-contain`}
    />
  );
}
