# Soul Good

Chef Kyla's premium wellness food brand website — Southern soul food meets functional healing nutrition.

> A [sakara.com](https://sakara.com) clone adapted with Soul Good branding, built as a frontend-only application with all data hardcoded and ready for backend integration.

## Quick Start

```bash
pnpm install
pnpm dev       # http://localhost:3000
pnpm build     # Production build
pnpm lint      # ESLint
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 — design tokens via `@theme` in `globals.css` |
| Carousels | Swiper.js 12 |
| Forms | React Hook Form + Zod v4 |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| Utilities | clsx + tailwind-merge |
| Runtime | React 19, Node.js 23+, pnpm |

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (fonts, providers, header/footer)
│   ├── globals.css             # Design system tokens (@theme)
│   ├── page.tsx                # Homepage
│   ├── about/                  # Chef Kyla's story & philosophy
│   ├── meal-plans/             # Plan comparison + detail pages
│   │   └── [slug]/             # Dynamic: /meal-plans/performance-fuel, /full-alignment
│   ├── menu/                   # Weekly rotating menu
│   ├── shop/                   # Product catalog (seasonings, juices, bundles, snacks)
│   │   └── [slug]/             # Product detail pages
│   ├── blog/                   # Blog listing
│   │   └── [slug]/             # Blog article detail
│   ├── recipes/                # Recipe listing
│   │   └── [slug]/             # Recipe detail
│   ├── cart/                   # Full cart page
│   ├── account/                # Login / register (UI only)
│   ├── catering/               # Catering inquiry form
│   ├── contact/                # Contact form
│   ├── experiences/            # Pop-up dinners & events
│   ├── testimonials/           # Customer reviews
│   ├── community/              # Community page
│   ├── cannabis-chef/          # Chef Kyla's cannabis chef background
│   ├── podcast/                # Podcast page
│   ├── faq/                    # FAQ accordion
│   ├── gift-card/              # Gift card purchase (UI only)
│   ├── privacy/                # Privacy policy
│   └── terms/                  # Terms of service
│
├── components/
│   ├── layout/                 # Header, Footer, MainNav, MobileMenu, CartSlideIn,
│   │                           #   SecondaryNav, AnnouncementBar, SearchOverlay
│   ├── ui/                     # Reusable primitives: Button, Card, Input, Modal,
│   │                           #   Accordion, Badge, Carousel, Rating, Tag
│   ├── sections/               # Homepage sections: Hero, Newsletter, ProductCarousel,
│   │                           #   PhilosophyPillars, Testimonials, PressLogos, etc.
│   ├── meal-plans/             # MealPlansContent, OrderConfigurator, PlanDetailContent,
│   │                           #   PlanComparisonCards, HowItWorks, DeliveryAreaInfo
│   ├── product/                # PDPContent, BuyingPanel, ImageGallery, RelatedProducts
│   ├── shop/                   # ShopContent, ProductCard, ShopFilters
│   ├── blog/                   # BlogContent, BlogArticleContent, RecipesContent,
│   │                           #   RecipeDetailContent
│   ├── account/                # AccountLoginContent (login + register tabs)
│   ├── cart/                   # CartContent
│   ├── contact/                # ContactContent
│   ├── catering/               # CateringContent
│   ├── cannabis-chef/          # CannabisChefContent
│   ├── community/              # CommunityContent
│   ├── experiences/            # ExperiencesContent
│   ├── gift-card/              # GiftCardContent
│   ├── legal/                  # LegalContent
│   ├── podcast/                # PodcastContent
│   ├── testimonials/           # TestimonialsContent
│   └── faq/                    # FaqContent
│
├── lib/
│   ├── constants.ts            # All hardcoded content (products, meal plans, blog posts, etc.)
│   ├── types.ts                # TypeScript interfaces for all data models
│   ├── cart-context.tsx        # Cart state (React Context + localStorage)
│   └── utils.ts                # Utility helpers (cn for className merging)
│
└── styles/                     # (reserved)
```

## Design System

Defined in `src/app/globals.css` via Tailwind v4 `@theme` tokens:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#C65D3E` (terracotta) | Buttons, links, accents |
| `--color-primary-dark` | `#A0522D` (burnt sienna) | Hover states |
| `--color-accent` | `#6B7F3E` (olive green) | Secondary accents, badges |
| `--color-cream` | `#FAFAF5` | Page backgrounds |
| `--color-cream-dark` | `#F5F0EB` | Section alternating backgrounds |
| `--font-heading` | Playfair Display | h1–h6 |
| `--font-body` | Lora | Body text |
| `--font-sans` | Inter | Labels, buttons, nav (uppercase tracking) |

**Key design rules:**
- **Zero border-radius** globally enforced (`* { border-radius: 0 !important }`)
- `.label-text` — uppercase, tracked Inter for UI elements
- `.section-padding` — responsive section spacing (5rem/4rem → 3rem/1.5rem)
- `.max-container` — 2000px max-width wrapper

## Data Architecture

All content lives in **`src/lib/constants.ts`** (~1,500 lines). Every page reads from this file.

**TypeScript interfaces** in `src/lib/types.ts`:

| Interface | Used For |
|-----------|----------|
| `Product` | Shop items (seasonings, juices, bundles, snacks) |
| `MealPlan` | Meal plan tiers with pricing, FAQs, reviews |
| `BlogPost` | Blog articles (recipes, wellness, heritage, nutrition) |
| `Recipe` | Standalone recipes with ingredients & instructions |
| `FAQ` | FAQ items by category |
| `Testimonial` | Customer reviews |
| `MenuItem` | Weekly rotating menu items |
| `Event` | Pop-up dinners & experiences |
| `CateringInquiry` | Catering form data shape |
| `CartItem` | Cart state items |
| `NavLink` | Navigation structure (supports nested children) |

**Cart state** is managed via React Context (`src/lib/cart-context.tsx`) with localStorage persistence.

## Backend Integration Guide

All `// TODO: Backend Integration` comments mark exact integration points. There are **22 markers** across the codebase. Here's what needs to happen:

### 1. Product & Content APIs
- **Shop** (`components/shop/ShopContent.tsx`) — Replace `PRODUCTS` import with API call; add server-side filtering/sorting
- **Product Detail** (`components/product/BuyingPanel.tsx`) — Wire "Add to Cart" to cart API
- **Blog** (`components/blog/BlogContent.tsx`) — Fetch posts from CMS with pagination
- **Blog Article** (`components/blog/BlogArticleContent.tsx`) — Replace with CMS-powered rich text
- **Recipes** (`components/blog/RecipesContent.tsx`, `RecipeDetailContent.tsx`) — Fetch from API
- **Weekly Menu** (`components/menu/WeeklyMenuContent.tsx`) — Dynamic menu with week navigation

### 2. E-commerce / Cart / Checkout
- **Cart Context** (`lib/cart-context.tsx`) — Swap localStorage cart for backend cart API
- **Cart Slide-in** (`components/layout/CartSlideIn.tsx`) — Wire "Checkout" button to checkout flow
- **Cart Page** (`components/cart/CartContent.tsx`) — Submit cart to checkout API
- **Meal Plan Orders** (`components/meal-plans/OrderConfigurator.tsx`) — Submit order config to API
- **Gift Cards** (`components/gift-card/GiftCardContent.tsx`) — Process purchase via payment API

### 3. Authentication
- **Login / Register** (`components/account/AccountLoginContent.tsx`) — Integrate NextAuth or similar; currently UI-only with console.log

### 4. Forms & Submissions
- **Newsletter** (`components/sections/Newsletter.tsx`, `components/layout/Footer.tsx`) — Submit to email service API
- **Contact Form** (`components/contact/ContactContent.tsx`) — Submit to API endpoint
- **Catering Inquiry** (`components/catering/CateringContent.tsx`) — Submit to API endpoint
- **Podcast Notification** (`components/podcast/PodcastContent.tsx`) — Submit email to notification API

### 5. Search
- **Search Overlay** (`components/layout/SearchOverlay.tsx`) — Currently UI-only; needs search API

### Quick pattern for replacing hardcoded data

```tsx
// Before (current)
import { PRODUCTS } from "@/lib/constants";

// After (with API)
async function getProducts() {
  const res = await fetch(`${process.env.API_URL}/products`);
  return res.json();
}

export default async function ShopPage() {
  const products = await getProducts();
  return <ShopContent products={products} />;
}
```

## Environment

- **No `.env` file needed** currently — no external services are connected
- When adding backend services, you'll need environment variables for API URLs, auth secrets, payment keys, etc.
- Node.js 23+ and pnpm required

## License

Private — All rights reserved.
