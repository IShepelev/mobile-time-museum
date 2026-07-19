"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TopBar from "@/components/TopBar";
import Reveal from "@/components/Reveal";
import { Eyebrow } from "@/components/ui";
import { BRANDS, PHONES, YEARS, MIN_YEAR, MAX_YEAR, YEAR_INTROS } from "@/lib/data";

export default function HomePage() {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const countsByYear = useMemo(() => {
    const m = new Map<number, number>();
    for (const p of PHONES) m.set(p.year, (m.get(p.year) ?? 0) + 1);
    return m;
  }, []);
  const maxCount = Math.max(...countsByYear.values(), 1);

  return (
    <div>
      <TopBar />

      {/* ============ HERO ============ */}
      <section className="container-x pt-24 pb-16 text-center md:pt-36 md:pb-24">
        <div className="animate-fadeup">
          <Eyebrow>A digital museum · est. 2026</Eyebrow>
        </div>
        <h1 className="mt-6 animate-fadeup text-[52px] font-semibold leading-[1.04] tracking-tight text-ink md:text-hero">
          The history of mobile,
          <br className="hidden sm:block" /> preserved in one place.
        </h1>
        <p className="mx-auto mt-8 max-w-2xl animate-fadeup text-bodylg leading-relaxed text-secondary [animation-delay:80ms]">
          {PHONES.length} handsets across {Object.keys(BRANDS).length} brands and{" "}
          {MAX_YEAR - MIN_YEAR} years — from the first handheld bricks to folding glass.
        </p>
        <div className="mt-10 flex animate-fadeup flex-wrap items-center justify-center gap-3 [animation-delay:160ms]">
          <Link href="/browse" className="btn-primary">
            Explore the collection <ArrowRight size={17} />
          </Link>
          <Link href="/brands" className="btn-secondary">
            Browse by brand
          </Link>
        </div>
      </section>

      {/* ============ TIMELINE ============ */}
      <section className="container-x pb-8 text-center">
        <Eyebrow>
          The timeline — {MIN_YEAR} to {MAX_YEAR}
        </Eyebrow>
      </section>

      {/* Live year preview — reserves height so nothing shifts when idle */}
      <div className="container-x flex min-h-[132px] flex-col items-center justify-center text-center md:min-h-[152px]">
        {hoveredYear ? (
          <div className="animate-fadein">
            <div className="text-[40px] font-semibold leading-none tracking-tight text-ink md:text-[48px]">
              {hoveredYear}
            </div>
            <p className="mx-auto mt-4 max-w-xl text-meta italic text-secondary md:text-bodylg">
              {YEAR_INTROS[hoveredYear] ?? "A year in the collection, waiting to be explored."}
            </p>
          </div>
        ) : (
          <p className="text-meta text-tertiary">Hover a year to preview it — click to enter.</p>
        )}
      </div>

      <section className="container-x scrollbar-thin overflow-x-auto pb-28 pt-6">
        <div className="flex min-w-max items-end gap-2 border-b border-hairline pb-8">
          {YEARS.map((y) => {
            const count = countsByYear.get(y) ?? 0;
            const heightPx = 36 + Math.round((count / maxCount) * 120);
            const active = hoveredYear === y;
            return (
              <Link
                key={y}
                href={`/year/${y}`}
                onMouseEnter={() => setHoveredYear(y)}
                onMouseLeave={() => setHoveredYear(null)}
                onFocus={() => setHoveredYear(y)}
                onBlur={() => setHoveredYear(null)}
                className="group relative flex w-16 shrink-0 flex-col items-center justify-end"
              >
                <span
                  className={`mb-3 text-caption font-medium transition-colors ${
                    active ? "text-accent" : "text-tertiary group-hover:text-accent"
                  }`}
                >
                  {y}
                </span>
                <div
                  style={{ height: `${heightPx}px` }}
                  className={`rounded-full transition-all duration-300 ease-apple ${
                    active ? "w-[6px] bg-accent" : "w-[3px] bg-ink/10 group-hover:w-[6px] group-hover:bg-accent"
                  }`}
                />
                <div
                  className={`mt-[-3px] h-1.5 w-1.5 rounded-full transition-colors ${
                    active ? "bg-accent" : "bg-ink/15 group-hover:bg-accent"
                  }`}
                />
                <span
                  className={`mt-3 text-[13px] font-medium transition-colors ${
                    active ? "text-accent" : "text-tertiary group-hover:text-accent"
                  }`}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============ FEATURED BRANDS ============ */}
      <Reveal as="section" className="container-x pb-24">
        <div className="flex items-end justify-between">
          <h2 className="text-sectiontitle text-ink">Iconic makers</h2>
          <Link
            href="/brands"
            className="inline-flex items-center gap-1.5 text-caption font-medium text-accent hover:underline"
          >
            All brands <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {["apple", "nokia", "samsung", "motorola", "sony", "blackberry"].map((id) =>
            BRANDS[id] ? (
              <Link
                key={id}
                href={`/brand/${id}`}
                className="card card-hover flex flex-col items-center gap-3 px-4 py-8"
              >
                <span className="text-lg font-semibold tracking-tight text-ink">{BRANDS[id].name}</span>
                <span className="text-caption text-tertiary">
                  {PHONES.filter((p) => p.brand === id).length} models
                </span>
              </Link>
            ) : null
          )}
        </div>
      </Reveal>
    </div>
  );
}
