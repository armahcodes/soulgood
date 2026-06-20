# Soul Good

Chef Kyla's premium wellness food brand — Southern soul food meets functional healing nutrition.

This repository contains two apps:

- **`apps/launch`** — the **Soul Good launch microsite** (currently the live/deployed site):
  a mobile-first Pathway Finder quiz → lead capture → confirmation flow for the Founding 50 cohort.
- **root (`src/`)** — the **full Soul Good website** (Next.js 16, App Router). It is kept in
  the repo but is **not currently deployed** (hidden). Only the microsite is live.

## Quick Start

### Microsite (live site — `apps/launch`)

```bash
npm install
npm run launch:dev     # http://localhost:3000  (microsite)
npm run launch:build   # Production build
npm run launch:start   # Serve production build
npm run launch:lint    # ESLint
npm run launch:test    # Vitest
```

> The microsite deploys on Vercel with the project **root directory set to `apps/launch`**.

### Full website (hidden — repo root)

```bash
npm install
npm run dev     # http://localhost:3000  (full website)
npm run build   # Production build
npm run start   # Serve production build
npm run lint    # ESLint
```

> The full website is not connected to a deployment. To make it live again, point a
> Vercel project at the repo root.

## Layout

```
src/                    # Full Soul Good website (hidden / not deployed)
├── app/                # marketing site routes incl. /menu
├── components/         # site components incl. menu/WeeklyMenuContent
└── lib/                # constants, types, and menu.ts (the real menu)

apps/
└── launch/             # The Soul Good microsite (live)
    ├── src/app/        # /  /quiz  /join  /welcome  /checkout  + /api/lead, /api/checkout
    ├── src/components/  # quiz, join, welcome, menu, sections, ui
    └── src/lib/        # quiz, pathways, lead-schema, brand, capture, and menu.ts (the real menu)
```

## The Menu

The real Soul Good menu (transcribed from the official menu collateral) has four pathway
**collections** — Mindful, Performance, Detox, Alignment — each with **Wraps / Bowls /
Breakfast & Essentials / Juices & Hydration**.

Because the two apps deploy independently, each keeps its own self-contained copy of the
menu data:

- Microsite: `apps/launch/src/lib/menu.ts` (drives the quiz result + welcome screens)
- Full website: `src/lib/menu.ts` (drives `/menu`)

Keep the two files in sync when the menu changes.

## Flow & Pricing (microsite)

1. **/quiz** — the Pathway Finder matches a guest to one of the four pathways.
2. **/join** — captures name, email, and phone (lead capture), then routes to **/welcome**.
3. **/welcome** — confirmation + the matched pathway's full menu.

- **Lead capture only — no payment is charged right now.** The Stripe checkout code
  (`/checkout`, `/api/checkout`) is left in place but unwired for when ordering opens.
- Plan pricing (shown for context): **$88 first week, then $111/week** — one meal a day,
  Monday–Friday (5 meals) + 5 functional juices, delivered fresh every Sunday.

Pricing and plan facts live in `apps/launch/src/lib/brand.ts`.

## Lead Capture

Leads POST to `/api/lead`. With all three `AIRTABLE_*` env vars set, leads go to Airtable;
otherwise they fall back to a local JSONL file (and on any Airtable error, so a lead is
never dropped). See `apps/launch/.env.example`.

## Enabling Payments Later

When you're ready to charge: add a **freshly rotated** `STRIPE_SECRET_KEY` to
`apps/launch/.env.local` (gitignored — never commit it), then re-route the join CTA to
`/checkout`. `/api/checkout` charges the first-week intro price ($88).

## License

Private — All rights reserved.
