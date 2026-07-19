import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-hairline">
      <div className="container-x grid gap-10 py-16 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="text-[15px] font-semibold tracking-tight text-ink">Mobile Time Museum</span>
          </div>
          <p className="mt-4 max-w-sm text-caption leading-relaxed text-tertiary">
            A digital museum preserving the evolution of mobile phones — from the first
            handheld bricks to folding glass.
          </p>
        </div>

        <nav className="flex flex-col gap-3 text-caption">
          <span className="font-medium text-secondary">Explore</span>
          <Link href="/" className="text-tertiary transition-colors hover:text-ink">Timeline</Link>
          <Link href="/browse" className="text-tertiary transition-colors hover:text-ink">Browse &amp; filter</Link>
          <Link href="/brands" className="text-tertiary transition-colors hover:text-ink">Brands</Link>
          <Link href="/search" className="text-tertiary transition-colors hover:text-ink">Search</Link>
        </nav>

        <nav className="flex flex-col gap-3 text-caption">
          <span className="font-medium text-secondary">Museum</span>
          <Link href="/admin" className="text-tertiary transition-colors hover:text-ink">Admin panel</Link>
          <span className="text-tertiary">Est. 2026</span>
        </nav>
      </div>

      <div className="container-x border-t border-hairline py-8">
        <p className="text-caption text-tertiary">
          Collection data compiled from user-submitted records · photos via Wikimedia Commons
          (CC BY-SA). Brand names and logos are trademarks of their respective owners.
        </p>
      </div>
    </footer>
  );
}
