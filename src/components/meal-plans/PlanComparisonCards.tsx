import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { MEAL_PLANS } from "@/lib/constants";
import { Check } from "lucide-react";

export function PlanComparisonCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {MEAL_PLANS.map((plan) => (
        <div
          key={plan.id}
          className="border border-border bg-white flex flex-col"
        >
          {/* Plan Image */}
          <div className="relative w-full h-56 md:h-64 lg:h-72 bg-gray-light">
            <Image
              src={plan.image}
              alt={`${plan.name} meal plan — ${plan.tagline}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-placeholder="true"
            />
          </div>

          {/* Plan Content */}
          <div className="flex flex-col flex-1 p-6 md:p-8">
            {/* Plan name and tagline */}
            <p className="label-text text-primary text-xs tracking-widest mb-2">
              {plan.tier === "performance-fuel" ? "TIER 1" : "TIER 2"}
            </p>
            <h3 className="font-heading text-2xl md:text-3xl mb-2">
              {plan.name}
            </h3>
            <p className="font-body text-sm text-black/50 italic mb-4">
              {plan.tagline}
            </p>
            <p className="font-body text-sm md:text-base text-black/70 mb-6 leading-relaxed">
              {plan.description}
            </p>

            {/* What's Included */}
            <div className="mb-6">
              <p className="label-text text-xs tracking-widest mb-3">
                WHAT&apos;S INCLUDED
              </p>
              <ul className="space-y-2.5">
                {plan.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-body text-sm text-black/80"
                  >
                    <Check
                      className="w-4 h-4 text-accent shrink-0 mt-0.5"
                      strokeWidth={2.5}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing */}
            <div className="mt-auto">
              <div className="border-t border-border pt-6 mb-6">
                <p className="label-text text-xs tracking-widest text-black/50 mb-1">
                  STARTING FROM
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl">
                    ${plan.pricing.threeDaySubscription}
                  </span>
                  <span className="font-body text-sm text-black/50">
                    / 3-day plan
                  </span>
                </div>
                <p className="font-body text-xs text-black/40 mt-1">
                  ${plan.pricing.fiveDaySubscription} / 5-day plan with subscription
                </p>
              </div>

              {/* CTA Button */}
              <Button
                as="a"
                href={`/meal-plans/${plan.slug}`}
                className="w-full text-center"
              >
                EXPLORE PLAN
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
