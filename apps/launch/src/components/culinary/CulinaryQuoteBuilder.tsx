"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ChefHat, Check, Printer, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CONTACT, formatCents } from "@/lib/brand";
import { type BowlId } from "@/lib/current-offer";
import { bowlSelectionTotal, type BowlSelection } from "@/lib/bowl-selection";
import { CulinaryMenu } from "./CulinaryMenu";
import { PlatedMenu } from "./PlatedMenu";
import { GatheringExtras } from "./GatheringExtras";
import type { ExtraLine } from "@/lib/menu-extras";
import { recipeName } from "@/lib/culinary-menu";
import {
  balancedCulinarySelection,
  CULINARY_PRICING,
  culinaryInputSchema,
  culinaryLineItems,
  culinaryRequestSchema,
  MAX_CULINARY_BOWLS,
  platedMenuName,
  type PlatedMenuId,
  type CulinaryExperience,
  type CulinaryInput,
  type CulinaryQuote,
} from "@/lib/culinary-booking";

const INPUT =
  "min-h-[48px] w-full min-w-0 rounded-md border border-forest/20 bg-white/70 px-3 py-3 text-base text-forest placeholder:text-forest/45 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30 disabled:opacity-60";
const LABEL = "grid min-w-0 gap-2 text-sm font-semibold text-forest";
const EMPTY_CONTACT = { name: "", email: "", phone: "" };
const STEPS = ["Experience", "Menu", "Event", "Review", "Contact"];

export function CulinaryQuoteBuilder({
  today,
  initialExperience = "delivery",
}: {
  today: string;
  initialExperience?: CulinaryExperience;
}) {
  const [experience, setExperience] = useState<CulinaryExperience>(initialExperience);
  const [guestCountInput, setGuestCountInput] = useState("10");
  const [guestCountTouched, setGuestCountTouched] = useState(false);
  const [platedMenu, setPlatedMenu] = useState<PlatedMenuId>("chefs-selection");
  const [step, setStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const wizard = useRef<HTMLDivElement | null>(null);
  const [extras, setExtras] = useState<ExtraLine[]>([]);
  const [selection, setSelection] = useState(() =>
    balancedCulinarySelection(10),
  );
  const [menuUndo, setMenuUndo] = useState<{
    selection: BowlSelection;
    message: string;
  } | null>(null);
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [occasion, setOccasion] = useState("");
  const [address, setAddress] = useState<CulinaryInput["address"]>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "CA",
    postalCode: "",
  });
  const [quote, setQuote] = useState<CulinaryQuote | null>(null);
  const [error, setError] = useState("");
  const [quoting, setQuoting] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [received, setReceived] = useState(false);
  const [expired, setExpired] = useState(false);
  const [contact, setContact] = useState(EMPTY_CONTACT);
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [accepted, setAccepted] = useState(false);
  const revision = useRef(0);
  const abort = useRef<AbortController | null>(null);
  const requestLock = useRef(false);
  const guestCount = Number(guestCountInput);
  const validGuestCount =
    guestCountInput.trim() !== "" &&
    Number.isInteger(guestCount) &&
    guestCount >= 1 &&
    guestCount <= MAX_CULINARY_BOWLS;
  const showGuestCountError = guestCountTouched && !validGuestCount;
  const count =
    experience === "plated" ? guestCount : bowlSelectionTotal(selection);
  const items =
    quote?.items ??
    (experience === "plated" && !validGuestCount
      ? []
      : culinaryLineItems(experience, selection, { platedMenu, guestCount, extras }));
  const foodItems = items.filter(
    (item) => item.kind === "bowl" || item.kind === "plated",
  );
  const extraItems = items.filter((item) => item.kind === "extra");
  const extrasTotal = extraItems.reduce((sum, item) => sum + item.amountCents, 0);
  const extrasItemCount = extraItems.reduce((sum, item) => sum + item.quantity, 0);
  const foodTotal = foodItems.reduce((sum, item) => sum + item.amountCents, 0);
  const subtotal = items.reduce((total, item) => total + item.amountCents, 0);
  const validCount =
    count >= (experience === "delivery" ? 10 : 1) &&
    count <= MAX_CULINARY_BOWLS &&
    (experience !== "plated" || validGuestCount);
  const locked = requesting || received;

  function goToStep(value: number) {
    if (quoting) invalidate();
    setStep(value);
    setFurthestStep((current) => Math.max(current, value));
    window.setTimeout(() => {
      wizard.current?.focus({ preventScroll: true });
      wizard.current?.scrollIntoView({ block: "start" });
    }, 0);
  }

  function changeGuests(value: string) {
    invalidate();
    setGuestCountInput(value);
    setGuestCountTouched(false);
  }

  useEffect(
    () => () => {
      abort.current?.abort();
    },
    [],
  );
  useEffect(() => {
    if (!quote || received) return;
    const timer = window.setTimeout(
      () => setExpired(true),
      Math.max(0, Date.parse(quote.expiresAt) - Date.now()),
    );
    return () => window.clearTimeout(timer);
  }, [quote, received]);

  function invalidate() {
    revision.current++;
    abort.current?.abort();
    setQuote(null);
    setQuoting(false);
    setAccepted(false);
    setExpired(false);
    setError("");
    setMenuUndo(null);
  }

  function quantity(id: BowlId, value: number) {
    invalidate();
    setSelection((current) => ({
      ...current,
      [id]: Number.isFinite(value)
        ? Math.max(
            0,
            Math.min(
              MAX_CULINARY_BOWLS - bowlSelectionTotal(current) + current[id],
              Math.trunc(value),
            ),
          )
        : 0,
    }));
  }
  function editAddress(key: keyof CulinaryInput["address"], value: string) {
    invalidate();
    setAddress((current) => ({ ...current, [key]: value }));
  }

  async function generate(event: FormEvent) {
    event.preventDefault();
    if (quoting || locked) return;
    if (step < 2) {
      if ((step === 0 && experience === "delivery") || validCount)
        goToStep(step + 1);
      return;
    }
    const input = culinaryInputSchema.safeParse({
      experience,
      ...(experience === "plated" ? { guestCount } : {}),
      bowlSelection:
        experience === "plated" ? balancedCulinarySelection(0) : selection,
      ...(experience === "plated" ? { platedMenu } : {}),
      ...(experience === "delivery" && extras.length ? { extras } : {}),
      eventDate,
      eventTime,
      occasion,
      address,
    });
    if (!input.success) {
      setError(input.error.issues[0].message);
      return;
    }
    const version = ++revision.current;
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 25_000);
    setQuoting(true);
    setQuote(null);
    setExpired(false);
    setAccepted(false);
    setError("");
    try {
      const response = await fetch("/api/culinary-quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input.data),
        signal: controller.signal,
      });
      const data = (await response.json().catch(() => null)) as {
        quote?: CulinaryQuote;
        error?: string;
      } | null;
      if (version !== revision.current) return;
      if (!response.ok || !data?.quote)
        throw new Error(
          data?.error || "We could not generate the quote. Please try again.",
        );
      setQuote(data.quote);
      setStep(3);
      setFurthestStep((current) => Math.max(current, 3));
      window.setTimeout(() => {
        if (version === revision.current) {
          wizard.current?.focus({ preventScroll: true });
          wizard.current?.scrollIntoView({ block: "start" });
        }
      }, 0);
    } catch (cause) {
      if (version === revision.current)
        setError(
          cause instanceof Error &&
            !(cause instanceof TypeError) &&
            cause.name !== "AbortError"
            ? cause.message
            : "We could not reach the quote service. Your selections are saved here—please check your connection and try again.",
        );
    } finally {
      window.clearTimeout(timeout);
      if (version === revision.current) setQuoting(false);
    }
  }

  async function requestBooking(event: FormEvent) {
    event.preventDefault();
    if (!quote || requestLock.current || received || expired) return;
    const parsed = culinaryRequestSchema.safeParse({
      quoteId: quote.id,
      contact,
      company,
      notes,
      acceptedEstimate: accepted,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    requestLock.current = true;
    setRequesting(true);
    setError("");
    try {
      const response = await fetch("/api/culinary-quotes/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: AbortSignal.timeout(25_000),
      });
      const data = (await response.json().catch(() => null)) as {
        received?: boolean;
        error?: string;
        expired?: boolean;
      } | null;
      if (data?.expired) setExpired(true);
      if (!response.ok || !data?.received)
        throw new Error(
          data?.error ||
            "We could not confirm receipt. Retry this request using the same quote.",
        );
      setReceived(true);
      wizard.current?.focus({ preventScroll: true });
      wizard.current?.scrollIntoView({ block: "start" });
    } catch (cause) {
      setError(
        cause instanceof Error &&
          !(cause instanceof TypeError) &&
          !["TimeoutError", "AbortError"].includes(cause.name)
          ? cause.message
          : "We could not confirm receipt yet. Retry this request using the same quote. No payment has been taken.",
      );
    } finally {
      requestLock.current = false;
      setRequesting(false);
    }
  }

  return (
    <div
      ref={wizard}
      tabIndex={-1}
      aria-label={
        received
          ? "Booking request received"
          : `Step ${step + 1} of 5: ${STEPS[step]}`
      }
      className="culinary-layout mx-auto w-full max-w-3xl scroll-mt-28 outline-none"
    >
      {!received && (
        <nav
          aria-label="Quote progress"
          className="print-hidden relative mb-6 grid grid-cols-5 gap-1 sm:gap-3"
        >
          {/* Progress rail — brand adaptation of 21st.dev shadcnspace/segmented-progress-pill-stepper */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-[10%] top-[1.375rem] h-0.5 rounded-full bg-forest/10">
            <span
              className="block h-full rounded-full bg-sage transition-[width] duration-500 ease-(--ease-soft)"
              style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
            />
          </span>
          {STEPS.map((label, index) => (
            <button
              key={label}
              type="button"
              disabled={
                locked ||
                index > furthestStep ||
                (index >= 3 && !quote) ||
                (index >= (experience === "plated" ? 1 : 2) && !validCount)
              }
              aria-current={index === step ? "step" : undefined}
              onClick={() => goToStep(index)}
              className={`relative flex min-h-14 min-w-0 flex-col items-center justify-start gap-1.5 rounded-md px-1 py-2 text-[11px] font-semibold transition-colors sm:text-sm ${index === step ? "text-forest" : "text-forest/60 enabled:hover:text-forest disabled:opacity-50"}`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ring-4 ring-card transition-colors duration-300 ${index === step ? "bg-forest text-oat" : index < step ? "bg-sage text-oat" : "bg-sand text-forest/70"}`}
              >
                {index < step ? (
                  <Check size={13} aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              {label}
            </button>
          ))}
        </nav>
      )}
      {step < 3 && !received && (
        <div
          className="print-hidden mb-6 flex flex-wrap items-center justify-between gap-2 border border-forest/15 bg-sand/30 px-4 py-3 text-sm rounded-lg"
          aria-label="Running estimate"
        >
          <span>
            {experience === "plated"
              ? validGuestCount
                ? `${guestCount} ${guestCount === 1 ? "guest" : "guests"} · Plated`
                : "Plated experience"
              : `${count} bowls${extrasItemCount ? ` + ${extrasItemCount} salads & snacks` : ""} · Delivery`}
          </span>
          {experience === "plated" && !validGuestCount ? (
            <span>Enter guests to see your estimate</span>
          ) : (
            <span>
              <strong aria-live="polite">{formatCents(subtotal)}</strong>{" "}
              <span className="text-xs text-forest/65">before tax</span>
            </span>
          )}
        </div>
      )}
      <form
        onSubmit={generate}
        hidden={step > 2 || received}
        className="print-hidden min-w-0"
      >
        <fieldset
          disabled={locked}
          className="min-w-0 space-y-6 disabled:opacity-65"
        >
          <legend className="sr-only">Culinary quote details</legend>
          <fieldset
            hidden={step !== 0}
            disabled={step !== 0}
            className="min-w-0"
            aria-labelledby="experience-title"
          >
            <h2
              id="experience-title"
              className="mb-5 text-center font-serif text-3xl sm:text-left"
            >
              <span className="mr-3 text-clay">01</span> Choose your experience
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["delivery", "plated"] as const).map((option) => (
                <label
                  key={option}
                  className={`relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-lg border p-5 pt-0 transition-[border-color,background-color,box-shadow] duration-300 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-clay ${experience === option ? "border-forest bg-forest text-oat shadow-[0_24px_48px_-32px_rgb(44_58_52/0.8)]" : "border-forest/20 bg-white/40 text-forest hover:border-sage"}`}
                >
                  <span className="relative -mx-5 mb-2 block aspect-[16/9] overflow-hidden">
                    <Image
                      src={option === "delivery" ? "/gatherings/team-lunch.webp" : "/gatherings/plated-dinner.webp"}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 360px, 100vw"
                      className={`object-cover transition-transform duration-700 ${experience === option ? "scale-[1.03]" : ""}`}
                    />
                  </span>
                  <div className="flex items-center justify-between">
                    <span>
                      {option === "delivery" ? (
                        <Truck size={24} aria-hidden="true" />
                      ) : (
                        <ChefHat size={24} aria-hidden="true" />
                      )}
                    </span>
                    <input
                      type="radio"
                      name="experience"
                      value={option}
                      checked={experience === option}
                      onChange={() => {
                        invalidate();
                        setExperience(option);
                      }}
                      className="h-5 w-5 accent-sage"
                    />
                  </div>
                  <span className="font-serif text-2xl">
                    {option === "delivery"
                      ? "Bowl delivery"
                      : "Plated experience"}
                  </span>
                  <span className="text-sm leading-6">
                    {option === "delivery"
                      ? "A minimum of 10 bowls. Delivered ready for your gathering, without on-site service."
                      : "$55 per guest, with a $555 food minimum, plus $500 culinary support. Includes plating, service, and ingredient education."}
                  </span>
                  <span
                    className={`mt-auto text-xs font-semibold ${experience === option ? "text-oat/75" : "text-forest/70"}`}
                  >
                    Tax and delivery calculated separately
                  </span>
                </label>
              ))}
            </div>
            {experience === "plated" && (
              <label className={`${LABEL} mt-6`}>
                How many guests are you serving?
                <input
                  type="number"
                  required
                  min={1}
                  max={MAX_CULINARY_BOWLS}
                  step={1}
                  inputMode="numeric"
                  value={guestCountInput}
                  onChange={(event) => changeGuests(event.target.value)}
                  onBlur={() => setGuestCountTouched(true)}
                  aria-invalid={showGuestCountError}
                  aria-describedby={`guest-count-help${showGuestCountError ? " guest-count-error" : ""}`}
                  className={INPUT}
                />
                <span
                  id="guest-count-help"
                  className="font-normal leading-6 text-forest/75"
                >
                  We’ll size one menu for your whole group. Choose the food
                  style in the next step.
                </span>
                {showGuestCountError && (
                  <span
                    id="guest-count-error"
                    role="alert"
                    className="text-sm font-semibold"
                  >
                    Enter a whole number from 1 to{" "}
                    {MAX_CULINARY_BOWLS.toLocaleString("en-US")} guests.
                  </span>
                )}
              </label>
            )}
            {experience === "plated" && (
              <div className="mt-4 flex gap-3 border-l-2 border-sage bg-sage/10 p-4 text-sm leading-6">
                <Check size={18} className="mt-1 shrink-0" aria-hidden="true" />
                <p>
                  Your $500 culinary support includes plating, service, and
                  ingredient education. Our team confirms staffing and arrival
                  time with you.
                </p>
              </div>
            )}
          </fieldset>

          <fieldset
            hidden={step !== 1}
            disabled={step !== 1}
            className="min-w-0"
            aria-labelledby="menu-title"
          >
            {experience === "plated" ? (
              <PlatedMenu
                value={platedMenu}
                guestCount={guestCount}
                onChange={(value) => {
                  invalidate();
                  setPlatedMenu(value);
                }}
              />
            ) : (
              <CulinaryMenu
                selection={selection}
                onQuantity={quantity}
                onChange={(next, message) => {
                  const previous = selection;
                  invalidate();
                  setSelection(next);
                  setMenuUndo({ selection: previous, message });
                }}
                undo={menuUndo}
                onUndo={() => {
                  if (!menuUndo) return;
                  const previous = menuUndo.selection;
                  invalidate();
                  setSelection(previous);
                }}
              />
            )}
            {experience === "delivery" ? (
              <GatheringExtras
                lines={extras}
                onChange={(next) => {
                  invalidate();
                  setExtras(next);
                }}
              />
            ) : null}
          </fieldset>

          <fieldset
            hidden={step !== 2}
            disabled={step !== 2}
            className="min-w-0"
            aria-labelledby="event-title"
          >
            <h2 id="event-title" className="mb-5 font-serif text-3xl">
              <span className="mr-3 text-clay">03</span> Tell us where & when
            </h2>
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <label className={LABEL}>
                Event date
                <input
                  type="date"
                  min={today}
                  required
                  value={eventDate}
                  onChange={(event) => {
                    invalidate();
                    setEventDate(event.target.value);
                  }}
                  className={INPUT}
                />
              </label>
              <label className={LABEL}>
                Preferred time (Los Angeles)
                <input
                  type="time"
                  required
                  value={eventTime}
                  onChange={(event) => {
                    invalidate();
                    setEventTime(event.target.value);
                  }}
                  className={INPUT}
                />
              </label>
              <label className={`${LABEL} sm:col-span-2`}>
                Occasion <span className="sr-only">optional</span>
                <input
                  maxLength={120}
                  placeholder="Team lunch, celebration, retreat… (optional)"
                  value={occasion}
                  onChange={(event) => {
                    invalidate();
                    setOccasion(event.target.value);
                  }}
                  className={INPUT}
                />
              </label>
              <label className={`${LABEL} sm:col-span-2`}>
                Event street address
                <input
                  autoComplete="shipping address-line1"
                  required
                  minLength={3}
                  maxLength={200}
                  value={address.addressLine1}
                  onChange={(event) =>
                    editAddress("addressLine1", event.target.value)
                  }
                  placeholder="Street address"
                  className={INPUT}
                />
              </label>
              <label className={`${LABEL} sm:col-span-2`}>
                Suite or venue details (optional)
                <input
                  autoComplete="shipping address-line2"
                  maxLength={200}
                  value={address.addressLine2}
                  onChange={(event) =>
                    editAddress("addressLine2", event.target.value)
                  }
                  className={INPUT}
                />
              </label>
              <label className={LABEL}>
                City
                <input
                  autoComplete="shipping address-level2"
                  required
                  minLength={2}
                  maxLength={100}
                  value={address.city}
                  onChange={(event) => editAddress("city", event.target.value)}
                  className={INPUT}
                />
              </label>
              <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-3">
                <label className={LABEL}>
                  State
                  <input value="CA" readOnly className={INPUT} />
                </label>
                <label className={LABEL}>
                  ZIP code
                  <input
                    autoComplete="shipping postal-code"
                    inputMode="numeric"
                    required
                    pattern="[0-9]{5}"
                    maxLength={5}
                    value={address.postalCode}
                    onChange={(event) =>
                      editAddress("postalCode", event.target.value)
                    }
                    className={INPUT}
                  />
                </label>
              </div>
            </div>
            <p className="mt-4 text-xs leading-6 text-forest/70">
              Los Angeles County only. Your address is used to verify service
              area and calculate current tax. Event dates, timing, and dietary
              requests are subject to confirmation.
            </p>
          </fieldset>
          {error && !quote && (
            <p
              role="alert"
              className="border border-clay/40 bg-clay/10 p-3 text-sm leading-6 rounded-lg"
            >
              {error}
            </p>
          )}
          <div className="culinary-sticky-actions sticky bottom-0 z-10 flex items-center gap-3 border-t border-forest/15 bg-oat/95 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
            {step > 0 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => goToStep(step - 1)}
                className="shrink-0 !px-4"
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              disabled={
                quoting ||
                ((step > 0 || experience === "plated") && !validCount)
              }
              className="w-full"
            >
              {step === 0
                ? "Choose my menu"
                : step === 1
                  ? "Add event details"
                  : quoting
                    ? "Calculating your quote…"
                    : quote
                      ? "Refresh my quote"
                      : "Generate my quote"}
            </Button>
          </div>
        </fieldset>
      </form>

      <aside
        hidden={step < 3 && !received}
        className="culinary-quote-aside min-w-0 border border-forest/20 bg-white/50 rounded-lg"
        aria-labelledby="quote-heading"
      >
        <div className="bg-forest px-5 py-6 text-oat sm:px-7">
          <p className="text-xs uppercase tracking-[0.16em] text-gold">
            Soul Bowls™ · Culinary bookings
          </p>
          <h2 id="quote-heading" className="mt-3 font-serif text-3xl">
            {received
              ? "Request received."
              : step === 4
                ? "Let’s make it happen."
                : quote
                  ? "Your event estimate."
                  : "Your gathering, itemized."}
          </h2>
          <p className="mt-2 text-sm text-oat/80">
            {experience === "plated"
              ? `${guestCount} guests · $55 per person + culinary support`
              : "Bowl delivery only"}
          </p>
        </div>
        <div className="p-5 sm:p-7">
          <div
            className="culinary-review-details"
            hidden={step !== 3 || received}
          >
            {quote && (
              <div className="mb-5 border-b border-forest/15 pb-5 text-sm leading-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">Quote {quote.reference}</p>
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="print-hidden min-h-11 shrink-0 font-semibold underline underline-offset-4"
                  >
                    Edit event details
                  </button>
                </div>
                <p>
                  {quote.input.occasion || "Your gathering"} ·{" "}
                  {quote.input.eventDate} at {quote.input.eventTime} PT
                </p>
                <p>
                  {quote.input.address.addressLine1}
                  {quote.input.address.addressLine2
                    ? `, ${quote.input.address.addressLine2}`
                    : ""}
                  <br />
                  {quote.input.address.city}, CA{" "}
                  {quote.input.address.postalCode}
                </p>
              </div>
            )}
            <div className="mb-5 border-b border-forest/15 pb-5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">Your menu</h3>
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="print-hidden min-h-11 font-semibold underline underline-offset-4"
                >
                  Edit menu
                </button>
              </div>
              <ul className="mt-1 grid gap-2 text-forest/75">
                {[...foodItems, ...extraItems].map((item) => (
                  <li key={item.id} className="flex justify-between gap-4">
                    <span>
                      {item.kind === "plated"
                        ? platedMenuName(platedMenu)
                        : item.kind === "extra"
                          ? item.label
                          : recipeName(item.label)}
                      {item.note ? (
                        <span className="block text-xs text-forest/55">{item.note}</span>
                      ) : null}
                    </span>
                    <span className="shrink-0 font-semibold">
                      {item.kind === "plated"
                        ? `${item.quantity} guests`
                        : `× ${item.quantity}`}
                    </span>
                  </li>
                ))}
              </ul>
              {experience === "plated" && (
                <p className="mt-3 text-xs leading-5 text-forest/65">
                  Food style for the whole group. Final dishes and dietary
                  requests will be confirmed before booking.
                </p>
              )}
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt>
                  {experience === "plated" ? "Plated menu" : "Bowl menu"}
                  <span className="mt-1 block text-xs text-forest/65">
                    {count} {experience === "plated" ? "guests" : "bowls"} ×{" "}
                    {formatCents(
                      experience === "plated"
                        ? CULINARY_PRICING.platedPersonCents
                        : CULINARY_PRICING.bowlUnitCents,
                    )}
                  </span>
                </dt>
                <dd className="shrink-0 font-semibold">
                  {formatCents(foodTotal)}
                </dd>
              </div>
              {extrasTotal > 0 && (
                <div className="flex items-start justify-between gap-4">
                  <dt>
                    Salads &amp; snacks
                    <span className="mt-1 block text-xs text-forest/65">
                      {extrasItemCount} {extrasItemCount === 1 ? "item" : "items"} at menu prices
                    </span>
                  </dt>
                  <dd className="shrink-0 font-semibold">{formatCents(extrasTotal)}</dd>
                </div>
              )}
              {items
                .filter(
                  (item) => item.kind !== "bowl" && item.kind !== "plated" && item.kind !== "extra",
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4"
                  >
                    <dt className="min-w-0 leading-5">
                      {item.label}
                      {item.kind === "minimum" && (
                        <span className="mt-1 block text-xs text-forest/65">
                          Brings food charges to the $555 minimum; does not add
                          guest servings.
                        </span>
                      )}
                      {item.kind === "support" && (
                        <span className="mt-1 block text-xs text-forest/65">
                          Mandatory; in addition to the food minimum.
                        </span>
                      )}
                    </dt>
                    <dd className="shrink-0 font-semibold">
                      {formatCents(item.amountCents)}
                    </dd>
                  </div>
                ))}
              <div className="flex justify-between gap-4 border-t border-forest/15 pt-4">
                <dt>Subtotal before tax</dt>
                <dd className="font-semibold">{formatCents(subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>
                  Estimated CA sales tax
                  {quote ? ` (${quote.taxPercentage}%)` : ""}
                </dt>
                <dd className="shrink-0 font-semibold">
                  {quote ? formatCents(quote.taxCents) : "After address check"}
                </dd>
              </div>
            </dl>
            <div className="mt-6 border-y border-forest/15 py-5">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-forest/70">
                {quote ? "Estimated total · USD" : "Estimate before tax · USD"}
              </p>
              <p
                className="mt-2 font-serif text-4xl tracking-tight"
                aria-live="polite"
              >
                {formatCents(quote?.totalCents ?? subtotal)}
              </p>
              <p className="mt-2 text-xs leading-5 text-forest/70">
                {quote
                  ? "Current tax rate verified for the event address. Final tax and availability confirmed before payment."
                  : "Generate your quote to verify the address and see tax. This is not the final total."}
              </p>
            </div>
            {quote?.paymentSchedule && (
              <div
                className="mt-5 space-y-4 bg-sand/40 p-4 text-sm"
                aria-label="Payment schedule"
              >
                <div className="flex justify-between gap-4">
                  <span>50% deposit</span>
                  <strong>
                    {formatCents(quote.paymentSchedule.depositCents)}
                  </strong>
                </div>
                <p className="!mt-1 text-xs leading-5 text-forest/75">
                  After availability is confirmed and your contract is signed.
                </p>
                <div className="flex justify-between gap-4">
                  <span>Remaining balance</span>
                  <strong>
                    {formatCents(quote.paymentSchedule.balanceCents)}
                  </strong>
                </div>
                <p className="!mt-1 text-xs leading-5 text-forest/75">
                  Due {quote.paymentSchedule.balanceDueDate}, before our team
                  arrives. No automatic charge.
                </p>
              </div>
            )}
          </div>
          {step === 4 && !received && quote && (
            <div className="print-hidden mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-forest/15 pb-4 text-sm">
              <span>
                Quote {quote.reference} · {formatCents(quote.totalCents)}
              </span>
              <span className="font-semibold">
                50% deposit:{" "}
                {formatCents(
                  quote.paymentSchedule?.depositCents ??
                    Math.round(quote.totalCents / 2),
                )}
              </span>
            </div>
          )}
          {quote && step === 3 && !received && (
            <div className="print-hidden mt-4">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex min-h-11 items-center gap-2 text-sm font-semibold text-clay underline underline-offset-4"
              >
                <Printer size={16} aria-hidden="true" />
                Print / save PDF
              </button>
            </div>
          )}
          {!received && (
            <p className="mt-3 text-xs leading-5 text-forest/70">
              This is an estimate, not a reservation or invoice. No payment is
              collected here.{" "}
              {quote && !received
                ? "Refresh the estimate after 30 minutes."
                : ""}
            </p>
          )}
          {expired && !received && (
            <p
              role="status"
              className="print-hidden mt-4 border border-clay/40 bg-clay/10 p-3 text-sm rounded-lg"
            >
              This estimate expired. Refresh your quote before requesting a
              booking.
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="mt-2 block min-h-11 font-semibold underline underline-offset-4"
              >
                Review event details & refresh
              </button>
            </p>
          )}
          {error && quote && (
            <p
              role="alert"
              className="print-hidden mt-4 border border-clay/40 bg-clay/10 p-3 text-sm leading-6 rounded-lg"
            >
              {error}
            </p>
          )}

          {step === 3 && !received && quote && (
            <div className="print-hidden mt-6 flex items-center gap-3 border-t border-forest/15 pt-5">
              <Button
                type="button"
                variant="secondary"
                onClick={() => goToStep(2)}
                className="shrink-0 !px-4"
              >
                Back
              </Button>
              <Button
                type="button"
                disabled={expired}
                onClick={() => goToStep(4)}
                className="w-full"
              >
                Continue to contact
              </Button>
            </div>
          )}
          {received ? (
            <div
              className="mt-6 border border-sage/40 bg-sage/10 p-4 rounded-lg"
              role="status"
            >
              <p className="font-semibold">Thank you—your request is saved.</p>
              <p className="mt-2 text-sm leading-6">
                Our team will confirm availability and discuss the event with
                you. Your date is not reserved yet and no payment has been
                taken.
              </p>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6">
                <li>
                  We review your date, guest count, menu, and event details.
                </li>
                <li>
                  We send your Square contract and invoice for review. Sign your
                  contract, then pay the 50% deposit to reserve.
                </li>
                <li>
                  Pay the remaining balance on the event date, before our team
                  arrives.
                </li>
              </ol>
              <Button
                type="button"
                variant="secondary"
                className="print-hidden mt-4 w-full"
                onClick={() => {
                  invalidate();
                  setReceived(false);
                  setContact(EMPTY_CONTACT);
                  setCompany("");
                  setNotes("");
                  setEventDate("");
                  setEventTime("");
                  setOccasion("");
                  setExtras([]);
                  setFurthestStep(0);
                  goToStep(0);
                }}
              >
                Start another quote
              </Button>
            </div>
          ) : (
            quote &&
            step === 4 && (
              <form onSubmit={requestBooking} className="print-hidden mt-5">
                <p className="mb-5 mt-2 text-sm leading-6 text-forest/75">
                  We’ll review availability, then send your contract and Square
                  invoice. Your 50% deposit reserves the date after approval and
                  signature.
                </p>
                <fieldset disabled={requesting} className="grid gap-4">
                  <legend className="sr-only">Booking contact details</legend>
                  <label className={LABEL}>
                    Your name
                    <input
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={120}
                      value={contact.name}
                      onChange={(event) =>
                        setContact({ ...contact, name: event.target.value })
                      }
                      className={INPUT}
                    />
                  </label>
                  <label className={LABEL}>
                    Email
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      value={contact.email}
                      onChange={(event) =>
                        setContact({ ...contact, email: event.target.value })
                      }
                      className={INPUT}
                    />
                  </label>
                  <label className={LABEL}>
                    Phone
                    <input
                      type="tel"
                      autoComplete="tel"
                      required
                      value={contact.phone}
                      onChange={(event) =>
                        setContact({ ...contact, phone: event.target.value })
                      }
                      className={INPUT}
                    />
                  </label>
                  <label className={LABEL}>
                    Dietary needs & event notes (optional)
                    <textarea
                      maxLength={2000}
                      rows={3}
                      placeholder="Allergies, access instructions, service timing…"
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      className={INPUT}
                    />
                    <span className="font-normal text-forest/70">
                      Our team will confirm dietary requests before booking.
                    </span>
                  </label>
                  <details className="border-y border-forest/15 py-3">
                    <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold">
                      Add a company or organization (optional)
                    </summary>
                    <div className="grid gap-4 pt-3">
                      <label className={LABEL}>
                        Company or organization (optional)
                        <input
                          autoComplete="organization"
                          maxLength={120}
                          value={company}
                          onChange={(event) => setCompany(event.target.value)}
                          className={INPUT}
                        />
                      </label>
                    </div>
                  </details>
                  <label className="flex items-start gap-3 text-sm leading-6">
                    <input
                      type="checkbox"
                      required
                      checked={accepted}
                      onChange={(event) => setAccepted(event.target.checked)}
                      className="mt-1 h-5 w-5 shrink-0 accent-forest"
                    />
                    <span>
                      I understand this is a booking request, not a confirmed
                      reservation, and agree to be contacted about my event.
                    </span>
                  </label>
                  <p className="text-xs leading-5 text-forest/65">
                    Your details are used to plan and invoice this event, as described in our{" "}
                    <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a>.
                  </p>
                  <Button
                    type="submit"
                    disabled={expired || !accepted}
                    className="w-full"
                  >
                    {requesting ? "Sending request…" : "Request this booking"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => goToStep(3)}
                    className="w-full"
                  >
                    Back to quote review
                  </Button>
                </fieldset>
              </form>
            )
          )}
        </div>
      </aside>
      <p className="print-hidden mt-6 text-center text-sm text-forest/75">
        Have a question?{" "}
        <a
          href={`mailto:${CONTACT.email}`}
          className="font-semibold text-clay underline underline-offset-4"
        >
          Contact our team
        </a>
      </p>
      <style>{`@media print { .culinary-page .print-hidden { display: none !important; } .culinary-page main { padding: 0; } .culinary-layout { display: block !important; } .culinary-quote-aside { position: static !important; width: 100%; border: 0; background: white; } .culinary-review-details { display: block !important; } .culinary-quote-aside > div:first-child, .culinary-quote-aside > div:first-child p { background: white; color: #2C3A34; } .culinary-page { background: white; } }`}</style>
    </div>
  );
}
