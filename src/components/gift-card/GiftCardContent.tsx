"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Gift } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

/* ============================================
   Gift Card Value Options
   ============================================ */

const GIFT_CARD_VALUES = [50, 100, 150, 200] as const;

/* ============================================
   Zod Schema — manual validation pattern
   (no @hookform/resolvers, Zod v4 compatible)
   ============================================ */

const giftCardSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientEmail: z
    .string()
    .min(1, "Recipient email is required")
    .email("Please enter a valid email address"),
  senderName: z.string().min(1, "Your name is required"),
  message: z.string().optional(),
});

type GiftCardFormData = z.infer<typeof giftCardSchema>;

/* ============================================
   Hero Section
   ============================================ */

function GiftCardHero() {
  return (
    <section className="bg-cream">
      <div className="max-container section-padding text-center">
        <p className="label-text text-primary mb-5 text-xs tracking-widest">
          GIFT CARDS
        </p>
        <h1 className="font-heading text-[2.75rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.08] mb-6 max-w-4xl mx-auto">
          Give the Gift of Soul Good
        </h1>
        <p className="font-body text-lg md:text-xl text-black/70 leading-relaxed max-w-2xl mx-auto">
          Share the nourishment of Chef Kyla&apos;s premium wellness meals with
          someone you love. The perfect gift for any occasion.
        </p>
      </div>
    </section>
  );
}

/* ============================================
   Value Selector
   ============================================ */

interface ValueSelectorProps {
  selectedValue: number | null;
  customValue: string;
  isCustom: boolean;
  onSelectPreset: (value: number) => void;
  onSelectCustom: () => void;
  onCustomValueChange: (value: string) => void;
}

function ValueSelector({
  selectedValue,
  customValue,
  isCustom,
  onSelectPreset,
  onSelectCustom,
  onCustomValueChange,
}: ValueSelectorProps) {
  return (
    <div>
      <h2 className="font-sans text-xs uppercase tracking-[0.16em] font-medium text-black/50 mb-6">
        SELECT GIFT CARD VALUE
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {GIFT_CARD_VALUES.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onSelectPreset(value)}
            className={cn(
              "py-4 px-6 border text-center transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
              "font-sans text-base font-medium",
              !isCustom && selectedValue === value
                ? "bg-black text-white border-black"
                : "bg-transparent text-black border-border hover:border-black"
            )}
          >
            ${value}
          </button>
        ))}
        <button
          type="button"
          onClick={onSelectCustom}
          className={cn(
            "py-4 px-6 border text-center transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
            "font-sans text-sm uppercase tracking-[0.06em] font-medium",
            isCustom
              ? "bg-black text-white border-black"
              : "bg-transparent text-black border-border hover:border-black"
          )}
        >
          Custom
        </button>
      </div>

      {isCustom && (
        <div className="mt-6 max-w-xs">
          <label
            htmlFor="custom-amount"
            className="block font-sans text-xs uppercase tracking-[0.06em] font-medium text-black/70 mb-2"
          >
            Custom Amount ($)
          </label>
          <input
            id="custom-amount"
            type="number"
            min="10"
            max="1000"
            placeholder="Enter amount"
            value={customValue}
            onChange={(e) => onCustomValueChange(e.target.value)}
            className={cn(
              "w-full bg-transparent border-0 border-b border-border px-0 py-3",
              "font-body text-base text-black placeholder:text-black/40",
              "focus:border-black focus:outline-none",
              "transition-colors duration-300"
            )}
          />
          <p className="mt-1.5 text-xs font-sans text-black/50">
            Minimum $10, maximum $1,000
          </p>
        </div>
      )}
    </div>
  );
}

/* ============================================
   Gift Card Form
   ============================================ */

export function GiftCardContent() {
  const [selectedValue, setSelectedValue] = useState<number | null>(100);
  const [customValue, setCustomValue] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<GiftCardFormData>({
    defaultValues: {
      recipientName: "",
      recipientEmail: "",
      senderName: "",
      message: "",
    },
  });

  const getSelectedAmount = (): number | null => {
    if (isCustom) {
      const parsed = parseFloat(customValue);
      if (!isNaN(parsed) && parsed >= 10 && parsed <= 1000) {
        return parsed;
      }
      return null;
    }
    return selectedValue;
  };

  const handleSelectPreset = (value: number) => {
    setIsCustom(false);
    setSelectedValue(value);
  };

  const handleSelectCustom = () => {
    setIsCustom(true);
    setSelectedValue(null);
  };

  const onSubmit = (data: GiftCardFormData) => {
    /* Manual Zod validation (Zod v4 pattern, no @hookform/resolvers) */
    const result = giftCardSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof GiftCardFormData;
        setError(field, { message: issue.message });
      }
      return;
    }

    const amount = getSelectedAmount();
    if (!amount) {
      return;
    }

    // TODO: Backend Integration - Process gift card purchase via payment API
    console.log("Gift card purchased:", {
      amount,
      ...result.data,
    });

    setIsSuccess(true);
    reset();
  };

  if (isSuccess) {
    return (
      <>
        <GiftCardHero />
        <section className="max-container section-padding">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto bg-accent/10 flex items-center justify-center mb-6">
              <Gift className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl mb-4">
              Gift Card Sent!
            </h2>
            <p className="font-body text-base text-black/70 leading-relaxed mb-8">
              Your Soul Good gift card has been sent. The recipient will receive
              an email with their gift card code and redemption instructions.
            </p>
            <button
              type="button"
              onClick={() => setIsSuccess(false)}
              className={cn(
                "inline-flex items-center justify-center",
                "font-sans text-sm uppercase tracking-[0.06em] font-medium",
                "bg-black text-white px-8 py-4",
                "hover:bg-black/80 active:bg-black/70",
                "transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]"
              )}
            >
              PURCHASE ANOTHER GIFT CARD
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <GiftCardHero />

      <section className="max-container section-padding">
        <div className="max-w-3xl mx-auto">
          {/* Value Selector */}
          <ValueSelector
            selectedValue={selectedValue}
            customValue={customValue}
            isCustom={isCustom}
            onSelectPreset={handleSelectPreset}
            onSelectCustom={handleSelectCustom}
            onCustomValueChange={setCustomValue}
          />

          {/* Divider */}
          <hr className="border-border my-12" />

          {/* Recipient Form */}
          <div>
            <h2 className="font-sans text-xs uppercase tracking-[0.16em] font-medium text-black/50 mb-8">
              RECIPIENT DETAILS
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recipient Name */}
                <Input
                  label="Recipient Name"
                  placeholder="Their full name"
                  {...register("recipientName", {
                    validate: (v) => {
                      const r =
                        giftCardSchema.shape.recipientName.safeParse(v);
                      return r.success
                        ? true
                        : r.error.issues[0]?.message ||
                            "Recipient name is required";
                    },
                  })}
                  error={errors.recipientName?.message}
                />

                {/* Recipient Email */}
                <Input
                  type="email"
                  label="Recipient Email"
                  placeholder="their@email.com"
                  {...register("recipientEmail", {
                    validate: (v) => {
                      const r =
                        giftCardSchema.shape.recipientEmail.safeParse(v);
                      return r.success
                        ? true
                        : r.error.issues[0]?.message ||
                            "Recipient email is required";
                    },
                  })}
                  error={errors.recipientEmail?.message}
                />
              </div>

              {/* Sender Name */}
              <Input
                label="Your Name"
                placeholder="Your full name"
                {...register("senderName", {
                  validate: (v) => {
                    const r = giftCardSchema.shape.senderName.safeParse(v);
                    return r.success
                      ? true
                      : r.error.issues[0]?.message || "Your name is required";
                  },
                })}
                error={errors.senderName?.message}
              />

              {/* Personal Message */}
              <div className="w-full">
                <label
                  htmlFor="message"
                  className="block font-sans text-xs uppercase tracking-[0.06em] font-medium text-black/70 mb-2"
                >
                  Personal Message{" "}
                  <span className="normal-case tracking-normal text-black/40">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Add a personal message to your gift card..."
                  {...register("message")}
                  className={cn(
                    "w-full bg-transparent border-0 border-b border-border px-0 py-3 resize-none",
                    "font-body text-base text-black placeholder:text-black/40",
                    "focus:outline-none focus:border-black transition-colors duration-300"
                  )}
                />
              </div>

              {/* Summary & Submit */}
              <div className="border-t border-border pt-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-sans text-sm uppercase tracking-[0.06em] font-medium text-black/70">
                    Gift Card Amount
                  </span>
                  <span className="font-heading text-2xl">
                    {getSelectedAmount()
                      ? `$${getSelectedAmount()}`
                      : "Select a value"}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !getSelectedAmount()}
                  className={cn(
                    "w-full inline-flex items-center justify-center",
                    "font-sans text-sm uppercase tracking-[0.06em] font-medium",
                    "bg-black text-white px-8 py-4",
                    "hover:bg-black/80 active:bg-black/70",
                    "transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
                    "disabled:opacity-50 disabled:pointer-events-none"
                  )}
                >
                  PURCHASE GIFT CARD
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
