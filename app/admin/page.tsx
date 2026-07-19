"use client";

import Link from "next/link";
import { Plus, Smartphone, Tag, CalendarDays, FileEdit, UploadCloud } from "lucide-react";
import { useMuseum } from "@/lib/useMuseum";

export default function AdminDashboard() {
  const data = useMuseum();
  const total = data.phones.length;
  const drafts = data.phones.filter((p) => (p.status ?? "published") === "draft").length;
  const published = total - drafts;
  const brands = Object.keys(data.brands).length;
  const years = Object.keys(data.years).length;

  const recent = [...data.phones]
    .sort((a, b) => b.year - a.year || a.name.localeCompare(b.name))
    .slice(0, 6);

  const stats = [
    { label: "Phones", value: total, icon: Smartphone, href: "/admin/phones" },
    { label: "Published", value: published, icon: UploadCloud, href: "/admin/phones" },
    { label: "Drafts", value: drafts, icon: FileEdit, href: "/admin/phones" },
    { label: "Brands", value: brands, icon: Tag, href: "/admin/brands" },
    { label: "Years", value: years, icon: CalendarDays, href: "/admin/years" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-pagetitle text-ink">Dashboard</h1>
          <p className="mt-2 text-meta text-secondary">Manage the entire collection from the browser.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/phones/new" className="btn-primary">
            <Plus size={17} /> Add phone
          </Link>
          <Link href="/admin/brands" className="btn-secondary">
            <Plus size={15} /> Add brand
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="card card-hover p-6">
              <Icon size={18} className="text-accent" />
              <div className="mt-4 text-3xl font-semibold tracking-tight text-ink">{s.value}</div>
              <div className="mt-1 text-caption text-tertiary">{s.label}</div>
            </Link>
          );
        })}
      </div>

      {/* Recent */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Recently in the collection</h2>
          <Link href="/admin/phones" className="text-caption font-medium text-accent hover:underline">
            View all
          </Link>
        </div>
        <div className="card divide-y divide-hairline">
          {recent.map((p) => (
            <Link
              key={p.id}
              href={`/admin/phones/${encodeURIComponent(p.id)}`}
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-paper"
            >
              <div>
                <div className="font-medium text-ink">{p.name}</div>
                <div className="text-caption text-tertiary">
                  {data.brands[p.brand]?.name ?? p.brand} · {p.year}
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-caption font-medium ${
                  (p.status ?? "published") === "draft"
                    ? "bg-warn/10 text-warn"
                    : "bg-success/10 text-success"
                }`}
              >
                {p.status ?? "published"}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
