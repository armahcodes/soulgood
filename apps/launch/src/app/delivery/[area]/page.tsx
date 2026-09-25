import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Minus } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { DeliveryMap } from "@/components/sections/DeliveryMap";
import { SaladBarShowcase } from "@/components/sections/SaladBarShowcase";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/kit/accordion";
import { Reveal } from "@/components/ui/kit/reveal";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { AVAILABLE_BOWLS } from "@/lib/current-offer";
import { DELIVERY_AREAS, findDeliveryArea } from "@/lib/delivery-areas";
import { EAT_NOW } from "@/lib/ordering";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return DELIVERY_AREAS.map((area) => ({ area: area.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }) {
  const area = findDeliveryArea((await params).area);
  if (!area) return {};
  return pageMetadata(`/delivery/${area.slug}`, { title: area.seoTitle, description: area.seoDescription });
}

const eyebrow = "text-[0.68rem] font-medium tracking-[0.22em] text-clay-ink uppercase";

export default async function DeliveryAreaPage({ params }: { params: Promise<{ area: string }> }) {
  const area = findDeliveryArea((await params).area);
  if (!area) notFound();
  const path = `/delivery/${area.slug}`;
  const services = [
    { title: "Weekly meal prep", status: "Every Sunday", on: true, text: area.weekly, href: "/checkout", cta: "Build your order" },
    {
      title: "On-demand Take Out",
      status: area.onDemand.available === "yes" ? EAT_NOW.days : area.onDemand.available === "some" ? "Near Long Beach" : "Not available",
      on: area.onDemand.available !== "no",
      text: area.onDemand.text,
      href: EAT_NOW.infoPath,
      cta: "About Take Out",
    },
    {
      title: "Gatherings & catering",
      status: area.gatherings.available ? "Available" : "LA County only",
      on: area.gatherings.available,
      text: area.gatherings.text,
      href: area.gatherings.available ? "/quote" : "mailto:contact@soulgood.com?subject=Orange%20County%20gathering",
      cta: area.gatherings.available ? "Plan a gathering" : "Email us",
    },
  ];

  return (
    <>
      <SiteHeader />
      <main className="bg-oat">
        <JsonLd
          data={[
            breadcrumbJsonLd([{ name: "Delivery areas", path: "/delivery" }, { name: area.name, path }]),
            serviceJsonLd({ name: `Soul Good meal prep delivery in ${area.name}`, description: area.seoDescription, path, serviceType: "Meal prep delivery", area: area.slug === "orange-county" ? "la-oc" : "la" }),
            faqJsonLd(area.faqs),
          ]}
        />
        <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pt-10 pb-12 sm:px-8 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
          <div>
            <nav aria-label="Breadcrumb" className="mb-5 text-sm text-forest/72">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link href="/" className="underline-offset-4 hover:underline">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/delivery" className="underline-offset-4 hover:underline">Delivery areas</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-forest">{area.name}</li>
              </ol>
            </nav>
            <p className={eyebrow}>Serving {area.county}</p>
            <h1 className="mt-4 text-[clamp(2.6rem,7vw,4.6rem)] leading-[1.02] tracking-[0.01em] text-forest">{area.seoTitle}</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-forest/75 sm:text-lg">{area.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as="a" href="/checkout" size="lg">Build your ritual</Button>
              <Button as="a" href="/menu" size="lg" variant="secondary">See the menu</Button>
            </div>
            <p className="mt-5 text-sm text-forest/72">$50 minimum order · free delivery over $100</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {AVAILABLE_BOWLS.slice(0, 2).map((bowl, index) => (
              <div key={bowl.id} className={cn("relative aspect-[3/4] overflow-hidden rounded-lg bg-sand/40", index === 1 && "translate-y-6")}>
                <Image src={bowl.imagePath} alt={`${bowl.name} in a 32 ounce Soul Good jar`} fill unoptimized sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover" loading={index === 0 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="services-heading" className="border-t border-forest/10 bg-card/60 py-14 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
            <Reveal className="mb-10 max-w-2xl">
              <p className={eyebrow}>What’s available in {area.place}</p>
              <h2 id="services-heading" className="mt-4 text-4xl leading-none text-forest sm:text-5xl">Three ways to order.</h2>
            </Reveal>
            <Reveal stagger className="grid gap-4 lg:grid-cols-3">
              {services.map((service) => (
                <div key={service.title} className="flex flex-col rounded-lg border border-forest/12 bg-oat p-6">
                  <p className={cn("inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", service.on ? "bg-sage/15 text-forest" : "bg-forest/6 text-forest/72")}>
                    {service.on ? <Check className="size-3.5 text-sage-ink" aria-hidden /> : <Minus className="size-3.5" aria-hidden />}
                    {service.status}
                  </p>
                  <h3 className="mt-4 font-serif text-3xl text-forest">{service.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-forest/75">{service.text}</p>
                  <a href={service.href} className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-forest underline underline-offset-4 hover:text-clay-ink">
                    {service.cta}
                  </a>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="coverage-heading" className="py-14 sm:py-20">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
            <div>
              <p className={eyebrow}>Coverage</p>
              <h2 id="coverage-heading" className="mt-4 text-4xl leading-none text-forest sm:text-5xl">Where we deliver.</h2>
              <p className="mt-4 text-sm leading-6 text-forest/75">
                Weekly delivery reaches every verified address in {area.county}, including:
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {area.places.map((place) => (
                  <li key={place} className="rounded-full border border-forest/12 bg-card px-3 py-1.5 text-sm text-forest/85">{place}</li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-5 text-forest/72">Addresses are verified at checkout. Other delivery areas: {DELIVERY_AREAS.filter((other) => other.slug !== area.slug).map((other, index) => (
                <span key={other.slug}>{index ? ", " : ""}<Link href={`/delivery/${other.slug}`} className="underline underline-offset-2">{other.name}</Link></span>
              ))}.</p>
            </div>
            <DeliveryMap />
          </div>
        </section>

        <SaladBarShowcase />

        <section aria-labelledby="area-faq-heading" className="border-t border-forest/10 bg-card/60 py-14 sm:py-20">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
            <div>
              <p className={eyebrow}>Questions</p>
              <h2 id="area-faq-heading" className="mt-4 text-4xl leading-none text-forest sm:text-5xl">{area.place} delivery, answered.</h2>
              <Link href="/#faq" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-forest underline underline-offset-4 hover:text-clay-ink">More questions</Link>
            </div>
            <Accordion items={area.faqs.map((faq, index) => ({ id: `${area.slug}-${index}`, ...faq }))} defaultOpen={[`${area.slug}-0`]} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
