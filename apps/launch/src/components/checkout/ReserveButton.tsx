"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { BowlBuilder } from "@/components/checkout/BowlBuilder";
import { Button } from "@/components/ui/Button";
import {
  BOWLS_PER_ORDER,
  bowlSelectionSchema,
  DEFAULT_BOWL_SELECTION,
  parseStoredBowlSelection,
  type BowlSelection,
} from "@/lib/bowl-selection";
import {
  FEES,
  FULFILLMENT,
  type FulfillmentMethod,
  formatCents,
  PRICING,
  PURCHASE_OPTIONS,
  type PurchaseType,
  TAX,
} from "@/lib/brand";
import type { CheckoutAddress, TaxQuote } from "@/lib/square";

type Contact = {
  givenName: string;
  familyName: string;
  email: string;
  phone: string;
};

type SquareTokenResult = {
  status: string;
  token?: string;
  errors?: Array<{ message?: string }>;
};

type SquareCard = {
  attach(selector: string): Promise<void>;
  destroy(): Promise<boolean>;
  tokenize(details: unknown): Promise<SquareTokenResult>;
};

declare global {
  interface Window {
    Square?: {
      payments(applicationId: string, locationId: string): {
        card(): Promise<SquareCard>;
      };
    };
  }
}

const INPUT_CLASS =
  "min-h-[50px] w-full rounded-none border border-forest/18 bg-white/75 px-4 text-base text-forest placeholder:text-forest/35 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20";

const EMPTY_ADDRESS: CheckoutAddress = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "CA",
  postalCode: "",
};

function addressIsComplete(address: CheckoutAddress): boolean {
  return Boolean(
    address.addressLine1.trim().length >= 3 &&
      address.city.trim().length >= 2 &&
      /^\d{5}$/.test(address.postalCode.trim()),
  );
}

export function ReserveButton({
  initialFulfillment,
  squareApplicationId,
  squareEnvironment,
  squareLocationId,
}: {
  initialFulfillment: FulfillmentMethod;
  squareApplicationId: string;
  squareEnvironment: "sandbox" | "production";
  squareLocationId: string;
}) {
  const [fulfillmentMethod, setFulfillmentMethod] =
    useState<FulfillmentMethod>(initialFulfillment);
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("one-time");
  const [bowlSelection, setBowlSelection] = useState<BowlSelection>(
    DEFAULT_BOWL_SELECTION,
  );
  const [contact, setContact] = useState<Contact>({
    givenName: "",
    familyName: "",
    email: "",
    phone: "",
  });
  const [deliveryAddress, setDeliveryAddress] =
    useState<CheckoutAddress>(EMPTY_ADDRESS);
  const [billingAddress, setBillingAddress] =
    useState<CheckoutAddress>(EMPTY_ADDRESS);
  const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(true);
  const [quote, setQuote] = useState<TaxQuote | null>(null);
  const [taxQuoteToken, setTaxQuoteToken] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [pending, setPending] = useState(false);
  const [quoting, setQuoting] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<SquareCard | null>(null);
  const configured = Boolean(squareApplicationId && squareLocationId);
  const effectiveBillingAddress =
    fulfillmentMethod === "delivery" && billingSameAsDelivery
      ? deliveryAddress
      : billingAddress;

  const scriptUrl =
    squareEnvironment === "production"
      ? "https://web.squarecdn.com/v1/square.js"
      : "https://sandbox.web.squarecdn.com/v1/square.js";

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const stored = window.sessionStorage.getItem("soulbowls:checkoutContact");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Partial<Contact>;
          setContact((current) => ({ ...current, ...parsed }));
        } catch {
          window.sessionStorage.removeItem("soulbowls:checkoutContact");
        }
      }
      const deliveryZip = window.sessionStorage.getItem("soulbowls:deliveryZip");
      if (deliveryZip) {
        setDeliveryAddress((current) => ({ ...current, postalCode: deliveryZip }));
      }
      const storedSelection = parseStoredBowlSelection(
        window.sessionStorage.getItem("soulbowls:bowlSelection"),
      );
      if (storedSelection) setBowlSelection(storedSelection);
      const storedPurchaseType = window.sessionStorage.getItem(
        "soulbowls:purchaseType",
      );
      if (storedPurchaseType === "one-time" || storedPurchaseType === "weekly") {
        setPurchaseType(storedPurchaseType);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!sdkLoaded || !configured || !window.Square || cardRef.current) return;
    let cancelled = false;
    void (async () => {
      try {
        const payments = window.Square!.payments(squareApplicationId, squareLocationId);
        const card = await payments.card();
        await card.attach("#square-card");
        if (cancelled) {
          await card.destroy();
          return;
        }
        cardRef.current = card;
        setCardReady(true);
      } catch {
        setError("Square’s secure card form could not load. Refresh and try again.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [configured, sdkLoaded, squareApplicationId, squareLocationId]);

  const contactComplete = useMemo(
    () =>
      contact.givenName.trim() &&
      contact.familyName.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()) &&
      /^\+?[\d\s().-]{9,}$/.test(contact.phone.trim()),
    [contact],
  );
  const bowlSelectionComplete = bowlSelectionSchema.safeParse(bowlSelection).success;

  function resetQuote(): void {
    setQuote(null);
    setTaxQuoteToken(null);
    setAccepted(false);
    setError(null);
  }

  function chooseFulfillment(method: FulfillmentMethod): void {
    setFulfillmentMethod(method);
    window.sessionStorage.setItem("soulbowls:fulfillment", method);
    resetQuote();
  }

  function choosePurchaseType(type: PurchaseType): void {
    setPurchaseType(type);
    window.sessionStorage.setItem("soulbowls:purchaseType", type);
    setAccepted(false);
    setError(null);
  }

  function updateBowlSelection(selection: BowlSelection): void {
    setBowlSelection(selection);
    window.sessionStorage.setItem(
      "soulbowls:bowlSelection",
      JSON.stringify(selection),
    );
    setAccepted(false);
    setError(null);
  }

  function updateContact(field: keyof Contact, value: string): void {
    setContact((current) => ({ ...current, [field]: value }));
    setError(null);
  }

  function updateAddress(
    target: "billing" | "delivery",
    field: keyof CheckoutAddress,
    value: string,
  ): void {
    const setter = target === "billing" ? setBillingAddress : setDeliveryAddress;
    setter((current) => ({ ...current, [field]: value }));
    resetQuote();
  }

  async function calculateTotal(): Promise<void> {
    if (!bowlSelectionComplete) {
      setError(`Select exactly ${BOWLS_PER_ORDER} bowls before calculating the total.`);
      return;
    }
    if (
      fulfillmentMethod === "delivery" &&
      !addressIsComplete(deliveryAddress)
    ) {
      setError("Enter the complete Los Angeles County delivery address.");
      return;
    }
    setQuoting(true);
    setError(null);
    try {
      const response = await fetch("/api/tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillmentMethod,
          deliveryAddress:
            fulfillmentMethod === "delivery" ? deliveryAddress : null,
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | (TaxQuote & { error?: string; quoteToken?: string | null })
        | null;
      if (!response.ok || !data || typeof data.totalCents !== "number") {
        throw new Error(data?.error ?? "Tax could not be calculated.");
      }
      setQuote(data);
      setTaxQuoteToken(data.quoteToken || null);
    } catch (quoteError) {
      setQuote(null);
      setTaxQuoteToken(null);
      setError(
        quoteError instanceof Error ? quoteError.message : "Tax could not be calculated.",
      );
    } finally {
      setQuoting(false);
    }
  }

  async function reserve(): Promise<void> {
    if (pending || !accepted || !quote || !cardRef.current) return;
    const leadId = window.sessionStorage.getItem("soulbowls:leadId");
    if (!leadId) {
      setError("Complete the reservation form before starting payment.");
      return;
    }
    if (!bowlSelectionComplete) {
      setError(`Select exactly ${BOWLS_PER_ORDER} bowls before checkout.`);
      return;
    }
    if (!contactComplete) {
      setError("Enter your full name, email, and US phone number.");
      return;
    }
    if (!addressIsComplete(effectiveBillingAddress)) {
      setError("Enter the complete billing address for the card.");
      return;
    }
    if (fulfillmentMethod === "delivery" && !addressIsComplete(deliveryAddress)) {
      setError("Enter the complete delivery address.");
      return;
    }

    setPending(true);
    setError(null);
    try {
      const billingContact = {
        givenName: contact.givenName,
        familyName: contact.familyName,
        email: contact.email,
        phone: contact.phone,
        addressLines: [
          effectiveBillingAddress.addressLine1,
          effectiveBillingAddress.addressLine2,
        ].filter(Boolean),
        city: effectiveBillingAddress.city,
        state: effectiveBillingAddress.state,
        postalCode: effectiveBillingAddress.postalCode,
        countryCode: "US",
      };
      const verificationDetails =
        purchaseType === "weekly"
          ? {
              billingContact,
              intent: "STORE",
              customerInitiated: true,
              sellerKeyedIn: false,
            }
          : {
              amount: (quote.totalCents / 100).toFixed(2),
              billingContact,
              currencyCode: "USD",
              intent: "CHARGE",
              customerInitiated: true,
              sellerKeyedIn: false,
            };
      const tokenResult = await cardRef.current.tokenize(verificationDetails);
      if (tokenResult.status !== "OK" || !tokenResult.token) {
        throw new Error(
          tokenResult.errors?.[0]?.message ?? "Check the card details and try again.",
        );
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          acceptedTerms: true,
          billingAddress: effectiveBillingAddress,
          bowlSelection,
          contact,
          deliveryAddress:
            fulfillmentMethod === "delivery" ? deliveryAddress : null,
          fulfillmentMethod,
          idempotencyKey: crypto.randomUUID(),
          leadId,
          purchaseType,
          sourceId: tokenResult.token,
          ...(taxQuoteToken ? { taxQuoteToken } : {}),
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; purchaseType?: PurchaseType }
        | null;
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error ?? "Square could not complete checkout.");
      }
      window.sessionStorage.setItem(
        purchaseType === "weekly"
          ? "soulbowls:subscriptionStatus"
          : "soulbowls:orderStatus",
        purchaseType === "weekly" ? "active" : "completed",
      );
      window.sessionStorage.setItem("soulbowls:confirmedPurchaseType", purchaseType);
      window.sessionStorage.setItem(
        "soulbowls:confirmedBowlSelection",
        JSON.stringify(bowlSelection),
      );
      window.location.href = `/welcome?purchased=1&type=${purchaseType}`;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Square could not complete checkout.",
      );
    } finally {
      setPending(false);
    }
  }

  function renderAddressFields(target: "billing" | "delivery") {
    const address = target === "billing" ? billingAddress : deliveryAddress;
    const prefix = target === "billing" ? "billing" : "delivery";
    return (
      <div className="grid gap-3">
        <input
          aria-label={`${target} street address`}
          autoComplete={`${prefix} address-line1`}
          className={INPUT_CLASS}
          placeholder="Street address"
          value={address.addressLine1}
          onChange={(event) => updateAddress(target, "addressLine1", event.target.value)}
        />
        <input
          aria-label={`${target} apartment or suite`}
          autoComplete={`${prefix} address-line2`}
          className={INPUT_CLASS}
          placeholder="Apartment or suite (optional)"
          value={address.addressLine2}
          onChange={(event) => updateAddress(target, "addressLine2", event.target.value)}
        />
        <div className="grid grid-cols-[1fr_72px_96px] gap-2">
          <input
            aria-label={`${target} city`}
            autoComplete={`${prefix} address-level2`}
            className={INPUT_CLASS}
            placeholder="City"
            value={address.city}
            onChange={(event) => updateAddress(target, "city", event.target.value)}
          />
          <input
            aria-label={`${target} state`}
            className={INPUT_CLASS}
            disabled
            value="CA"
          />
          <input
            aria-label={`${target} ZIP code`}
            autoComplete={`${prefix} postal-code`}
            className={INPUT_CLASS}
            inputMode="numeric"
            maxLength={5}
            placeholder="ZIP"
            value={address.postalCode}
            onChange={(event) => updateAddress(target, "postalCode", event.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Script src={scriptUrl} strategy="afterInteractive" onLoad={() => setSdkLoaded(true)} />

      <fieldset className="grid gap-2">
        <legend className="mb-2 text-xs font-bold tracking-[0.12em] text-forest/55 uppercase">
          Choose how to order
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(PURCHASE_OPTIONS) as PurchaseType[]).map((type) => {
            const option = PURCHASE_OPTIONS[type];
            return (
              <label
                key={type}
                className={`cursor-pointer border p-4 transition-colors ${
                  purchaseType === type
                    ? "border-sage bg-sage/10"
                    : "border-forest/15 bg-white/60 hover:border-sage"
                }`}
              >
                <span className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="purchase-type"
                    checked={purchaseType === type}
                    disabled={pending}
                    onChange={() => choosePurchaseType(type)}
                    className="mt-0.5 h-5 w-5 accent-forest"
                  />
                  <span className="text-sm">
                    <strong className="block text-forest">{option.label}</strong>
                    <span className="mt-1 block leading-relaxed text-forest/58">
                      {option.disclosure}
                    </span>
                    <span className="mt-2 block font-bold text-forest">
                      {type === "weekly" ? PRICING.weekly : PRICING.oneTime}
                    </span>
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <BowlBuilder
        disabled={pending}
        onChange={updateBowlSelection}
        selection={bowlSelection}
      />

      <fieldset className="grid gap-2">
        <legend className="mb-2 text-xs font-bold tracking-[0.12em] text-forest/55 uppercase">
          Choose fulfillment
        </legend>
        {(Object.keys(FULFILLMENT) as FulfillmentMethod[]).map((method) => {
          const option = FULFILLMENT[method];
          return (
            <label key={method} className="flex cursor-pointer items-center justify-between gap-4 border border-forest/15 bg-white/60 p-4 text-sm text-forest/72 transition-colors hover:border-sage">
              <span className="flex items-center gap-3">
                <input type="radio" name="fulfillment" checked={fulfillmentMethod === method} disabled={pending} onChange={() => chooseFulfillment(method)} className="h-5 w-5 accent-forest" />
                <span><strong className="block text-forest">{option.label}</strong>{method === "pickup" ? "Sunday location and window confirmed after checkout" : "Available throughout Los Angeles County"}</span>
              </span>
              <strong className="shrink-0 text-forest">{formatCents(option.amountCents)}{method === "delivery" ? "/order" : ""}</strong>
            </label>
          );
        })}
      </fieldset>

      <fieldset className="grid gap-3">
        <legend className="mb-1 text-xs font-bold tracking-[0.12em] text-forest/55 uppercase">Customer</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <input aria-label="First name" autoComplete="given-name" className={INPUT_CLASS} placeholder="First name" value={contact.givenName} onChange={(event) => updateContact("givenName", event.target.value)} />
          <input aria-label="Last name" autoComplete="family-name" className={INPUT_CLASS} placeholder="Last name" value={contact.familyName} onChange={(event) => updateContact("familyName", event.target.value)} />
        </div>
        <input aria-label="Email" autoComplete="email" className={INPUT_CLASS} inputMode="email" placeholder="Email" type="email" value={contact.email} onChange={(event) => updateContact("email", event.target.value)} />
        <input aria-label="Phone" autoComplete="tel" className={INPUT_CLASS} inputMode="tel" placeholder="US phone number" type="tel" value={contact.phone} onChange={(event) => updateContact("phone", event.target.value)} />
      </fieldset>

      {fulfillmentMethod === "delivery" && (
        <fieldset className="grid gap-3">
          <legend className="mb-1 text-xs font-bold tracking-[0.12em] text-forest/55 uppercase">LA County delivery address</legend>
          {renderAddressFields("delivery")}
          <label className="flex items-center gap-3 text-sm text-forest/72">
            <input type="checkbox" className="h-5 w-5 accent-forest" checked={billingSameAsDelivery} onChange={(event) => { setBillingSameAsDelivery(event.target.checked); resetQuote(); }} />
            Use this as the card billing address
          </label>
        </fieldset>
      )}

      {(fulfillmentMethod === "pickup" || !billingSameAsDelivery) && (
        <fieldset className="grid gap-3">
          <legend className="mb-1 text-xs font-bold tracking-[0.12em] text-forest/55 uppercase">Card billing address</legend>
          {renderAddressFields("billing")}
        </fieldset>
      )}

      <Button type="button" variant="secondary" className="w-full" disabled={quoting || pending || !bowlSelectionComplete} onClick={calculateTotal}>
        {quoting
          ? "Checking address and tax…"
          : quote
            ? "Recalculate total"
            : "Calculate total"}
      </Button>

      <dl className="grid gap-3 border-y border-forest/10 py-5 text-sm text-forest/70">
        <div className="flex justify-between gap-4"><dt>{purchaseType === "weekly" ? "Weekly base plan" : "One-time bowl order"}</dt><dd className="font-semibold text-forest">{purchaseType === "weekly" ? PRICING.weekly : PRICING.oneTime}</dd></div>
        <div className="flex justify-between gap-4"><dt>{FULFILLMENT[fulfillmentMethod].label}</dt><dd className="font-semibold text-forest">{formatCents(FULFILLMENT[fulfillmentMethod].amountCents)}</dd></div>
        <div className="flex justify-between gap-4"><dt>California sales tax{quote && <span className="block text-xs text-forest/50">{quote.percentage}% · {quote.jurisdiction}</span>}</dt><dd className="font-semibold text-forest">{quote ? formatCents(quote.taxCents) : "Calculate above"}</dd></div>
        <div className="flex items-end justify-between gap-4 border-t border-forest/10 pt-4"><dt className="font-semibold text-forest">{purchaseType === "weekly" ? "Weekly charge" : "Total charge"}<span className="block text-xs font-normal text-forest/50">{purchaseType === "weekly" ? "Renews every 7 days until canceled" : "Charged once · no automatic renewal"}</span></dt><dd className="font-serif text-3xl font-semibold text-forest">{quote ? formatCents(quote.totalCents) : formatCents(PRICING.oneTimeCents + FULFILLMENT[fulfillmentMethod].amountCents)}</dd></div>
      </dl>

      <div>
        <p className="mb-2 text-xs font-bold tracking-[0.12em] text-forest/55 uppercase">Secure card details</p>
        <div id="square-card" className="min-h-[90px] border border-forest/15 bg-white p-3" />
        {!configured && <p className="mt-2 text-sm text-clay">Square payment is not configured.</p>}
        {configured && !cardReady && !error && <p className="mt-2 text-xs text-forest/50">Loading Square’s secure card form…</p>}
      </div>

      <div className="border border-forest/15 bg-white/60 p-4 text-sm leading-relaxed text-forest/72">
        <p className="font-bold tracking-[0.08em] text-forest uppercase">
          {purchaseType === "weekly" ? "Automatic renewal" : "One-time payment"}
        </p>
        <p className="mt-2">
          {purchaseType === "weekly"
            ? `Your card will be charged ${quote ? formatCents(quote.totalCents) : "the displayed total"} today and every 7 days for the ${PRICING.weekly} plan, selected fulfillment, and applicable tax until canceled.`
            : `Your card will be charged ${quote ? formatCents(quote.totalCents) : "the displayed total"} once for this five-bowl order, selected fulfillment, and applicable tax. This order does not renew automatically.`}{" "}
          Any reusable-container deposit is separate and refundable under the return terms.
        </p>
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-forest/72">
        <input type="checkbox" checked={accepted} disabled={pending} onChange={(event) => setAccepted(event.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-forest" />
        <span>I authorize Soul Goods LLC to {purchaseType === "weekly" ? "save this card and charge the automatic weekly renewal shown above" : "charge the displayed total once for this order"}. I agree to the <Link href="/terms" className="font-semibold underline underline-offset-2">Terms of Service</Link> and <Link href="/customer-agreement" className="font-semibold underline underline-offset-2">Customer Agreement</Link>.</span>
      </label>

      <Button type="button" size="lg" className="w-full" disabled={pending || !accepted || !quote || !cardReady || !bowlSelectionComplete} onClick={reserve}>
        {pending
          ? purchaseType === "weekly"
            ? "Starting your weekly plan…"
            : "Placing your order…"
          : `${purchaseType === "weekly" ? "Start weekly Soul Bowls™" : "Place one-time order"}${quote ? ` — ${formatCents(quote.totalCents)}` : ""}`}
      </Button>

      <p className="text-xs leading-relaxed text-forest/50">Secure {purchaseType === "weekly" ? "card storage and recurring billing are" : "one-time payment is"} provided by Square. {TAX.disclosure} Reusable-container deposit: {FEES.containerDeposit.amountCents === null ? "confirmed separately" : formatCents(FEES.containerDeposit.amountCents)}.</p>

      {error && <p role="alert" className="text-sm leading-relaxed text-clay">{error} {error.includes("reservation form") && <Link href="/#join" className="font-semibold underline underline-offset-2">Reserve your spot.</Link>}</p>}
    </div>
  );
}
