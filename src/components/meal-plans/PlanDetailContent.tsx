"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { Rating } from "@/components/ui/Rating";
import type { MealPlan } from "@/lib/types";
import type { AccordionItemData } from "@/components/ui/Accordion";

interface PlanDetailContentProps {
  plan: MealPlan;
}

export function PlanDetailContent({ plan }: PlanDetailContentProps) {
  const [pricingView, setPricingView] = useState<"subscription" | "one-time">(
    "subscription"
  );

  const faqItems: AccordionItemData[] = plan.faqs.map((faq) => ({
    id: faq.id,
    title: faq.question,
    content: faq.answer,
  }));

  const averageRating =
    plan.reviews.length > 0
      ? plan.reviews.reduce((sum, r) => sum + r.rating, 0) / plan.reviews.length
      : 0;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] lg:h-[60vh] lg:min-h-[500px]">
        <Image
          src={plan.heroImage}
          alt={`${plan.name} — ${plan.tagline}`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
          data-placeholder="true"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="label-text text-xs tracking-widest text-white/80 mb-4">
            {plan.tier === "performance-fuel" ? "TIER 1" : "TIER 2"} MEAL PLAN
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-3">
            {plan.name}
          </h1>
          <p className="font-body text-lg md:text-xl text-white/80 italic max-w-xl">
            {plan.tagline}
          </p>
        </div>
      </section>

      {/* Description Section */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <p className="label-text text-primary text-xs tracking-widest mb-4">
            ABOUT THIS PLAN
          </p>
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-6">
            Nourishment by Design
          </h2>
          <p className="font-body text-base md:text-lg text-black/70 leading-relaxed">
            {plan.longDescription}
          </p>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="section-padding bg-cream">
        <div className="max-container">
          <div className="text-center mb-12">
            <p className="label-text text-primary text-xs tracking-widest mb-4">
              WHAT&apos;S INCLUDED
            </p>
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-4">
              Everything in Your {plan.name} Plan
            </h2>
            <p className="font-body text-base text-black/60 max-w-2xl mx-auto">
              Each delivery is thoughtfully prepared by Chef Kyla and her team to
              fuel your body with intention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {plan.whatsIncludedDetailed.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 md:p-8 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent/10 flex items-center justify-center shrink-0">
                    <Check
                      className="w-4 h-4 text-accent"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <h3 className="label-text text-sm tracking-widest mb-2">
                      {item.title.toUpperCase()}
                    </h3>
                    <p className="font-body text-sm text-black/70 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="label-text text-primary text-xs tracking-widest mb-4">
              PRICING
            </p>
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-4">
              Choose Your Plan
            </h2>
            <p className="font-body text-base text-black/60 max-w-xl mx-auto">
              Flexible options to fit your lifestyle. Subscribe and save 15% on
              every delivery.
            </p>
          </div>

          {/* Subscription / One-Time Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex border border-border">
              <button
                type="button"
                onClick={() => setPricingView("subscription")}
                className={`label-text text-xs px-6 py-3 transition-all duration-300 ${
                  pricingView === "subscription"
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-cream"
                }`}
              >
                SUBSCRIPTION
                <span className="ml-2 text-primary font-semibold">
                  SAVE 15%
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPricingView("one-time")}
                className={`label-text text-xs px-6 py-3 transition-all duration-300 ${
                  pricingView === "one-time"
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-cream"
                }`}
              >
                ONE-TIME
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 3-Day Plan */}
            <div className="border border-border p-6 md:p-8 text-center">
              <p className="label-text text-xs tracking-widest text-black/50 mb-2">
                3-DAY PLAN
              </p>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="font-heading text-4xl md:text-5xl">
                  $
                  {pricingView === "subscription"
                    ? plan.pricing.threeDaySubscription
                    : plan.pricing.threeDayOneTime}
                </span>
                <span className="font-body text-sm text-black/50">/ week</span>
              </div>
              {pricingView === "subscription" && (
                <p className="font-body text-xs text-black/40 line-through mb-4">
                  ${plan.pricing.threeDayOneTime} one-time
                </p>
              )}
              {pricingView === "one-time" && <div className="mb-4" />}
              <p className="font-body text-sm text-black/60 mb-6">
                {plan.tier === "performance-fuel"
                  ? "6 meals + 3 juices"
                  : "6 meals + 3 juices + 3 snacks"}
              </p>
              <Button
                as="a"
                href={`/meal-plans/order?plan=${plan.slug}&days=3&type=${pricingView}`}
                className="w-full text-center"
              >
                START YOUR PLAN
              </Button>
            </div>

            {/* 5-Day Plan */}
            <div className="border-2 border-black p-6 md:p-8 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1">
                <span className="label-text text-[10px] text-white tracking-widest">
                  BEST VALUE
                </span>
              </div>
              <p className="label-text text-xs tracking-widest text-black/50 mb-2">
                5-DAY PLAN
              </p>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="font-heading text-4xl md:text-5xl">
                  $
                  {pricingView === "subscription"
                    ? plan.pricing.fiveDaySubscription
                    : plan.pricing.fiveDayOneTime}
                </span>
                <span className="font-body text-sm text-black/50">/ week</span>
              </div>
              {pricingView === "subscription" && (
                <p className="font-body text-xs text-black/40 line-through mb-4">
                  ${plan.pricing.fiveDayOneTime} one-time
                </p>
              )}
              {pricingView === "one-time" && <div className="mb-4" />}
              <p className="font-body text-sm text-black/60 mb-6">
                {plan.tier === "performance-fuel"
                  ? "10 meals + 5 juices"
                  : "10 meals + 5 juices + 5 snacks"}
              </p>
              <Button
                as="a"
                href={`/meal-plans/order?plan=${plan.slug}&days=5&type=${pricingView}`}
                className="w-full text-center"
              >
                START YOUR PLAN
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-cream-dark section-padding">
        <div className="max-container text-center">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-4">
            Ready to Nourish Your Soul?
          </h2>
          <p className="font-body text-base md:text-lg text-black/60 max-w-xl mx-auto mb-8">
            Start your {plan.name} journey today. Chef-crafted, nutrient-dense
            meals delivered to your door in Los Angeles.
          </p>
          <Button
            as="a"
            href={`/meal-plans/order?plan=${plan.slug}`}
            size="lg"
          >
            START YOUR PLAN
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="label-text text-primary text-xs tracking-widest mb-4">
              FREQUENTLY ASKED QUESTIONS
            </p>
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl">
              Questions About {plan.name}
            </h2>
          </div>
          <Accordion items={faqItems} />
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="section-padding bg-cream">
        <div className="max-container">
          <div className="text-center mb-10">
            <p className="label-text text-primary text-xs tracking-widest mb-4">
              WHAT PEOPLE ARE SAYING
            </p>
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-3">
              Customer Reviews
            </h2>
            {plan.reviews.length > 0 && (
              <div className="flex items-center justify-center gap-3">
                <Rating value={averageRating} size="md" />
                <span className="font-body text-sm text-black/60">
                  {averageRating.toFixed(1)} out of 5 ({plan.reviews.length}{" "}
                  {plan.reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plan.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 md:p-8 border border-border"
              >
                <Rating value={review.rating} size="sm" className="mb-4" />
                <p className="font-body text-sm text-black/70 leading-relaxed italic mb-6">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="label-text text-xs tracking-widest text-black/50">
                  {review.name.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
