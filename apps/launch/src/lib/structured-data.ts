import type { ReactNode } from "react";
import { BUSINESS, CONTACT, PRICING } from "./brand";
import { AVAILABLE_BOWLS } from "./current-offer";
import { EXTRA_CATEGORIES, extraPriceCents, MENU_EXTRAS } from "./menu-extras";

/**
 * schema.org structured data for search engines. Facts only: names, prices,
 * service area, and addresses already published on the site — no health claims.
 */

const SITE = BUSINESS.website;
const dollars = (cents: number) => (cents / 100).toFixed(2);

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: "Soul Good",
        legalName: BUSINESS.legalName,
        url: SITE,
        logo: `${SITE}/brand/soul-good-horizontal.png`,
        email: CONTACT.email,
        address: { "@type": "PostalAddress", streetAddress: "2450 Colorado Ave, Suite 100E", addressLocality: "Santa Monica", addressRegion: "CA", postalCode: "90404", addressCountry: "US" },
      },
      {
        "@type": "FoodEstablishment",
        "@id": `${SITE}/#kitchen`,
        name: "Soul Good Kitchen",
        parentOrganization: { "@id": `${SITE}/#organization` },
        url: SITE,
        image: `${SITE}/products/glow-bowl.webp`,
        servesCuisine: ["Soul food", "Bowls", "Salads"],
        priceRange: "$$",
        address: { "@type": "PostalAddress", streetAddress: "456 Elm Ave", addressLocality: "Long Beach", addressRegion: "CA", postalCode: "90802", addressCountry: "US" },
        areaServed: [
          { "@type": "AdministrativeArea", name: "Los Angeles County, California" },
          { "@type": "AdministrativeArea", name: "Orange County, California" },
        ],
        hasMenu: `${SITE}/menu`,
        acceptsReservations: false,
      },
    ],
  };
}

export function menuJsonLd() {
  const bowlUnit = PRICING.oneTimeCents / 5;
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "The Soul Good menu",
    url: `${SITE}/menu`,
    hasMenuSection: [
      {
        "@type": "MenuSection",
        name: "Soul Bowls™",
        description: "32 oz jars, packed in sets of five.",
        hasMenuItem: AVAILABLE_BOWLS.map((bowl) => ({
          "@type": "MenuItem",
          name: bowl.name,
          description: bowl.ingredients,
          offers: { "@type": "Offer", price: dollars(bowlUnit), priceCurrency: "USD" },
        })),
      },
      ...EXTRA_CATEGORIES.map((category) => ({
        "@type": "MenuSection",
        name: category.title,
        description: category.blurb,
        hasMenuItem: MENU_EXTRAS.filter((item) => item.category === category.id).map((item) => ({
          "@type": "MenuItem",
          name: item.name,
          description: item.description,
          image: `${SITE}${item.imagePath}`,
          offers: { "@type": "Offer", price: dollars(extraPriceCents(item.id)), priceCurrency: "USD" },
        })),
      })),
    ],
  };
}

/** Serialize for a <script type="application/ld+json">, escaping "<" so content can't close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: "Soul Good",
    alternateName: ["Soul Good Kitchen", "Soul Bowls"],
    url: SITE,
    publisher: { "@id": `${SITE}/#organization` },
    inLanguage: "en-US",
  };
}

/** Breadcrumbs for an inner page: Home → … → this page. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

type FaqItem = { title: string; content: ReactNode; plain?: string };

/** FAQPage from the same questions shown on the page (visible content only). */
export function faqJsonLd(items: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items
      .map((item) => ({ question: item.title, answer: item.plain ?? (typeof item.content === "string" ? item.content : null) }))
      .filter((item): item is { question: string; answer: string } => Boolean(item.answer))
      .map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };
}

const AREA_SERVED = [
  { "@type": "AdministrativeArea", name: "Los Angeles County, California" },
  { "@type": "AdministrativeArea", name: "Orange County, California" },
];

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  area?: "la-oc" | "la";
  offers?: { name: string; priceCents: number; unit?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: `${SITE}${input.path}`,
    serviceType: input.serviceType,
    provider: { "@id": `${SITE}/#organization` },
    areaServed: input.area === "la" ? [AREA_SERVED[0]] : AREA_SERVED,
    ...(input.offers
      ? {
          offers: input.offers.map((offer) => ({
            "@type": "Offer",
            name: offer.name,
            price: dollars(offer.priceCents),
            priceCurrency: "USD",
            ...(offer.unit ? { priceSpecification: { "@type": "UnitPriceSpecification", price: dollars(offer.priceCents), priceCurrency: "USD", unitText: offer.unit } } : {}),
          })),
        }
      : {}),
  };
}
