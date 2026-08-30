# Soul Bowls™

Five chef-made bowls ready every Sunday for $88/week, with pickup or delivery.

This repository contains two apps:

- **`apps/launch`** — the **Soul Bowls™ launch microsite** (currently the live/deployed site):
  a focused product landing page → lead capture → confirmation flow.
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
└── launch/             # The Soul Bowls™ microsite (live)
    ├── src/app/        # customer flow, legal pages, and API routes
    ├── src/components/  # signup, checkout, and brand UI
    └── src/lib/        # lead schema, brand, capture, and legacy menu data
```

## Legacy Menu Data

The real Soul Good menu (transcribed from the official menu collateral) has four pathway
**collections** — Mindful, Performance, Detox, Alignment — each with **Wraps / Bowls /
Breakfast & Essentials / Juices & Hydration**.

Because the two apps deploy independently, each keeps its own self-contained copy of the
menu data:

- Microsite: `apps/launch/src/lib/menu.ts` (preserved legacy source data)
- Full website: `src/lib/menu.ts` (drives `/menu`)

Keep the two files in sync when the menu changes.

## Flow & Pricing (microsite)

1. **/** — presents the single Soul Bowls™ offer and captures contact, fulfillment preference, and LA County delivery eligibility.
2. **/checkout** — discloses every charge and collects affirmative recurring-plan consent.
3. **/welcome** — confirms the paid reservation and provides retainable plan/cancellation terms.
4. **/terms**, **/customer-agreement**, and **/cancel** — legal and subscription-management pages.
5. **/join** redirects to the homepage form; **/quiz** redirects to the homepage.

- Plan pricing: **$88/week** for 5 chef-made bowls, ready every Sunday.
- Sunday pickup: **$0**. Los Angeles County delivery: **$8.88/week**.
- Applicable California sales tax is looked up by address through CDTFA, shown before consent, revalidated server-side, and passed to Square with the subscription.
- Online payment remains disabled until the Square application, location, access token, and subscription-plan IDs are configured.

Pricing and plan facts live in `apps/launch/src/lib/brand.ts`.

## Lead Capture

Leads POST to `/api/lead`. With `MONGODB_URI` set, leads go to MongoDB; otherwise
they fall back to a local JSONL file (and on any MongoDB error, so a lead is never
dropped). See `apps/launch/.env.example`.

## Enabling Square Payments

Create two WEEKLY Square subscription plan variations: **$88 pickup** and
**$96.88 delivery**. Add `SQUARE_APPLICATION_ID`, `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`,
`SQUARE_PICKUP_PLAN_VARIATION_ID`, and `SQUARE_DELIVERY_PLAN_VARIATION_ID` to
`apps/launch/.env.local` (gitignored — never commit it). Set `SQUARE_ENVIRONMENT`
to `production` only for live credentials. The checkout uses Square Web Payments
to tokenize the card, stores it on the Square customer with explicit consent, and
creates a weekly subscription through the Subscriptions API. `/api/tax` uses the
official CDTFA address service and rejects delivery addresses outside Los Angeles
County. The server recalculates the rate before sending `tax_percentage` to Square.

Any reusable-container deposit remains outside the recurring plan; it is disclosed
and collected separately when containers are issued.

## License

Private — All rights reserved.
