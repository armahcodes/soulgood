import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/join");

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ fulfillment?: string }>;
}) {
  const requested = (await searchParams).fulfillment;
  const fulfillment = requested === "pickup" ? "pickup" : "delivery";

  redirect(`/checkout?fulfillment=${fulfillment}`);
}
