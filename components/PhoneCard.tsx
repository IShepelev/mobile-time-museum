import Link from "next/link";
import PhoneImage from "./PhoneImage";
import { resolveMainImage } from "@/lib/images";
import { BRANDS } from "@/lib/data";
import type { Phone } from "@/lib/types";

/**
 * The standard exhibit card used on brand pages, browse results, related
 * lists, etc. One consistent, premium card everywhere.
 */
export default function PhoneCard({
  phone,
  showBrand = false,
}: {
  phone: Phone;
  showBrand?: boolean;
}) {
  const brand = BRANDS[phone.brand];
  return (
    <Link
      href={`/phone/${phone.id}`}
      className="card card-hover group flex flex-col items-center p-8 text-center"
    >
      <div className="flex h-40 w-full items-center justify-center">
        <PhoneImage
          src={resolveMainImage(phone)}
          alt={`${brand?.name ?? ""} ${phone.name}`}
          shape={phone.shape}
          className="max-h-40 w-auto opacity-95 transition-all duration-500 ease-apple group-hover:scale-[1.04] group-hover:opacity-100"
        />
      </div>
      <div className="mt-7 text-xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
        {phone.name}
      </div>
      <div className="mt-2 text-caption text-tertiary">
        {showBrand && brand ? `${brand.name} · ` : ""}
        {phone.released || phone.year}
      </div>
    </Link>
  );
}
