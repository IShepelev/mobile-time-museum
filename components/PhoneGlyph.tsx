"use client";

import { useId } from "react";
import type { PhoneShape } from "@/lib/data";

export default function PhoneGlyph({
  shape,
  className = "",
}: {
  shape: PhoneShape;
  className?: string;
}) {
  const uid = useId();
  const gradId = `brassLine-${uid}`;
  const stroke = `url(#${gradId})`;
  const common = {
    fill: "none",
    stroke,
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  let body;
  switch (shape) {
    case "brick":
      body = (
        <>
          <rect x="46" y="30" width="68" height="150" rx="8" {...common} />
          <line x1="80" y1="6" x2="80" y2="30" {...common} />
          <rect x="56" y="44" width="48" height="26" rx="2" {...common} />
          {Array.from({ length: 12 }).map((_, i) => (
            <circle
              key={i}
              cx={62 + (i % 4) * 11}
              cy={92 + Math.floor(i / 4) * 20}
              r="3.4"
              stroke={stroke}
              fill="none"
              strokeWidth="1.6"
            />
          ))}
        </>
      );
      break;
    case "flip":
      body = (
        <>
          <rect x="50" y="60" width="60" height="110" rx="10" {...common} />
          <line x1="50" y1="112" x2="110" y2="112" {...common} strokeDasharray="3 4" />
          <rect x="60" y="72" width="40" height="18" rx="2" {...common} />
          <circle cx="80" cy="100" r="3" stroke={stroke} fill="none" strokeWidth="1.6" />
        </>
      );
      break;
    case "slider":
      body = (
        <>
          <rect x="48" y="26" width="64" height="150" rx="10" {...common} />
          <rect x="54" y="34" width="52" height="70" rx="4" {...common} />
          <line x1="48" y1="118" x2="112" y2="118" {...common} />
          {Array.from({ length: 6 }).map((_, i) => (
            <circle
              key={i}
              cx={64 + (i % 3) * 22}
              cy={138 + Math.floor(i / 3) * 18}
              r="3"
              stroke={stroke}
              fill="none"
              strokeWidth="1.4"
            />
          ))}
        </>
      );
      break;
    case "candybar":
      body = (
        <>
          <rect x="50" y="24" width="60" height="152" rx="12" {...common} />
          <rect x="58" y="34" width="44" height="42" rx="3" {...common} />
          {Array.from({ length: 9 }).map((_, i) => (
            <circle
              key={i}
              cx={64 + (i % 3) * 16}
              cy={96 + Math.floor(i / 3) * 20}
              r="3.2"
              stroke={stroke}
              fill="none"
              strokeWidth="1.5"
            />
          ))}
        </>
      );
      break;
    case "touch":
      body = (
        <>
          <rect x="44" y="18" width="72" height="164" rx="18" {...common} />
          <rect x="52" y="30" width="56" height="120" rx="3" {...common} />
          <circle cx="80" cy="166" r="8" {...common} />
        </>
      );
      break;
    case "fold":
      body = (
        <>
          <rect x="34" y="40" width="46" height="130" rx="10" {...common} />
          <rect x="80" y="40" width="46" height="130" rx="10" {...common} />
          <line x1="80" y1="46" x2="80" y2="164" stroke={stroke} strokeWidth="1.4" strokeDasharray="2 5" />
        </>
      );
      break;
    default:
      body = (
        <>
          <rect x="44" y="16" width="72" height="168" rx="24" {...common} />
          <rect x="50" y="26" width="60" height="140" rx="6" {...common} />
          <circle cx="100" cy="24" r="2.6" stroke={stroke} fill="none" strokeWidth="1.4" />
        </>
      );
  }

  return (
    <svg viewBox="0 0 160 200" className={className} role="img" aria-label={`Illustration of a ${shape}-style phone`}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8E8E93" />
          <stop offset="100%" stopColor="#3A3A3C" />
        </linearGradient>
      </defs>
      {body}
    </svg>
  );
}
