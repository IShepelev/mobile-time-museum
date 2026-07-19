"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, ChevronRight } from "lucide-react";

const NAV = [
  { href: "/", label: "Museum" },
  { href: "/browse", label: "Explore" },
  { href: "/brands", label: "Brands" },
];

/**
 * Global sticky glass navigation. `crumbs` is kept for backward
 * compatibility with existing pages and is shown as a subtle breadcrumb
 * trail on desktop.
 */
export default function TopBar({ crumbs = [] }: { crumbs?: string[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 glass border-b border-hairline/70">
      <nav className="container-x flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-2.5" aria-label="Mobile Time Museum — home">
            <span className="h-2.5 w-2.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-125" />
            <span className="text-[15px] font-semibold tracking-tight text-ink">Mobile Time Museum</span>
          </Link>

          {crumbs.length > 0 && (
            <div className="hidden items-center gap-2 text-caption text-tertiary lg:flex">
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-2">
                  <ChevronRight size={12} className="opacity-40" />
                  <span className={i === crumbs.length - 1 ? "text-ink" : ""}>{c}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-1.5 text-caption font-medium transition-colors ${
                isActive(item.href) ? "text-ink" : "text-secondary hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/search"
            aria-label="Search"
            className="ml-1 rounded-full p-2 text-secondary transition-colors hover:text-accent"
          >
            <Search size={18} />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full p-2 text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-hairline/70 bg-surface md:hidden">
          <div className="container-x flex flex-col py-2">
            {[...NAV, { href: "/search", label: "Search" }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-2 py-3 text-meta font-medium transition-colors ${
                  isActive(item.href) ? "text-accent" : "text-ink hover:text-accent"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
