# Soul Good

Chef Kyla's premium wellness food brand — Southern soul food meets functional healing nutrition.

This repository serves the **Soul Good launch microsite** (`apps/launch`): a mobile-first
Pathway Finder quiz → lead capture → confirmation flow for the Founding 50 cohort.

## Quick Start

All root scripts delegate to the microsite (`apps/launch`):

```bash
npm install
npm run dev     # http://localhost:3000  (Soul Good microsite)
npm run build   # Production build
npm run start   # Serve production build
npm run lint    # ESLint
npm run test    # Vitest (apps/launch)
```

> Deploying on Vercel/Netlify? Set the project **root directory to `apps/launch`**
> (the root scripts above produce the same result for generic CI hosts).

## Monorepo Layout

```
apps/
└── launch/             # The Soul Good microsite (Next.js 16, App Router)
    ├── src/app/        # /  /quiz  /join  /welcome  /checkout  + /api/lead, /api/checkout
    ├── src/components/  # quiz, join, welcome, menu, sections, ui
    └── src/lib/        # quiz, pathways, lead-schema, brand, capture (Airtable/local)

packages/
└── menu/               # @soulgood/menu — the real menu (single source of truth)
```

## The Menu (`@soulgood/menu`)

`packages/menu/src/index.ts` is the single source of truth for the Soul Good menu,
transcribed from the official menu collateral. Four pathway **collections** — Mindful,
Performance, Detox, Alignment — each with **Wraps / Bowls / Breakfast & Essentials /
Juices & Hydration**. The pathway a guest matches in the quiz maps directly to its menu
collection, which is shown on the quiz result and welcome screens.

## Flow & Pricing

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
