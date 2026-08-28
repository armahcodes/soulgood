import { Button } from "@/components/ui/Button";
import { LegalShell } from "@/components/legal/LegalShell";
import { BRAND_NAME, CONTACT } from "@/lib/brand";

export const metadata = {
  title: `Cancel Subscription — ${BRAND_NAME}`,
  description: `Cancel future ${BRAND_NAME} weekly subscription renewals online.`,
};

const cancellationHref = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
  "Cancel my Soul Bowls subscription",
)}&body=${encodeURIComponent(
  "Please cancel my Soul Bowls weekly subscription and send confirmation.\n\nName:\nEmail used for subscription:\nDelivery ZIP:\n",
)}`;

export default function CancelPage() {
  return (
    <LegalShell
      eyebrow="Subscription management"
      title="Cancel future renewals"
      intro="You can cancel your Soul Bowls™ subscription at any time. Cancellation stops future weekly renewals and does not reverse an order already charged and committed to production."
    >
      <section className="rounded-3xl bg-gold/25 p-6 sm:p-8">
        <h2>Send your cancellation request</h2>
        <p>
          The button below opens a preformatted email. Add the name, email, and
          delivery ZIP connected to the subscription, then send it. Your request
          is effective when received, provided those details identify the plan. We
          will email confirmation; no retention call or extra step is required.
        </p>
        <Button as="a" href={cancellationHref} className="mt-6">
          Email my cancellation
        </Button>
      </section>

      <section>
        <h2>Need help?</h2>
        <p>
          If the button does not open your email app, send “Cancel my Soul Bowls
          subscription” with your name, account email, and delivery ZIP to{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>
      </section>
    </LegalShell>
  );
}
