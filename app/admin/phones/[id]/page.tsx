"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, UploadCloud, Trash2, Eye, Plus, X } from "lucide-react";
import { useMuseum } from "@/lib/useMuseum";
import { blankPhone, deletePhone, slugify, upsertPhone } from "@/lib/store";
import { Field, TextArea, Select, FormSection } from "@/components/admin/fields";
import ImageUploader from "@/components/admin/ImageUploader";
import PhoneImage from "@/components/PhoneImage";
import { resolveMainImage } from "@/lib/images";
import type { ImageAsset, Phone, PhoneShape, PhoneSpecs } from "@/lib/types";
import { SHAPES } from "@/lib/data";

export default function PhoneEditorPage({ params }: { params: { id: string } }) {
  const data = useMuseum();
  const router = useRouter();
  const isNew = params.id === "new";
  const decodedId = decodeURIComponent(params.id);

  const existing = useMemo(
    () => (isNew ? undefined : data.phones.find((p) => p.id === decodedId)),
    [data.phones, decodedId, isNew]
  );

  const [phone, setPhone] = useState<Phone>(() =>
    isNew ? blankPhone(Object.keys(data.brands)[0] ?? "") : existing ?? blankPhone()
  );
  const [colorsText, setColorsText] = useState(phone.colors.join(", "));
  const [saved, setSaved] = useState(false);

  if (!isNew && !existing) {
    return (
      <div className="card p-16 text-center">
        <p className="text-meta text-secondary">Phone not found in your working copy.</p>
        <Link href="/admin/phones" className="btn-secondary mt-6">
          Back to phones
        </Link>
      </div>
    );
  }

  const set = <K extends keyof Phone>(key: K, value: Phone[K]) => {
    setPhone((p) => ({ ...p, [key]: value }));
    setSaved(false);
  };
  const setSpec = <K extends keyof PhoneSpecs>(key: K, value: string) => {
    setPhone((p) => ({ ...p, specs: { ...p.specs, [key]: value } }));
    setSaved(false);
  };

  const brandOptions = Object.entries(data.brands)
    .map(([id, b]) => ({ value: id, label: b.name }))
    .sort((a, b) => a.label.localeCompare(b.label));

  function buildRecord(status: "draft" | "published"): Phone | null {
    const name = phone.name.trim();
    if (!phone.brand) {
      alert("Please choose a brand.");
      return null;
    }
    if (!name) {
      alert("Please enter a model name.");
      return null;
    }
    let id = phone.id;
    if (isNew || !id) {
      const base = slugify(`${phone.brand}-${name}`);
      id = base;
      let n = 2;
      while (data.phones.some((p) => p.id === id)) id = `${base}-${n++}`;
    }
    const colors = colorsText
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    return { ...phone, id, name, colors, status };
  }

  function save(status: "draft" | "published") {
    const record = buildRecord(status);
    if (!record) return;
    upsertPhone(record);
    setPhone(record);
    setSaved(true);
    router.push("/admin/phones");
  }

  function saveAndPreview() {
    const record = buildRecord(phone.status === "published" ? "published" : "draft");
    if (!record) return;
    upsertPhone(record);
    router.push(`/admin/preview/${encodeURIComponent(record.id)}`);
  }

  function addGalleryImage(src: string) {
    if (!src) return;
    set("images", [...(phone.images ?? []), { src }]);
  }
  function removeGalleryImage(i: number) {
    set(
      "images",
      (phone.images ?? []).filter((_, idx) => idx !== i)
    );
  }

  const previewSrc = resolveMainImage({ ...phone, colors: [] } as Phone);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/phones" className="inline-flex items-center gap-2 text-caption text-secondary hover:text-ink">
          <ArrowLeft size={15} /> Phones
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={saveAndPreview} className="btn-secondary !py-2.5">
            <Eye size={15} /> Preview
          </button>
          <button onClick={() => save("draft")} className="btn-secondary !py-2.5">
            <Save size={15} /> Save draft
          </button>
          <button onClick={() => save("published")} className="btn-primary !py-2.5">
            <UploadCloud size={15} /> Publish
          </button>
        </div>
      </div>

      <div>
        <h1 className="text-pagetitle text-ink">{isNew ? "Add phone" : phone.name || "Edit phone"}</h1>
        <p className="mt-2 text-meta text-secondary">
          {isNew ? "Every field is here — fill in what you know." : `Editing ${phone.id}`}
          {saved && <span className="ml-2 text-success">Saved ✓</span>}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <FormSection title="Basics">
            <Select
              label="Brand"
              value={phone.brand}
              onChange={(v) => set("brand", v)}
              options={[{ value: "", label: "Select…" }, ...brandOptions]}
            />
            <Field label="Model" value={phone.name} onChange={(v) => set("name", v)} placeholder="e.g. Galaxy S24" />
            <Field label="Series" value={phone.series ?? ""} onChange={(v) => set("series", v)} placeholder="e.g. Galaxy S" />
            <Field label="Year" type="number" value={String(phone.year)} onChange={(v) => set("year", Number(v) || 0)} />
            <Select
              label="Shape"
              value={phone.shape}
              onChange={(v) => set("shape", v as PhoneShape)}
              options={SHAPES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))}
            />
            <Field label="Announced" value={phone.announced} onChange={(v) => set("announced", v)} placeholder="e.g. Jan 2024" />
            <Field label="Released" value={phone.released} onChange={(v) => set("released", v)} placeholder="e.g. Feb 2024" />
            <Field label="Launch price" value={phone.price} onChange={(v) => set("price", v)} placeholder="e.g. $799" />
            <Field label="Colors (comma-separated)" value={colorsText} onChange={(v) => { setColorsText(v); setSaved(false); }} placeholder="Black, Silver, Blue" />
          </FormSection>

          <FormSection title="Story">
            <div className="sm:col-span-2">
              <TextArea label="Description" value={phone.desc} onChange={(v) => set("desc", v)} rows={3} />
            </div>
            <div className="sm:col-span-2">
              <TextArea label="Interesting fact" value={phone.fact} onChange={(v) => set("fact", v)} rows={2} />
            </div>
            <div className="sm:col-span-2">
              <TextArea label="History (optional, longer)" value={phone.history ?? ""} onChange={(v) => set("history", v)} rows={4} />
            </div>
          </FormSection>

          <FormSection title="Specifications">
            <Field label="Display" value={phone.specs.display} onChange={(v) => setSpec("display", v)} />
            <Field label="Chipset" value={phone.specs.chipset ?? ""} onChange={(v) => setSpec("chipset", v)} />
            <Field label="Processor" value={phone.specs.processor} onChange={(v) => setSpec("processor", v)} />
            <Field label="Memory (RAM)" value={phone.specs.memory} onChange={(v) => setSpec("memory", v)} />
            <Field label="Storage" value={phone.specs.storage ?? ""} onChange={(v) => setSpec("storage", v)} />
            <Field label="Rear camera" value={phone.specs.camera} onChange={(v) => setSpec("camera", v)} />
            <Field label="Front camera" value={phone.specs.frontCamera ?? ""} onChange={(v) => setSpec("frontCamera", v)} />
            <Field label="Battery" value={phone.specs.battery} onChange={(v) => setSpec("battery", v)} />
            <Field label="Network" value={phone.specs.network} onChange={(v) => setSpec("network", v)} placeholder="e.g. 5G · Nano-SIM" />
            <Field label="Connectivity" value={phone.specs.connectivity} onChange={(v) => setSpec("connectivity", v)} />
            <Field label="SIM" value={phone.specs.sim ?? ""} onChange={(v) => setSpec("sim", v)} />
            <Field label="Operating system" value={phone.specs.os} onChange={(v) => setSpec("os", v)} />
            <Field label="Dimensions" value={phone.specs.dimensions} onChange={(v) => setSpec("dimensions", v)} />
            <Field label="Weight" value={phone.specs.weight} onChange={(v) => setSpec("weight", v)} />
            <div className="sm:col-span-2">
              <TextArea label="Package contents (in the box)" value={phone.specs.package} onChange={(v) => setSpec("package", v)} rows={2} />
            </div>
          </FormSection>

          <FormSection title="Links">
            <Field label="Wikipedia URL" value={phone.wikipedia ?? ""} onChange={(v) => set("wikipedia", v)} placeholder="https://en.wikipedia.org/…" />
            <Field label="Source URL" value={phone.source ?? ""} onChange={(v) => set("source", v)} placeholder="https://…" />
          </FormSection>

          <section className="card space-y-6 p-6 md:p-8">
            <h3 className="text-lg font-semibold tracking-tight text-ink">Images</h3>
            <ImageUploader
              label="Main image"
              value={phone.image ?? ""}
              onChange={(v) => set("image", v)}
            />
            <div>
              <span className="field-label">Gallery ({(phone.images ?? []).length})</span>
              {(phone.images ?? []).length > 0 && (
                <div className="mb-4 flex flex-wrap gap-3">
                  {(phone.images ?? []).map((img: ImageAsset, i) => (
                    <div key={i} className="relative">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-hairline bg-paper">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.src} alt="" className="max-h-full max-w-full object-contain p-1" />
                      </div>
                      <button
                        onClick={() => removeGalleryImage(i)}
                        className="absolute -right-2 -top-2 rounded-full bg-ink p-1 text-white"
                        title="Remove"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <GalleryAdder onAdd={addGalleryImage} />
            </div>
          </section>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="card p-6">
            <div className="mb-4 flex items-center gap-2 text-caption font-medium text-tertiary">
              <Eye size={14} /> Live preview
            </div>
            <div className="flex h-44 items-center justify-center rounded-xl bg-paper">
              <PhoneImage src={previewSrc} alt={phone.name} shape={phone.shape} className="max-h-40 w-auto" />
            </div>
            <div className="mt-5 text-center">
              <div className="text-caption uppercase tracking-wide text-accent">
                {data.brands[phone.brand]?.name ?? "—"}
              </div>
              <div className="mt-1 text-xl font-semibold tracking-tight text-ink">
                {phone.name || "Untitled"}
              </div>
              <div className="mt-1 text-caption text-tertiary">{phone.year || "—"}</div>
            </div>
            {phone.desc && <p className="mt-4 text-caption leading-relaxed text-secondary">{phone.desc}</p>}
          </div>

          {!isNew && (
            <button
              onClick={() => {
                if (confirm(`Delete "${phone.name}" from your working copy?`)) {
                  deletePhone(phone.id);
                  router.push("/admin/phones");
                }
              }}
              className="btn-ghost mt-4 w-full !text-warn"
            >
              <Trash2 size={15} /> Delete phone
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function GalleryAdder({ onAdd }: { onAdd: (src: string) => void }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-secondary !px-4 !py-2">
        <Plus size={15} /> Add gallery image
      </button>
    );
  }
  return (
    <div className="rounded-xl border border-dashed border-hairline p-4">
      <ImageUploader
        label="New gallery image"
        value=""
        onChange={(v) => {
          onAdd(v);
          setOpen(false);
        }}
        square
      />
    </div>
  );
}
