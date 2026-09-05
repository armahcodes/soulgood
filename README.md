# Soul Bowls™

Soul Good’s customer storefront lives in `apps/launch`: product browsing, checkout,
Square payments, passwordless accounts, order history, and transactional email.

## Development

```bash
npm ci
npm run dev                         # Active storefront on localhost:3000
npm run launch:test                 # Unit and API regression tests
npm run launch:lint
npm run launch:build
npm run test:e2e --workspace apps/launch
```

Copy `apps/launch/.env.example` to `apps/launch/.env.local` and configure a separate
sandbox database and Square account. Never put production credentials in tests.
Browser tests run a local server with mocked Square, checkout, and tax responses;
they do not charge cards or prove live wallet/device eligibility.

## Customer offer

- Five 32 oz Soul Bowls™ jars per five-day meal set, starting at $88.
- One to six people, with one to three meals per person per day.
- One of each available bowl per set; Herb Chicken is currently sold out.
- One-time pickup is free. LA County delivery is $8.88 per order.
- Automatic weekly orders currently support delivery only. Square’s itemized
  subscription fulfillment does not support pickup; weekly pickup is disabled.
- Address-based tax and the exact total are shown before consent and bound to a
  signed, expiring quote. Checkout rejects changes to the approved total.
- Apple Pay and Google Pay are offered for eligible one-time purchases; weekly
  subscriptions use a card saved with explicit consent.

Offer/catalog sources: `current-offer.ts`, `brand.ts`, `bowl-selection.ts`, and
`square-catalog.ts` under `apps/launch/src/lib`. The catalog sync script writes
to Square; inspect its target environment before intentionally running it.

## Payment reliability

Checkout saves an immutable recovery record in MongoDB before any Square write.
Retries use the same reference and Square idempotency keys. An interrupted request
is verified through the recovery screen, not treated as permission to charge again.
Subscription enrollment is shown as payment pending until Square reports payment.

Signed webhooks and a scheduled worker reconcile payment, subscription, invoice,
refund, cancellation, and email state. Branded customer emails use a durable outbox.
Order history requires a verified email session; guest checkout does not overwrite
an existing Square customer profile.

## Deployment and operations

Vercel must use **`apps/launch` as its root directory**. Read
[the operations runbook](apps/launch/OPERATIONS.md) before deploying this change.
It contains required environment variables, webhook registration, scheduler setup,
validation, alerts, incident recovery, and rollback instructions.

New production checkouts fail closed if required recovery configuration is absent.
Environment-variable presence alone does not prove the webhook or scheduler is
working; the rollout checks are mandatory.

Lead capture requires MongoDB in production. For local-only development, explicit
`ALLOW_LOCAL_LEAD_CAPTURE=true` enables a private, gitignored
`apps/launch/.local-data/leads.local.jsonl` file. Failed production persistence
returns an error instead of pretending the lead was saved.

## Archived root application

The root `src/` app is an archived design, not the active checkout. Root builds
redirect to the live storefront by default. `npm run legacy:dev` enables an
explicit preview with disabled form controls and an archive banner. Root
`npm run build` / `npm run lint` remain available to verify that archive.

## License

Private — All rights reserved.
