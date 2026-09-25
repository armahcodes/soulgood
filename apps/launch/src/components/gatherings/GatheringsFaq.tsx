import { Accordion } from "@/components/ui/kit/accordion";
import { CONTACT, formatCents } from "@/lib/brand";
import { CULINARY_PRICING } from "@/lib/culinary-booking";

// Question wording stays lowercase-friendly: the quote wizard's step buttons are
// matched by name ("Experience", "Menu", "Event", "Review", "Contact").
const FAQS = [
  {
    id: "difference",
    title: "What’s the difference between bowl delivery and a plated dinner?",
    content: `Bowl delivery brings chef-made Soul Bowls™ to your venue, ready to share, with no on-site service. For a plated dinner, our team plates and serves at your venue at ${formatCents(CULINARY_PRICING.platedPersonCents)} per guest, and includes ingredient education.`,
  },
  {
    id: "minimums",
    title: "Is there a minimum?",
    content: `Bowl delivery starts at ${CULINARY_PRICING.deliveryMinimumBowls} bowls. Plated dinners have a ${formatCents(CULINARY_PRICING.platedFoodMinimumCents)} food minimum, plus ${formatCents(CULINARY_PRICING.platedSupportCents)} culinary support for plating, service, and ingredient education.`,
  },
  {
    id: "payment",
    title: "When do I pay?",
    content: `Nothing is charged to request a booking. After we confirm availability, we send your contract and Square invoice. A ${CULINARY_PRICING.depositPercentage}% deposit reserves the date once you sign; the balance is due on the day of your gathering, before our team arrives. There’s no automatic charge.`,
  },
  {
    id: "reserved",
    title: "Is my date reserved when I send a request?",
    content: "Not yet. Your date is reserved once your contract is signed and the deposit is paid. We’ll confirm availability with you first.",
  },
  {
    id: "area",
    title: "Where do you cater?",
    content: "Gatherings are available throughout Los Angeles County. Your estimate checks the address and applies the current California sales tax for it.",
  },
  {
    id: "dietary",
    title: "Can you work with allergies and dietary needs?",
    content: `Yes—tell us in the final step and our team confirms every request before booking. Our kitchen handles common allergens, so we can’t guarantee an allergen-free kitchen. Questions? Email ${CONTACT.email}.`,
  },
] as const;

export function GatheringsFaq() {
  return <Accordion items={FAQS} defaultOpen={["difference"]} />;
}
