import Link from "next/link";
import { CulinaryQuoteBuilder } from "@/components/culinary/CulinaryQuoteBuilder";
import { Wordmark } from "@/components/ui/Wordmark";
import { todayInLosAngeles } from "@/lib/culinary-booking";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Culinary bookings & quotes — Soul Bowls™",
  description:
    "Plan a Los Angeles County gathering. Bowl delivery starts at 10 bowls. Plated service is $55 per guest, with a $555 food minimum plus $500 culinary support, tax, and delivery. 50% deposit; balance due on the event date before arrival.",
};

export default function QuotePage() {
  return (
    <div className="culinary-page min-h-screen bg-oat text-forest">
      <header className="print-hidden border-b border-forest/12">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <Wordmark href="/" />
          <Link
            href="/checkout"
            className="text-right text-xs font-semibold text-forest underline underline-offset-4"
          >
            Looking for weekly bowls?
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-9">
        <div className="print-hidden mx-auto mb-6 max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-clay">
            Culinary bookings · Los Angeles County
          </p>
          <h1 className="mt-3 font-serif text-3xl font-normal leading-tight tracking-tight sm:text-4xl">
            Let’s plan your gathering.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-forest/75">
            Your menu, your people, one thoughtful step at a time. No payment
            required to request a booking.
          </p>
        </div>
        <CulinaryQuoteBuilder today={todayInLosAngeles()} />
      </main>
      <footer className="print-hidden mx-auto flex max-w-3xl flex-wrap justify-center gap-x-5 gap-y-3 border-t border-forest/10 px-4 py-5 text-xs text-forest/65">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center underline underline-offset-4"
        >
          Back to Soul Good
        </Link>
        <Link
          href="/terms"
          className="inline-flex min-h-11 items-center underline underline-offset-4"
        >
          Terms of service
        </Link>
        <Link
          href="/customer-agreement"
          className="inline-flex min-h-11 items-center underline underline-offset-4"
        >
          Customer agreement
        </Link>
      </footer>
    </div>
  );
}
