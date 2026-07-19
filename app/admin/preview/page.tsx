"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useMuseum } from "@/lib/useMuseum";
import PhoneImage from "@/components/PhoneImage";
import { resolveMainImage } from "@/lib/images";
import { searchPhones } from "@/lib/search";

export default function PreviewIndex() {
  const data = useMuseum();
  const [q, setQ] = useState("");

  const phones = useMemo(() => {
    const list = searchPhones(data.phones, q, data.brands);
    return [...list].sort((a, b) => b.year - a.year || a.name.localeCompare(b.name));
  }, [data, q]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-pagetitle text-ink">Preview</h1>
        <p className="mt-2 text-meta text-secondary">
          See any phone exactly as it will appear publicly — including unpublished drafts —
          before you publish.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-2.5 focus-within:border-accent">
        <Search size={17} className="text-tertiary" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search to preview…"
          className="w-full bg-transparent text-meta text-ink outline-none placeholder:text-tertiary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {phones.slice(0, 60).map((p) => {
          const isDraft = (p.status ?? "published") === "draft";
          return (
            <Link
              key={p.id}
              href={`/admin/preview/${encodeURIComponent(p.id)}`}
              className="card card-hover group relative flex flex-col items-center p-6 text-center"
            >
              {isDraft && (
                <span className="absolute left-3 top-3 rounded-full bg-warn/10 px-2 py-0.5 text-caption font-medium text-warn">
                  draft
                </span>
              )}
              <div className="flex h-28 items-center justify-center">
                <PhoneImage
                  src={resolveMainImage(p)}
                  alt={p.name}
                  shape={p.shape}
                  className="max-h-28 w-auto transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 text-sm font-semibold text-ink group-hover:text-accent">{p.name}</div>
              <div className="mt-1 text-caption text-tertiary">
                {data.brands[p.brand]?.name ?? p.brand} · {p.year}
              </div>
            </Link>
          );
        })}
      </div>
      {phones.length > 60 && (
        <p className="text-center text-caption text-tertiary">
          Showing first 60 of {phones.length}. Refine your search to see more.
        </p>
      )}
    </div>
  );
}
