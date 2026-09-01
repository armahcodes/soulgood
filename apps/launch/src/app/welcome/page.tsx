import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import { Wordmark } from "@/components/ui/Wordmark";
import { BRAND_NAME } from "@/lib/brand";

export const metadata = {
  title: `Order status — ${BRAND_NAME}`,
  description: `Review your ${BRAND_NAME} checkout confirmation and next steps.`,
};

export default function WelcomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-oat">
      <header className="border-b border-forest/12">
        <div className="mx-auto flex min-h-20 w-full max-w-5xl items-center px-5 sm:px-8">
          <Wordmark href="/" />
        </div>
      </header>
      <OrderConfirmation />
    </main>
  );
}
