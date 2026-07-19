"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import TopBar from "@/components/TopBar";
import PhoneCard from "@/components/PhoneCard";
import { Eyebrow } from "@/components/ui";
import {
  ALL_COLORS,
  ALL_SERIES,
  BRANDS,
  NETWORKS,
  OPERATING_SYSTEMS,
  PHONES,
  SHAPES,
  YEARS,
} from "@/lib/data";
import { applyFilters, searchPhones, type PhoneFilters } from "@/lib/search";
import type { PhoneShape } from "@/lib/types";

type SortKey = "year-desc" | "year-asc" | "name" | "brand";

const PAGE_SIZE = 24;

export default function BrowsePage() {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<PhoneFilters>({});
  const [sort, setSort] = useState<SortKey>("year-desc");
  const [panelOpen, setPanelOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const brandOptions = useMemo(
    () =>
      Object.entries(BRANDS)
        .filter(([id]) => PHONES.some((p) => p.brand === id))
        .map(([id, b]) => ({ id, name: b.name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const results = useMemo(() => {
    let list = searchPhones(PHONES, q, BRANDS);
    list = applyFilters(list, filters);
    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sort) {
        case "year-asc":
          return a.year - b.year || a.name.localeCompare(b.name);
        case "name":
          return a.name.localeCompare(b.name);
        case "brand":
          return BRANDS[a.brand].name.localeCompare(BRANDS[b.brand].name) || a.year - b.year;
        default:
          return b.year - a.year || a.name.localeCompare(b.name);
      }
    });
    return sorted;
  }, [q, filters, sort]);

  const shown = results.slice(0, visible);
  const activeCount = Object.values(filters).filter((v) => v !== undefined && v !== "").length;

  function set<K extends keyof PhoneFilters>(key: K, value: PhoneFilters[K]) {
    setVisible(PAGE_SIZE);
    setFilters((prev) => {
      const next = { ...prev };
      if (value === undefined || value === "" || prev[key] === value) delete next[key];
      else next[key] = value;
      return next;
    });
  }

  function clearAll() {
    setFilters({});
    setQ("");
    setVisible(PAGE_SIZE);
  }

  return (
    <div className="animate-fadein">
      <TopBar crumbs={["Explore"]} />
      <div className="container-x pt-14 pb-8">
        <Eyebrow>The whole collection</Eyebrow>
        <h1 className="mt-3 text-pagetitle text-ink">Explore</h1>

        {/* Search bar */}
        <div className="mt-8 flex items-center gap-3 rounded-full border border-hairline bg-surface px-5 py-3 shadow-subtle focus-within:border-accent">
          <Search size={20} className="text-tertiary" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Search brand, model, year, OS, camera, network…"
            className="w-full bg-transparent text-meta text-ink outline-none placeholder:text-tertiary"
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="Clear search" className="text-tertiary hover:text-ink">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="container-x grid gap-10 pb-20 lg:grid-cols-[260px_1fr]">
        {/* Filter panel */}
        <aside className={`${panelOpen ? "block" : "hidden"} lg:block`}>
          <div className="lg:sticky lg:top-20">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-caption font-semibold text-ink">Filters</span>
              {activeCount > 0 && (
                <button onClick={clearAll} className="text-caption text-accent hover:underline">
                  Clear all
                </button>
              )}
            </div>

            <FilterSelect label="Brand" value={filters.brand ?? ""} onChange={(v) => set("brand", v || undefined)}
              options={brandOptions.map((b) => ({ value: b.id, label: b.name }))} />
            <FilterSelect label="Year" value={filters.year ? String(filters.year) : ""}
              onChange={(v) => set("year", v ? Number(v) : undefined)}
              options={[...YEARS].reverse().map((y) => ({ value: String(y), label: String(y) }))} />
            <FilterSelect label="Shape" value={filters.shape ?? ""}
              onChange={(v) => set("shape", (v || undefined) as PhoneShape | undefined)}
              options={SHAPES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))} />
            <FilterSelect label="Operating system" value={filters.os ?? ""} onChange={(v) => set("os", v || undefined)}
              options={OPERATING_SYSTEMS.map((o) => ({ value: o, label: o }))} />
            <FilterSelect label="Network" value={filters.network ?? ""} onChange={(v) => set("network", v || undefined)}
              options={NETWORKS.map((n) => ({ value: n, label: n }))} />
            <FilterSelect label="Series" value={filters.series ?? ""} onChange={(v) => set("series", v || undefined)}
              options={ALL_SERIES.map((s) => ({ value: s, label: s }))} />
            <FilterSelect label="Color" value={filters.color ?? ""} onChange={(v) => set("color", v || undefined)}
              options={ALL_COLORS.map((c) => ({ value: c, label: c }))} />

            <label className="mt-2 flex cursor-pointer items-center gap-2.5 py-2 text-caption text-secondary">
              <input
                type="checkbox"
                checked={!!filters.hasCamera}
                onChange={(e) => set("hasCamera", e.target.checked || undefined)}
                className="h-4 w-4 accent-accent"
              />
              Has a camera
            </label>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-caption text-tertiary">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPanelOpen((v) => !v)}
                className="btn-secondary !px-4 !py-2 lg:hidden"
              >
                <SlidersHorizontal size={15} /> Filters{activeCount ? ` (${activeCount})` : ""}
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="field !w-auto !py-2"
                aria-label="Sort"
              >
                <option value="year-desc">Newest first</option>
                <option value="year-asc">Oldest first</option>
                <option value="name">Name A–Z</option>
                <option value="brand">Brand</option>
              </select>
            </div>
          </div>

          {shown.length === 0 ? (
            <div className="card p-16 text-center">
              <p className="text-meta text-secondary">No phones match those filters.</p>
              <button onClick={clearAll} className="btn-secondary mt-6">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((p) => (
                <PhoneCard key={p.id} phone={p} showBrand />
              ))}
            </div>
          )}

          {visible < results.length && (
            <div className="mt-12 text-center">
              <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-secondary">
                Load more ({results.length - visible} remaining)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="mb-4">
      <label className="field-label">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="field">
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
