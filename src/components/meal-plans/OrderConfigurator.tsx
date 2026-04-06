"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MEAL_PLANS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ShoppingBag,
} from "lucide-react";

/* ============================================
   Types
   ============================================ */

interface OrderState {
  planTier: "performance-fuel" | "full-alignment" | "";
  subscriptionType: "subscription" | "one-time";
  dayCount: 3 | 5;
  deliverySchedule: "once-sunday" | "once-monday" | "twice-week";
  dietaryPreferences: string[];
  dietaryOther: string;
  addOns: string[];
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
}

/* ============================================
   Constants
   ============================================ */

const STEPS = [
  { number: 1, label: "Choose Plan" },
  { number: 2, label: "Subscription" },
  { number: 3, label: "Day Count" },
  { number: 4, label: "Delivery" },
  { number: 5, label: "Dietary" },
  { number: 6, label: "Add-ons" },
  { number: 7, label: "Review" },
];

const DIETARY_OPTIONS = [
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
  { id: "nut-free", label: "Nut-Free" },
  { id: "shellfish-free", label: "Shellfish-Free" },
];

const ADD_ONS: AddOn[] = [
  {
    id: "extra-juice",
    name: "Extra Cold-Pressed Juice Pack",
    description: "3 additional cold-pressed juices for the week",
    price: 24,
  },
  {
    id: "snack-pack",
    name: "Adaptogen Snack Pack",
    description: "5 functional energy bites with ashwagandha and maca",
    price: 18,
  },
  {
    id: "detox-bundle",
    name: "Weekend Detox Bundle",
    description: "2 detox juices + 1 turmeric elixir for the weekend",
    price: 22,
  },
  {
    id: "soul-seasoning",
    name: "Soul Seasoning Blend",
    description: "Chef Kyla's signature all-purpose seasoning",
    price: 18,
  },
];

const DEFAULT_ORDER_STATE: OrderState = {
  planTier: "",
  subscriptionType: "subscription",
  dayCount: 5,
  deliverySchedule: "once-sunday",
  dietaryPreferences: [],
  dietaryOther: "",
  addOns: [],
};

/* ============================================
   Helper Functions
   ============================================ */

function getBasePrice(order: OrderState): number {
  if (!order.planTier) return 0;
  const plan = MEAL_PLANS.find((p) => p.slug === order.planTier);
  if (!plan) return 0;

  if (order.dayCount === 3) {
    return order.subscriptionType === "subscription"
      ? plan.pricing.threeDaySubscription
      : plan.pricing.threeDayOneTime;
  }
  return order.subscriptionType === "subscription"
    ? plan.pricing.fiveDaySubscription
    : plan.pricing.fiveDayOneTime;
}

function getAddOnsTotal(selectedAddOns: string[]): number {
  return selectedAddOns.reduce((total, addOnId) => {
    const addOn = ADD_ONS.find((a) => a.id === addOnId);
    return total + (addOn?.price ?? 0);
  }, 0);
}

function formatPrice(price: number): string {
  return `$${price}`;
}

/* ============================================
   Progress Indicator Component
   ============================================ */

function ProgressIndicator({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="w-full mb-10">
      {/* Desktop Progress */}
      <div className="hidden md:flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1 last:flex-0">
            <button
              type="button"
              onClick={() => onStepClick(step.number)}
              className={cn(
                "flex items-center gap-2 group cursor-pointer",
                step.number <= currentStep
                  ? "opacity-100"
                  : "opacity-40 hover:opacity-60"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 flex items-center justify-center border text-sm font-sans font-medium transition-all duration-300",
                  step.number < currentStep
                    ? "bg-black text-white border-black"
                    : step.number === currentStep
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-black/50 border-border"
                )}
              >
                {step.number < currentStep ? (
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "label-text text-[10px] tracking-widest hidden lg:inline",
                  step.number === currentStep
                    ? "text-black"
                    : step.number < currentStep
                      ? "text-black/70"
                      : "text-black/40"
                )}
              >
                {step.label}
              </span>
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-3",
                  step.number < currentStep ? "bg-black" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile Progress */}
      <div className="md:hidden">
        <div className="flex justify-between items-center mb-3">
          <span className="label-text text-xs tracking-widest text-black/50">
            STEP {currentStep} OF {STEPS.length}
          </span>
          <span className="label-text text-xs tracking-widest text-primary">
            {STEPS[currentStep - 1].label}
          </span>
        </div>
        <div className="w-full h-1 bg-cream-darker">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================
   Step 1: Choose Plan Tier
   ============================================ */

function StepChoosePlan({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (tier: "performance-fuel" | "full-alignment") => void;
}) {
  return (
    <div>
      <div className="text-center mb-8">
        <p className="label-text text-primary text-xs tracking-widest mb-3">
          STEP 1
        </p>
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-2">
          Choose Your Plan
        </h2>
        <p className="font-body text-base text-black/60 max-w-lg mx-auto">
          Select the meal plan tier that best fits your wellness goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {MEAL_PLANS.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() =>
              onSelect(plan.slug as "performance-fuel" | "full-alignment")
            }
            className={cn(
              "text-left p-6 md:p-8 border-2 transition-all duration-300 cursor-pointer",
              selected === plan.slug
                ? "border-primary bg-cream"
                : "border-border hover:border-black/30 bg-white"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="label-text text-[10px] tracking-widest text-black/40 mb-1">
                  {plan.tier === "performance-fuel" ? "TIER 1" : "TIER 2"}
                </p>
                <h3 className="font-heading text-xl md:text-2xl">{plan.name}</h3>
              </div>
              <div
                className={cn(
                  "w-6 h-6 border-2 flex items-center justify-center transition-all duration-300",
                  selected === plan.slug
                    ? "border-primary bg-primary"
                    : "border-border"
                )}
              >
                {selected === plan.slug && (
                  <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                )}
              </div>
            </div>
            <p className="font-body text-sm text-black/60 leading-relaxed mb-4">
              {plan.description}
            </p>
            <ul className="space-y-2">
              {plan.includes.slice(0, 4).map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm font-body text-black/70"
                >
                  <Check
                    className="w-3.5 h-3.5 text-accent shrink-0"
                    strokeWidth={2.5}
                  />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="font-body text-sm text-black/50">
                Starting from{" "}
                <span className="text-black font-medium">
                  {formatPrice(plan.pricing.threeDaySubscription)}
                </span>
                /week
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   Step 2: Subscription Type
   ============================================ */

function StepSubscriptionType({
  selected,
  onSelect,
  order,
}: {
  selected: "subscription" | "one-time";
  onSelect: (type: "subscription" | "one-time") => void;
  order: OrderState;
}) {
  const plan = MEAL_PLANS.find((p) => p.slug === order.planTier);
  const subscriptionPrice = plan
    ? order.dayCount === 3
      ? plan.pricing.threeDaySubscription
      : plan.pricing.fiveDaySubscription
    : 0;
  const oneTimePrice = plan
    ? order.dayCount === 3
      ? plan.pricing.threeDayOneTime
      : plan.pricing.fiveDayOneTime
    : 0;

  return (
    <div>
      <div className="text-center mb-8">
        <p className="label-text text-primary text-xs tracking-widest mb-3">
          STEP 2
        </p>
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-2">
          Subscription Type
        </h2>
        <p className="font-body text-base text-black/60 max-w-lg mx-auto">
          Subscribe weekly and save, or try a single order.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Subscription Option */}
        <button
          type="button"
          onClick={() => onSelect("subscription")}
          className={cn(
            "text-left p-6 md:p-8 border-2 transition-all duration-300 cursor-pointer relative",
            selected === "subscription"
              ? "border-primary bg-cream"
              : "border-border hover:border-black/30 bg-white"
          )}
        >
          <Badge variant="accent" className="absolute top-4 right-4">
            SAVE 15%
          </Badge>
          <div className="flex items-start gap-3 mb-4">
            <div
              className={cn(
                "w-5 h-5 border-2 mt-0.5 flex items-center justify-center shrink-0 transition-all duration-300",
                selected === "subscription"
                  ? "border-primary bg-primary"
                  : "border-border"
              )}
            >
              {selected === "subscription" && (
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              )}
            </div>
            <div>
              <h3 className="font-heading text-lg md:text-xl mb-1">
                Weekly Subscription
              </h3>
              <p className="font-body text-sm text-black/60 leading-relaxed">
                Fresh meals delivered every week. Pause, skip, or cancel
                anytime. Changes by Thursday midnight apply to next week.
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl">
                {formatPrice(subscriptionPrice)}
              </span>
              <span className="font-body text-sm text-black/50">/ week</span>
            </div>
            <p className="font-body text-xs text-black/40 line-through">
              {formatPrice(oneTimePrice)} one-time price
            </p>
          </div>
        </button>

        {/* One-Time Option */}
        <button
          type="button"
          onClick={() => onSelect("one-time")}
          className={cn(
            "text-left p-6 md:p-8 border-2 transition-all duration-300 cursor-pointer",
            selected === "one-time"
              ? "border-primary bg-cream"
              : "border-border hover:border-black/30 bg-white"
          )}
        >
          <div className="flex items-start gap-3 mb-4">
            <div
              className={cn(
                "w-5 h-5 border-2 mt-0.5 flex items-center justify-center shrink-0 transition-all duration-300",
                selected === "one-time"
                  ? "border-primary bg-primary"
                  : "border-border"
              )}
            >
              {selected === "one-time" && (
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              )}
            </div>
            <div>
              <h3 className="font-heading text-lg md:text-xl mb-1">
                One-Time Order
              </h3>
              <p className="font-body text-sm text-black/60 leading-relaxed">
                Try Soul Good with a single delivery. No commitment — just
                chef-crafted nourishment for the week.
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl">
                {formatPrice(oneTimePrice)}
              </span>
              <span className="font-body text-sm text-black/50">/ order</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

/* ============================================
   Step 3: Day Count
   ============================================ */

function StepDayCount({
  selected,
  onSelect,
  order,
}: {
  selected: 3 | 5;
  onSelect: (days: 3 | 5) => void;
  order: OrderState;
}) {
  const plan = MEAL_PLANS.find((p) => p.slug === order.planTier);
  const isSubscription = order.subscriptionType === "subscription";

  const threeDayPrice = plan
    ? isSubscription
      ? plan.pricing.threeDaySubscription
      : plan.pricing.threeDayOneTime
    : 0;
  const fiveDayPrice = plan
    ? isSubscription
      ? plan.pricing.fiveDaySubscription
      : plan.pricing.fiveDayOneTime
    : 0;

  const isTier2 = order.planTier === "full-alignment";

  return (
    <div>
      <div className="text-center mb-8">
        <p className="label-text text-primary text-xs tracking-widest mb-3">
          STEP 3
        </p>
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-2">
          How Many Days?
        </h2>
        <p className="font-body text-base text-black/60 max-w-lg mx-auto">
          Choose between a 3-day or 5-day meal plan per week.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* 3-Day */}
        <button
          type="button"
          onClick={() => onSelect(3)}
          className={cn(
            "text-left p-6 md:p-8 border-2 transition-all duration-300 cursor-pointer",
            selected === 3
              ? "border-primary bg-cream"
              : "border-border hover:border-black/30 bg-white"
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-heading text-2xl md:text-3xl">3-Day Plan</h3>
            <div
              className={cn(
                "w-6 h-6 border-2 flex items-center justify-center transition-all duration-300",
                selected === 3 ? "border-primary bg-primary" : "border-border"
              )}
            >
              {selected === 3 && (
                <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
              )}
            </div>
          </div>
          <p className="font-body text-sm text-black/60 mb-4">
            {isTier2
              ? "6 meals + 3 juices + 3 snacks"
              : "6 meals + 3 juices"}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-2xl">
              {formatPrice(threeDayPrice)}
            </span>
            <span className="font-body text-sm text-black/50">
              / {isSubscription ? "week" : "order"}
            </span>
          </div>
        </button>

        {/* 5-Day */}
        <button
          type="button"
          onClick={() => onSelect(5)}
          className={cn(
            "text-left p-6 md:p-8 border-2 transition-all duration-300 cursor-pointer relative",
            selected === 5
              ? "border-primary bg-cream"
              : "border-border hover:border-black/30 bg-white"
          )}
        >
          <div className="absolute -top-3 left-6 bg-primary px-3 py-0.5">
            <span className="label-text text-[10px] text-white tracking-widest">
              BEST VALUE
            </span>
          </div>
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-heading text-2xl md:text-3xl">5-Day Plan</h3>
            <div
              className={cn(
                "w-6 h-6 border-2 flex items-center justify-center transition-all duration-300",
                selected === 5 ? "border-primary bg-primary" : "border-border"
              )}
            >
              {selected === 5 && (
                <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
              )}
            </div>
          </div>
          <p className="font-body text-sm text-black/60 mb-4">
            {isTier2
              ? "10 meals + 5 juices + 5 snacks"
              : "10 meals + 5 juices"}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-2xl">
              {formatPrice(fiveDayPrice)}
            </span>
            <span className="font-body text-sm text-black/50">
              / {isSubscription ? "week" : "order"}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

/* ============================================
   Step 4: Delivery Schedule
   ============================================ */

function StepDeliverySchedule({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (schedule: "once-sunday" | "once-monday" | "twice-week") => void;
}) {
  const options = [
    {
      id: "once-sunday" as const,
      title: "Sunday Evening",
      subtitle: "Once per week",
      description:
        "Receive all your meals Sunday evening between 5–7 PM. Ready for the week ahead.",
    },
    {
      id: "once-monday" as const,
      title: "Monday Morning",
      subtitle: "Once per week",
      description:
        "Receive all your meals early Monday morning between 6–8 AM. Fresh start to your week.",
    },
    {
      id: "twice-week" as const,
      title: "Twice per Week",
      subtitle: "Split delivery",
      description:
        "Receive half your meals Sunday evening and half Wednesday evening for maximum freshness.",
    },
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <p className="label-text text-primary text-xs tracking-widest mb-3">
          STEP 4
        </p>
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-2">
          Delivery Schedule
        </h2>
        <p className="font-body text-base text-black/60 max-w-lg mx-auto">
          Choose when you&apos;d like your meals delivered. Available throughout
          Greater Los Angeles.
        </p>
      </div>

      <div className="space-y-4 max-w-xl mx-auto">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={cn(
              "w-full text-left p-5 md:p-6 border-2 transition-all duration-300 cursor-pointer flex items-start gap-4",
              selected === option.id
                ? "border-primary bg-cream"
                : "border-border hover:border-black/30 bg-white"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 border-2 mt-0.5 flex items-center justify-center shrink-0 transition-all duration-300",
                selected === option.id
                  ? "border-primary bg-primary"
                  : "border-border"
              )}
            >
              {selected === option.id && (
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-heading text-lg">{option.title}</h3>
                <span className="label-text text-[10px] tracking-widest text-black/40">
                  {option.subtitle.toUpperCase()}
                </span>
              </div>
              <p className="font-body text-sm text-black/60">
                {option.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   Step 5: Dietary Preferences
   ============================================ */

function StepDietaryPreferences({
  selected,
  otherText,
  onToggle,
  onOtherChange,
}: {
  selected: string[];
  otherText: string;
  onToggle: (id: string) => void;
  onOtherChange: (text: string) => void;
}) {
  const hasOther = selected.includes("other");

  return (
    <div>
      <div className="text-center mb-8">
        <p className="label-text text-primary text-xs tracking-widest mb-3">
          STEP 5
        </p>
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-2">
          Dietary Preferences
        </h2>
        <p className="font-body text-base text-black/60 max-w-lg mx-auto">
          Let us know about any dietary needs. Select all that apply, or skip if
          none.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="space-y-3">
          {DIETARY_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onToggle(option.id)}
              className={cn(
                "w-full text-left p-4 md:p-5 border-2 transition-all duration-300 cursor-pointer flex items-center gap-4",
                selected.includes(option.id)
                  ? "border-primary bg-cream"
                  : "border-border hover:border-black/30 bg-white"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-all duration-300",
                  selected.includes(option.id)
                    ? "border-primary bg-primary"
                    : "border-border"
                )}
              >
                {selected.includes(option.id) && (
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                )}
              </div>
              <span className="font-body text-base">{option.label}</span>
            </button>
          ))}

          {/* Other */}
          <button
            type="button"
            onClick={() => onToggle("other")}
            className={cn(
              "w-full text-left p-4 md:p-5 border-2 transition-all duration-300 cursor-pointer flex items-center gap-4",
              hasOther
                ? "border-primary bg-cream"
                : "border-border hover:border-black/30 bg-white"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-all duration-300",
                hasOther ? "border-primary bg-primary" : "border-border"
              )}
            >
              {hasOther && (
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              )}
            </div>
            <span className="font-body text-base">Other</span>
          </button>

          {hasOther && (
            <div className="pl-9 pt-1">
              <input
                type="text"
                value={otherText}
                onChange={(e) => onOtherChange(e.target.value)}
                placeholder="Please specify your dietary needs..."
                className="w-full bg-transparent border-0 border-b border-border px-0 py-3 font-body text-base text-black placeholder:text-black/40 focus:border-black focus:outline-none transition-colors duration-300"
              />
            </div>
          )}
        </div>

        <p className="font-body text-xs text-black/40 mt-6 text-center">
          Our kitchen handles common allergens. While we take precautions, we
          cannot guarantee a completely allergen-free environment.
        </p>
      </div>
    </div>
  );
}

/* ============================================
   Step 6: Add-ons
   ============================================ */

function StepAddOns({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <div className="text-center mb-8">
        <p className="label-text text-primary text-xs tracking-widest mb-3">
          STEP 6
        </p>
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-2">
          Add-ons
        </h2>
        <p className="font-body text-base text-black/60 max-w-lg mx-auto">
          Enhance your plan with optional extras. These are one-time additions
          to your order.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {ADD_ONS.map((addOn) => (
          <button
            key={addOn.id}
            type="button"
            onClick={() => onToggle(addOn.id)}
            className={cn(
              "text-left p-5 md:p-6 border-2 transition-all duration-300 cursor-pointer",
              selected.includes(addOn.id)
                ? "border-primary bg-cream"
                : "border-border hover:border-black/30 bg-white"
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="label-text text-xs tracking-widest">
                {addOn.name.toUpperCase()}
              </h3>
              <div
                className={cn(
                  "w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-all duration-300",
                  selected.includes(addOn.id)
                    ? "border-primary bg-primary"
                    : "border-border"
                )}
              >
                {selected.includes(addOn.id) && (
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                )}
              </div>
            </div>
            <p className="font-body text-sm text-black/60 mb-3">
              {addOn.description}
            </p>
            <p className="font-heading text-lg">+{formatPrice(addOn.price)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   Step 7: Review & Confirm
   ============================================ */

function StepReview({
  order,
  onPlaceOrder,
}: {
  order: OrderState;
  onPlaceOrder: () => void;
}) {
  const plan = MEAL_PLANS.find((p) => p.slug === order.planTier);
  const basePrice = getBasePrice(order);
  const addOnsTotal = getAddOnsTotal(order.addOns);
  const total = basePrice + addOnsTotal;

  const deliveryLabel =
    order.deliverySchedule === "once-sunday"
      ? "Sunday Evening (5–7 PM)"
      : order.deliverySchedule === "once-monday"
        ? "Monday Morning (6–8 AM)"
        : "Twice per Week (Sun + Wed)";

  const dietaryLabels = order.dietaryPreferences
    .map((id) => {
      if (id === "other") return order.dietaryOther || "Other";
      return DIETARY_OPTIONS.find((o) => o.id === id)?.label ?? id;
    })
    .filter(Boolean);

  const selectedAddOns = ADD_ONS.filter((a) => order.addOns.includes(a.id));

  return (
    <div>
      <div className="text-center mb-8">
        <p className="label-text text-primary text-xs tracking-widest mb-3">
          STEP 7
        </p>
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-2">
          Review Your Order
        </h2>
        <p className="font-body text-base text-black/60 max-w-lg mx-auto">
          Confirm your selections before placing your order.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Order Summary */}
        <div className="border border-border divide-y divide-border">
          {/* Plan Tier */}
          <div className="p-5 md:p-6 flex justify-between items-start">
            <div>
              <p className="label-text text-[10px] tracking-widest text-black/40 mb-1">
                PLAN
              </p>
              <p className="font-heading text-lg">{plan?.name}</p>
            </div>
          </div>

          {/* Subscription Type */}
          <div className="p-5 md:p-6 flex justify-between items-start">
            <div>
              <p className="label-text text-[10px] tracking-widest text-black/40 mb-1">
                TYPE
              </p>
              <p className="font-body text-base">
                {order.subscriptionType === "subscription"
                  ? "Weekly Subscription"
                  : "One-Time Order"}
              </p>
            </div>
            {order.subscriptionType === "subscription" && (
              <Badge variant="accent">SAVE 15%</Badge>
            )}
          </div>

          {/* Day Count */}
          <div className="p-5 md:p-6 flex justify-between items-start">
            <div>
              <p className="label-text text-[10px] tracking-widest text-black/40 mb-1">
                DAYS PER WEEK
              </p>
              <p className="font-body text-base">{order.dayCount}-Day Plan</p>
            </div>
            <p className="font-heading text-lg">{formatPrice(basePrice)}</p>
          </div>

          {/* Delivery Schedule */}
          <div className="p-5 md:p-6">
            <p className="label-text text-[10px] tracking-widest text-black/40 mb-1">
              DELIVERY
            </p>
            <p className="font-body text-base">{deliveryLabel}</p>
          </div>

          {/* Dietary Preferences */}
          <div className="p-5 md:p-6">
            <p className="label-text text-[10px] tracking-widest text-black/40 mb-1">
              DIETARY PREFERENCES
            </p>
            <p className="font-body text-base">
              {dietaryLabels.length > 0 ? dietaryLabels.join(", ") : "None"}
            </p>
          </div>

          {/* Add-ons */}
          {selectedAddOns.length > 0 && (
            <div className="p-5 md:p-6">
              <p className="label-text text-[10px] tracking-widest text-black/40 mb-2">
                ADD-ONS
              </p>
              <div className="space-y-2">
                {selectedAddOns.map((addOn) => (
                  <div
                    key={addOn.id}
                    className="flex justify-between items-center"
                  >
                    <p className="font-body text-sm">{addOn.name}</p>
                    <p className="font-body text-sm">
                      +{formatPrice(addOn.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="border-2 border-black p-5 md:p-6 mt-4">
          <div className="flex justify-between items-center mb-1">
            <p className="label-text text-sm tracking-widest">ORDER TOTAL</p>
            <p className="font-heading text-2xl md:text-3xl">
              {formatPrice(total)}
            </p>
          </div>
          <p className="font-body text-xs text-black/40 text-right">
            {order.subscriptionType === "subscription"
              ? "per week, billed weekly"
              : "one-time charge"}
          </p>
        </div>

        {/* Place Order Button */}
        <div className="mt-8">
          <Button
            onClick={onPlaceOrder}
            size="lg"
            className="w-full flex items-center justify-center gap-3"
          >
            <ShoppingBag className="w-5 h-5" />
            PLACE ORDER
          </Button>
          <p className="font-body text-xs text-black/40 text-center mt-3">
            {/* TODO: Backend Integration - Submit order data to API endpoint */}
            By placing your order, you agree to our Terms & Conditions. Your
            order data will be submitted for processing.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   Main OrderConfigurator (Inner Component)
   ============================================ */

function getInitialOrderState(
  searchParams: ReturnType<typeof useSearchParams>
): OrderState {
  const initial = { ...DEFAULT_ORDER_STATE };

  const planParam = searchParams.get("plan");
  const daysParam = searchParams.get("days");
  const typeParam = searchParams.get("type");

  if (planParam) {
    const validPlans = MEAL_PLANS.map((p) => p.slug);
    if (validPlans.includes(planParam)) {
      initial.planTier = planParam as "performance-fuel" | "full-alignment";
    }
  }

  if (daysParam === "3" || daysParam === "5") {
    initial.dayCount = parseInt(daysParam) as 3 | 5;
  }

  if (typeParam === "subscription" || typeParam === "one-time") {
    initial.subscriptionType = typeParam;
  }

  return initial;
}

function OrderConfiguratorInner() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [order, setOrder] = useState<OrderState>(() =>
    getInitialOrderState(searchParams)
  );
  const [orderPlaced, setOrderPlaced] = useState(false);

  const canProceed = useCallback((): boolean => {
    switch (currentStep) {
      case 1:
        return order.planTier !== "";
      default:
        return true;
    }
  }, [currentStep, order.planTier]);

  const handleNext = () => {
    if (currentStep < 7 && canProceed()) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = (step: number) => {
    // Only allow clicking to completed steps or the next step
    if (step <= currentStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleToggleDietary = (id: string) => {
    setOrder((prev) => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(id)
        ? prev.dietaryPreferences.filter((d) => d !== id)
        : [...prev.dietaryPreferences, id],
    }));
  };

  const handleToggleAddOn = (id: string) => {
    setOrder((prev) => ({
      ...prev,
      addOns: prev.addOns.includes(id)
        ? prev.addOns.filter((a) => a !== id)
        : [...prev.addOns, id],
    }));
  };

  const handlePlaceOrder = () => {
    const plan = MEAL_PLANS.find((p) => p.slug === order.planTier);
    const basePrice = getBasePrice(order);
    const addOnsTotal = getAddOnsTotal(order.addOns);

    const orderData = {
      plan: plan?.name,
      planTier: order.planTier,
      subscriptionType: order.subscriptionType,
      dayCount: order.dayCount,
      deliverySchedule: order.deliverySchedule,
      dietaryPreferences: order.dietaryPreferences,
      dietaryOther: order.dietaryOther,
      addOns: order.addOns.map((id) => {
        const addOn = ADD_ONS.find((a) => a.id === id);
        return { id, name: addOn?.name, price: addOn?.price };
      }),
      pricing: {
        basePrice,
        addOnsTotal,
        total: basePrice + addOnsTotal,
      },
      timestamp: new Date().toISOString(),
    };

    // TODO: Backend Integration - Submit order data to API endpoint
    console.log("Order placed:", orderData);
    setOrderPlaced(true);
  };

  // Price display for navigation bar
  const currentPrice = getBasePrice(order) + getAddOnsTotal(order.addOns);

  // Order Placed Confirmation
  if (orderPlaced) {
    return (
      <div className="section-padding">
        <div className="max-container">
          <div className="max-w-xl mx-auto text-center py-16">
            <div className="w-16 h-16 bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-accent" strokeWidth={2} />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl mb-4">
              Order Confirmed!
            </h1>
            <p className="font-body text-base text-black/60 mb-8">
              Thank you for your Soul Good order. Your chef-crafted meals will
              be prepared with intention and delivered with love. Check your
              email for order details and tracking information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button as="a" href="/meal-plans">
                EXPLORE MORE PLANS
              </Button>
              <Button as="a" href="/" variant="secondary">
                RETURN HOME
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <section className="bg-cream-dark py-8 md:py-12">
        <div className="max-container px-6 md:px-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="label-text text-primary text-xs tracking-widest mb-2">
                MEAL PLAN CONFIGURATOR
              </p>
              <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl">
                Build Your Plan
              </h1>
            </div>
            {order.planTier && (
              <div className="text-left md:text-right">
                <p className="label-text text-[10px] tracking-widest text-black/40 mb-1">
                  CURRENT TOTAL
                </p>
                <p className="font-heading text-2xl md:text-3xl">
                  {formatPrice(currentPrice)}
                </p>
                <p className="font-body text-xs text-black/40">
                  {order.subscriptionType === "subscription"
                    ? "per week"
                    : "one-time"}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Configurator Content */}
      <section className="section-padding">
        <div className="max-container">
          <ProgressIndicator
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />

          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 1 && (
              <StepChoosePlan
                selected={order.planTier}
                onSelect={(tier) =>
                  setOrder((prev) => ({ ...prev, planTier: tier }))
                }
              />
            )}
            {currentStep === 2 && (
              <StepSubscriptionType
                selected={order.subscriptionType}
                onSelect={(type) =>
                  setOrder((prev) => ({ ...prev, subscriptionType: type }))
                }
                order={order}
              />
            )}
            {currentStep === 3 && (
              <StepDayCount
                selected={order.dayCount}
                onSelect={(days) =>
                  setOrder((prev) => ({ ...prev, dayCount: days }))
                }
                order={order}
              />
            )}
            {currentStep === 4 && (
              <StepDeliverySchedule
                selected={order.deliverySchedule}
                onSelect={(schedule) =>
                  setOrder((prev) => ({
                    ...prev,
                    deliverySchedule: schedule,
                  }))
                }
              />
            )}
            {currentStep === 5 && (
              <StepDietaryPreferences
                selected={order.dietaryPreferences}
                otherText={order.dietaryOther}
                onToggle={handleToggleDietary}
                onOtherChange={(text) =>
                  setOrder((prev) => ({ ...prev, dietaryOther: text }))
                }
              />
            )}
            {currentStep === 6 && (
              <StepAddOns
                selected={order.addOns}
                onToggle={handleToggleAddOn}
              />
            )}
            {currentStep === 7 && (
              <StepReview order={order} onPlaceOrder={handlePlaceOrder} />
            )}
          </div>

          {/* Navigation Buttons */}
          {currentStep < 7 && (
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-border max-w-3xl mx-auto">
              {currentStep > 1 ? (
                <Button
                  variant="secondary"
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  BACK
                </Button>
              ) : (
                <div />
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                NEXT
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {currentStep === 7 && (
            <div className="flex justify-start mt-8 max-w-2xl mx-auto">
              <Button
                variant="secondary"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                BACK
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ============================================
   OrderConfigurator Wrapper with Suspense
   ============================================ */

export function OrderConfigurator() {
  return (
    <Suspense
      fallback={
        <div className="section-padding">
          <div className="max-container text-center py-16">
            <p className="label-text text-xs tracking-widest text-black/40">
              LOADING CONFIGURATOR...
            </p>
          </div>
        </div>
      }
    >
      <OrderConfiguratorInner />
    </Suspense>
  );
}
