# User Testing

Testing surface, required testing skills/tools, resource cost classification per surface.

---

## Validation Surface

### Browser (Primary Surface)
- **Tool**: agent-browser
- **URL**: http://localhost:3000
- **Service**: Next.js dev server (port 3000)
- **Setup**: Run `pnpm dev` to start the dev server, wait for healthcheck

### Pages to Test
All pages are accessible via the Next.js App Router:
- `/` - Homepage
- `/meal-plans` - Meal plans comparison
- `/meal-plans/performance-fuel` - Plan detail
- `/meal-plans/full-alignment` - Plan detail
- `/meal-plans/order` - Order configurator
- `/menu` - Weekly menu
- `/about` - Chef Kyla's Story
- `/experiences` - Events & catering overview
- `/catering` - Catering inquiry form
- `/cannabis-chef` - Cannabis chef background
- `/community` - Community section
- `/shop` - Product listing
- `/shop/[slug]` - Product detail
- `/blog` - Blog listing
- `/blog/[slug]` - Blog article
- `/recipes` - Recipes
- `/faq` - FAQ
- `/contact` - Contact form
- `/account/login` - Login/Register
- `/cart` - Cart page
- `/gift-card` - Gift card
- `/privacy` - Privacy policy
- `/terms` - Terms & conditions
- `/podcast` - Podcast coming soon

## Flow Validator Guidance: agent-browser

### Isolation Rules
- All validators share the same Next.js dev server at http://localhost:3000
- The site is read-only (no database, no server-side mutations) — all data is hardcoded in constants
- Validators do NOT interfere with each other since there's no shared mutable state
- Each validator must use its own unique agent-browser session ID
- Cart state is client-side only (React Context) and isolated per browser session

### Testing Guidelines
- Navigate to http://localhost:3000 and test assertions via screenshots and DOM inspection
- agent-browser always opens at 1280x720 viewport — this is close enough to desktop (1440px) for visual validation
- For mobile-width testing (375px): use CSS class review (checking responsive classes like `lg:hidden`, `md:flex`) rather than actual viewport resizing
- Take screenshots as evidence for each assertion
- Check browser console for errors
- Save evidence screenshots to the designated evidence directory

### Known Limitations
- agent-browser viewport is fixed at 1280x720, cannot resize to exact 375px or 1440px
- Unsplash images may occasionally fail to load — this is not a test failure
- First page load may be slow due to Next.js compilation in dev mode

## Validation Concurrency

### agent-browser
- **Max concurrent validators**: 5
- **Rationale**: Machine has 48GB RAM and 16 CPU cores. Next.js dev server uses ~200MB. Each agent-browser instance uses ~300MB. 5 instances = 1.5GB + 200MB dev server = 1.7GB total, well within the ~30GB available headroom (70% of ~42GB free). CPU load is minimal for static page rendering.
