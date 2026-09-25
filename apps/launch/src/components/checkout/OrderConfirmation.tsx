"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Clock } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
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
import { orderStatusLabel } from "@/lib/customer-experience";
import { describeExtraOptions, findExtra } from "@/lib/menu-extras";
import { LAST_MIX_KEY, type LastMix } from "@/lib/last-mix";

/** Animated status seal — adapted from 21st.dev kavikatiyar/order-confirmation-card. */
function StatusSeal({ pending }: { pending: boolean }) {
  const reduced = useReducedMotion();
  const Icon = pending ? Clock : Check;
  return (
    <motion.div
      initial={reduced ? false : { scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative mb-8 flex size-20 items-center justify-center rounded-full ${pending ? "bg-gold/25 text-forest" : "bg-sage-ink text-oat"}`}
    >
      <span aria-hidden className={`absolute inset-0 rounded-full ${pending ? "" : "motion-safe:animate-ping bg-sage/30 [animation-iteration-count:2]"}`} />
      <motion.span
        initial={reduced ? false : { scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 320, damping: 18 }}
        className="relative"
      >
        <Icon className="size-9" strokeWidth={2.25} aria-hidden />
      </motion.span>
    </motion.div>
  );
}

export function OrderConfirmation() {
  const [confirmation, setConfirmation] = useState<
    LastOrderConfirmation | null | undefined
  >(undefined);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const parsed = parseLastOrderConfirmation(
        window.sessionStorage.getItem(LAST_ORDER_STORAGE_KEY),
      );
      setConfirmation(parsed);
      if (parsed) {
        const lastMix: LastMix = {
          version: 1,
          bowlSelection: parsed.bowlSelection,
          peopleCount: parsed.peopleCount,
          mealsPerDay: parsed.mealsPerDay,
          fulfillmentMethod: parsed.fulfillmentMethod,
          savedAt: parsed.acceptedAt,
        };
        try {
          window.localStorage.setItem(LAST_MIX_KEY, JSON.stringify(lastMix));
        } catch {
          // Storage can be unavailable (private mode); reordering is optional.
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (confirmation === undefined) {
    return (
      <div
        className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center px-5 py-16"
        role="status"
      >
        <span className="sr-only">Loading your order confirmation…</span>
        <div aria-hidden="true" className="flex w-full flex-col items-center gap-5 motion-safe:animate-pulse">
          <div className="size-20 rounded-full bg-forest/8" />
          <div className="h-3 w-32 rounded bg-forest/8" />
          <div className="h-14 w-3/4 max-w-md rounded-md bg-forest/8" />
          <div className="h-4 w-full max-w-lg rounded bg-forest/8" />
          <div className="mt-6 h-56 w-full rounded-lg bg-forest/6" />
        </div>
      </div>
    );
  }

  if (!confirmation) {
    return (
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
        <div className="mb-8 flex size-20 items-center justify-center rounded-full bg-forest">
          <Logo size={42} title="" variant="cream" />
        </div>
        <p className="mb-5 text-xs font-medium tracking-[0.18em] text-clay-ink uppercase">
          Confirmation unavailable
        </p>
        <h1 className="max-w-[12ch] text-5xl leading-[1.02] font-normal tracking-[0.01em] text-forest sm:text-7xl">
          Let&rsquo;s find your order.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-forest/72">
          This tab does not have a completed checkout to display. If you already
          paid, sign in with the email used at checkout to see the order and its
          Square receipt. You can also check your confirmation email.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button as="a" href="/account">
            View my orders
          </Button>
          <Button as="a" href="/checkout" variant="secondary">
            Start a new order
          </Button>
        </div>
      </section>
    );
  }

  const weekly = confirmation.purchaseType === "weekly";
  const pending =
    Boolean(confirmation.paymentPending) ||
    confirmation.status === "PENDING_PAYMENT";
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
      <StatusSeal pending={pending} />
      <p className="mb-5 text-xs font-medium tracking-[0.18em] text-clay-ink uppercase">
        {confirmation.paymentPending ||
        confirmation.status === "PENDING_PAYMENT"
          ? "Plan enrolled · payment pending"
          : weekly
            ? "Weekly plan"
            : "Order confirmed"}
      </p>
      <h1 className="max-w-[12ch] text-5xl leading-[1.02] font-normal tracking-[0.01em] text-forest sm:text-7xl">
        {confirmation.paymentPending ||
        confirmation.status === "PENDING_PAYMENT"
          ? "Your plan is enrolled."
          : "Your bowls are confirmed."}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-forest/72">
        {confirmation.paymentPending ||
        confirmation.status === "PENDING_PAYMENT"
          ? "Square is processing your first invoice. This is not a payment receipt. We’ll confirm your bowls after payment clears. Check your account for the latest status."
          : "Thank you for making Soul Good part of your day. Your order is saved in your account. We’ll be in touch with your Sunday pickup or delivery window. Your confirmation email may take a few minutes to arrive."}
      </p>

      <section className="mt-10 w-full overflow-hidden rounded-lg border border-forest/12 bg-card p-6 text-left shadow-[0_30px_60px_-45px_rgb(44_58_52/0.5)] sm:p-8">
        <div className="flex flex-col justify-between gap-5 border-b border-forest/10 pb-6 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-medium tracking-[0.16em] text-clay-ink uppercase">
              {weekly ? "Weekly plan" : "One-time order"}
            </p>
            <p className="mt-2 font-serif text-3xl text-forest">
              {confirmation.peopleCount}{" "}
              {confirmation.peopleCount === 1 ? "person" : "people"}
              {" · "}
              {confirmation.mealsPerDay}{" "}
              {confirmation.mealsPerDay === 1 ? "meal" : "meals"}/day
            </p>
            <p className="mt-2 text-xs text-forest/72">
              Order {orderReference}
            </p>
          </div>
          <div className="sm:text-right">
            <span className="inline-flex rounded-md bg-sage/14 px-3 py-2 text-xs font-medium tracking-[0.1em] text-forest uppercase">
              {orderStatusLabel(confirmation.status)}
            </span>
            <p className="mt-3 font-serif text-3xl text-forest">
              {formatCents(confirmation.totalCents)}
            </p>
          </div>
        </div>

        <div className="grid gap-7 pt-6 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-medium tracking-[0.12em] text-forest/72 uppercase">
              Your chosen bowls
            </p>
            <ul className="mt-4 grid divide-y divide-forest/8">
              {selectedBowls.map((bowl) => (
                <li
                  key={bowl.id}
                  className="flex items-center justify-between gap-3 py-2.5 text-sm text-forest/75"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-sand">
                      <Image src={bowl.imagePath} alt="" fill unoptimized sizes="44px" className="object-cover" />
                    </span>
                    <span className="font-serif text-lg leading-tight text-forest">{bowl.name}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-forest/6 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-forest tabular-nums">
                    × {confirmation.bowlSelection[bowl.id]}
                  </span>
                </li>
              ))}
            </ul>
            {confirmation.extras?.length ? (
              <>
                <p className="mt-6 text-xs font-medium tracking-[0.12em] text-forest/72 uppercase">Salads &amp; snacks</p>
                <ul className="mt-3 grid divide-y divide-forest/8">
                  {confirmation.extras.map((line, index) => {
                    const extra = findExtra(line.id);
                    return (
                      <li key={`${line.id}-${index}`} className="flex items-center justify-between gap-3 py-2.5 text-sm text-forest/75">
                        <span className="flex min-w-0 items-center gap-3">
                          {extra ? (
                            <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-sand">
                              <Image src={extra.imagePath} alt="" fill sizes="44px" className="object-cover" />
                            </span>
                          ) : null}
                          <span className="min-w-0">
                            <span className="block font-serif text-lg leading-tight text-forest">{extra?.name ?? line.id}</span>
                            {describeExtraOptions(line) ? <span className="block text-xs text-forest/72">{describeExtraOptions(line)}</span> : null}
                          </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-forest/6 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-forest tabular-nums">× {line.quantity}</span>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : null}
          </div>

          <dl className="grid content-start gap-3 text-sm text-forest/72">
            <div className="flex justify-between gap-4">
              <dt>Fulfillment</dt>
              <dd className="font-semibold text-forest">
                {confirmation.fulfillmentMethod === "delivery"
                  ? "Sunday delivery"
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
                  className="font-semibold text-clay-ink underline underline-offset-4"
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
          <li key={step} className="rounded-lg border border-forest/12 bg-card/70 p-5">
            <span className="mb-5 flex size-7 items-center justify-center rounded-full bg-gold/30 text-xs font-bold text-forest">
              {index + 1}
            </span>
            <p className="text-sm leading-relaxed text-forest/72">{step}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8 max-w-3xl rounded-lg border border-forest/12 bg-card/70 p-5 text-sm leading-relaxed text-forest/72">
        {weekly
          ? "Your plan renews every seven days until canceled."
          : "This order is charged once and does not renew automatically."}{" "}
        Keep a copy of the{" "}
        <Link
          href="/customer-agreement"
          className="font-semibold underline underline-offset-2"
        >
          Customer Agreement
        </Link>
        {weekly ? (
          <>
            {" "}
            and use the{" "}
            <Link
              href="/cancel"
              className="font-semibold underline underline-offset-2"
            >
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
      <p className="mt-4 text-xs leading-relaxed text-forest/72">
        Repeat orders open as one-time purchases. You can review the quantity,
        mix, fulfillment, and total before paying.
      </p>
    </section>
  );
}
