# Customer account and cancellation experience

Reviewed September 12, 2026. Implementation is local; it has not been deployed.

## Scope and evidence

The Product Design audit was applied to cancellation entry, sign-in, weekly plan management, request recovery, and the return to order history. The existing Soul Good typography, colors, logo, and voice were retained. Homepage, payment entry, culinary quotes, and the external Eat Now checkout were not re-audited in this pass.

Before screenshots were captured from the live public `/cancel` page and the `/account` sign-in redirect. No authenticated customer session was available, so the signed-in findings were source-confirmed rather than presented as live observations. No real cancellation, payment, login email, or customer-data mutation was performed.

After screenshots for public cancellation and contextual sign-in came from the actual local Next application. Signed-in interactions and responsive states used the actual customer components in an isolated fixture with synthetic records, mocked authentication, mocked cancellation responses, and navigation stubs. This fixture is outside the deployable application at `tmp/cancellation-audit/fixture` in the repository root. It contains no authentication bypass in production routes.

## Journey health

| Step | Before | Implemented result | Verification |
| --- | --- | --- | --- |
| 1. Find cancellation | Poor: public page primarily opened an email; online account management was disconnected. | One `/cancel` destination with online management first and an explicit email fallback. | Live-before and local-after screenshots; route rendering tests. |
| 2. Sign in | Fair: generic order copy, no resend action, no cancellation context. | Contextual sign-in, preserved plan destination, resend cooldown, invalid-code recovery, no purchase upsell. | Local Next screenshot; mocked code, resend, and return-path interactions. |
| 3. Find the right plan | Poor: management was inside receipt cards; older plans could fall outside the latest 50 records. | Separate plan query and page, plan references, scoped actions, honest empty and unavailable states. | Source review, server-page regression tests, signed-in component fixture. |
| 4. Submit cancellation | Poor: pending responses appeared as failures; no clear saved-request state. | Explicit review, immediate durable acknowledgment, pending versus confirmed result, readable end date. | API tests; fixture review/back/submit; one mock POST followed by status GETs. |
| 5. Recover or return later | Poor: no read-only request-status path. | Owned, uncached status endpoint; bounded polling; saved state restored after navigation; lost-response and expired-session recovery. | API/page tests and mocked browser interactions. |
| 6. Return to orders | Fair: enrollment, billing, details, reorder, and cancellation competed in one timeline. | Separate receipts, expandable details, fee breakdown, clear payment labels, contextual support, one-time reorder handoff. | Server-render regression test; 390px fixture interaction and screenshot. |

Overall: the account journey is clearer and locally verified. Live authenticated and provider integration verification remains outstanding; this is not a claim that every site flow has been audited or that a real Square cancellation was executed.

## Key implementation details

- `/cancel` is the consistent destination from the account, footer, and sign-in return path. Existing legal links already point there.
- Every cancellation still requires verified email ownership and a same-origin POST. No cancellation occurs on page load or status polling.
- The POST saves the existing durable job before returning HTTP 202. Square processing runs using Next `after`; the existing reconciliation job remains the retry path.
- GET reads saved status only. A provider-confirmed date takes precedence over pending downstream record/email synchronization.
- A missing response is not described as a successful cancellation. The customer can check the same plan before retrying.
- Confirmation emails use the same state language and formatted calendar date as the account UI. The email request policy and already-paid-order policy were preserved.
- Plan state is not confused with payment state. Reordering a weekly mix remains a one-time purchase and does not restart its plan.
- Shared navigation, visible focus styling, keyboard focus restoration, live statuses, loading states, mobile wrapping, 44px+ main controls, and stronger text/hover contrast improve accessibility.

## Checks performed

- 233 unit/regression tests passed, including ownership, cross-origin rejection, persisted pending requests, end-date recovery, account rendering, fee display, and confirmation email copy.
- TypeScript check passed after normalizing nullable legacy delivery fees.
- ESLint and the production build passed. `/account`, `/cancel`, and `/login` were verified as dynamic, request-rendered routes rather than static build output.
- In-app browser: actual local public cancellation to contextual sign-in; fixture review/back focus; confirmation through one POST and status reads; lost-response recovery; expired-session return link; invalid OTP; resend; correct `/cancel` handoff; expanded order details and one-time reorder destination.
- Fixture layouts had no measured overflow at 320px (plan) and 390px (receipt); 1280px desktop was also inspected. These are embedded responsive viewports, not native-device or cross-browser certification.
- The standalone Playwright suite was not executed during this pass. Browser verification used the in-app browser and isolated fixtures instead.
- The local environment has no configured `BETTER_AUTH_SECRET`. Live local sign-in therefore still requires restoring that secret through the normal secret-management process; no production authentication settings were changed. The public entry page remains available without an authentication cookie, while protected operations continue to require a verified session.

## Screenshots

Paths below are relative to the repository root. Saved screenshots were reopened for inspection.

- `tmp/cancellation-audit/01-cancel-before.png` — live public cancellation before.
- `tmp/cancellation-audit/02-sign-in-before.png` — live account entry before.
- `tmp/cancellation-audit/03-cancel-after.png` — actual local public cancellation after.
- `tmp/cancellation-audit/04-sign-in-after.png` — actual local contextual sign-in after.
- `tmp/cancellation-audit/05-review-fixture.png` — signed-in cancellation review with synthetic data.
- `tmp/cancellation-audit/06-pending-fixture.png` — saved request state with synthetic data.
- `tmp/cancellation-audit/07-confirmed-fixture.png` — confirmed state; one mock POST, two status checks.
- `tmp/cancellation-audit/09-mobile-320-confirmed.png` — 320px responsive confirmed state.
- `tmp/cancellation-audit/10-mobile-order-details.png` — 390px responsive order details.
- `tmp/cancellation-audit/11-final-cancellation-entry.png` — final local entry page after request-rendering and guest-access checks.

The initial fixture hot-reload capture `07-fixture-reset-during-capture.png` is rejected evidence, not a confirmed cancellation result. `08-mobile-390-fixture.png` used a 390px outer frame with 388px inner content; the explicitly measured 320px and 390px captures above are the acceptance evidence.

## Release and follow-up

No schema migration, credential change, branch creation, or deployment was performed. Existing cancellation storage, ownership rules, and reconciliation infrastructure are retained. Release all new shared components together with the route and page changes; do not deploy the new client against the old cancellation response shape alone.

Before production verification, use an explicitly authorized test customer and test subscription to check real sign-in email delivery, Square's confirmed cancellation date, the email outbox, and pending-job recovery. Do not cancel a customer subscription simply to smoke-test the UI. Roll back the application deployment as a unit if needed; preserve the durable cancellation jobs so received requests are not lost.
