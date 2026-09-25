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
