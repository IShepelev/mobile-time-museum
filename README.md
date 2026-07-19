# Mobile Time Museum

A digital museum for exploring the history of mobile phones — travel through
years, brands, and individual exhibits, with a built-in browser-based CMS for
editing the whole collection without touching code.

## Stack

- Next.js 14 (App Router, file-based routing)
- TypeScript (strict, zero errors)
- Tailwind CSS
- lucide-react icons
- Self-hosted Inter via `next/font`

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Routes

| Route | Page |
|---|---|
| `/` | Home — hero + interactive year timeline |
| `/browse` | Explore everything with search + full filter panel |
| `/brands` | All brands |
| `/year/[year]` | Brands active in a given year |
| `/brand/[brandId]` | Brand history + its year-by-year timeline |
| `/brand/[brandId]/[year]` | Phone list for that brand/year |
| `/phone/[id]` | Full exhibit — gallery, specs, history, related, prev/next |
| `/search` | Quick search across phones, brands, years |
| `/admin` | **Admin Panel / CMS** (see below) |

## Data — single source of truth

All collection data lives in **`/data`** as plain JSON:

- `data/phones.json` — every phone (array of `Phone`)
- `data/brands.json` — every brand (`Record<brandId, Brand>`)
- `data/years.json` — timeline year intros (`Record<year, string>`)

`lib/data.ts` reads exclusively from those files and exposes the same API the
whole app uses (`BRANDS`, `PHONES`, `YEARS`, lookups, facets, relationships).
The original hand-written `lib/phones/**.ts` sources were migrated into JSON by
`scripts/migrate-to-json.mjs` (kept for reference) and removed — **you never
edit TypeScript to change the collection.**

Types are in `lib/types.ts`. Core fields are unchanged from v1; new fields
(`series`, `history`, `images`, `wikipedia`, `source`, richer specs, brand
`country`/`closed`/`logo`/`website`, …) are all optional, so existing records
stay valid.

## Admin Panel (CMS)

Go to `/admin` and sign in.

- **Password:** defaults to `museum`. Override with the
  `NEXT_PUBLIC_ADMIN_PASSWORD` build-time env var. This is a *soft gate* on a
  static site — not real authentication.
- **Dashboard** — collection stats and recent activity.
- **Phones** — search, filter, paginate; add / edit / delete; draft ↔ publish.
  The editor is a full template with every field and image/gallery upload.
- **Brands** — add / edit / delete, with logo upload and country/founded/closed.
- **Years** — add / rename / delete years and edit their timeline intros.
- **Preview** — see any phone exactly as it will look publicly, including
  unpublished drafts, before publishing.
- **Publish** — promote drafts, then **download** the updated
  `phones.json` / `brands.json` / `years.json`.

### How editing + publishing works

The CMS keeps a **working copy** of the whole dataset in the browser
(localStorage), seeded from `/data` on first use. Every edit happens there —
no backend, no accounts. Images are stored inline as base64 data URLs.

To make edits go live:

1. Edit in the Admin Panel (drafts and publishes accumulate in the working copy).
2. Open **Publish → Download data files**.
3. Replace the three files in `/data` with the downloads and redeploy.

The live site reads from `/data`, so your changes ship on the next build.

## Images

`lib/images.ts` resolves each phone's main image in priority order: an explicit
`image` on the record (CMS upload or URL) → a curated Wikimedia Commons photo →
otherwise the illustrated `PhoneGlyph` fallback (so nothing is ever broken).
Gallery images are supported per phone.

## Deployment

Works out of the box on Vercel (or any Node host):

```bash
npm run build
```

No environment variables are required (set `NEXT_PUBLIC_ADMIN_PASSWORD` if you
want a custom admin password).
