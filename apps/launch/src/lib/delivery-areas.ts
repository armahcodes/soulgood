import { FEES, formatCents, ORDER_RULES } from "./brand";
import { CULINARY_PRICING } from "./culinary-booking";
import { EAT_NOW } from "./ordering";

/**
 * Service-area landing pages. Every fact here mirrors the rules enforced in
 * checkout, Take Out, and gatherings — each page says what is and isn’t
 * available in that area rather than repeating the same copy.
 */

export type DeliveryArea = {
  slug: "los-angeles" | "orange-county" | "long-beach";
  name: string;
  /** Used in titles: "Meal Prep Delivery in …" */
  place: string;
  county: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  places: string[];
  weekly: string;
  onDemand: { available: "yes" | "some" | "no"; text: string };
  gatherings: { available: boolean; text: string };
  faqs: { title: string; content: string }[];
};

const delivery = `${formatCents(FEES.delivery.amountCents)} per Sunday delivery, free on orders over $100`;
const minimum = ORDER_RULES.minimumLabel;

export const DELIVERY_AREAS: DeliveryArea[] = [
  {
    slug: "los-angeles",
    name: "Los Angeles County",
    place: "Los Angeles",
    county: "Los Angeles County",
    seoTitle: "Meal Prep Delivery in Los Angeles",
    seoDescription: `Chef-made Soul Bowls™, salads, and sides delivered Sundays anywhere in LA County. ${minimum}; free delivery over $100. Weekly or one-time.`,
    intro:
      "Weekly nourishment for Los Angeles: chef-made Soul Bowls™, made-to-order salads, and veggie sides, delivered by our own team every Sunday to verified addresses anywhere in the county.",
    places: ["Los Angeles", "Long Beach", "Santa Monica", "Culver City", "Pasadena", "Glendale", "Burbank", "Inglewood", "Torrance", "West Hollywood", "Downey", "Carson"],
    weekly: `Sunday delivery to any verified address in Los Angeles County, ${delivery}. Free Sunday pickup is available for one-time orders.`,
    onDemand: {
      available: "some",
      text: `Take Out delivers ${EAT_NOW.days} within about ${EAT_NOW.radiusMiles} miles of our Long Beach kitchen, which covers much of the South Bay, Gateway Cities, and parts of central LA. Your exact address is checked at Take Out checkout.`,
    },
    gatherings: {
      available: true,
      text: `Gatherings are available across LA County: bowl delivery from ${CULINARY_PRICING.deliveryMinimumBowls} bowls, or plated dinners from ${formatCents(CULINARY_PRICING.platedPersonCents)} per guest.`,
    },
    faqs: [
      { title: "Do you deliver meal prep everywhere in Los Angeles County?", content: `Yes. Weekly orders are delivered on Sundays to verified addresses anywhere in Los Angeles County. Delivery is ${delivery}, and every order has a $50 minimum.` },
      { title: "Can I get same-week or on-demand delivery in LA?", content: `Take Out offers on-demand delivery ${EAT_NOW.days} within about ${EAT_NOW.radiusMiles} miles of our Long Beach kitchen. Addresses farther away can still get Sunday delivery.` },
      { title: "Do you cater events in Los Angeles?", content: `Yes. Build an itemized estimate for bowl delivery (from ${CULINARY_PRICING.deliveryMinimumBowls} bowls) or a plated dinner for your group on our Gatherings page. A ${CULINARY_PRICING.depositPercentage}% deposit reserves your date after we confirm.` },
    ],
  },
  {
    slug: "orange-county",
    name: "Orange County",
    place: "Orange County",
    county: "Orange County",
    seoTitle: "Meal Prep Delivery in Orange County",
    seoDescription: `Chef-made Soul Bowls™, salads, and sides delivered Sundays across Orange County. ${minimum}; free delivery over $100. Weekly or one-time.`,
    intro:
      "Weekly nourishment for Orange County: chef-made Soul Bowls™, made-to-order salads, and veggie sides, delivered by our own team every Sunday to verified addresses across the county.",
    places: ["Anaheim", "Santa Ana", "Irvine", "Huntington Beach", "Costa Mesa", "Garden Grove", "Fullerton", "Orange", "Newport Beach", "Seal Beach", "Westminster", "Tustin"],
    weekly: `Sunday delivery to any verified address in Orange County, ${delivery}. Free Sunday pickup is available for one-time orders.`,
    onDemand: {
      available: "some",
      text: `Take Out delivers ${EAT_NOW.days} within about ${EAT_NOW.radiusMiles} miles of our Long Beach kitchen, which reaches parts of north and west Orange County near Long Beach. Your exact address is checked at Take Out checkout.`,
    },
    gatherings: {
      available: false,
      text: "Gatherings and catering are currently available in Los Angeles County only. For an Orange County event, email us and we’ll let you know what’s possible.",
    },
    faqs: [
      { title: "Do you deliver meal prep in Orange County?", content: `Yes. Weekly orders are delivered on Sundays to verified addresses anywhere in Orange County. Delivery is ${delivery}, and every order has a $50 minimum.` },
      { title: "Is on-demand Take Out available in Orange County?", content: `In parts of north and west Orange County. Take Out delivers ${EAT_NOW.days} within about ${EAT_NOW.radiusMiles} miles of our Long Beach kitchen; your address is checked at Take Out checkout.` },
      { title: "Can Food for the Soul hold a meal drive in Orange County?", content: "Yes. Organizations in Orange County can apply to host a free Food for the Soul community meal drive, open to everyone and served first come, first served." },
    ],
  },
  {
    slug: "long-beach",
    name: "Long Beach",
    place: "Long Beach",
    county: "Los Angeles County",
    seoTitle: "Meal Prep & On-Demand Delivery in Long Beach",
    seoDescription: "Our kitchen is in Long Beach: Sunday meal prep delivery, free pickup, and on-demand Take Out Thursday–Sunday. Soul Bowls™, salads, and sides.",
    intro:
      "Long Beach is home. Our kitchen on Elm Avenue prepares every Soul Bowl™, salad, and side, so Long Beach gets every way to order: Sunday meal prep, free pickup, and on-demand Take Out.",
    places: ["Downtown Long Beach", "Belmont Shore", "Bixby Knolls", "Naples", "North Long Beach", "Signal Hill", "Lakewood", "Los Alamitos"],
    weekly: `Sunday delivery across Long Beach and all of LA and Orange County, ${delivery}. Free Sunday pickup is available for one-time orders.`,
    onDemand: {
      available: "yes",
      text: `Take Out is available ${EAT_NOW.days} for pickup or on-demand delivery anywhere in Long Beach, within about ${EAT_NOW.radiusMiles} miles of our kitchen. A courier fee is shown at checkout, waived on orders over $100.`,
    },
    gatherings: {
      available: true,
      text: `Plan a Long Beach gathering: bowl delivery from ${CULINARY_PRICING.deliveryMinimumBowls} bowls, or plated dinners from ${formatCents(CULINARY_PRICING.platedPersonCents)} per guest.`,
    },
    faqs: [
      { title: "Can I pick up my order in Long Beach?", content: "Yes. Sunday pickup is free for one-time meal prep orders, and Take Out orders can be picked up during service hours. We confirm the pickup location and window before fulfillment." },
      { title: "What’s the fastest way to get a bowl in Long Beach?", content: `Take Out: order single bowls ${EAT_NOW.days} for pickup or on-demand courier delivery. For the week ahead, order meal prep for Sunday delivery.` },
      { title: "Is there a minimum order in Long Beach?", content: "Every meal prep and Take Out order has a $50 minimum, and delivery is free on orders over $100." },
    ],
  },
];

export function findDeliveryArea(slug: string): DeliveryArea | undefined {
  return DELIVERY_AREAS.find((area) => area.slug === slug);
}
