import { redirect } from "next/navigation";
import { BRAND_NAME } from "@/lib/brand";

export const metadata = {
  title: `Order Soul Bowls™ — ${BRAND_NAME}`,
  description:
    "Build and pay for a one-time or weekly Soul Bowls™ order with pickup or Los Angeles County delivery.",
};

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ fulfillment?: string }>;
}) {
  const requested = (await searchParams).fulfillment;
  const fulfillment = requested === "pickup" ? "pickup" : "delivery";

  redirect(`/checkout?fulfillment=${fulfillment}`);
}
