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

## Validation Concurrency

### agent-browser
- **Max concurrent validators**: 5
- **Rationale**: Machine has 48GB RAM and 16 CPU cores. Next.js dev server uses ~200MB. Each agent-browser instance uses ~300MB. 5 instances = 1.5GB + 200MB dev server = 1.7GB total, well within the ~30GB available headroom (70% of ~42GB free). CPU load is minimal for static page rendering.
