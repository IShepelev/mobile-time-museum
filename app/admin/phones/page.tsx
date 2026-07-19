"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Eye, ArrowUpCircle } from "lucide-react";
import { useMuseum } from "@/lib/useMuseum";
import { deletePhone, setPhoneStatus } from "@/lib/store";
import { searchPhones } from "@/lib/search";

const PAGE = 15;

export default function AdminPhones() {
  const data = useMuseum();
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let list = searchPhones(data.phones, q, data.brands);
    if (brand) list = list.filter((p) => p.brand === brand);
    if (status) list = list.filter((p) => (p.status ?? "published") === status);
    return [...list].sort((a, b) => b.year - a.year || a.name.localeCompare(b.name));
  }, [data, q, brand, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE));
  const current = Math.min(page, pageCount - 1);
  const rows = filtered.slice(current * PAGE, current * PAGE + PAGE);

  const brandOptions = Object.entries(data.brands)
    .map(([id, b]) => ({ id, name: b.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  function reset() {
    setPage(0);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-pagetitle text-ink">Phones</h1>
          <p className="mt-2 text-meta text-secondary">{data.phones.length} in the collection</p>
        </div>
        <Link href="/admin/phones/new" className="btn-primary">
          <Plus size={17} /> Add phone
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-2.5 focus-within:border-accent">
          <Search size={17} className="text-tertiary" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              reset();
            }}
            placeholder="Search phones…"
            className="w-full bg-transparent text-meta text-ink outline-none placeholder:text-tertiary"
          />
        </div>
        <select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            reset();
          }}
          className="field !w-auto !py-2.5"
        >
          <option value="">All brands</option>
          {brandOptions.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            reset();
          }}
          className="field !w-auto !py-2.5"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="hidden grid-cols-[1fr_140px_80px_110px_150px] gap-4 border-b border-hairline px-5 py-3 text-caption font-medium text-tertiary sm:grid">
          <span>Model</span>
          <span>Brand</span>
          <span>Year</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        {rows.length === 0 ? (
          <div className="px-5 py-16 text-center text-meta text-secondary">No phones match.</div>
        ) : (
          rows.map((p) => {
            const isDraft = (p.status ?? "published") === "draft";
            return (
              <div
                key={p.id}
                className="grid grid-cols-1 gap-2 border-b border-hairline px-5 py-4 last:border-0 sm:grid-cols-[1fr_140px_80px_110px_150px] sm:items-center sm:gap-4"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium text-ink">{p.name}</div>
                  <div className="truncate text-caption text-tertiary sm:hidden">
                    {data.brands[p.brand]?.name ?? p.brand} · {p.year}
                  </div>
                </div>
                <div className="hidden truncate text-caption text-secondary sm:block">
                  {data.brands[p.brand]?.name ?? p.brand}
                </div>
                <div className="hidden text-caption text-secondary sm:block">{p.year}</div>
                <div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-caption font-medium ${
                      isDraft ? "bg-warn/10 text-warn" : "bg-success/10 text-success"
                    }`}
                  >
                    {isDraft ? "draft" : "published"}
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:justify-end">
                  <Link
                    href={`/admin/preview/${encodeURIComponent(p.id)}`}
                    className="rounded-lg p-2 text-tertiary hover:bg-paper hover:text-ink"
                    title="Preview"
                  >
                    <Eye size={16} />
                  </Link>
                  {isDraft && (
                    <button
                      onClick={() => setPhoneStatus(p.id, "published")}
                      className="rounded-lg p-2 text-tertiary hover:bg-paper hover:text-success"
                      title="Publish"
                    >
                      <ArrowUpCircle size={16} />
                    </button>
                  )}
                  <Link
                    href={`/admin/phones/${encodeURIComponent(p.id)}`}
                    className="rounded-lg p-2 text-tertiary hover:bg-paper hover:text-accent"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${p.name}"? This affects your working copy until you publish.`))
                        deletePhone(p.id);
                    }}
                    className="rounded-lg p-2 text-tertiary hover:bg-paper hover:text-warn"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-caption text-tertiary">
            Page {current + 1} of {pageCount} · {filtered.length} results
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={current === 0}
              className="btn-secondary !px-4 !py-2"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={current >= pageCount - 1}
              className="btn-secondary !px-4 !py-2"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
