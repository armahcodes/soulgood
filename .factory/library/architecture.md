# Architecture

How the system works - components, relationships, data flows, invariants.

---

## Overview
Soul Good is a Next.js 14+ frontend application using the App Router pattern. It replicates sakara.com's luxury wellness brand aesthetic adapted for Chef Kyla's Soul Good brand. The site is frontend-only - all data is hardcoded in constants files, ready for a backend developer to swap in API calls later.

## Tech Stack
- **Framework**: Next.js 14+ with App Router (`src/app/` directory)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: CSS transitions + Framer Motion for complex interactions
- **Carousels**: Swiper.js
- **Forms**: React Hook Form with Zod validation
- **State**: React Context for cart state
- **Images**: Next.js Image component with Unsplash URLs

## Design System
The design is defined by these core principles (matching sakara.com):
- **Zero border-radius** - Every element is sharp/rectangular
- **No box-shadows** - Flat design with color contrast
- **Dual-font system** - Serif for headlines/body, sans-serif for labels/UI
- **Generous whitespace** - 64px horizontal padding, 80px vertical sections
- **Slow transitions** - 0.7s cubic-bezier(0.165, 0.84, 0.44, 1) for buttons

### Soul Good Color Palette
- Primary accent: Deep Terracotta (~#C65D3E)
- Secondary accent: Burnt Sienna (~#A0522D)
- Supporting: Olive/Moss Green (~#6B7F3E)
- Backgrounds: Warm cream (#FAFAF5), off-white (#F5F0EB), light (#EBEBDF)
- Text: Black #000000
- Borders: #D9D9D9
- Buttons: Black bg / white text (primary), outlined (secondary)

### Typography
- Headlines: Playfair Display or Cormorant Garamond (serif, weights 200-600)
- Body: Lora or Source Serif Pro (serif, weight 400)
- Labels/UI: Inter or Work Sans (sans-serif, weight 600, uppercase, letter-spacing)

## Component Architecture

### Layout Components (wrap all pages)
- `RootLayout` - HTML/body wrapper, font loading, global providers
- `Header` - AnnouncementBar + SecondaryNav + MainNav
- `Footer` - Social, link columns, newsletter, legal
- `MobileMenu` - Full-screen slide-in navigation

### Page Composition
Each page is composed of **section components** that follow a consistent pattern:
- Full-width wrapper with theme background
- Inner container with max-width 2000px and 64px horizontal padding
- Content arranged in the section's specific layout

### Data Flow
1. All content data lives in `src/lib/constants.ts` (meals, products, blog posts, FAQs, etc.)
2. TypeScript interfaces in `src/lib/types.ts` define the shape of all data
3. Pages import data from constants and pass to components as props
4. Cart state is managed via React Context (`CartProvider`) with `useCart()` hook
5. Forms use React Hook Form, submission handlers log to console (placeholder for API)

### Cart State Management
- `CartContext` provides: items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal
- State persisted to localStorage for cross-page persistence
- Cart slide-in panel component reads from context
- Cart page reads from context

### Routing Structure
All routes use Next.js App Router file-based routing under `src/app/`:
- Static pages: `page.tsx` files
- Dynamic pages: `[slug]/page.tsx` for products, blog posts, and recipes
- Shared layouts: `layout.tsx` at root level

## Key Invariants
- All images use Next.js Image component (no raw `<img>` tags)
- All interactive elements have keyboard accessibility
- All pages include proper SEO metadata via Next.js Metadata API
- No external API calls - all data from constants (until backend integration)
- Responsive at 375px, 768px, 1024px, 1440px breakpoints
- Cart state survives page navigation via Context + localStorage
