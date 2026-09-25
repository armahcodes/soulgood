import { CONTACT } from "@/lib/brand";

export const cancellationHelpHref = `mailto:${CONTACT.email}?subject=${encodeURIComponent("Cancel my Soul Bowls subscription")}&body=${encodeURIComponent("Please cancel my Soul Bowls weekly subscription and send confirmation.\n\nName:\nEmail used for subscription:\nDelivery ZIP:\nPlan reference (if available):\n")}`;

export function CancellationHelp() {
  return (
    <aside id="cancellation-help" className="rounded-lg border border-forest/12 bg-card/70 p-6 sm:p-8">
      <h2 className="text-2xl">Can’t find your plan or access your email?</h2>
      <p className="mt-3 text-sm leading-6 text-forest/75">
        We can help with a plan under another email or an older subscription.
        You do not need to place another order.
      </p>
      <a
        href={cancellationHelpHref}
        className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
      >
        Email a cancellation request
      </a>
      <p className="mt-1 text-sm leading-6 text-forest/75">
        This opens your email app; you still need to send the message. Include
        your name, checkout email, and delivery ZIP. If it does not open, email{" "}
        <a
          className="whitespace-nowrap underline underline-offset-4"
          href={`mailto:${CONTACT.email}`}
        >
          {CONTACT.email}
        </a>{" "}
        directly.
      </p>
      <p className="mt-3 text-xs leading-5 text-forest/70">
        Email cancellation requests are effective when received, provided those
        details identify the plan. We’ll email confirmation; no retention call
        is required.
      </p>
    </aside>
  );
}
