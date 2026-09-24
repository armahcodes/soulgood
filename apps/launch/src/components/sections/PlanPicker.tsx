"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/kit/segmented-control";
import {
  FULFILLMENT,
  NOURISHMENT,
  PLAN,
  PRICING,
  PURCHASE_OPTIONS,
  formatCents,
  type FulfillmentMethod,
  type PurchaseType,
} from "@/lib/brand";

const PURCHASE_CHOICES = [
  { value: "one-time", label: "Once" },
  { value: "weekly", label: "Weekly" },
] as const satisfies readonly { value: PurchaseType; label: string }[];

const FULFILLMENT_CHOICES = [
  { value: "pickup", label: "Pickup" },
  { value: "delivery", label: "Delivery" },
] as const satisfies readonly { value: FulfillmentMethod; label: string }[];

const INCLUDED = [
  `${PLAN.bowlsPerWeek} chef-made 32 oz bowls, chosen by you`,
  "Prep and eat-by dates on every jar",
  NOURISHMENT.deliveryDisclosure,
];

/**
 * Pricing card (21st.dev felipemenezes098/card-09 pattern) driven by two
 * segmented controls (21st.dev ddoemonn/segmented-control). Weekly plans are
 * delivery-only, so choosing weekly moves the fulfillment choice to delivery.
 */
export function PlanPicker() {
  const [purchase, setPurchase] = useState<PurchaseType>("one-time");
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>("pickup");

  const choosePurchase = (next: PurchaseType) => {
    setPurchase(next);
    if (next === "weekly") setFulfillment("delivery");
  };

  const fulfillmentCents = FULFILLMENT[fulfillment].amountCents;
  const subtotalCents = PRICING.oneTimeCents + fulfillmentCents;

  return (
    <div className="grid overflow-hidden rounded-lg border border-forest/12 bg-card shadow-[0_30px_60px_-40px_rgb(44_58_52/0.45)] lg:grid-cols-[1.05fr_0.95fr]">
      <div className="flex flex-col gap-8 p-6 sm:p-10">
        <div>
          <p className="text-[0.68rem] font-bold tracking-[0.22em] text-clay uppercase">Make it yours</p>
          <h2 className="mt-3 text-5xl leading-none font-normal tracking-[-0.045em] text-forest sm:text-6xl">
            Five bowls. $88.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-forest/70">
            Begin with one of each available recipe, then make the selection your own.
            Larger orders scale for the people at your table.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <fieldset className="grid gap-2">
            <legend className="mb-2 text-[0.65rem] font-bold tracking-[0.18em] text-forest/60 uppercase">How often</legend>
            <SegmentedControl label="How often" options={PURCHASE_CHOICES} value={purchase} onValueChange={choosePurchase} className="w-full" />
          </fieldset>
          <fieldset className="grid gap-2">
            <legend className="mb-2 text-[0.65rem] font-bold tracking-[0.18em] text-forest/60 uppercase">Sunday service</legend>
            {purchase === "weekly" ? (
              <p className="flex min-h-[3.25rem] items-center rounded-lg border border-dashed border-forest/20 px-4 text-xs leading-5 text-forest/70">
                Weekly plans are delivered by our team.
              </p>
            ) : (
              <SegmentedControl label="Sunday service" options={FULFILLMENT_CHOICES} value={fulfillment} onValueChange={setFulfillment} className="w-full" />
            )}
          </fieldset>
        </div>

        <ul className="grid gap-3 text-sm leading-6 text-forest/78">
          {INCLUDED.map((item) => (
            <li key={item} className="flex gap-3">
              <Check className="mt-1 size-4 shrink-0 text-sage" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col justify-between gap-8 bg-forest p-6 text-oat sm:p-10">
        <dl className="grid gap-4 text-sm" aria-live="polite">
          <div className="flex items-baseline justify-between gap-6">
            <dt className="text-oat/70">{PURCHASE_OPTIONS[purchase].label}</dt>
            <dd className="font-serif text-2xl">{PRICING.oneTime}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-t border-oat/12 pt-4">
            <dt className="text-oat/70">{FULFILLMENT[fulfillment].label}</dt>
            <dd className="font-serif text-2xl">{fulfillmentCents === 0 ? "Free" : formatCents(fulfillmentCents)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-t border-oat/25 pt-4">
            <dt className="font-bold">
              {purchase === "weekly" ? "Each week, before tax" : "Before tax"}
            </dt>
            <dd className="font-serif text-4xl tracking-[-0.03em]">{formatCents(subtotalCents)}</dd>
          </div>
        </dl>

        <div className="grid gap-4">
          <p className="text-xs leading-5 text-oat/70">
            {PURCHASE_OPTIONS[purchase].disclosure} {FULFILLMENT[fulfillment].disclosure} Applicable tax is shown before payment.
          </p>
          <Button
            as="a"
            href={`/checkout?fulfillment=${fulfillment}`}
            size="lg"
            className="w-full bg-oat text-forest hover:bg-sand"
          >
            Continue with {fulfillment}
          </Button>
        </div>
      </div>
    </div>
  );
}
