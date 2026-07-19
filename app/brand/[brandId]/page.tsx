import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight, ExternalLink } from "lucide-react";
import TopBar from "@/components/TopBar";
import Reveal from "@/components/Reveal";
import BrandLogo from "@/components/BrandLogo";
import PhoneCard from "@/components/PhoneCard";
import { Eyebrow, BackLink, SectionTitle, Detail } from "@/components/ui";
import { BRANDS, phonesForBrand, phonesFor, yearsForBrand } from "@/lib/data";

export function generateStaticParams() {
  return Object.keys(BRANDS).map((brandId) => ({ brandId }));
}

export function generateMetadata({ params }: { params: { brandId: string } }): Metadata {
  const brand = BRANDS[params.brandId];
  return { title: brand ? brand.name : "Brand" };
}

export default function BrandPage({ params }: { params: { brandId: string } }) {
  const brand = BRANDS[params.brandId];
  if (!brand) notFound();

  const years = yearsForBrand(params.brandId);
  const all = phonesForBrand(params.brandId);
  const highlights = all.slice(0, 3);

  return (
    <div className="animate-fadein">
      <TopBar crumbs={[brand.name]} />
      <div className="container-x pt-14 pb-10">
        <BackLink href="/brands" label="All brands" />

        <div className="flex items-start gap-6">
          <BrandLogo brand={brand} size={72} />
          <div>
            <Eyebrow>
              Brand · founded {brand.founded}
              {brand.closed ? ` · closed ${brand.closed}` : ""}
            </Eyebrow>
            <h1 className="mt-3 text-pagetitle text-ink">{brand.name}</h1>
          </div>
        </div>

        <p className="mt-8 max-w-2xl border-l-2 border-hairline pl-6 text-bodylg text-secondary">
          {brand.description || brand.history}
        </p>

        <div className="mt-10 grid max-w-2xl grid-cols-2 gap-8 sm:grid-cols-4">
          <Detail label="Founded" value={brand.founded || "—"} />
          <Detail label="Status" value={brand.closed ? `Closed ${brand.closed}` : "Active"} />
          {brand.country ? <Detail label="Country" value={brand.country} /> : null}
          <Detail label="In collection" value={`${all.length} models`} />
        </div>

        {(brand.website || brand.wikipedia) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {brand.website && (
              <a href={brand.website} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Website <ExternalLink size={15} />
              </a>
            )}
            {brand.wikipedia && (
              <a href={brand.wikipedia} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Wikipedia <ExternalLink size={15} />
              </a>
            )}
          </div>
        )}
      </div>

      {highlights.length > 0 && (
        <Reveal as="section" className="container-x pb-4">
          <SectionTitle>Highlights</SectionTitle>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((p) => (
              <PhoneCard key={p.id} phone={p} />
            ))}
          </div>
        </Reveal>
      )}

      <Reveal as="section" className="container-x pb-20 pt-16">
        <SectionTitle>Years in the collection</SectionTitle>
        <div className="mt-8 divide-y divide-hairline border-y border-hairline">
          {years.map((y) => {
            const count = phonesFor(params.brandId, y).length;
            return (
              <Link
                key={y}
                href={`/brand/${params.brandId}/${y}`}
                className="group flex w-full items-center justify-between py-6 transition-all duration-300 hover:pl-2"
              >
                <span className="text-3xl font-semibold text-ink transition-colors group-hover:text-accent">
                  {y}
                </span>
                <span className="flex items-center gap-3 text-caption text-tertiary">
                  {count} phone{count > 1 ? "s" : ""} <ChevronRight size={15} className="opacity-50" />
                </span>
              </Link>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}
