import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Reveal from "@/components/Reveal";
import PhoneCard from "@/components/PhoneCard";
import { Eyebrow, BackLink } from "@/components/ui";
import { BRANDS, phonesFor } from "@/lib/data";

export function generateMetadata({
  params,
}: {
  params: { brandId: string; year: string };
}): Metadata {
  const brand = BRANDS[params.brandId];
  return { title: brand ? `${brand.name} ${params.year}` : "Exhibit list" };
}

export default function ListPage({
  params,
}: {
  params: { brandId: string; year: string };
}) {
  const brand = BRANDS[params.brandId];
  const year = Number(params.year);
  if (!brand) notFound();

  const phones = phonesFor(params.brandId, year);
  if (phones.length === 0) notFound();

  return (
    <div className="animate-fadein">
      <TopBar crumbs={[brand.name, params.year]} />
      <div className="container-x pt-14 pb-20">
        <BackLink href={`/year/${year}`} label={`${year}`} />
        <Eyebrow>
          {brand.name} · {year}
        </Eyebrow>
        <h1 className="mt-3 text-pagetitle text-ink">
          {phones.length} exhibit{phones.length === 1 ? "" : "s"}
        </h1>

        <Reveal className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {phones.map((p) => (
            <PhoneCard key={p.id} phone={p} />
          ))}
        </Reveal>
      </div>
    </div>
  );
}
