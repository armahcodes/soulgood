import { z } from "zod";

// Square returns calendar dates, not instants. UTC preserves the intended day.
export function formatCustomerDate(value: string): string {
  if (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !z.iso.date().safeParse(value).success
  )
    return "Date unavailable";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00Z`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: /^\d{4}-\d{2}-\d{2}$/.test(value) ? "UTC" : "America/Los_Angeles",
  }).format(date);
}

export function planHasEnded(status?: string): boolean {
  return ["CANCELED", "CANCELLED", "DEACTIVATED"].includes(
    status?.toUpperCase() ?? "",
  );
}

export const cancellationSnapshotSchema = z.discriminatedUnion("state", [
  z.object({ state: z.literal("active") }),
  z.object({ state: z.literal("pending") }),
  z.object({ state: z.literal("scheduled"), effectiveDate: z.iso.date() }),
  z.object({ state: z.literal("ended") }),
]);

export type CancellationSnapshot = z.infer<typeof cancellationSnapshotSchema>;

export function orderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    COMPLETED: "Paid",
    PAID: "Paid",
    APPROVED: "Payment authorized",
    PENDING_PAYMENT: "Payment pending",
    PENDING: "Processing",
    FAILED: "Payment needs attention",
    DECLINED: "Payment declined",
    CANCELED: "Canceled",
    CANCELLED: "Canceled",
    REFUNDED: "Refunded",
    PARTIALLY_REFUNDED: "Partially refunded",
    ACTIVE: "Active",
  };
  return (
    labels[status.toUpperCase()] ?? status.toLowerCase().replaceAll("_", " ")
  );
}
