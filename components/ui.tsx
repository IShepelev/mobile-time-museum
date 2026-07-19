import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** Small kicker/tag text — sits above a title, e.g. "Brand · founded 1865" */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="text-caption uppercase tracking-wide text-secondary">{children}</div>;
}

/** A real section header within a page, e.g. "Specifications" */
export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-sectiontitle text-ink">{children}</h2>;
}

export function Divider() {
  return <div className="my-6 h-px w-12 bg-hairline" />;
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-10 inline-flex items-center gap-2 text-caption text-secondary transition-colors hover:text-ink"
    >
      <ArrowLeft size={15} /> {label}
    </Link>
  );
}

/** Label / value pair used in the exhibit facts row. */
export function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-caption uppercase tracking-wide text-tertiary">{label}</div>
      <div className="mt-1.5 text-meta text-ink">{value}</div>
    </div>
  );
}

/** Small rounded chip — used for colors, tags, facets. */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-hairline bg-surface px-3 py-1 text-caption text-secondary">
      {children}
    </span>
  );
}

/** A single specification row (label left, value right). */
export function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-hairline py-4">
      <span className="w-40 shrink-0 text-caption capitalize text-tertiary">{label}</span>
      <span className="text-right text-meta text-ink sm:text-left">{value}</span>
    </div>
  );
}
