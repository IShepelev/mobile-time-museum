"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Smartphone,
  Tag,
  CalendarDays,
  UploadCloud,
  Eye,
  LogOut,
  Lock,
} from "lucide-react";
import { isAuthed, login, logout, hasUnpublishedChanges } from "@/lib/store";
import { useMuseum } from "@/lib/useMuseum";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/phones", label: "Phones", icon: Smartphone },
  { href: "/admin/brands", label: "Brands", icon: Tag },
  { href: "/admin/years", label: "Years", icon: CalendarDays },
  { href: "/admin/preview", label: "Preview", icon: Eye },
  { href: "/admin/publish", label: "Publish", icon: UploadCloud },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAuthed(isAuthed());
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-paper" />;
  }

  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} />;
  }

  return <AdminChrome onLogout={() => setAuthed(false)}>{children}</AdminChrome>;
}

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (login(password)) onSuccess();
    else setError(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <form onSubmit={submit} className="card w-full max-w-sm animate-scalein p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Lock size={22} />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">Admin Panel</h1>
        <p className="mt-2 text-caption text-tertiary">Sign in to manage the collection.</p>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          className="field mt-6 text-center"
        />
        {error && <p className="mt-3 text-caption text-warn">Incorrect password.</p>}
        <button type="submit" className="btn-primary mt-5 w-full">
          Sign in
        </button>
        <p className="mt-6 text-caption text-tertiary">
          Default password is <code className="rounded bg-paper px-1.5 py-0.5 text-ink">museum</code>.
          Set <code className="text-ink">NEXT_PUBLIC_ADMIN_PASSWORD</code> to change it. This is a
          soft gate, not real security.
        </p>
        <Link href="/" className="mt-4 inline-block text-caption text-accent hover:underline">
          ← Back to site
        </Link>
      </form>
    </div>
  );
}

function AdminChrome({ children, onLogout }: { children: ReactNode; onLogout: () => void }) {
  const pathname = usePathname();
  useMuseum(); // re-render when the working copy changes
  const dirty = hasUnpublishedChanges();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="min-h-screen bg-paper">
      {/* Top bar */}
      <header className="sticky top-0 z-50 glass border-b border-hairline/70">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="text-[15px] font-semibold tracking-tight text-ink">
              Museum CMS
            </span>
            {dirty && (
              <span className="rounded-full bg-warn/10 px-2.5 py-0.5 text-caption font-medium text-warn">
                Unpublished changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="btn-ghost">
              View site
            </Link>
            <button
              onClick={() => {
                logout();
                onLogout();
              }}
              className="btn-ghost"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-8 px-5 py-8">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-20 space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-caption font-medium transition-colors ${
                    active ? "bg-surface text-accent shadow-subtle" : "text-secondary hover:text-ink"
                  }`}
                >
                  <Icon size={17} /> {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">
          {/* Mobile nav */}
          <nav className="mb-6 flex gap-2 overflow-x-auto md:hidden">
            {NAV.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-full px-4 py-2 text-caption font-medium ${
                    active ? "bg-accent text-white" : "border border-hairline bg-surface text-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {children}
        </main>
      </div>
    </div>
  );
}
