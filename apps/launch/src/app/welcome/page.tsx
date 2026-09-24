import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import Link from "next/link";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { BRAND_NAME } from "@/lib/brand";

export const metadata = {
  title: `Order status — ${BRAND_NAME}`,
  description: `Review your ${BRAND_NAME} checkout confirmation and next steps.`,
};

export default function WelcomePage() {
  return (
    <>
      <SiteHeader
        variant="focus"
        aside={
          <Link
            href="/account"
            className="inline-flex min-h-11 items-center text-[0.7rem] font-bold tracking-[0.1em] text-forest/70 uppercase transition-colors hover:text-clay"
          >
            My orders
          </Link>
        }
      />
      <main className="flex min-h-screen flex-col bg-oat">
        <OrderConfirmation />
      </main>
    </>
  );
}
