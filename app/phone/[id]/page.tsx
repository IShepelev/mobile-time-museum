import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import { BackLink } from "@/components/ui";
import PhoneExhibit from "@/components/PhoneExhibit";
import {
  BRANDS,
  PHONES,
  getPhone,
  relatedPhones,
  siblingPhones,
  yearsForBrand,
} from "@/lib/data";
import { galleryImages, photoAttribution } from "@/lib/images";

export function generateStaticParams() {
  return PHONES.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const phone = getPhone(params.id);
  if (!phone) return { title: "Exhibit" };
  const brand = BRANDS[phone.brand];
  return {
    title: `${phone.name}`,
    description: phone.desc,
    openGraph: { title: `${brand?.name ?? ""} ${phone.name}`, description: phone.desc },
  };
}

export default function PhonePage({ params }: { params: { id: string } }) {
  const phone = getPhone(params.id);
  if (!phone) notFound();

  const brand = BRANDS[phone.brand];

  return (
    <div className="animate-fadein">
      <TopBar crumbs={[brand?.name ?? "", phone.name]} />
      <div className="container-x pt-12">
        <BackLink href={`/brand/${phone.brand}/${phone.year}`} label="Back to list" />
      </div>
      <PhoneExhibit
        phone={phone}
        brand={brand}
        images={galleryImages(phone)}
        attribution={!phone.image ? photoAttribution(phone.id) : null}
        plateNumber={String(PHONES.indexOf(phone) + 1).padStart(3, "0")}
        related={relatedPhones(phone, 4)}
        prev={siblingPhones(phone).prev}
        next={siblingPhones(phone).next}
        brandYears={yearsForBrand(phone.brand)}
      />
    </div>
  );
}
