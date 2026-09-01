"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { BowlSelection } from "@/lib/bowl-selection";
import type { FulfillmentMethod } from "@/lib/brand";

type ReorderButtonProps = {
  bowlSelection: BowlSelection;
  peopleCount: number;
  mealsPerDay: number;
  fulfillmentMethod: FulfillmentMethod;
  customerEmail?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
};

export function ReorderButton({
  bowlSelection,
  peopleCount,
  mealsPerDay,
  fulfillmentMethod,
  customerEmail,
  children = "Order this mix again",
  className,
  variant = "primary",
}: ReorderButtonProps) {
  const router = useRouter();

  function reorder(): void {
    window.sessionStorage.setItem(
      "soulbowls:bowlSelection",
      JSON.stringify(bowlSelection),
    );
    window.sessionStorage.setItem("soulbowls:peopleCount", String(peopleCount));
    window.sessionStorage.setItem("soulbowls:mealsPerDay", String(mealsPerDay));
    window.sessionStorage.setItem("soulbowls:fulfillment", fulfillmentMethod);
    // Reorders start as a one-time purchase so an existing weekly customer never
    // creates a second subscription by accident.
    window.sessionStorage.setItem("soulbowls:purchaseType", "one-time");

    if (customerEmail) {
      try {
        const current = JSON.parse(
          window.sessionStorage.getItem("soulbowls:checkoutContact") || "{}",
        ) as Record<string, string>;
        window.sessionStorage.setItem(
          "soulbowls:checkoutContact",
          JSON.stringify({ ...current, email: customerEmail }),
        );
      } catch {
        window.sessionStorage.setItem(
          "soulbowls:checkoutContact",
          JSON.stringify({ email: customerEmail }),
        );
      }
    }

    router.push(`/checkout?fulfillment=${fulfillmentMethod}&reorder=1`);
  }

  return (
    <Button type="button" className={className} variant={variant} onClick={reorder}>
      {children}
    </Button>
  );
}
