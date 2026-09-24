# Food for the Soul

Public route: `/food-for-the-soul`. Linked from the home-page announcement, community section, and shared footer. This is a community-partnership funnel, not a store, fundraiser, paid booking, or meal reservation.

## Campaign facts

- Soul Good provides the meals.
- 100+ meals delivered is the supplied impact-to-date figure, not an October goal or a live counter.
- Next drive: October 15, 2026.
- Time, location, capacity, and volunteer placements are not yet confirmed on the page.
- Existing Soul Good product photography is illustrative; the drive menu may vary.
- No nonprofit identity, tax-deductibility, sponsorship pricing, or donation claims are made.

Update `src/lib/community-drive.ts` and the page copy together when a new date or verified impact figure is available. Confirm event logistics before publishing them. Review the date-specific homepage invitation after the drive.

## Inquiries and team follow-up

`POST /api/community-interest` validates the selected interest, contact fields, and explicit campaign-contact consent. It applies an 8 KB body limit, same-origin browser checks, a honeypot, and a Mongo-backed request limit. Host inquiries require a community/city; addresses and payment details are not collected.

Validated inquiries are stored in MongoDB's `community_interests` collection, separately from customers, orders, and meal-plan leads. Identical retries reuse one record and one email job. The API acknowledges only after both the inquiry and its team-notification job are persisted. There is no public inquiry-list endpoint.

Notifications use the existing branded email layout and durable `email_outbox`. Delivery runs after the response and is retried by the existing reconciliation job. Emails go to `COMMUNITY_EMAIL_TO` if configured, otherwise `contact@soulgood.com`. Reply-to is the inquirer's email. No extra environment variable is required when the default recipient is correct. Existing `MONGODB_URI`, `RESEND_API_KEY`, sender, and reconciliation configuration are reused.

The team should monitor the recipient inbox, follow up on inquiries, and review `needs-review` email jobs through the existing operational process. A successful form submission is not a confirmed drive or volunteer assignment. No automated confirmation email or marketing subscription is promised or created.

Honor contact-data correction/removal requests in both `community_interests` and associated `email_outbox` records. Messages ask visitors not to include private information about meal recipients.

## Verification

- Unit tests use mocked MongoDB, outbox, request limiter, and email transport.
- `e2e/community-drive.spec.ts` tests desktop/mobile forms, validation, retry behavior, sharing fallback, discoverability, and responsive layouts with mocked submissions.
- Never send test inquiries into production or create payment objects to test this page.
