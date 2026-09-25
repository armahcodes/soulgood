<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## UI kit (21st.dev components)

- Brand-adapted 21st.dev components live in `src/components/ui/kit/`. Each file names its 21st.dev source in a comment. Colors come only from the Brand Kit palette via the semantic tokens in `src/app/globals.css`; corners are capped at 4–8px there too.
- Do not run `21st add` / `npx shadcn add` inside this repo: registry items write to `src/components/ui/` (where `button.tsx` collides with `Button.tsx` on case-insensitive macOS) and inject foreign CSS variables into `globals.css`. Install into a scratch project, read the source (`21st get <id>`), then write a brand version into `kit/`.
- Keep `aria-label`s, legend text, link names, and disclosure copy stable; the e2e suite asserts many of them (one `<header>` per page, `h1` below it, "Build your ritual" → `/checkout`, "Eat Now · Single orders" with `target="_self"`).
- `next/image` `priority` is deprecated in Next 16; use `loading="eager"` (plus `fetchPriority="high"` for the LCP image).

## Verification

From `apps/launch`: `npx tsc --noEmit -p .`, `npx eslint src e2e`, `npx vitest run`, `npx playwright test` (starts its own dev server on :3109 — stop any other `next dev` for this app first).

## Salads, veggie cups & snacks (add-ons)

- Catalog, options, and prices live in `src/lib/menu-extras.ts`; product photos are in `public/menu/<id>.webp` (generated with the imagine.art MCP, Nano Banana Pro, 4:5, oat linen / sage / clay styling).
- Add-ons are validated and priced server-side, bound into the signed tax quote (`extrasHash`), and sent to Square as tier-priced catalog line items whose note names the dish and choices. They repeat on weekly plans.
- Online add-ons stay disabled until all five `SQUARE_ADDON_*_VARIATION_ID` env vars exist. Create them with `node scripts/square-catalog-sync.mjs` (writes to the Square account in `.env`), then add the printed IDs to Vercel.

## Typography (brand)

- Display: **Marcellus** (`--font-serif`) — the closest web match to the flared SOUL GOOD wordmark. One weight only; headings never use negative tracking or faux bold (`font-synthesis: none`).
- Body & UI: **Jost** (`--font-sans`) — matches the geometric NOURISH • HEAL • THRIVE tagline. Labels/eyebrows use Jost medium, uppercase, wide tracking (0.16–0.3em), like the tagline.
- Avoid tight negative letter-spacing, sub-1.0 leading on multi-line headings, and scrolling/sliding text; reveals are fade-only.

## Privacy, newsletter, and community programs

- Legal pages: `/terms`, `/customer-agreement`, `/privacy`, `/privacy-choices`. `LEGAL_VERSION` in `src/lib/brand.ts` is the effective date saved with consent. The postal address (`BUSINESS.mailingAddress`) appears in every email footer (CAN-SPAM) and on legal pages.
- No analytics/ad cookies or pixels are used. If any are added, update `/privacy` first and gate them on `readPrivacyOptOut()` (honors GPC and the saved `sg_privacy` choice).
- Newsletter (`src/lib/newsletter.ts`): double opt-in in Mongo `newsletter_subscribers`, synced to Resend Contacts after confirmation; optional `RESEND_NEWSLETTER_SEGMENT_ID`. One-click unsubscribe (RFC 8058) at `/api/newsletter/unsubscribe`.
- Privacy requests (`/api/privacy-requests`) go to `PRIVACY_EMAIL_TO` (falls back to contact@) with a 45-day respond-by date; keep records 24 months.
- Food for the Soul host applications (`src/lib/meal-drive.ts`): organizations in LA/OC only; never add fields about protected characteristics or meal recipients; commitments require open, first-come-first-served distribution. `src/lib/__tests__/meal-drive.test.ts` guards this. Team notices go to `COMMUNITY_EMAIL_TO`.

## Accessibility (color)

- Text uses `text-clay-ink` / `text-sage-ink` (AA 4.5:1 on oat, card, and sand); keep `clay`/`sage` for fills, borders, and art. Light text on sage needs `bg-sage-ink`.
- Muted forest text is `text-forest/72` or darker; muted oat text on forest is `text-oat/62` or lighter. Anything fainter fails AA for small text.
- Horizontal scrollers without focusable children need `tabIndex={0}`, `role="region"`, and an `aria-label`.
- Re-check with axe (scratch install, not a repo dependency) after visual changes; the last full sweep of every page on desktop and mobile had zero violations.

## SEO

- Page titles, descriptions, canonicals, and robots live in `src/lib/seo.ts` (`PAGE_SEO` + `pageMetadata(path)`); the root layout adds " | Soul Good". Keep titles ≤ ~60 characters and descriptions ≤ 160, facts only (no health claims). `e2e/seo.spec.ts` enforces this.
- Private pages (login, account, cancel, welcome, join, newsletter) use `index: false` (noindex meta). Don't block them in robots.txt, or crawlers can't see the noindex.
- Structured data helpers are in `src/lib/structured-data.ts`, rendered with `<JsonLd>`. FAQ markup must match questions visible on the page.
- Service-area pages come from `src/lib/delivery-areas.ts` (`/delivery/[area]`). Keep each area's facts in sync with checkout and Take Out rules.
- Share cards: `src/lib/og-card.tsx` + `opengraph-image.tsx` per route; photo crops and the Marcellus font are in `assets/og/`.
- Set `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` in Vercel to verify Search Console and Bing, then submit `https://www.soulgood.kitchen/sitemap.xml`.
