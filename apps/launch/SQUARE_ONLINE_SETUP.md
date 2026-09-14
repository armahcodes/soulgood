# Eat Now: Square Online and Soul Good

## Two separate ordering paths

- **Eat Now / single orders:** `https://checkout.soulgood.kitchen/s/order`.
  Square Online owns the live menu, cart, customer details, payment and receipt.
  Delivery may use available courier partners such as DoorDash, Uber Eats, or
  Postmates, or a Soul Good courier. This app disclosure does not configure or
  enable native courier dispatch. Customers should choose **One time** if a
  purchase selector appears.
- **Weekly nourishment · Once or weekly:** `https://www.soulgood.kitchen/checkout`.
  The existing $88 one-time and weekly plan checkout remains unchanged. Weekly
  meal-prep delivery is exclusively handled by the Soul Good team, not partners.
- **Eat Now information and return destination:**
  `https://www.soulgood.kitchen/eat-now#order-help`.
  This is navigation/help, not evidence of a successful payment.

Homepage, mobile navigation, footer and plan-checkout links open the menu in the
same tab. No customer details, account cookies, checkout IDs, payment tokens or
cart contents are transferred. Browser Back returns to the previous main-site
page. No new dependencies, DNS changes, courier integrations or payment APIs are
needed for these links.

## Required Square editor changes before promotion

The repository cannot modify the separately hosted Square Online site. In the
Square Online editor for **checkout.soulgood.kitchen**, make these changes and
publish only after reviewing them:

1. Replace the current **By: Chef Kyla** storefront identity with **Soul Good** /
   **Soul Bowls™**, retaining Chef Kyla as the founder attribution. Use the existing
   Soul Good brand assets in `public/brand/`, not a new logo.
2. Use the Order Online menu as the landing page so customers do not have to pass
   through the old catering homepage. All app order links already go to `/s/order`.
3. Add ordinary external navigation links:
   - **Soul Good home** → `https://www.soulgood.kitchen/`
   - **Weekly nourishment** → `https://www.soulgood.kitchen/checkout`
   - **Culinary bookings** → `https://www.soulgood.kitchen/quote`
   - **Order help** → `https://www.soulgood.kitchen/eat-now#order-help`
   Use a native return/continue-shopping link if that setting is available. Do not
   inject an automatic redirect that hides Square's receipt or payment status.
4. Match the brand palette: Forest `#2C3A34`, Oat `#F8F3EC`, Sage `#77916F`,
   Clay `#C17A5E`, Gold `#C9A161`, Sand `#ECD6BC`. Use EB Garamond for headings
   where available and Arial for body text. Follow `BRAND_VOICE.md` for the
   nourishment-led language, keeping single-order and subscription choices clear.
5. Review the fulfillment location: **courier partners or Soul Good courier**, actual delivery area,
   pickup availability, preparation times, opening hours and scheduling rules.
   Do not copy Sunday meal-plan timing into Eat Now unless that is the actual
   service schedule. “Eat Now” does not promise immediate or same-day delivery.
   Confirm which providers are enabled and available for each order in the
   operating system. Do not assume every named partner has a direct Square
   integration or that updating app copy enables dispatch.
6. Verify individual items, inventory, one-time purchase settings, minimums, tax
   treatment, and the intended $8.88 delivery fee in Square Online. Website
   constants do not configure Square Online fees or tax. Verify applicable rules
   before collecting payment. Do not promise $8.88 on the new menu entry page until
   the native checkout configuration is confirmed.

## Orders and account history

Square Online owns confirmations for Eat Now. The app's account history and
branded payment-email workflow currently cover app-created scheduled orders, not
arbitrary Square Online orders. The account page and Eat Now help page disclose
this distinction and direct customers to their Square confirmation and Soul Good
support. Do not attach unrelated orders to accounts or send duplicate receipts.
Unified order history requires a separate, verified external-order import with
customer-ownership checks; a return URL or shared subdomain is not that integration.

## Validation and rollback

- Local unit/browser tests verify both paths, same-tab navigation, no data in the
  outgoing URL, a safe return/help page, and responsive layout at 320–1440 px.
  The external menu is mocked in browser tests; these do not prove live checkout.
- Verify native pickup and delivery eligibility and times, individual quantities,
  payment, receipt, Soul Good preparation, available courier workflow, and return links.
  A paid smoke order needs explicit authorization; do not charge a real customer
  or dispatch a courier for testing.
- If native checkout is unavailable, remove/prominently pause the Eat Now entry
  links. Do not silently route a single-bowl customer into a five-bowl purchase.
  Keep the existing meal-plan checkout and all financial records intact.

Reference: [Square's supported ordering-page connection](https://squareup.com/help/us/en/article/6861-create-an-order-online-page-with-square-online-store).
