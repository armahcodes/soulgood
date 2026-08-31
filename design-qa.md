# Soul Good redesign — design QA

## Comparison target

- Source visual truth: `/Users/armahcodes/.codex/generated_images/01a04624-4771-7a71-9dca-95980f12bf9e/exec-99197ac6-c8d4-4c34-8167-039dcedc22ce.png`
- Source dimensions: 856 × 1837 px
- Final implementation capture: `/Users/armahcodes/projects/soulgood/tmp/design-qa/design-qa-implementation-final.png`
- Implementation dimensions: 1280 × 4284 px
- Browser viewport: 1280 × 720 CSS px at device scale factor 1
- State: public homepage, anonymous customer, desktop, top-to-bottom default state
- Full-view comparison: `/Users/armahcodes/projects/soulgood/tmp/design-qa/design-qa-comparison-final-full.jpg`
- Focused hero comparison: `/Users/armahcodes/projects/soulgood/tmp/design-qa/design-qa-comparison-final-hero.jpg`
- Density normalization: both full-page captures were resized to 620 px wide for the side-by-side comparison. Hero crops were normalized to equal 900 × 720 px panels.

## Findings

No actionable P0, P1, or P2 differences remain.

- Fonts and typography: EB Garamond is used for display type and Arial for interface/body copy. The hierarchy, optical weight, line height, and letter spacing follow the selected editorial direction. Product names wrap cleanly without truncation.
- Spacing and layout rhythm: the final pass retains the selected full-bleed hero, alternating product storytelling, five-jar family moment, five-step ritual, split fulfillment choice, price close, and forest conversion ending. The implementation is longer than the generated comp because it preserves legible ingredients, allergen notices, functional controls, and the production footer; this is an intentional product constraint rather than unresolved visual drift.
- Colors and visual tokens: Sage Ritual `#77916f`, Forest Depth `#2c3a34`, Soft Oat `#f8f3ec`, Clay Essence `#c17a5e`, Golden Harvest `#c9a161`, and Warm Sand `#ecd6bc` match the BrandKit tokens. Contrast is sufficient for primary copy and actions.
- Image quality and asset fidelity: the approved Soul Good logo files replace the previous handmade mark. All five supplied jar photographs are used directly through the existing private image route. The botanical branch is a generated raster asset with transparency, not CSS or inline-SVG art. Product imagery remains sharp at the evaluated viewport.
- Copy and content: the page consistently communicates Soul Bowls™, five 32 oz bowls, $88 one-time or weekly, free pickup, $8.88 LA County delivery, tax/deposit disclosure, and the five current bowl names. The primary CTA language is consistently order-focused.

## Interaction and browser checks

- Primary homepage CTA opens `/join`.
- Pickup and delivery actions open `/join` with the requested fulfillment option preselected.
- Empty lead submission exposes accessible field-level validation.
- `/checkout?fulfillment=pickup` loads the branded Square checkout, one-time/weekly choice, five-bowl builder, pickup state, customer/billing fields, tax calculation action, contextual payment disclosure, legal links, and Square card fields.
- Browser console checked after the final render and checkout load: no errors.
- Navigation anchors, legal links, cancellation link, and contact link are present in the rendered accessibility tree.
- The selected design is desktop-first. Responsive classes and small-screen stacking are implemented and compile successfully; a separate mobile-source mock was not provided for pixel comparison.

## Checkout rebuild QA — 2026-08-31

- Evidence: `/Users/armahcodes/projects/soulgood/tmp/checkout-builder-view.png` and `/Users/armahcodes/projects/soulgood/tmp/checkout-one-time.png`.
- A fresh checkout preselects one of each of the five current bowls and shows `5 of 5`.
- Quantity controls allow any mix totaling exactly five; totals below five disable tax calculation and checkout.
- Incomplete mixes persist through refresh without becoming server-valid checkout payloads.
- Each bowl exposes ingredients, serving guidance, dietary positioning, and applicable allergen information through “Learn more.”
- One-time is the default purchase mode and clearly states one charge with no automatic renewal.
- Weekly mode changes the disclosure, consent language, secure-token intent, charge label, and final action to the recurring plan.
- Pickup tax rendered at the verified 9.75% Los Angeles rate in browser QA: $88.00 subtotal, $8.58 tax, $96.58 total.
- One-time and weekly confirmation states render the correct post-purchase language and confirmed recipe quantities.

## Comparison history

### Pass 1

- Evidence: `/Users/armahcodes/projects/soulgood/tmp/design-qa/design-qa-comparison-1-full.jpg`
- Finding: [P2] The product-story section was substantially taller and denser than the selected visual target, weakening the magazine-like pacing.
- Fix: reduced alternating row height, vertical padding, family-lineup spacing, ritual spacing, fulfillment panels, price block, closing CTA, and footer density.

### Pass 2

- Evidence: `/Users/armahcodes/projects/soulgood/tmp/design-qa/design-qa-comparison-2-full.jpg`
- Finding: [P2] Product rows still carried more vertical space than necessary because headline, divider, ingredient, dietary, and allergen treatments stacked independently.
- Fix: simplified each product story to eyebrow, product name, concise ingredients, and applicable allergen notice; tightened the supporting sections again.

### Final pass

- Evidence: `/Users/armahcodes/projects/soulgood/tmp/design-qa/design-qa-comparison-final-full.jpg`
- Post-fix result: the editorial hierarchy, alternating product cadence, fulfillment split, price close, typography, palette, and imagery now follow the selected option while retaining required production information and interactions.

## Follow-up polish

- [P3] Capture and compare a dedicated mobile art direction if one is created later; the current implementation uses production responsive behavior rather than a separate mobile mock.

## Implementation checklist

- [x] Approved logos and brand palette
- [x] Exact display/body typography roles
- [x] Five real 32 oz product images and names
- [x] Functional primary CTA and fulfillment choices
- [x] Working lead validation and Square one-time/weekly checkout handoff
- [x] Legal and cancellation access
- [x] Lint, 66 tests, production build, browser render, and console checks

final result: passed
