# Soul Good Website - Sakara.com Clone Analysis and Build Plan

## 1. Sakara.com Site Overview

Sakara is a premium wellness food brand built on Astro with Shopify e-commerce. The site has a clean, minimal, luxury aesthetic with sharp rectangular design (zero border-radius), elegant serif typography, and generous whitespace.

### Complete Sitemap

#### Core Pages
- **Homepage** (`/`) - Hero section, category navigation, product carousels, brand philosophy, editorial content, press logos, testimonials, newsletter signup
- **About** (`/pages/about`) - Brand story, founders, mission, philosophy
- **FAQ** (`/frequently-asked-questions`) - Accordion-style Q&A organized by category
- **Contact** (`/pages/contact`) - Contact form and information
- **Weekly Menu** (`/next-week-menu`) - Preview of upcoming meal menus

#### Nutrition Programs
- **Compare Programs** (`/pages/nutrition-program-compare`) - Side-by-side comparison of meal programs with left sidebar navigation
- **Signature Nutrition Program** (`/nutrition/signature-nutrition-program`) - Main meal delivery product page with pricing (3-day: from $152 subscription / $179 one-time, 5-day plans available)
- **Level II: Detox** (`/nutrition/detox`) - Specialized detox program
- **Sign-up Flows** (`/nutrition/signature-sign-up`, `/nutrition/detox-sign-up`) - Multi-step ordering flow with subscription vs one-time options

#### Shop / Products
- **Shop All** (`/collections/shop-by-collection`) - 3-column product grid with filter/sort
- **Collection pages**: Supplements, Snacks, Best Sellers, Bundles, Gummies, Powders, etc.
- **Product Detail Pages** - Image gallery, buying panel, accordion details, trust badges, related products
- **Gift Card** (`/products/sakara-life-gift-card-email`)

#### Content / Editorial
- **S-Life Mag** (`/mag`) - Blog with categories (Featured, Sakara 101, Recipes, Well-Being, Inspirations)
- **Blog Articles** - Rich text with images, category labels, author info
- **Podcast** (`/pages/sakara-podcast`) - 151+ episodes with player
- **Our Standards** (`/pages/the-sakara-promise`) - Quality commitments

#### Community & Account
- **Community & Events** (`/pages/community`) - Community page
- **Ambassadors** (`/pages/ambassadors`) - Ambassador program
- **Account Login** (`/account/login`) - Login/Register with tabs
- **Find Us In Store** (`/pages/find-us-in-store`) - Retail locations

#### Legal / Utility
- Terms & Conditions, Privacy Policy, Return Policy, Accessibility, Careers

---

## 2. Design System (Adapted for Soul Good)

### Typography System

**Sakara uses:**
- Gestura Headline (serif) - headings, display text (weights: 200, 300, 400, 600)
- Gestura Text (serif) - body copy (weights: 200, 300, 400, 600, 700)
- Rework Text (sans-serif) - labels, buttons, nav (weights: 300, 400, 600)

**Soul Good equivalent (free/open-source alternatives):**
- Headlines: Playfair Display or Cormorant Garamond (elegant serif)
- Body: Lora or Source Serif Pro
- Labels/UI: Inter or Work Sans (clean sans-serif)

### Color Palette

**Sakara palette:**
- Black `#000000` (primary text, CTA buttons)
- White `#FFFFFF` (backgrounds)
- Sakara Green `#00873B` (accent, badges, announcement bar)
- Off-white/Cream `#FAFAF8`, `#F5F5F1`, `#EBEBE4` (warm backgrounds)
- Gray `#D9D9D9` (borders)

**Soul Good brand colors (from questionnaire):**
- Deep Terracotta (primary accent - replaces Sakara Green)
- Burnt Sienna (secondary accent)
- Olive/Moss Greens (supporting colors)
- Warm neutrals (cream, off-white backgrounds)
- Black (text, buttons - keep same)

### Spacing Scale
- 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 80px
- Section padding: 80px vertical, 64px horizontal (desktop)
- Button padding: 16px 32px
- Max container width: 2000px

### Component Design Patterns
- **Zero border-radius** - Everything is sharp/rectangular
- **No box-shadows** - Flat design, color contrast only
- **Button transitions**: `0.7s cubic-bezier(0.165, 0.84, 0.44, 1)` (easeOutQuart)
- **Product images**: 3:4 aspect ratio on `#F7F7F7` background
- **Cards**: No borders, no shadows, just spacing and typography hierarchy

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: 1025px+
- Large: 1440px
- Max container: 2000px

---

## 3. Page-by-Page Section Breakdown

### Homepage Sections (top to bottom)
1. **Announcement Bar** - Scrolling marquee with promotional messages (Soul Good accent color bg, white text)
2. **Secondary Nav Bar** - Black bar with promo text left, utility links right (Weekly Menu, Learn dropdown, Sign In)
3. **Main Header** - White, logo left, nav center, search + cart icons right
4. **Hero** - 50/50 split: text left (eyebrow, headline, body, CTA button), lifestyle image right
5. **Category Navigation** - Horizontal scrollable cards (Meal Plans, Products, etc.)
6. **Product Carousel** - "Your Everyday Essentials" - scrollable product cards with Swiper.js
7. **Brand Feature** - Split section: lifestyle image left, brand copy + CTA right
8. **Editorial/Blog** - 4-up article cards with category label, title, excerpt, "Read More"
9. **Press Logos** - Horizontal row of press logos with quotes
10. **Nutrition Philosophy** - "Our Pillars" carousel with image cards
11. **Testimonials** - Scrollable customer review cards
12. **Newsletter Signup** - Email input + "Sign Up" button
13. **Footer** - App badges, social icons, 4-column link grid, legal bar

### Nutrition Program Page
1. Breadcrumb navigation
2. Image gallery (left) + Buying panel (right)
3. Plan type selector (Subscription vs One-Time)
4. Day count selector (3-day, 5-day)
5. Meal selection (Breakfast + Lunch, Lunch + Dinner, etc.)
6. Add-ons section
7. Price display + CTA
8. Content sections below (How It Works, What's Included, FAQ)
9. Reviews section (star ratings, written reviews)

### Product Detail Page (PDP)
1. Breadcrumb
2. Image gallery with thumbnails (left) + Product info panel (right)
3. Product name, subtitle, rating stars
4. Price (subscription vs one-time)
5. Purchase options (subscription toggle, quantity)
6. "Add to Cart" button (black, full-width)
7. Accordion sections (Benefits, How to Use, Ingredients, etc.)
8. Trust badges row
9. Related products carousel

### Collection/Shop Page
1. Category header with title
2. Filter/sort bar
3. 3-column product grid
4. Product cards: image (3:4), name, subtitle, rating, price, badges

### Blog/Magazine Page
1. Category tabs/filter
2. Featured article hero
3. Article grid (image, category, title, excerpt)

### About Page
1. Large headline on cream background
2. Full-width lifestyle photography
3. Rich text story sections
4. Team/founders section

### FAQ Page
1. Category navigation (left sidebar)
2. Accordion Q&A sections (right)

---

## 4. Soul Good Content Mapping

### Brand Information (from discovery docs)
- **Brand name**: Soul Good
- **Tagline**: "Made with intention. Seasoned with love."
- **Chef**: Chef Kyla - classically trained, nutrition certified, based in Los Angeles
- **Personality**: Elevated, Conscious, Uplifting, Nourishing, Intentional, Fun
- **Positioning**: Premium luxury wellness food brand
- **Heritage**: Southern soul food meets functional healing nutrition
- **Transformation story**: Personal healing journey - reversed hypertension, high cholesterol, elevated cortisol through intentional cooking

### Revenue Pillars (mapped to site sections)

1. **Meal Prep** (PRIMARY) - Maps to Nutrition Programs
   - Tier 1: Performance Fuel (2 meals + juice)
   - Tier 2: Full Alignment Fuel (2 meals + juice + snack)
   - Plans: 5-day (flagship), 3-day (intro)
   - Both subscription and one-time orders
   - Delivery: Greater LA area (Long Beach to Malibu, Valley, DTLA, etc.)
   - Schedule: Sunday eve/Monday AM, or twice weekly

2. **Experiences & Events** - Maps to Community/Events page
   - Pop-up dinners ("Tastemakers")
   - Catering services (inquiry-based pricing)
   - Calendly integration for 15-min consultations

3. **Education & Speaking** (Future) - Coming soon section

4. **Products** (Future) - Shop page (sauces, seasonings, juices)

### Pages to Build (Soul Good equivalent of Sakara pages)

| Sakara Page | Soul Good Equivalent | Priority |
|---|---|---|
| Homepage | Homepage (fully customized content) | P0 |
| Nutrition Programs Compare | Meal Plans page | P0 |
| Signature Nutrition Program | Performance Fuel / Full Alignment plans | P0 |
| Sign-up Flow | Order flow (subscription + one-time) | P0 |
| Weekly Menu | This Week's Menu | P0 |
| About | Chef Kyla's Story | P0 |
| Shop All / Collections | Shop (future products) | P1 |
| Product Detail | Product pages | P1 |
| S-Life Mag / Blog | Recipes & Blog | P1 |
| FAQ | FAQ | P1 |
| Community & Events | Experiences & Events | P0 |
| Catering inquiry | Private Chef / Catering | P0 |
| Contact | Contact | P1 |
| Account Login/Register | Account | P1 |
| Cart | Cart | P1 |
| Podcast | Podcast (coming soon) | P2 |
| Gift Card | Gift Card | P2 |
| Cannabis Chef page | Separate page for cannabis chef background | P1 |
| Testimonials | Testimonials / Reviews | P1 |
| Legal pages | Terms, Privacy, etc. | P2 |

---

## 5. Technical Architecture

### Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS (matches the utility-first, clean aesthetic)
- **Animations**: Framer Motion (for carousels, transitions)
- **Carousel**: Swiper.js (same as Sakara)
- **Forms**: React Hook Form
- **Icons**: Lucide React or custom SVGs
- **Images**: Next.js Image component with placeholder blur
- **Fonts**: Google Fonts or local font files

### Project Structure

```
soulgood/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with header/footer
│   │   ├── page.tsx                # Homepage
│   │   ├── about/page.tsx          # Chef Kyla's Story
│   │   ├── meal-plans/
│   │   │   ├── page.tsx            # Compare plans
│   │   │   ├── [slug]/page.tsx     # Individual plan detail
│   │   │   └── order/page.tsx      # Order flow
│   │   ├── menu/page.tsx           # Weekly menu
│   │   ├── shop/
│   │   │   ├── page.tsx            # Shop all products
│   │   │   └── [slug]/page.tsx     # Product detail
│   │   ├── experiences/page.tsx    # Events & catering
│   │   ├── catering/page.tsx       # Catering inquiry form
│   │   ├── blog/
│   │   │   ├── page.tsx            # Blog listing
│   │   │   └── [slug]/page.tsx     # Blog article
│   │   ├── recipes/page.tsx        # Recipes section
│   │   ├── faq/page.tsx            # FAQ
│   │   ├── contact/page.tsx        # Contact
│   │   ├── cannabis-chef/page.tsx  # Cannabis chef background
│   │   ├── community/page.tsx      # Community section
│   │   ├── account/
│   │   │   ├── login/page.tsx      # Login/Register
│   │   │   └── page.tsx            # Account dashboard
│   │   ├── cart/page.tsx           # Cart
│   │   ├── privacy/page.tsx        # Privacy policy
│   │   └── terms/page.tsx          # Terms & conditions
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Announcement bar + nav
│   │   │   ├── Footer.tsx
│   │   │   ├── AnnouncementBar.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Accordion.tsx
│   │   │   ├── Carousel.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Rating.tsx
│   │   │   └── Tag.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── CategoryNav.tsx
│   │   │   ├── ProductCarousel.tsx
│   │   │   ├── BrandFeature.tsx
│   │   │   ├── EditorialCards.tsx
│   │   │   ├── PressLogos.tsx
│   │   │   ├── PhilosophyPillars.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── Newsletter.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   └── BuyingPanel.tsx
│   │   ├── meal-plan/
│   │   │   ├── PlanCard.tsx
│   │   │   ├── PlanCompare.tsx
│   │   │   ├── OrderFlow.tsx
│   │   │   └── MenuPreview.tsx
│   │   └── forms/
│   │       ├── CateringInquiry.tsx
│   │       ├── ContactForm.tsx
│   │       └── NewsletterForm.tsx
│   ├── lib/
│   │   ├── constants.ts            # Brand content, pricing, etc.
│   │   ├── types.ts                # TypeScript interfaces
│   │   └── utils.ts                # Helper functions
│   └── styles/
│       └── globals.css             # Tailwind + custom styles
├── public/
│   ├── images/                     # Placeholder images
│   ├── fonts/                      # Local font files
│   └── icons/                      # SVG icons
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

### Backend Handoff Readiness

The frontend will be built with clean separation for backend integration:
- All data currently hardcoded in `lib/constants.ts` - easy to swap for API calls
- Form submissions use React Hook Form with clear interfaces - ready for API endpoints
- Cart state management via React Context - ready for backend cart API
- Auth pages built with forms ready for NextAuth or similar
- TypeScript interfaces defined for all data models (meals, products, orders, etc.)
- API route stubs in comments for backend developer

---

## 6. Build Milestones

### Milestone 1: Foundation & Global Layout
- Next.js project setup with Tailwind CSS
- Design tokens (colors, typography, spacing) in Tailwind config
- Global layout (Header with announcement bar, navigation, footer)
- Responsive mobile menu
- Shared UI components (Button, Card, Badge, Accordion, Modal, Input)

### Milestone 2: Homepage
- Hero section (50/50 split with Soul Good content)
- Category navigation cards
- Product/plan carousel
- Brand feature section
- Editorial/blog preview cards
- Press/testimonials section
- Newsletter signup
- Full responsive behavior

### Milestone 3: Meal Plans & Ordering
- Meal plans comparison page
- Individual plan detail pages (Performance Fuel, Full Alignment)
- Plan ordering flow (subscription vs one-time, day selection)
- Weekly menu page
- Delivery area information

### Milestone 4: About, Experiences & Community
- Chef Kyla's Story (About) page
- Experiences & Events page
- Catering inquiry form with all fields
- Cannabis Chef separate page
- Community section
- Testimonials page

### Milestone 5: Shop, Blog & Supporting Pages
- Shop/product listing page with grid
- Product detail page template
- Blog listing page
- Blog article page template
- Recipes section
- FAQ page with accordion
- Contact page with form

### Milestone 6: Account, Cart & Legal
- Account login/register pages
- Account dashboard (placeholder)
- Cart page
- Gift card page
- Privacy policy, Terms, Accessibility pages
- Podcast coming soon page

### Milestone 7: Polish & Responsive QA
- Full responsive testing across all pages
- Animation and transition polish
- Image optimization and placeholders
- SEO metadata on all pages
- Performance optimization
- Final cross-browser testing

---

## 7. Key Interactions to Replicate

1. **Announcement bar marquee** - Continuous horizontal scroll with promotional messages
2. **Header scroll behavior** - Sticky header with background on scroll
3. **Mobile hamburger menu** - Full-screen slide-in from left
4. **Product card hover** - Image swap between two images
5. **Carousel navigation** - Swiper.js with prev/next arrows and touch swipe
6. **Accordion expand/collapse** - Smooth height animation
7. **Cart slide-in panel** - Right-side panel with blur backdrop
8. **Modal dialogs** - Centered with backdrop blur, translateY animation
9. **Search overlay** - Full-width panel sliding down from header
10. **Newsletter form** - Input validation with error/success states
11. **Plan configurator** - Interactive radio buttons for subscription type and meal selection
12. **Responsive grid breakpoints** - Smooth transitions between column counts

---

## 8. Placeholder Content Strategy

Since Chef Kyla's photography and branding assets are not yet available:
- Use high-quality stock food photography from Unsplash/Pexels (soul food, healthy meals)
- Create placeholder AI-generated food imagery descriptions
- Use Lorem ipsum sparingly - prefer realistic Soul Good brand copy based on questionnaire answers
- All placeholder images clearly marked with data attributes for easy replacement
- Logo as text wordmark "SOUL GOOD" until custom logo is created
