"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import TopBar from "@/components/TopBar";
import { Eyebrow } from "@/components/ui";
import { BRANDS, PHONES, YEARS } from "@/lib/data";
import { searchPhones } from "@/lib/search";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return { phones: [], brands: [], years: [] as number[] };
    const query = q.toLowerCase();
    const phones = searchPhones(PHONES, q, BRANDS).slice(0, 12);
    const brands = Object.entries(BRANDS)
      .filter(([, b]) => b.name.toLowerCase().includes(query))
      .slice(0, 6);
    const years = YEARS.filter((y) => String(y).includes(query)).slice(0, 6);
    return { phones, brands, years };
  }, [q]);

  const hasResults =
    results.phones.length > 0 || results.brands.length > 0 || results.years.length > 0;

  return (
    <div className="animate-fadein">
      <TopBar crumbs={["Search"]} />
      <div className="mx-auto max-w-2xl px-6 pt-12 pb-28">
        <div className="flex items-center gap-4 border-b-2 border-hairline pb-5 focus-within:border-accent">
          <Search size={22} className="text-tertiary" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a phone, brand, year, OS, camera…"
            className="w-full bg-transparent text-bodylg text-ink outline-none placeholder:text-tertiary"
          />
        </div>

        <div className="mt-10 space-y-10">
          {q.trim() === "" && (
            <div className="space-y-6">
              <p className="text-meta text-tertiary">Try &ldquo;Nokia&rdquo;, &ldquo;1999&rdquo;, &ldquo;5G&rdquo;, or &ldquo;iPhone&rdquo;.</p>
              <Link href="/browse" className="btn-secondary">
                <SlidersHorizontal size={15} /> Advanced filters
              </Link>
            </div>
          )}

          {q.trim() !== "" && !hasResults && (
            <p className="text-meta text-secondary">No matches for &ldquo;{q}&rdquo;.</p>
          )}

          {results.years.length > 0 && (
            <div>
              <Eyebrow>Years</Eyebrow>
              <div className="mt-4 flex flex-wrap gap-3">
                {results.years.map((y) => (
                  <Link
                    key={y}
                    href={`/year/${y}`}
                    className="rounded-full border border-hairline bg-surface px-5 py-2.5 text-xl font-medium text-ink shadow-subtle transition-colors hover:border-accent hover:text-accent"
                  >
                    {y}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.brands.length > 0 && (
            <div>
              <Eyebrow>Brands</Eyebrow>
              <div className="mt-4 flex flex-wrap gap-3">
                {results.brands.map(([id, b]) => (
                  <Link
                    key={id}
                    href={`/brand/${id}`}
                    className="rounded-full border border-hairline bg-surface px-5 py-2.5 text-lg font-medium text-ink shadow-subtle transition-colors hover:border-accent hover:text-accent"
                  >
                    {b.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.phones.length > 0 && (
            <div>
              <Eyebrow>Phones</Eyebrow>
              <div className="mt-4 divide-y divide-hairline border-t border-hairline">
                {results.phones.map((p) => (
                  <Link
                    key={p.id}
                    href={`/phone/${p.id}`}
                    className="group flex w-full items-center justify-between py-4 text-left"
                  >
                    <span className="text-meta text-ink transition-colors group-hover:text-accent">
                      {p.name}
                    </span>
                    <span className="text-caption text-tertiary">
                      {BRANDS[p.brand].name} · {p.year}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
