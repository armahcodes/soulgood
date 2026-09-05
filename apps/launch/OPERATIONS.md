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
