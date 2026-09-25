import { formatCents, PRICING } from "@/lib/brand";
import { CULINARY_PRICING } from "@/lib/culinary-booking";
import { AVAILABLE_BOWLS } from "@/lib/current-offer";
import { DELIVERY_AREAS } from "@/lib/delivery-areas";
import { EXTRA_CATEGORIES, extraPriceCents, MENU_EXTRAS } from "@/lib/menu-extras";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

/** llms.txt: a plain-language summary of the site for AI search and assistants (llmstxt.org). Facts only. */
export function GET() {
  const lines = [
    "# Soul Good",
    "",
    "> Chef-made Soul Bowls™, made-to-order salads, and veggie sides by Chef Kyla, from a kitchen in Long Beach, California. Weekly meal prep is delivered Sundays across Los Angeles and Orange County; on-demand Take Out runs Thursday–Sunday near Long Beach. Operated by Soul Goods LLC.",
    "",
    "Every order has a $50 minimum; delivery is free on orders over $100 (otherwise $8.88 per Sunday delivery). Menu information describes ingredients and allergens only; it is not medical or nutrition advice.",
    "",
    "## Order",
    `- [Menu](${SITE_URL}/menu): Soul Bowls™ (${formatCents(PRICING.oneTimeCents)} per set of five 32 oz bowls), salads, veggie cups, and snacks with prices and allergens`,
    `- [Weekly meal prep](${SITE_URL}/checkout): one-time or weekly orders, Sunday pickup or delivery`,
    `- [Take Out](${SITE_URL}/eat-now): single bowls on demand, Thursday–Sunday, within about 20 miles of Long Beach`,
    `- [Gatherings](${SITE_URL}/quote): LA County catering, bowl delivery from ${CULINARY_PRICING.deliveryMinimumBowls} bowls or plated dinners from ${formatCents(CULINARY_PRICING.platedPersonCents)} per guest`,
    `- [Pathway Finder](${SITE_URL}/quiz): a short quiz that suggests bowls, salads, and sides`,
    "",
    "## Delivery areas",
    ...DELIVERY_AREAS.map((area) => `- [${area.name}](${SITE_URL}/delivery/${area.slug}): ${area.seoDescription}`),
    "",
    "## This week’s Soul Bowls™",
    ...AVAILABLE_BOWLS.map((bowl) => `- ${bowl.name}: ${bowl.ingredients}${bowl.allergen ? ` (${bowl.allergen})` : ""}`),
    "",
    ...EXTRA_CATEGORIES.flatMap((category) => [
      `## ${category.title}`,
      ...MENU_EXTRAS.filter((item) => item.category === category.id).map((item) => `- ${item.name} (${formatCents(extraPriceCents(item.id))}): ${item.description}`),
      "",
    ]),
    "## Community",
    `- [Food for the Soul](${SITE_URL}/food-for-the-soul): free community meal drives, open to all, first come, first served`,
    `- [Host a meal drive](${SITE_URL}/food-for-the-soul/host): application for organizations in Los Angeles and Orange County`,
    "",
    "## Policies",
    `- [Terms of Service](${SITE_URL}/terms)`,
    `- [Customer Agreement](${SITE_URL}/customer-agreement)`,
    `- [Privacy Policy](${SITE_URL}/privacy)`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
