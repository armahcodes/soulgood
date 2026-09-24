import { CulinaryQuoteBuilder } from "@/components/culinary/CulinaryQuoteBuilder";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
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
      <SiteHeader current="/quote" className="print-hidden" />
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
      <div className="print-hidden mt-10">
        <SiteFooter />
      </div>
    </div>
  );
}
