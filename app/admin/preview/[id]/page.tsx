"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Eye } from "lucide-react";
import { useMuseum } from "@/lib/useMuseum";
import PhoneExhibit from "@/components/PhoneExhibit";
import { BackLink } from "@/components/ui";
import { galleryImages, photoAttribution } from "@/lib/images";

export default function PreviewPhonePage({ params }: { params: { id: string } }) {
  const data = useMuseum();
  const id = decodeURIComponent(params.id);
  const phone = data.phones.find((p) => p.id === id);

  if (!phone) {
    return (
      <div className="card p-16 text-center">
        <p className="text-meta text-secondary">That phone isn&rsquo;t in your working copy.</p>
        <Link href="/admin/preview" className="btn-secondary mt-6">
          Back to preview
        </Link>
      </div>
    );
  }

  const brand = data.brands[phone.brand];
  const line = data.phones
    .filter((p) => p.brand === phone.brand)
    .sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));
  const idx = line.findIndex((p) => p.id === phone.id);
  const brandYears = [...new Set(line.map((p) => p.year))].sort((a, b) => a - b);
  const isDraft = (phone.status ?? "published") === "draft";

  return (
    <div>
      {/* Preview banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/30 bg-accent/5 px-5 py-3">
        <span className="inline-flex items-center gap-2 text-caption font-medium text-accent">
          <Eye size={15} /> Preview — exactly how the public page will look
          {isDraft && <span className="rounded-full bg-warn/10 px-2 py-0.5 text-warn">draft</span>}
        </span>
        <div className="flex items-center gap-2">
          <Link href={`/admin/phones/${encodeURIComponent(phone.id)}`} className="btn-ghost">
            Edit
          </Link>
          {!isDraft && (
            <Link href={`/phone/${phone.id}`} target="_blank" className="btn-ghost">
              Open live <ExternalLink size={14} />
            </Link>
          )}
        </div>
      </div>

      <div className="rounded-xl2 border border-hairline bg-paper py-6">
        <div className="container-x">
          <BackLink href="/admin/preview" label="All previews" />
        </div>
        <PhoneExhibit
          mode="preview"
          phone={phone}
          brand={brand}
          images={galleryImages(phone)}
          attribution={!phone.image ? photoAttribution(phone.id) : null}
          plateNumber={String(idx + 1).padStart(3, "0")}
          related={[]}
          prev={line[idx - 1]}
          next={line[idx + 1]}
          brandYears={brandYears}
        />
      </div>
    </div>
  );
}
