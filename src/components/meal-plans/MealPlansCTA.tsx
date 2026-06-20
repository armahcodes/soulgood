import { Button } from "@/components/ui/Button";

export function MealPlansCTA() {
  return (
    <section className="section-padding bg-black text-white text-center">
      <p className="label-text text-primary text-xs tracking-widest mb-4">
        READY TO NOURISH YOUR SOUL?
      </p>
      <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
        Start Your Wellness Journey
      </h2>
      <p className="font-body text-base text-white/60 max-w-lg mx-auto mb-8">
        Choose your plan, customize your preferences, and let Chef Kyla&apos;s kitchen
        take care of the rest. Made with intention. Seasoned with love.
      </p>
      <Button
        as="a"
        href="/meal-plans/order"
        variant="secondary"
        className="border-white text-white hover:bg-white hover:text-black"
      >
        START YOUR ORDER
      </Button>
    </section>
  );
}
