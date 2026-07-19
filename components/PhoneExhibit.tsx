import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import PhoneGallery from "./PhoneGallery";
import PhoneCard from "./PhoneCard";
import BrandLogo from "./BrandLogo";
import { Eyebrow, Divider, Detail, SectionTitle, SpecRow } from "./ui";
import type { Brand, Phone, PhoneSpecs } from "@/lib/types";

export const SPEC_LABELS: Record<keyof PhoneSpecs, string> = {
  display: "Display",
  processor: "Processor",
  chipset: "Chipset",
  battery: "Battery",
  camera: "Rear camera",
  frontCamera: "Front camera",
  memory: "Memory",
  storage: "Storage",
  connectivity: "Connectivity",
  network: "Network",
  sim: "SIM",
  dimensions: "Dimensions",
  weight: "Weight",
  os: "Operating system",
  package: "In the box",
};

export const SPEC_ORDER: (keyof PhoneSpecs)[] = [
  "display",
  "chipset",
  "processor",
  "memory",
  "storage",
  "camera",
  "frontCamera",
  "battery",
  "network",
  "connectivity",
  "sim",
  "os",
  "dimensions",
  "weight",
];

export const isMeaningful = (v?: string) => !!v && v.trim() !== "" && v.trim() !== "N/A";

export interface ExhibitData {
  phone: Phone;
  brand?: Brand;
  images: string[];
  attribution?: { license: string; author?: string } | null;
  plateNumber: string;
  related: Phone[];
  prev?: Phone;
  next?: Phone;
  brandYears: number[];
  /** In preview mode, sibling/related links point at preview routes. */
  mode?: "public" | "preview";
}

export default function PhoneExhibit({
  phone,
  brand,
  images,
  attribution,
  plateNumber,
  related,
  prev,
  next,
  brandYears,
  mode = "public",
}: ExhibitData) {
  const phoneHref = (id: string) =>
    mode === "preview" ? `/admin/preview/${encodeURIComponent(id)}` : `/phone/${id}`;
  const brandHref = `/brand/${phone.brand}`;
  const yearHref = (y: number) => `/brand/${phone.brand}/${y}`;

  const specRows = SPEC_ORDER.filter((k) => isMeaningful(phone.specs[k])).map((k) => ({
    label: SPEC_LABELS[k],
    value: phone.specs[k] as string,
  }));

  return (
    <>
      {/* HERO */}
      <div className="container-x grid items-center gap-14 pb-12 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <PhoneGallery images={images} alt={`${brand?.name ?? ""} ${phone.name}`} shape={phone.shape} />
          {attribution && (
            <p className="mt-5 text-center text-caption text-tertiary">
              Photo: Wikimedia Commons · {attribution.license}
              {attribution.author ? ` · ${attribution.author}` : ""}
            </p>
          )}
        </div>

        <div className="order-1 md:order-2">
          <div className="flex items-center gap-3">
            {brand && <BrandLogo brand={brand} size={40} />}
            <Link href={brandHref} className="text-caption uppercase tracking-wide text-accent hover:underline">
              {brand?.name}
            </Link>
          </div>
          <h1 className="mt-4 text-phonename text-ink">{phone.name}</h1>
          {phone.series && <div className="mt-2 text-meta text-secondary">{phone.series} series</div>}
          <div className="mt-5 text-caption uppercase tracking-wide text-tertiary">
            Plate {plateNumber} · {phone.year}
          </div>
          <p className="mt-7 text-bodylg text-secondary">{phone.desc}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {isMeaningful(phone.wikipedia) && (
              <a href={phone.wikipedia} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Wikipedia <ExternalLink size={15} />
              </a>
            )}
            {isMeaningful(phone.source) && (
              <a href={phone.source} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Source <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* QUICK FACTS */}
      <div className="container-x pb-14">
        <Divider />
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <Detail label="Announced" value={phone.announced || "—"} />
          <Detail label="Released" value={phone.released || "—"} />
          <Detail label="Launch price" value={phone.price || "—"} />
          <Detail label="Colors" value={phone.colors.filter(isMeaningful).join(", ") || "—"} />
        </div>
      </div>

      {/* TIMELINE POSITION */}
      {brandYears.length > 0 && (
        <div className="container-x pb-16">
          <Eyebrow>Timeline position — {brand?.name}</Eyebrow>
          <div className="scrollbar-thin mt-5 flex items-center gap-2 overflow-x-auto pb-2">
            {brandYears.map((y) => (
              <Link
                key={y}
                href={yearHref(y)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-caption font-medium transition-colors ${
                  y === phone.year
                    ? "bg-accent text-white"
                    : "border border-hairline bg-surface text-secondary hover:border-accent hover:text-accent"
                }`}
              >
                {y}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SPECIFICATIONS */}
      {specRows.length > 0 && (
        <section className="container-x pb-16">
          <SectionTitle>Specifications</SectionTitle>
          <div className="mt-8 grid gap-x-16 sm:grid-cols-2">
            {specRows.map((r) => (
              <SpecRow key={r.label} label={r.label} value={r.value} />
            ))}
          </div>
        </section>
      )}

      {/* HISTORY */}
      {isMeaningful(phone.history) && (
        <section className="container-x pb-16">
          <SectionTitle>History</SectionTitle>
          <p className="mt-6 max-w-3xl whitespace-pre-line text-bodylg leading-relaxed text-secondary">
            {phone.history}
          </p>
        </section>
      )}

      {/* FACT + IN THE BOX */}
      <section className="container-x grid gap-6 pb-20 md:grid-cols-2">
        {isMeaningful(phone.fact) && (
          <div className="card p-8">
            <Eyebrow>Curator&rsquo;s note</Eyebrow>
            <p className="mt-5 text-2xl font-normal leading-relaxed text-ink">{phone.fact}</p>
          </div>
        )}
        {isMeaningful(phone.specs.package) && (
          <div className="card p-8">
            <Eyebrow>In the box</Eyebrow>
            <p className="mt-5 text-meta leading-relaxed text-secondary">{phone.specs.package}</p>
          </div>
        )}
      </section>

      {/* RELATED */}
      {related.length > 0 && mode === "public" && (
        <section className="container-x pb-16">
          <SectionTitle>More from {brand?.name}</SectionTitle>
          <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <PhoneCard key={p.id} phone={p} />
            ))}
          </div>
        </section>
      )}

      {/* PREV / NEXT */}
      {(prev || next) && (
        <div className="container-x flex items-stretch justify-between gap-4 border-t border-hairline py-10">
          {prev ? (
            <Link href={phoneHref(prev.id)} className="group flex flex-1 items-center gap-3">
              <ChevronRight size={18} className="rotate-180 text-tertiary group-hover:text-accent" />
              <span className="text-left">
                <span className="block text-caption text-tertiary">Previous</span>
                <span className="block text-meta text-ink group-hover:text-accent">{prev.name}</span>
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link href={phoneHref(next.id)} className="group flex flex-1 items-center justify-end gap-3">
              <span className="text-right">
                <span className="block text-caption text-tertiary">Next</span>
                <span className="block text-meta text-ink group-hover:text-accent">{next.name}</span>
              </span>
              <ChevronRight size={18} className="text-tertiary group-hover:text-accent" />
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </div>
      )}
    </>
  );
}
