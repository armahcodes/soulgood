import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { DeliveryOptions } from "@/components/sections/DeliveryOptions";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { DELIVERY_AREAS } from "@/lib/delivery-areas";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata("/delivery", {
  title: "Delivery Areas: LA, Orange County & Long Beach",
  description: "Where Soul Good delivers: Sunday meal prep across LA and Orange County, and on-demand Take Out within about 20 miles of our Long Beach kitchen.",
});

export default function DeliveryAreasPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-oat">
        <JsonLd data={breadcrumbJsonLd([{ name: "Delivery areas", path: "/delivery" }])} />
        <section className="mx-auto w-full max-w-7xl px-5 pt-10 pb-12 sm:px-8 sm:pt-14 lg:px-12">
          <p className="text-[0.68rem] font-medium tracking-[0.22em] text-clay-ink uppercase">Delivery areas</p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.6rem,7vw,4.6rem)] leading-[1.02] tracking-[0.01em] text-forest">Where we deliver.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-forest/75 sm:text-lg">
            Sunday meal prep across Los Angeles and Orange County, and on-demand Take Out near our Long Beach kitchen.
          </p>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {DELIVERY_AREAS.map((area) => (
              <li key={area.slug}>
                <Link href={`/delivery/${area.slug}`} className="group flex h-full flex-col rounded-lg border border-forest/12 bg-card p-6 transition-colors hover:border-forest/35">
                  <span className="font-serif text-3xl text-forest">{area.name}</span>
                  <span className="mt-3 flex-1 text-sm leading-6 text-forest/75">{area.seoDescription}</span>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest">
                    Delivery in {area.place} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section aria-label="Delivery options" className="border-t border-forest/10 py-14 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
            <DeliveryOptions />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
