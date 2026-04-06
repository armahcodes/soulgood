import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function MealPlansHeroBanner() {
  return (
    <section className="relative bg-cream-dark overflow-hidden">
      <div className="flex flex-col md:flex-row items-center">
        {/* Image side */}
        <div className="relative w-full md:w-1/2 h-64 md:h-80">
          <Image
            src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&h=500&fit=crop"
            alt="Fresh, colorful wellness meals arranged beautifully on a table"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            data-placeholder="true"
          />
        </div>

        {/* Copy side */}
        <div className="w-full md:w-1/2 px-8 py-10 md:px-12 md:py-16">
          <p className="label-text text-primary text-xs tracking-widest mb-3">
            LIMITED TIME OFFER
          </p>
          <h2 className="font-heading text-2xl md:text-3xl mb-3">
            Get 15% Off Your First Order
          </h2>
          <p className="font-body text-sm md:text-base text-black/60 mb-6 max-w-sm">
            Start your wellness journey with Soul Good. Use code{" "}
            <span className="font-semibold text-black">SOULGOOD</span> at checkout.
          </p>
          <Button as="a" href="/meal-plans/order" size="sm">
            START YOUR PLAN
          </Button>
        </div>
      </div>
    </section>
  );
}
