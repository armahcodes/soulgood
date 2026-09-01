"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ReorderButton } from "@/components/checkout/ReorderButton";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { FEES, formatCents, PLAN } from "@/lib/brand";
import {
  LAST_ORDER_STORAGE_KEY,
  parseLastOrderConfirmation,
  type LastOrderConfirmation,
} from "@/lib/checkout-session";
import { CURRENT_BOWLS } from "@/lib/current-offer";

export function OrderConfirmation() {
  const [confirmation, setConfirmation] =
    useState<LastOrderConfirmation | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setConfirmation(
        parseLastOrderConfirmation(
          window.sessionStorage.getItem(LAST_ORDER_STORAGE_KEY),
        ),
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (confirmation === undefined) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center" role="status">
        <p className="text-sm text-forest/58">Loading your order confirmation…</p>
      </div>
    );
  }

  if (!confirmation) {
    return (
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
        <div className="mb-8 flex h-20 w-20 items-center justify-center bg-forest">
          <Logo size={46} title="" variant="cream" />
        </div>
        <p className="mb-5 text-xs font-bold tracking-[0.18em] text-clay uppercase">
          Confirmation unavailable
        </p>
        <h1 className="max-w-[12ch] text-5xl leading-[0.94] font-normal tracking-[-0.05em] text-forest sm:text-7xl">
          Let&rsquo;s find your order.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-forest/68">
          This tab does not have a completed checkout to display. If you already
          paid, sign in with the email used at checkout to see the order and its
          Square receipt. You can also check your confirmation email.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button as="a" href="/account">View my orders</Button>
          <Button as="a" href="/checkout" variant="secondary">
            Start a new order
          </Button>
        </div>
      </section>
    );
  }

  const weekly = confirmation.purchaseType === "weekly";
  const selectedBowls = CURRENT_BOWLS.filter(
    (bowl) => confirmation.bowlSelection[bowl.id] > 0,
  );
  const orderReference = (
    confirmation.squareOrderId || confirmation.squareObjectId
  )
    .slice(-8)
    .toUpperCase();

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-5 py-12 text-center sm:px-8 sm:py-16">
      <div className="mb-7 flex h-20 w-20 items-center justify-center bg-forest">
        <Logo size={46} title="" variant="cream" />
      </div>
      <p className="mb-5 text-xs font-bold tracking-[0.18em] text-clay uppercase">
        {weekly ? "Weekly plan active" : "Order confirmed"}
      </p>
      <h1 className="max-w-[12ch] text-5xl leading-[0.94] font-normal tracking-[-0.05em] text-forest sm:text-7xl">
        Your bowls are confirmed.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-forest/68">
        Thanks for ordering Soul Bowls™. We&rsquo;ll text you to confirm your
        first Sunday window. A confirmation email is on its way to the address
        used at checkout.
      </p>

      <section className="mt-10 w-full border border-sage/30 bg-white/50 p-6 text-left sm:p-8">
        <div className="flex flex-col justify-between gap-5 border-b border-forest/10 pb-6 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-clay uppercase">
              {weekly ? "Weekly plan" : "One-time order"}
            </p>
            <p className="mt-2 font-serif text-3xl text-forest">
              {confirmation.peopleCount}{" "}
              {confirmation.peopleCount === 1 ? "person" : "people"}
              {" · "}
              {confirmation.mealsPerDay}{" "}
              {confirmation.mealsPerDay === 1 ? "meal" : "meals"}/day
            </p>
            <p className="mt-2 text-xs text-forest/50">Order {orderReference}</p>
          </div>
          <div className="sm:text-right">
            <span className="inline-flex bg-sage/14 px-3 py-2 text-xs font-bold tracking-[0.1em] text-forest uppercase">
              {confirmation.status}
            </span>
            <p className="mt-3 font-serif text-3xl text-forest">
              {formatCents(confirmation.totalCents)}
            </p>
          </div>
        </div>

        <div className="grid gap-7 pt-6 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.12em] text-forest/55 uppercase">
              Confirmed bowl mix
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {selectedBowls.map((bowl) => (
                <li
                  key={bowl.id}
                  className="flex justify-between gap-3 border-b border-forest/8 pb-2 text-sm text-forest/68"
                >
                  <span>{bowl.name}</span>
                  <strong className="text-forest">
                    × {confirmation.bowlSelection[bowl.id]}
                  </strong>
                </li>
              ))}
            </ul>
          </div>

          <dl className="grid content-start gap-3 text-sm text-forest/62">
            <div className="flex justify-between gap-4">
              <dt>Fulfillment</dt>
              <dd className="font-semibold text-forest">
                {confirmation.fulfillmentMethod === "delivery"
                  ? "LA County delivery"
                  : "Pickup"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Subtotal</dt>
              <dd>{formatCents(confirmation.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>California sales tax</dt>
              <dd>{formatCents(confirmation.taxCents)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-forest/10 pt-3 font-semibold text-forest">
              <dt>{weekly ? "Weekly charge" : "Total charged"}</dt>
              <dd>{formatCents(confirmation.totalCents)}</dd>
            </div>
            {confirmation.receiptUrl ? (
              <div className="pt-2 text-right">
                <a
                  href={confirmation.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-clay underline underline-offset-4"
                >
                  View Square receipt
                </a>
              </div>
            ) : null}
          </dl>
        </div>
      </section>

      <ol className="mt-6 grid w-full gap-3 text-left sm:grid-cols-3">
        {[
          "Keep the confirmation email and receipt for your records.",
          "We text you to confirm your Sunday pickup or delivery window.",
          `Your fresh 32 oz jarred bowls are prepared for ${PLAN.deliveryDay}.`,
        ].map((step, index) => (
          <li key={step} className="border border-forest/12 bg-white/35 p-5">
            <span className="mb-5 flex h-7 w-7 items-center justify-center bg-gold text-xs font-bold text-forest">
              {index + 1}
            </span>
            <p className="text-sm leading-relaxed text-forest/72">{step}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8 max-w-3xl border border-forest/12 bg-white/35 p-5 text-sm leading-relaxed text-forest/68">
        {weekly
          ? "Your plan renews every seven days until canceled."
          : "This order is charged once and does not renew automatically."}{" "}
        Keep a copy of the{" "}
        <Link href="/customer-agreement" className="font-semibold underline underline-offset-2">
          Customer Agreement
        </Link>
        {weekly ? (
          <>
            {" "}and use the{" "}
            <Link href="/cancel" className="font-semibold underline underline-offset-2">
              online cancellation page
            </Link>{" "}
            anytime to stop future renewals.
          </>
        ) : (
          <> for the exchange, pickup, and delivery terms.</>
        )}{" "}
        Your reusable-container deposit is
        {FEES.containerDeposit.amountCents === null
          ? " confirmed separately before containers are issued."
          : ` ${formatCents(FEES.containerDeposit.amountCents)} and refundable under the return terms.`}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ReorderButton
          bowlSelection={confirmation.bowlSelection}
          fulfillmentMethod={confirmation.fulfillmentMethod}
          mealsPerDay={confirmation.mealsPerDay}
          peopleCount={confirmation.peopleCount}
        >
          {weekly ? "Add this mix once" : "Order this mix again"}
        </ReorderButton>
        <Button as="a" href="/account" variant="secondary">
          View my orders
        </Button>
        <Button as="a" href="/" variant="link">
          Return home
        </Button>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-forest/50">
        Repeat orders open as one-time purchases. You can review the quantity,
        mix, fulfillment, and total before paying.
      </p>
    </section>
  );
}
