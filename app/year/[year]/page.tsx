import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import TopBar from "@/components/TopBar";
import Reveal from "@/components/Reveal";
import { Eyebrow, BackLink, SectionTitle } from "@/components/ui";
import BrandLogo from "@/components/BrandLogo";
import { BRANDS, PHONES, YEARS, YEAR_INTROS, brandsInYear } from "@/lib/data";

export function generateStaticParams() {
  return YEARS.map((y) => ({ year: String(y) }));
}

export function generateMetadata({ params }: { params: { year: string } }): Metadata {
  return { title: `${params.year} — the year in mobile` };
}

export default function YearPage({ params }: { params: { year: string } }) {
  const year = Number(params.year);
  if (!YEARS.includes(year)) notFound();

  const brandIds = brandsInYear(year).sort((a, b) => BRANDS[a].name.localeCompare(BRANDS[b].name));
  const total = PHONES.filter((p) => p.year === year).length;
  const idx = YEARS.indexOf(year);
  const prevYear = YEARS[idx - 1];
  const nextYear = YEARS[idx + 1];

  return (
    <div className="animate-fadein">
      <TopBar crumbs={[String(year)]} />
      <div className="container-x pt-14 pb-8">
        <BackLink href="/" label="Timeline" />
        <Eyebrow>A year in the collection</Eyebrow>
        <h1 className="mt-3 text-[64px] font-semibold leading-none tracking-tight text-ink md:text-[88px]">
          {year}
        </h1>
        <p className="mt-7 max-w-2xl border-l-2 border-hairline pl-6 text-bodylg text-secondary">
          {YEAR_INTROS[year] ?? "A year in the collection, waiting to be explored."}
        </p>
        <p className="mt-6 text-caption text-tertiary">
          {total} model{total === 1 ? "" : "s"} · {brandIds.length} brand{brandIds.length === 1 ? "" : "s"}
        </p>
      </div>

      <Reveal as="section" className="container-x pb-16">
        <SectionTitle>Brands active in {year}</SectionTitle>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brandIds.map((bid) => {
            const count = PHONES.filter((p) => p.year === year && p.brand === bid).length;
            return (
              <Link
                key={bid}
                href={`/brand/${bid}/${year}`}
                className="card card-hover group block px-7 py-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-2xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
                      {BRANDS[bid].name}
                    </div>
                    <div className="mt-2 text-caption text-tertiary">
                      {count} model{count === 1 ? "" : "s"} this year
                    </div>
                  </div>
                  <BrandLogo brand={BRANDS[bid]} size={48} />
                </div>
              </Link>
            );
          })}
        </div>
      </Reveal>

      {/* Prev / next year */}
      <div className="container-x flex items-center justify-between gap-4 border-t border-hairline py-10">
        {prevYear ? (
          <Link href={`/year/${prevYear}`} className="btn-ghost">
            <ChevronRight size={16} className="rotate-180" /> {prevYear}
          </Link>
        ) : (
          <span />
        )}
        {nextYear ? (
          <Link href={`/year/${nextYear}`} className="btn-ghost">
            {nextYear} <ChevronRight size={16} />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
