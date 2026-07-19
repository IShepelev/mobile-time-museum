"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { useMuseum } from "@/lib/useMuseum";
import { blankBrand, deleteBrand, slugify, upsertBrand } from "@/lib/store";
import { Field, TextArea } from "@/components/admin/fields";
import ImageUploader from "@/components/admin/ImageUploader";
import BrandLogo from "@/components/BrandLogo";
import type { Brand } from "@/lib/types";

export default function AdminBrands() {
  const data = useMuseum();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [draft, setDraft] = useState<Brand>(blankBrand());
  const [idField, setIdField] = useState("");

  const brands = Object.entries(data.brands).sort((a, b) => a[1].name.localeCompare(b[1].name));

  function startNew() {
    setDraft(blankBrand());
    setIdField("");
    setIsNew(true);
    setEditingId("new");
  }
  function startEdit(id: string) {
    setDraft({ ...data.brands[id] });
    setIdField(id);
    setIsNew(false);
    setEditingId(id);
  }
  function close() {
    setEditingId(null);
  }

  function save() {
    const name = draft.name.trim();
    if (!name) {
      alert("Brand name is required.");
      return;
    }
    const id = isNew ? slugify(idField || name) : editingId!;
    if (!id) {
      alert("A valid brand id is required.");
      return;
    }
    if (isNew && data.brands[id]) {
      alert(`A brand with id "${id}" already exists.`);
      return;
    }
    upsertBrand(id, { ...draft, name });
    close();
  }

  const countFor = (id: string) => data.phones.filter((p) => p.brand === id).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-pagetitle text-ink">Brands</h1>
          <p className="mt-2 text-meta text-secondary">{brands.length} brands</p>
        </div>
        <button onClick={startNew} className="btn-primary">
          <Plus size={17} /> Add brand
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map(([id, brand]) => (
          <div key={id} className="card flex items-center gap-4 p-5">
            <BrandLogo brand={brand} size={48} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold text-ink">{brand.name}</div>
              <div className="text-caption text-tertiary">
                {countFor(id)} model{countFor(id) === 1 ? "" : "s"} · {id}
              </div>
            </div>
            <button onClick={() => startEdit(id)} className="rounded-lg p-2 text-tertiary hover:bg-paper hover:text-accent" title="Edit">
              <Pencil size={16} />
            </button>
            <button
              onClick={() => {
                const n = countFor(id);
                if (n > 0) {
                  alert(`Can't delete "${brand.name}" — ${n} phone(s) still reference it. Reassign or remove those first.`);
                  return;
                }
                if (confirm(`Delete brand "${brand.name}"?`)) deleteBrand(id);
              }}
              className="rounded-lg p-2 text-tertiary hover:bg-paper hover:text-warn"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Editor drawer */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/30 backdrop-blur-sm" onClick={close}>
          <div
            className="h-full w-full max-w-lg overflow-y-auto bg-paper p-6 shadow-float animate-scalein"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-ink">
                {isNew ? "Add brand" : `Edit ${draft.name}`}
              </h2>
              <button onClick={close} className="rounded-lg p-2 text-tertiary hover:text-ink">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              {isNew && (
                <Field
                  label="Brand id (URL slug)"
                  value={idField}
                  onChange={setIdField}
                  placeholder="auto from name if blank"
                  hint="Used in the URL: /brand/<id>. Lowercase, no spaces."
                />
              )}
              <Field label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Country" value={draft.country ?? ""} onChange={(v) => setDraft({ ...draft, country: v })} />
                <Field label="Founded" value={draft.founded} onChange={(v) => setDraft({ ...draft, founded: v })} />
                <Field label="Closed (if any)" value={draft.closed ?? ""} onChange={(v) => setDraft({ ...draft, closed: v })} />
                <Field label="Website" value={draft.website ?? ""} onChange={(v) => setDraft({ ...draft, website: v })} />
              </div>
              <Field label="Wikipedia" value={draft.wikipedia ?? ""} onChange={(v) => setDraft({ ...draft, wikipedia: v })} />
              <TextArea label="Description (shown on brand page)" value={draft.description ?? ""} onChange={(v) => setDraft({ ...draft, description: v })} rows={3} />
              <TextArea label="History" value={draft.history} onChange={(v) => setDraft({ ...draft, history: v })} rows={4} />
              <ImageUploader label="Logo" value={draft.logo ?? ""} onChange={(v) => setDraft({ ...draft, logo: v })} square />
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={save} className="btn-primary flex-1">
                <Save size={16} /> Save brand
              </button>
              <button onClick={close} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
