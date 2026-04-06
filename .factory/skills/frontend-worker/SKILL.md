---
name: frontend-worker
description: Builds Next.js pages, components, and features for the Soul Good website
---

# Frontend Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the WORK PROCEDURE.

## When to Use This Skill

Use for any feature that involves building Next.js pages, React components, Tailwind CSS styling, or client-side interactivity for the Soul Good website.

## Required Skills

- **agent-browser**: Used for manual verification of built pages and components. Invoke after implementing to visually verify rendering at desktop and mobile widths.

## Work Procedure

### 1. Understand the Feature
- Read the feature description, preconditions, expectedBehavior, and verificationSteps carefully
- Read `AGENTS.md` for coding conventions and design system rules
- Read `.factory/library/architecture.md` for component patterns and data flow
- Check `src/lib/types.ts` and `src/lib/constants.ts` for existing data structures
- Check what components already exist in `src/components/` to avoid duplication

### 2. Plan the Implementation
- Identify which files need to be created or modified
- Determine if new TypeScript interfaces are needed in `types.ts`
- Determine if new constants/data are needed in `constants.ts`
- Check if existing UI components can be reused

### 3. Implement (Test-Driven)
- For components with logic (forms, cart, configurator): write the component test expectations first
- Build the component/page following the conventions in AGENTS.md:
  - Use Tailwind utility classes
  - Zero border-radius on all elements
  - Proper responsive breakpoints (mobile-first)
  - Next.js Image component for all images
  - Proper TypeScript types (no `any`)
  - `"use client"` only when needed
- Add TODO comments for backend integration points

### 4. Verify with TypeScript and Lint
- Run `npx tsc --noEmit` to verify no type errors
- Run `pnpm lint` to verify no lint errors
- Fix any issues before proceeding

### 5. Verify with agent-browser (REQUIRED)
- Start the dev server: `pnpm dev` (wait for it to be ready)
- Use agent-browser to navigate to the page at http://localhost:3000/{route}
- Take screenshots at desktop width (1440px) and mobile width (375px)
- Verify:
  - Page renders without visual errors
  - All content is visible and properly laid out
  - Interactive elements work (click buttons, expand accordions, fill forms)
  - Responsive layout is correct at mobile width
  - No console errors
- Stop the dev server when done: `lsof -ti :3000 | xargs kill -9 2>/dev/null || true`

### 6. Record Every Verification
- Every page/component verified = one entry in `interactiveChecks`
- Include the specific actions taken and what was observed
- Note any visual issues or deviations from the design system

## Example Handoff

```json
{
  "salientSummary": "Built the homepage with all 10 sections: hero, category nav, product carousel, brand feature, editorial cards, press logos, philosophy pillars, testimonials, newsletter signup, and responsive mobile layout. Verified at desktop (1440px) and mobile (375px) via agent-browser.",
  "whatWasImplemented": "Created src/app/page.tsx (homepage), src/components/sections/Hero.tsx, CategoryNav.tsx, ProductCarousel.tsx, BrandFeature.tsx, EditorialCards.tsx, PressLogos.tsx, PhilosophyPillars.tsx, Testimonials.tsx, Newsletter.tsx. Added homepage content data to src/lib/constants.ts. Installed and configured swiper for carousels.",
  "whatWasLeftUndone": "",
  "verification": {
    "commandsRun": [
      {"command": "npx tsc --noEmit", "exitCode": 0, "observation": "No type errors"},
      {"command": "pnpm lint", "exitCode": 0, "observation": "No lint errors"},
      {"command": "pnpm build", "exitCode": 0, "observation": "Build succeeded, all pages pre-rendered"}
    ],
    "interactiveChecks": [
      {"action": "Opened http://localhost:3000 at 1440px width, scrolled through all sections", "observed": "All 10 sections render correctly. Hero has 50/50 split, carousels scroll with arrows, newsletter form has email input and submit button. Soul Good colors applied throughout."},
      {"action": "Opened http://localhost:3000 at 375px width", "observed": "Hero stacks vertically (image on top, text below). Carousels are touch-scrollable. Editorial cards stack to single column. Footer columns collapse."},
      {"action": "Clicked hero CTA button", "observed": "Navigated to /meal-plans page correctly"},
      {"action": "Submitted newsletter form with empty email", "observed": "Validation error displayed: 'Please enter a valid email address'"},
      {"action": "Submitted newsletter form with valid email", "observed": "Success message displayed: 'Thank you for signing up!'"}
    ]
  },
  "tests": {
    "added": []
  },
  "discoveredIssues": []
}
```

## When to Return to Orchestrator

- A precondition is not met (e.g., a required component or data structure doesn't exist yet)
- The design system specifications are ambiguous or contradictory
- A dependency (npm package) fails to install or has compatibility issues
- The dev server won't start or crashes
- The feature scope is significantly larger than described
