"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { BowlBuilder } from "@/components/checkout/BowlBuilder";
import { Button } from "@/components/ui/Button";
import {
  bowlsForPlan,
  bowlSelectionSchemaForPlan,
  DEFAULT_BOWL_SELECTION,
  MAX_MEALS_PER_DAY,
  MAX_MEAL_SETS_PER_ORDER,
  MAX_PEOPLE_PER_ORDER,
  mealSetCount,
  parseStoredBowlSelection,
  selectionForPlan,
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
import {
  LAST_ORDER_STORAGE_KEY,
  type LastOrderConfirmation,
} from "@/lib/checkout-session";
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

type SquareWallet = {
  destroy(): Promise<boolean>;
  tokenize(): Promise<SquareTokenResult>;
};

type SquareGooglePay = SquareWallet & {
  attach(
    selector: string,
    options?: {
      buttonBorderType?: "no_border" | "default_border";
      buttonColor?: "black" | "white" | "default";
      buttonRadius?: number;
      buttonSizeMode?: "static" | "fill";
      buttonType?: "long" | "short";
    },
  ): Promise<void>;
};

type SquarePaymentRequest = object;

type SquarePayments = {
  applePay(request: SquarePaymentRequest): Promise<SquareWallet>;
  card(): Promise<SquareCard>;
  googlePay(request: SquarePaymentRequest): Promise<SquareGooglePay>;
  paymentRequest(options: {
    countryCode: "US";
    currencyCode: "USD";
    lineItems: Array<{ amount: string; label: string }>;
    total: { amount: string; label: string };
  }): SquarePaymentRequest;
  verifyBuyer(
    sourceId: string,
    details: unknown,
  ): Promise<{ status?: string; token?: string } | null>;
};

type CheckoutSuccess = {
  ok: true;
  purchaseType: PurchaseType;
  status: string;
  paymentId?: string;
  subscriptionId?: string;
  orderId?: string;
  orderTemplateId?: string;
  receiptUrl?: string;
  acceptedAt: string;
  fulfillmentMethod: FulfillmentMethod;
  mealsPerDay: number;
  peopleCount: number;
  bowlSelection: BowlSelection;
  tax: TaxQuote;
};

declare global {
  interface Window {
    Square?: {
      payments(applicationId: string, locationId: string): SquarePayments;
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
  const router = useRouter();
  const [fulfillmentMethod, setFulfillmentMethod] =
    useState<FulfillmentMethod>(initialFulfillment);
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("one-time");
  const [peopleCount, setPeopleCount] = useState(1);
  const [mealsPerDay, setMealsPerDay] = useState(1);
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
  const [applePayReady, setApplePayReady] = useState(false);
  const [googlePayReady, setGooglePayReady] = useState(false);
  const [walletCheckComplete, setWalletCheckComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<SquareCard | null>(null);
  const applePayRef = useRef<SquareWallet | null>(null);
  const googlePayRef = useRef<SquareGooglePay | null>(null);
  const walletPaymentsRef = useRef<SquarePayments | null>(null);
  const errorRef = useRef<HTMLParagraphElement | null>(null);
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
      const storedPurchaseType = window.sessionStorage.getItem(
        "soulbowls:purchaseType",
      );
      if (storedPurchaseType === "one-time" || storedPurchaseType === "weekly") {
        setPurchaseType(storedPurchaseType);
      }
      const storedPeople = Number(
        window.sessionStorage.getItem("soulbowls:peopleCount") || "1",
      );
      const storedMeals = Number(
        window.sessionStorage.getItem("soulbowls:mealsPerDay") || "1",
      );
      const validSize =
        Number.isInteger(storedPeople) &&
        storedPeople >= 1 &&
        storedPeople <= MAX_PEOPLE_PER_ORDER &&
        Number.isInteger(storedMeals) &&
        storedMeals >= 1 &&
        storedMeals <= MAX_MEALS_PER_DAY &&
        mealSetCount(storedPeople, storedMeals) <= MAX_MEAL_SETS_PER_ORDER;
      const nextPeople = validSize ? storedPeople : 1;
      const nextMeals = validSize ? storedMeals : 1;
      setPeopleCount(nextPeople);
      setMealsPerDay(nextMeals);
      if (
        storedSelection &&
        bowlSelectionSchemaForPlan(nextPeople, nextMeals).safeParse(storedSelection)
          .success
      ) {
        setBowlSelection(storedSelection);
      } else {
        setBowlSelection(selectionForPlan(nextPeople, nextMeals));
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

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setApplePayReady(false);
      setGooglePayReady(false);
      setWalletCheckComplete(false);
    });
    applePayRef.current = null;
    googlePayRef.current = null;
    walletPaymentsRef.current = null;

    if (
      !sdkLoaded ||
      !configured ||
      !window.Square ||
      !quote ||
      purchaseType !== "one-time"
    ) {
      return;
    }

    let applePay: SquareWallet | null = null;
    let googlePay: SquareGooglePay | null = null;

    void (async () => {
      const payments = window.Square!.payments(
        squareApplicationId,
        squareLocationId,
      );
      walletPaymentsRef.current = payments;
      const bowlsAmount = PRICING.oneTimeCents * mealSetCount(peopleCount, mealsPerDay);
      const fulfillmentAmount = FULFILLMENT[fulfillmentMethod].amountCents;
      const paymentRequestOptions = {
        countryCode: "US" as const,
        currencyCode: "USD" as const,
        lineItems: [
          { amount: (bowlsAmount / 100).toFixed(2), label: "Soul Bowls™" },
          {
            amount: (fulfillmentAmount / 100).toFixed(2),
            label: FULFILLMENT[fulfillmentMethod].label,
          },
          {
            amount: (quote.taxCents / 100).toFixed(2),
            label: "California sales tax",
          },
        ],
        total: {
          amount: (quote.totalCents / 100).toFixed(2),
          label: "Soul Goods LLC",
        },
      };

      try {
        applePay = await payments.applePay(
          payments.paymentRequest(paymentRequestOptions),
        );
        if (!cancelled) {
          applePayRef.current = applePay;
          setApplePayReady(true);
        }
      } catch {
        // Apple Pay is only exposed when the browser, device, wallet, and
        // registered HTTPS domain all support it.
      }

      try {
        googlePay = await payments.googlePay(
          payments.paymentRequest(paymentRequestOptions),
        );
        if (!cancelled) {
          googlePayRef.current = googlePay;
          setGooglePayReady(true);
          await new Promise<void>((resolve) => {
            window.requestAnimationFrame(() => resolve());
          });
          if (!cancelled) {
            await googlePay.attach("#google-pay-button", {
              buttonBorderType: "no_border",
              buttonColor: "black",
              buttonRadius: 0,
              buttonSizeMode: "fill",
              buttonType: "long",
            });
          }
        }
      } catch {
        if (!cancelled) {
          googlePayRef.current = null;
          setGooglePayReady(false);
        }
        // Unsupported Google Pay environments fall back to the card form.
      } finally {
        if (!cancelled) setWalletCheckComplete(true);
      }
    })();

    return () => {
      cancelled = true;
      walletPaymentsRef.current = null;
      applePayRef.current = null;
      googlePayRef.current = null;
      setApplePayReady(false);
      setGooglePayReady(false);
      setWalletCheckComplete(false);
      if (applePay) void applePay.destroy().catch(() => false);
      if (googlePay) void googlePay.destroy().catch(() => false);
    };
  }, [
    configured,
    fulfillmentMethod,
    mealsPerDay,
    peopleCount,
    purchaseType,
    quote,
    sdkLoaded,
    squareApplicationId,
    squareLocationId,
  ]);

  const contactComplete = useMemo(
    () =>
      contact.givenName.trim() &&
      contact.familyName.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()) &&
      /^\+?[\d\s().-]{9,}$/.test(contact.phone.trim()),
    [contact],
  );
  const mealSets = mealSetCount(peopleCount, mealsPerDay);
  const targetBowls = bowlsForPlan(peopleCount, mealsPerDay);
  const bowlOrderCents = PRICING.oneTimeCents * mealSets;
  const bowlSelectionComplete = bowlSelectionSchemaForPlan(
    peopleCount,
    mealsPerDay,
  ).safeParse(bowlSelection).success;
  const walletPaymentReady = Boolean(
    accepted &&
      quote &&
      contactComplete &&
      bowlSelectionComplete &&
      addressIsComplete(effectiveBillingAddress) &&
      (fulfillmentMethod !== "delivery" || addressIsComplete(deliveryAddress)),
  );

  function resetQuote(): void {
    setQuote(null);
    setTaxQuoteToken(null);
    setAccepted(false);
    setError(null);
  }

  function reportError(message: string): void {
    setError(message);
    window.requestAnimationFrame(() => {
      errorRef.current?.focus();
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
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

  function chooseOrderSize(nextPeople: number, nextMeals: number): void {
    if (
      nextPeople < 1 ||
      nextPeople > MAX_PEOPLE_PER_ORDER ||
      nextMeals < 1 ||
      nextMeals > MAX_MEALS_PER_DAY ||
      mealSetCount(nextPeople, nextMeals) > MAX_MEAL_SETS_PER_ORDER
    ) {
      return;
    }
    const nextSelection = selectionForPlan(nextPeople, nextMeals);
    setPeopleCount(nextPeople);
    setMealsPerDay(nextMeals);
    setBowlSelection(nextSelection);
    window.sessionStorage.setItem("soulbowls:peopleCount", String(nextPeople));
    window.sessionStorage.setItem("soulbowls:mealsPerDay", String(nextMeals));
    window.sessionStorage.setItem(
      "soulbowls:bowlSelection",
      JSON.stringify(nextSelection),
    );
    resetQuote();
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
    setContact((current) => {
      const next = { ...current, [field]: value };
      window.sessionStorage.setItem(
        "soulbowls:checkoutContact",
        JSON.stringify(next),
      );
      return next;
    });
    setError(null);
  }

  function updateAddress(
    target: "billing" | "delivery",
    field: keyof CheckoutAddress,
    value: string,
  ): void {
    const setter = target === "billing" ? setBillingAddress : setDeliveryAddress;
    setter((current) => ({ ...current, [field]: value }));
    if (target === "delivery") {
      resetQuote();
    } else {
      setError(null);
    }
  }

  async function calculateTotal(): Promise<void> {
    if (!bowlSelectionComplete) {
      reportError(`Select exactly ${targetBowls} bowls before calculating the total.`);
      return;
    }
    if (
      fulfillmentMethod === "delivery" &&
      !addressIsComplete(deliveryAddress)
    ) {
      reportError("Enter the complete Los Angeles County delivery address.");
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
          mealsPerDay,
          peopleCount,
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
      reportError(
        quoteError instanceof Error ? quoteError.message : "Tax could not be calculated.",
      );
    } finally {
      setQuoting(false);
    }
  }

  function validatePaymentDetails(): boolean {
    if (!accepted || !quote) {
      reportError("Calculate the total and accept the terms before paying.");
      return false;
    }
    if (!bowlSelectionComplete) {
      reportError(`Select exactly ${targetBowls} bowls before checkout.`);
      return false;
    }
    if (!contactComplete) {
      reportError("Enter your full name, email, and US phone number.");
      return false;
    }
    if (!addressIsComplete(effectiveBillingAddress)) {
      reportError("Enter the complete billing address for the payment method.");
      return false;
    }
    if (fulfillmentMethod === "delivery" && !addressIsComplete(deliveryAddress)) {
      reportError("Enter the complete delivery address.");
      return false;
    }
    return true;
  }

  function billingContactDetails() {
    return {
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
  }

  async function submitCheckout(
    sourceId: string,
    verificationToken?: string,
    paymentMethod: "card" | "apple-pay" | "google-pay" = "card",
  ): Promise<void> {
    let leadId = window.sessionStorage.getItem("soulbowls:leadId");
    if (!leadId) {
      leadId = `direct-${crypto.randomUUID()}`;
      window.sessionStorage.setItem("soulbowls:leadId", leadId);
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
        mealsPerDay,
        paymentMethod,
        peopleCount,
        purchaseType,
        sourceId,
        ...(taxQuoteToken ? { taxQuoteToken } : {}),
        ...(verificationToken ? { verificationToken } : {}),
      }),
    });
    const data = (await response.json().catch(() => null)) as
      | CheckoutSuccess
      | { ok?: false; error?: string }
      | null;
    if (!response.ok || !data || data.ok !== true) {
      throw new Error(
        data && "error" in data && data.error
          ? data.error
          : "Square could not complete checkout.",
      );
    }

    const squareObjectId = data.paymentId || data.subscriptionId;
    if (!squareObjectId) {
      throw new Error(
        "Payment completed, but the confirmation could not be loaded. Check your email or account for the receipt.",
      );
    }

    const confirmation: LastOrderConfirmation = {
      version: 1,
      purchaseType: data.purchaseType,
      status: data.status,
      squareObjectId,
      squareOrderId: data.orderId || data.orderTemplateId,
      receiptUrl: data.receiptUrl,
      acceptedAt: data.acceptedAt,
      fulfillmentMethod: data.fulfillmentMethod,
      mealsPerDay: data.mealsPerDay,
      peopleCount: data.peopleCount,
      bowlSelection: data.bowlSelection,
      subtotalCents: data.tax.subtotalCents,
      taxCents: data.tax.taxCents,
      totalCents: data.tax.totalCents,
    };
    window.sessionStorage.setItem(
      purchaseType === "weekly"
        ? "soulbowls:subscriptionStatus"
        : "soulbowls:orderStatus",
      purchaseType === "weekly" ? "active" : "completed",
    );
    window.sessionStorage.setItem(
      LAST_ORDER_STORAGE_KEY,
      JSON.stringify(confirmation),
    );
    // A completed checkout is a terminal step. Replacing the route prevents
    // the browser Back button from returning to a submitted payment form.
    window.sessionStorage.removeItem("soulbowls:leadId");
    router.replace("/welcome?confirmed=1");
  }

  async function reserve(): Promise<void> {
    if (pending || !cardRef.current || !validatePaymentDetails()) return;
    const currentQuote = quote;
    if (!currentQuote) return;

    setPending(true);
    setError(null);
    try {
      const billingContact = billingContactDetails();
      const verificationDetails =
        purchaseType === "weekly"
          ? {
              billingContact,
              intent: "STORE",
              customerInitiated: true,
              sellerKeyedIn: false,
            }
          : {
              amount: (currentQuote.totalCents / 100).toFixed(2),
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
      await submitCheckout(tokenResult.token);
    } catch (checkoutError) {
      reportError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Square could not complete checkout.",
      );
    } finally {
      setPending(false);
    }
  }

  async function payWithWallet(method: "apple-pay" | "google-pay"): Promise<void> {
    const wallet = method === "apple-pay" ? applePayRef.current : googlePayRef.current;
    const payments = walletPaymentsRef.current;
    if (
      pending ||
      purchaseType !== "one-time" ||
      !wallet ||
      !payments ||
      !validatePaymentDetails()
    ) {
      return;
    }

    setPending(true);
    setError(null);
    try {
      // Square and Apple require wallet tokenization to begin directly from
      // the customer's click, before any network or other asynchronous work.
      const tokenResult = await wallet.tokenize();
      if (tokenResult.status !== "OK" || !tokenResult.token) {
        throw new Error(
          tokenResult.errors?.[0]?.message ??
            `${method === "apple-pay" ? "Apple Pay" : "Google Pay"} could not authorize this payment.`,
        );
      }

      const verification = await payments.verifyBuyer(tokenResult.token, {
        amount: (quote!.totalCents / 100).toFixed(2),
        billingContact: billingContactDetails(),
        currencyCode: "USD",
        intent: "CHARGE",
      });
      await submitCheckout(tokenResult.token, verification?.token, method);
    } catch (checkoutError) {
      reportError(
        checkoutError instanceof Error
          ? checkoutError.message
          : `${method === "apple-pay" ? "Apple Pay" : "Google Pay"} could not complete checkout.`,
      );
    } finally {
      setPending(false);
    }
  }

  function renderAddressFields(target: "billing" | "delivery") {
    const address = target === "billing" ? billingAddress : deliveryAddress;
    const prefix = target === "billing" ? "billing" : "shipping";
    const labelPrefix = target === "billing" ? "Billing" : "Delivery";
    return (
      <div className="grid gap-3">
        <label className="grid gap-2 text-xs font-bold tracking-[0.08em] text-forest/58 uppercase">
          {labelPrefix} street address
          <input
            autoComplete={`${prefix} address-line1`}
            className={INPUT_CLASS}
            placeholder="Street address"
            value={address.addressLine1}
            onChange={(event) => updateAddress(target, "addressLine1", event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-xs font-bold tracking-[0.08em] text-forest/58 uppercase">
          Apartment or suite <span className="font-normal normal-case">(optional)</span>
          <input
            autoComplete={`${prefix} address-line2`}
            className={INPUT_CLASS}
            placeholder="Apartment or suite"
            value={address.addressLine2}
            onChange={(event) => updateAddress(target, "addressLine2", event.target.value)}
          />
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_72px_96px] sm:gap-2">
          <label className="col-span-2 grid gap-2 text-xs font-bold tracking-[0.08em] text-forest/58 uppercase sm:col-span-1">
            City
            <input
              autoComplete={`${prefix} address-level2`}
              className={INPUT_CLASS}
              placeholder="City"
              value={address.city}
              onChange={(event) => updateAddress(target, "city", event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-xs font-bold tracking-[0.08em] text-forest/58 uppercase">
            State
            <input className={INPUT_CLASS} disabled value="CA" />
          </label>
          <label className="grid gap-2 text-xs font-bold tracking-[0.08em] text-forest/58 uppercase">
            ZIP
            <input
              autoComplete={`${prefix} postal-code`}
              className={INPUT_CLASS}
              inputMode="numeric"
              maxLength={5}
              placeholder="90001"
              value={address.postalCode}
              onChange={(event) => updateAddress(target, "postalCode", event.target.value)}
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Script src={scriptUrl} strategy="afterInteractive" onLoad={() => setSdkLoaded(true)} />

      <fieldset className="grid gap-3 border border-forest/14 bg-gold/10 p-5">
        <legend className="px-2 text-xs font-bold tracking-[0.12em] text-forest/55 uppercase">
          Step 1 · Plan size
        </legend>
        <div className="flex items-center justify-between gap-5">
          <div>
            <p className="font-serif text-2xl text-forest">
              {peopleCount} {peopleCount === 1 ? "person" : "people"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-forest/55">
              One customer account can cover the whole order.
            </p>
          </div>
          <div className="flex items-center border border-forest/18 bg-oat">
            <button
              type="button"
              aria-label="Remove one person"
              className="h-11 w-11 text-xl text-forest disabled:text-forest/25"
              disabled={pending || peopleCount === 1}
              onClick={() => chooseOrderSize(peopleCount - 1, mealsPerDay)}
            >
              −
            </button>
            <output
              aria-label={`${peopleCount} ${peopleCount === 1 ? "person" : "people"} selected`}
              className="flex h-11 min-w-11 items-center justify-center border-x border-forest/14 font-bold text-forest"
            >
              {peopleCount}
            </output>
            <button
              type="button"
              aria-label="Add one person"
              className="h-11 w-11 text-xl text-forest disabled:text-forest/25"
              disabled={pending || peopleCount === MAX_PEOPLE_PER_ORDER}
              onClick={() =>
                chooseOrderSize(
                  peopleCount + 1,
                  Math.min(
                    mealsPerDay,
                    Math.floor(MAX_MEAL_SETS_PER_ORDER / (peopleCount + 1)),
                  ),
                )
              }
            >
              +
            </button>
          </div>
        </div>

        <div className="border-t border-forest/10 pt-4">
          <p className="text-xs font-bold tracking-[0.1em] text-forest/55 uppercase">
            Meals per person, per day
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {Array.from({ length: MAX_MEALS_PER_DAY }, (_, index) => index + 1).map(
              (meals) => {
                const available =
                  mealSetCount(peopleCount, meals) <= MAX_MEAL_SETS_PER_ORDER;
                return (
                  <button
                    key={meals}
                    type="button"
                    disabled={pending || !available}
                    aria-pressed={mealsPerDay === meals}
                    onClick={() => chooseOrderSize(peopleCount, meals)}
                    className={`min-h-14 border px-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                      mealsPerDay === meals
                        ? "border-sage bg-sage/14 text-forest"
                        : "border-forest/14 bg-white/60 text-forest/65 hover:border-sage"
                    }`}
                  >
                    {meals} {meals === 1 ? "meal" : "meals"}
                  </button>
                );
              },
            )}
          </div>
        </div>

        <p className="border-t border-forest/10 pt-4 text-sm leading-relaxed text-forest/68">
          <strong className="text-forest">
            {peopleCount} × {mealsPerDay} × 5 days = {targetBowls} bowls
          </strong>
          <span className="mt-1 block">
            {formatCents(bowlOrderCents)} before fulfillment and California tax.
          </span>
        </p>
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="mb-2 text-xs font-bold tracking-[0.12em] text-forest/55 uppercase">
          Order frequency
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
                      {formatCents(bowlOrderCents)}
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
        mealsPerDay={mealsPerDay}
        onChange={updateBowlSelection}
        peopleCount={peopleCount}
        selection={bowlSelection}
      />

      <fieldset className="grid gap-2">
        <legend className="mb-2 text-xs font-bold tracking-[0.12em] text-forest/55 uppercase">
          Step 3 · Choose fulfillment
        </legend>
        {(Object.keys(FULFILLMENT) as FulfillmentMethod[]).map((method) => {
          const option = FULFILLMENT[method];
          return (
            <label key={method} className="grid cursor-pointer grid-cols-[1fr_auto] items-start gap-3 border border-forest/15 bg-white/60 p-4 text-sm text-forest/72 transition-colors hover:border-sage sm:items-center">
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
        <legend className="mb-1 text-xs font-bold tracking-[0.12em] text-forest/55 uppercase">Step 4 · Your details</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2 text-xs font-bold tracking-[0.08em] text-forest/58 uppercase">First name<input autoComplete="given-name" className={INPUT_CLASS} placeholder="First name" value={contact.givenName} onChange={(event) => updateContact("givenName", event.target.value)} /></label>
          <label className="grid gap-2 text-xs font-bold tracking-[0.08em] text-forest/58 uppercase">Last name<input autoComplete="family-name" className={INPUT_CLASS} placeholder="Last name" value={contact.familyName} onChange={(event) => updateContact("familyName", event.target.value)} /></label>
        </div>
        <label className="grid gap-2 text-xs font-bold tracking-[0.08em] text-forest/58 uppercase">Email<input autoComplete="email" className={INPUT_CLASS} inputMode="email" placeholder="you@example.com" type="email" value={contact.email} onChange={(event) => updateContact("email", event.target.value)} /></label>
        <label className="grid gap-2 text-xs font-bold tracking-[0.08em] text-forest/58 uppercase">Phone<input autoComplete="tel" className={INPUT_CLASS} inputMode="tel" placeholder="US phone number" type="tel" value={contact.phone} onChange={(event) => updateContact("phone", event.target.value)} /></label>
      </fieldset>

      {fulfillmentMethod === "delivery" && (
        <fieldset className="grid gap-3">
          <legend className="mb-1 text-xs font-bold tracking-[0.12em] text-forest/55 uppercase">LA County delivery address</legend>
          {renderAddressFields("delivery")}
          <label className="flex items-start gap-3 border border-forest/12 bg-white/55 p-4 text-sm text-forest/72">
            <input
              type="checkbox"
              className="mt-0.5 h-5 w-5 shrink-0 accent-forest"
              checked={!billingSameAsDelivery}
              onChange={(event) => {
                setBillingSameAsDelivery(!event.target.checked);
                setError(null);
              }}
            />
            <span>
              <strong className="block text-forest">Use a different billing address</strong>
              <span className="mt-1 block text-xs leading-relaxed text-forest/55">
                Select this when the payment method is billed somewhere other than the
                delivery address.
              </span>
            </span>
          </label>
        </fieldset>
      )}

      {(fulfillmentMethod === "pickup" || !billingSameAsDelivery) && (
        <fieldset className="grid gap-3">
          <legend className="mb-1 text-xs font-bold tracking-[0.12em] text-forest/55 uppercase">Billing address</legend>
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

      {error ? (
        <p
          ref={errorRef}
          role="alert"
          tabIndex={-1}
          className="border border-clay/35 bg-clay/8 px-4 py-3 text-sm leading-relaxed text-clay outline-none"
        >
          {error}
        </p>
      ) : null}

      <dl className="grid gap-3 border-y border-forest/10 py-5 text-sm text-forest/70">
        <div className="flex justify-between gap-4"><dt>{mealSets} five-meal {mealSets === 1 ? "set" : "sets"}<span className="block text-xs text-forest/50">{peopleCount} {peopleCount === 1 ? "person" : "people"} · {mealsPerDay} {mealsPerDay === 1 ? "meal" : "meals"}/day</span></dt><dd className="font-semibold text-forest">{formatCents(bowlOrderCents)}</dd></div>
        <div className="flex justify-between gap-4"><dt>{FULFILLMENT[fulfillmentMethod].label}</dt><dd className="font-semibold text-forest">{formatCents(FULFILLMENT[fulfillmentMethod].amountCents)}</dd></div>
        <div className="flex justify-between gap-4"><dt>California sales tax{quote && <span className="block text-xs text-forest/50">{quote.percentage}% · {quote.jurisdiction}</span>}</dt><dd className="font-semibold text-forest">{quote ? formatCents(quote.taxCents) : "Calculate above"}</dd></div>
        <div className="flex items-end justify-between gap-4 border-t border-forest/10 pt-4"><dt className="font-semibold text-forest">{purchaseType === "weekly" ? "Weekly charge" : "Total charge"}<span className="block text-xs font-normal text-forest/50">{purchaseType === "weekly" ? "Renews every 7 days until canceled" : "Charged once · no automatic renewal"}</span></dt><dd className="font-serif text-3xl font-semibold text-forest">{quote ? formatCents(quote.totalCents) : formatCents(bowlOrderCents + FULFILLMENT[fulfillmentMethod].amountCents)}</dd></div>
      </dl>

      <div>
        <p className="mb-2 text-xs font-bold tracking-[0.12em] text-forest/55 uppercase">Step 5 · Secure payment</p>
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
            ? `Your card will be charged ${quote ? formatCents(quote.totalCents) : "the displayed total"} today and every 7 days for ${peopleCount} ${peopleCount === 1 ? "person" : "people"} at ${mealsPerDay} ${mealsPerDay === 1 ? "meal" : "meals"} per day, selected fulfillment, and applicable tax until canceled.`
            : `Your selected payment method will be charged ${quote ? formatCents(quote.totalCents) : "the displayed total"} once for this ${targetBowls}-bowl order, selected fulfillment, and applicable tax. This order does not renew automatically.`}{" "}
          Any reusable-container deposit is separate and refundable under the return terms.
        </p>
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-forest/72">
        <input type="checkbox" checked={accepted} disabled={pending} onChange={(event) => setAccepted(event.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-forest" />
        <span>I authorize Soul Goods LLC to {purchaseType === "weekly" ? "save this card and charge the automatic weekly renewal shown above" : "charge the displayed total once using my selected payment method"}. I agree to the <Link href="/terms" className="font-semibold underline underline-offset-2">Terms of Service</Link> and <Link href="/customer-agreement" className="font-semibold underline underline-offset-2">Customer Agreement</Link>.</span>
      </label>

      {purchaseType === "one-time" ? (
        <div
          className="grid gap-3 border border-forest/12 bg-white/55 p-4"
          aria-label="Express checkout options"
        >
          <div className="flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-forest/12" />
            <span className="text-xs font-bold tracking-[0.1em] text-forest/50 uppercase">
              Express checkout
            </span>
            <span className="h-px flex-1 bg-forest/12" />
          </div>
          <div className={applePayReady ? "block" : "hidden"}>
            {applePayReady ? (
              <button
                type="button"
                aria-label="Buy with Apple Pay"
                className="apple-pay-button"
                disabled={pending || !walletPaymentReady}
                onClick={() => void payWithWallet("apple-pay")}
              />
            ) : null}
          </div>
          <div
            className={googlePayReady ? "min-h-12" : "hidden"}
            aria-hidden={!googlePayReady}
            onClick={() => void payWithWallet("google-pay")}
            style={
              pending || !walletPaymentReady
                ? { opacity: 0.45, pointerEvents: "none" }
                : undefined
            }
          >
            <div id="google-pay-button" className="min-h-12 w-full" />
          </div>
          {!quote ? (
            <p className="text-center text-xs leading-relaxed text-forest/55">
              Calculate your total to check this device for Apple Pay or Google Pay.
            </p>
          ) : !walletCheckComplete ? (
            <p className="text-center text-xs leading-relaxed text-forest/55">
              Checking this device for Apple Pay and Google Pay…
            </p>
          ) : !applePayReady && !googlePayReady ? (
            <p className="text-center text-xs leading-relaxed text-forest/60">
              No digital wallet is available in this browser. Use Safari with Apple Pay
              or a supported browser with Google Pay configured, or continue by card.
            </p>
          ) : !walletPaymentReady ? (
            <p className="text-center text-xs leading-relaxed text-forest/55">
              Complete your details, calculate the total, and accept the terms to use
              express checkout.
            </p>
          ) : null}
        </div>
      ) : (
        <p className="border border-forest/12 bg-white/55 px-4 py-3 text-xs leading-relaxed text-forest/60">
          Weekly plans require a card because Apple Pay and Google Pay cannot be saved
          for automatic renewal through Square.
        </p>
      )}

      <Button type="button" size="lg" className="w-full" disabled={pending || !accepted || !quote || !cardReady || !bowlSelectionComplete} onClick={reserve}>
        {pending
          ? purchaseType === "weekly"
            ? "Starting your weekly plan…"
            : "Placing your order…"
          : `${purchaseType === "weekly" ? "Start weekly Soul Bowls™" : "Pay by card"}${quote ? ` — ${formatCents(quote.totalCents)}` : ""}`}
      </Button>

      <p className="text-xs leading-relaxed text-forest/50">Secure {purchaseType === "weekly" ? "card storage and recurring billing are" : "card and digital-wallet payments are"} provided by Square. Wallet availability depends on your browser, device, and saved payment setup. {TAX.disclosure} Reusable-container deposit: {FEES.containerDeposit.amountCents === null ? "confirmed separately" : formatCents(FEES.containerDeposit.amountCents)}.</p>

    </div>
  );
}
