# Storefront operations and rollout

## Scope and current verification

This release adds durable checkout recovery, signed Square event reconciliation,
an email outbox, cancellation recovery, billing fixes, and checkout regression tests.
Local/mocked tests are not proof of live payments, live email delivery, Apple Pay
eligibility, Google Pay eligibility, or production database connectivity.

No production webhook, scheduler, secret, account data, or payment is changed by
editing this repository. Complete the setup and live smoke checks before launch.

## Required configuration

Use the active Vercel project rooted at `apps/launch`. Configure the names in
`.env.example` separately for each environment. Do not give preview deployments
production Square or MongoDB credentials.

1. Configure MongoDB with TLS, database-scoped credentials, backups, and network
   access restricted to the deployment where practical. Both native MongoDB jobs
   and Mongoose records must use the same `MONGODB_DB`.
2. Generate independent high-entropy values of at least 32 characters for
   `BETTER_AUTH_SECRET`, `CHECKOUT_QUOTE_SECRET`, `CHECKOUT_ENCRYPTION_SECRET`,
   and `CRON_SECRET`. Never reuse the sample/test values.
3. Configure the matching Square application, location, access token, six bowl
   variation IDs, delivery variation ID, and itemized weekly plan variation ID.
   Validate those objects in Square; retired pickup/delivery fixed-plan variables
   are no longer used. Catalog sync is a write operation, not a deployment check.
4. Configure Resend and a verified sender domain. Test sign-in codes and emails to
   an internal recipient before opening checkout. Review SPF, DKIM, and DMARC.
5. Register the Square webhook below and start the scheduler. New production
   checkouts are refused if required secrets/configuration are missing. Existing
   saved attempts remain recoverable, including during a configuration incident.
6. Configure an independent `OPERATIONS_SECRET` only if staff need exchange-update
   emails through the protected endpoint.

Credentials previously shared in messages should be rotated in their vendor
dashboards and securely replaced. Do not print credentials, customer details,
payment tokens, or sign-in codes in logs.

### Square webhook

Register `https://www.soulgood.kitchen/api/webhooks/square` in the **matching
Square environment**. Set `SQUARE_WEBHOOK_NOTIFICATION_URL` to the exact registered
URL and `SQUARE_WEBHOOK_SIGNATURE_KEY` to that subscription’s signing key. HTTPS,
hostname, path, trailing slash, and query must match; do not route through a redirect.

Subscribe to these supported events as available for the configured API version:

- `payment.created`, `payment.updated`
- `invoice.created`, `invoice.published`, `invoice.updated`,
  `invoice.payment_made`, `invoice.refunded`,
  `invoice.scheduled_charge_failed`, `invoice.canceled`
- `subscription.created`, `subscription.updated`
- `refund.created`, `refund.updated`
- `order.created`, `order.updated`, `order.fulfillment.updated`

The handler validates the signature over the unmodified body and exact notification
URL. It acknowledges only after MongoDB saves the event. Database failures return
503 so Square can retry. Replayed event IDs are deduplicated. Workers retrieve
current Square objects instead of trusting webhook status or customer fields.

References: [Square webhook validation](https://developer.squareup.com/docs/webhooks/step3validate)
and [Square subscription limitations](https://developer.squareup.com/docs/subscriptions-api/overview).

### Recovery scheduler

`vercel.json` requests `GET /api/internal/reconcile` every five minutes.
Confirm the current Vercel plan permits this frequency and the 300-second function
budget **before deploying**. Do not purchase or upgrade a plan implicitly.

If the plan cannot run it, use an authorized external scheduler every five minutes
with `Authorization: Bearer <CRON_SECRET>` and remove the Vercel cron entry for that
deployment. Do not disable recovery or reduce it to a daily job without redesigning
the recovery limits. Keep credentials in the scheduler’s secret store.

The endpoint creates operational indexes, resumes expired checkout/cancellation
leases, sweeps saved Square records, processes durable events, and drains email.
Each run is bounded; monitor backlog and increase capacity when volume requires it.
A five-minute schedule is not a guarantee that every record is updated in five
minutes: the sweep processes five records per invocation.

Configure alerts for scheduler failures, webhook delivery failures, and old pending
jobs. A 503 response can also report `checkoutAttention`, `emailAttention`, or
`staleEvents`; inspect them rather than retrying blindly. Monitor oldest pending
checkout, cancellation, event, and mail timestamps even when the endpoint returns 200. Verify that the scheduler actually ran after deployment, not only that an
environment variable exists.

### Staff customer updates

`POST /api/internal/customer-updates` requires
`Authorization: Bearer <OPERATIONS_SECRET>` and a JSON body:

```json
{
  "orderId": "existing-square-object-id",
  "caseId": "support-case-reference",
  "updateId": "a-new-uuid-for-this-message",
  "update": "Your approved exchange update."
}
```

The recipient is resolved from the existing order, never supplied in the request.
Keep `updateId` stable when retrying the same message; use a new ID for a distinct
update. This endpoint sends status communication; it does not issue refunds,
change inventory, or approve an exchange automatically.

## Rollout checks

- Run unit tests, lint, production build, and browser regressions.
- Verify the sandbox matrix: one-time pickup and delivery; weekly delivery;
  separate billing name/state/ZIP+4; one to six people and one to three meals/day;
  current bowl mix; terms/quote expiry; a declined card; repeat ordering.
- Test approved payment with a dropped HTTP response, refresh, and status recovery.
  Confirm one Square payment and one app record. A second submission must not create
  a second charge for the same attempt.
- Test weekly invoice paid, failed, refunded, and renewal events against Square
  sandbox. Enrollment alone must remain “payment pending.”
- Test cancellation when the Square response is lost and when MongoDB is unavailable
  after Square accepts it. The saved cancellation must recover without a false claim.
- Deliver an event twice, tamper with its signature, and temporarily interrupt the
  database. Verify deduplication, rejection, and Square retry behavior.
- Confirm branded enrollment, paid-order, cancellation, fulfillment, payment-update,
  and exchange emails reach an internal mailbox. Authentication codes are sent
  directly because they expire; transactional order emails use the outbox.
- Confirm account ownership with two different verified emails. Guest checkout must
  not mutate an existing Square profile found by email.
- Verify Google Pay on an eligible browser and Apple Pay on a real supported Apple
  device with an eligible wallet. Check HTTPS, Square domain registration, CSP, and
  browser console. Chromium mobile emulation does not validate Apple Pay.
- With authorization, perform a controlled production smoke purchase and verify
  Square, MongoDB, account history, email, webhook, and scheduler end to end.
  Do not use real customer cards for testing without permission.

Weekly pickup is intentionally unavailable because Square itemized subscriptions
require shipped items. One-time pickup remains supported. Do not re-enable weekly
pickup solely by removing the UI restriction.

## Recovery and incident handling

Collections include `checkout_attempts`, `checkout_records`, `square_events`,
`subscription_cancellations`, `email_outbox`, and `request_limits`.
Verify actual collection names in the code before operating on them.

A checkout UUID is a bearer recovery capability. Do not publish it in URLs or logs
available to customers. Browser storage retains only the reference, never raw card
details or Square payment nonces. The server temporarily encrypts nonces with
AES-256-GCM and removes them after durable payment/card identification or escalation.

When an outcome is unknown:

1. Keep the same checkout reference and immutable request.
2. Check the attempt’s saved Square customer/order/payment/subscription IDs and the
   matching Square dashboard/API records.
3. Resume the existing job only when its environment and encryption keys match.
4. Never tell the customer to pay again until the previous outcome is verified.
5. Never delete the ledger or reset an idempotency key to “fix” a timeout.

Unresolved financial writes older than 23 hours enter `needs-review` instead of
being replayed indefinitely. Email sends whose first attempt is older than 23 hours
also require review because [Resend deduplicates for 24 hours](https://resend.com/docs/dashboard/emails/idempotency-keys).
Inspect the vendor record before retrying outside that window. Failed email delivery
must not cause another payment.

Historical orders that already lack app records from before this release are not
automatically restored without an identifiable saved attempt or verified parent
subscription. Backfill them through a reviewed migration matching Square object IDs
and verified customer ownership; do not attach orders by an unverified request email.

Retain financial/idempotency ledgers and event deduplication records according to the
business’s approved retention policy. TTL applies to request-limit buckets, not
financial records. Restrict database access and secure backups.

## Eat Now single orders

For the separate **Eat Now** single-order menu on `checkout.soulgood.kitchen`,
see [Square Online setup](./SQUARE_ONLINE_SETUP.md). Eat Now delivery may use
available courier partners (DoorDash, Uber Eats, or Postmates) or a Soul Good
courier. Weekly meal-prep delivery remains exclusive to the Soul Good team.
The app's delivery disclosures do not configure courier dispatch or guarantee
provider availability. Operational courier assignment is separate from this app.
The menu has its own cart and confirmations; the five-bowl checkout, account
history and payment recovery protocol are not an automatic Square Online
order import.

## Culinary booking quotes

`/quote` is a separate, one-time event estimate and request flow, not
Square checkout. It does not take payment or reserve dates. Submitted requests create
a draft Square invoice and its supporting customer/order for staff review.
The customer interface is a five-step wizard: Experience, Menu, Event, Review,
Contact. Only the active step is visible. Back/Next preserves in-memory entries;
changing priced details invalidates the quote and acknowledgement. Review includes
all fees, verified address tax, deposit, and balance before the separate contact step.
Expired estimates link back to event details for a refresh without clearing the form.
Staff must confirm availability, timing, staffing, allergies, final tax, and payment
arrangements before confirming a booking. The previous `/culinary-bookings` URL
permanently redirects to `/quote`, preserving query parameters.

- Delivery only: 10-bowl minimum, $17.60 per bowl, plus $8.88 LA County delivery and tax.
- Plated: $55 per guest, with a $555 food minimum, plus a mandatory $500 culinary-support fee, plus
  $8.88 delivery and tax. Support includes plating, service, and ingredient education.
  Food below $555 produces an explicitly labeled minimum adjustment; the adjustment
  does not silently add servings. Food above $555 remains charged per guest. Support
  is never included in or credited against the food minimum.
- New plated requests choose one food style for the entire group: chef’s selection,
  plant-forward, or chicken. Headcount sets servings and pricing; customers do not
  allocate individual bowls. The saved quote, emails, and Square draft preserve the
  style. Confirm final dishes and dietary needs before booking. Legacy saved quotes
  retain their original recipe allocations. Bowl delivery still allows individual
  quantities and balanced presets, excludes sold-out recipes, and supports undo.
- 50% of the tax-inclusive total is due as a deposit after approval and signature.
  The remaining balance is due on the event date, before team arrival. Odd cents
  round up into the deposit; the balance is the exact remainder. There is no autopay.
- Only available recipes can be selected. All prices, minimums, and fees are
  recalculated server-side. Quantities are whole bowls, not retail five-bowl sets.
- The address is checked against CDTFA's current rate lookup and must be in LA
  County. The estimate uses the site's prepared-meal tax treatment, including
  mandatory meal service and delivery. Confirm the actual food/service classification
  and applicable rate before collecting payment; cold-food exemptions and delivery
  rules can depend on how the order is supplied. See [CDTFA catering guidance](https://www.cdtfa.ca.gov/industry/caterers/industry-topics.htm).

`POST /api/culinary-quotes` saves a server-priced estimate in `culinary_quotes` and
returns a random reference valid for 30 minutes. Unrequested estimates are eligible
for deletion after 24 hours. `POST /api/culinary-quotes/request` requires the quote
UUID, contact details, and an explicit estimate acknowledgement. No public endpoint
reads saved customer requests. Keep UUIDs out of logs; the short SG reference is for
staff communication, not authorization.

A request is saved atomically before the API acknowledges it. Identical retries
return the saved outcome; changing an already requested quote's contact details is
rejected. Requested records have no automatic deletion: apply the business's approved
retention policy to them and their email jobs. The existing reconciliation scheduler
creates the TTL/indexes and recovers pending customer and team notification jobs.
Resend sends two branded, itemized emails through the durable outbox. Staff emails
go to `CULINARY_BOOKING_EMAIL_TO`, falling back to `contact@soulgood.com`.

Before launch, verify MongoDB access, the scheduler, a verified Resend sender, and
the receiving staff inbox. Send an authorized test request and confirm both emails
arrive. Local tests mock persistence, tax lookup, and mail; they do not establish live
delivery. Monitor requested quotes with `notificationsQueued: false` and stalled
email jobs so no request is left without staff follow-up.

### Square draft invoice and contract review

Current pricing-version requests atomically queue `invoiceJob` on the saved quote.
The request's post-response task and protected reconciliation scheduler process it
using a Mongo lease, persisted progress, and stable Square idempotency keys. Existing
requested quotes are not backfilled; older unsubmitted estimates must be refreshed.
`SQUARE_ACCESS_TOKEN` and `SQUARE_LOCATION_ID` must authorize customer, order, and
invoice creation in the same Square account/environment. No invoice is published,
sent, charged, or dispatched by this integration. Event line items are ad-hoc and
do not change retail catalog prices or decrement retail jar stock.

Square does not expose a public native Contracts API. Staff must open the draft in
Square, attach the correct native contract, enable signature-before-payment where
supported by the account plan, review the details, then send the invoice. Review the
venue, allergies, staffing, tax treatment, exact arrival time, and deposit due date
before publishing. Square's payment due date is date-only: the before-arrival deadline
must also appear in the contract and be operationally confirmed by the team.
If signature gating is unavailable, collect the contract signature before publishing
the invoice; do not represent the request acknowledgement as a signed contract.

Drafts contain DEPOSIT and BALANCE payment requests. The deposit due date is initially
the request date for deterministic retries; staff must update it if publishing later.
The team receives a second email when the draft is ready. `invoiceJob.state` moves
from `pending` to `ready`, or `needs-review` after a total mismatch, passed event date,
unexpected invoice state, or eight failed attempts. Inspect saved IDs in Square before
retrying or repairing a job—never erase IDs or change idempotency keys to force a retry.
Reconciliation returns 503 while culinary jobs need review. Monitor pending jobs and
the staff inbox. `CULINARY_SQUARE_INVOICES_ENABLED=false` pauses creation without losing
requests; use it for rollback, and continue manual follow-up on paused requests.

Before production, run an authorized sandbox request and verify the saved order,
draft payment schedule, native-contract attachment/gating, staff notifications, and
final balance deadline. Unit and browser tests mock Square and do not establish live
account access, native contract availability, email receipt, or end-to-end payment.

## Rollback

Pause new checkout submissions before rolling back a financial change. Preserve
MongoDB records, Square IDs, signing keys, and encryption keys. Continue a compatible
recovery worker while pending attempts settle. Rolling back to a version without
the ledger/recovery protocol can reintroduce duplicate-payment risks.

Do not rotate the encryption secret (or quote secret when used as its fallback)
while pending encrypted sources exist without a tested decrypt/re-encrypt migration.
Rotating Better Auth secrets invalidates sessions; plan and communicate that change.
Restore application code separately from database rollback—never discard newer
payment state to match an older build.
