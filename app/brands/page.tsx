import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import TopBar from "@/components/TopBar";
import Reveal from "@/components/Reveal";
import BrandLogo from "@/components/BrandLogo";
import { Eyebrow } from "@/components/ui";
import { BRANDS, PHONES, yearsForBrand } from "@/lib/data";

export const metadata: Metadata = {
  title: "Brands",
  description: "Every manufacturer in the Mobile Time Museum collection.",
};

export default function BrandsPage() {
  const brands = Object.entries(BRANDS)
    .map(([id, brand]) => ({
      id,
      brand,
      count: PHONES.filter((p) => p.brand === id).length,
      years: yearsForBrand(id),
    }))
    .filter((b) => b.count > 0)
    .sort((a, b) => b.count - a.count || a.brand.name.localeCompare(b.brand.name));

  return (
    <div className="animate-fadein">
      <TopBar crumbs={["Brands"]} />
      <div className="container-x pt-14 pb-10">
        <Eyebrow>The makers</Eyebrow>
        <h1 className="mt-3 text-pagetitle text-ink">Brands</h1>
        <p className="mt-6 max-w-2xl text-bodylg text-secondary">
          {brands.length} manufacturers, from century-old industrial giants to newcomers —
          each with its own chapter in mobile history.
        </p>
      </div>

      <Reveal as="section" className="container-x pb-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map(({ id, brand, count, years }) => (
            <Link key={id} href={`/brand/${id}`} className="card card-hover group flex items-center gap-5 p-6">
              <BrandLogo brand={brand} size={56} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
                  {brand.name}
                </div>
                <div className="mt-1 text-caption text-tertiary">
                  {count} model{count === 1 ? "" : "s"}
                  {years.length ? ` · ${years[0]}–${years[years.length - 1]}` : ""}
                </div>
              </div>
              <ChevronRight size={18} className="text-tertiary transition-colors group-hover:text-accent" />
            </Link>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
