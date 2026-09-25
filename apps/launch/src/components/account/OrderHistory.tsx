import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { ReorderButton } from "@/components/checkout/ReorderButton";
import { describeExtraOptions, findExtra } from "@/lib/menu-extras";
import { formatCents, CONTACT } from "@/lib/brand";
import type { CustomerOrder } from "@/lib/checkout-record";
import { CURRENT_BOWLS } from "@/lib/current-offer";
import {
  formatCustomerDate,
  orderStatusLabel,
} from "@/lib/customer-experience";
import { cn } from "@/lib/utils";

function statusTone(status: string): string {
  const value = status.toUpperCase();
  if (["COMPLETED", "PAID", "ACTIVE"].includes(value)) return "bg-sage/15 text-forest";
  if (["FAILED", "DECLINED", "CANCELED", "CANCELLED"].includes(value)) return "bg-clay/12 text-clay-ink";
  if (value.includes("REFUND")) return "bg-forest/8 text-forest/75";
  return "bg-gold/20 text-forest";
}

export function OrderHistory({
  orders,
  email,
}: {
  orders: CustomerOrder[];
  email: string;
}) {
  return (
    <div className="space-y-5">
      {orders.map((order) => {
        const reference = order.id.slice(-8).toUpperCase();
        const bowls = CURRENT_BOWLS.filter((bowl) => order.bowlSelection[bowl.id] > 0);
        const helpHref = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Help with Soul Bowls order ${reference}`)}`;
        return (
          <article
            key={order.id}
            className="min-w-0 rounded-lg border border-forest/12 bg-card shadow-[0_20px_40px_-36px_rgb(44_58_52/0.45)] p-5 sm:p-7"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-[0.12em] text-forest/72 uppercase">
                  {order.squareObjectType === "invoice"
                    ? "Weekly order"
                    : "One-time order"}{" "}
                  · {reference}
                </p>
                <h3 className="mt-2 text-3xl leading-tight">
                  {formatCustomerDate(order.createdAt)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-forest/75">
                  {order.peopleCount}{" "}
                  {order.peopleCount === 1 ? "person" : "people"} ·{" "}
                  {order.mealsPerDay}{" "}
                  {order.mealsPerDay === 1 ? "meal" : "meals"} per person, per
                  day
                </p>
              </div>
              <div className="flex w-full items-center justify-between gap-4 border-t border-forest/10 pt-3 sm:w-auto sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                <span className={cn("inline-flex rounded-md px-3 py-1.5 text-xs font-medium tracking-[0.06em] uppercase", statusTone(order.status))}>
                  {orderStatusLabel(order.status)}
                </span>
                <p className="font-serif text-3xl">
                  {formatCents(order.totalCents)}
                </p>
              </div>
            </div>
            <div aria-hidden="true" className="mt-5 flex items-center gap-3">
              <div className="flex -space-x-3">
                {bowls.map((bowl) => (
                  <span key={bowl.id} className="relative size-11 overflow-hidden rounded-full border-2 border-card bg-sand">
                    <Image src={bowl.imagePath} alt="" fill unoptimized sizes="44px" className="scale-150 object-cover object-[50%_60%]" />
                  </span>
                ))}
              </div>
              <p className="text-xs font-semibold text-forest/72">
                {bowls.reduce((total, bowl) => total + order.bowlSelection[bowl.id], 0)} bowls ·{" "}
                {order.fulfillmentMethod === "delivery" ? "Sunday delivery" : "Pickup"}
              </p>
            </div>
            <details className="group mt-4 border-t border-forest/12">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                <span>
                  Order details{" "}
                  <span className="sr-only">for order {reference}</span>
                </span>
                <ChevronDown className="size-4 text-clay-ink transition-transform duration-300 group-open:rotate-180" aria-hidden />
              </summary>
              <div className="grid gap-6 pb-4 md:grid-cols-2">
                <div>
                  <h4 className="font-sans text-xs font-medium tracking-[0.1em] text-forest/72 uppercase">
                    Your bowls
                  </h4>
                  <ul className="mt-3 space-y-2 text-sm leading-6">
                    {bowls.map((bowl) => (
                      <li
                        key={bowl.id}
                        className="flex justify-between gap-3 border-b border-forest/10 pb-2"
                      >
                        <span>{bowl.name}</span>
                        <strong className="shrink-0">
                          × {order.bowlSelection[bowl.id]}
                        </strong>
                      </li>
                    ))}
                  </ul>
                  {order.extras?.length ? (
                    <>
                      <h4 className="mt-5 font-sans text-xs font-medium tracking-[0.1em] text-forest/72 uppercase">
                        Salads &amp; snacks
                      </h4>
                      <ul className="mt-3 space-y-2 text-sm leading-6">
                        {order.extras.map((line, index) => (
                          <li key={`${line.id}-${index}`} className="flex justify-between gap-3 border-b border-forest/10 pb-2">
                            <span>
                              {findExtra(line.id)?.name ?? line.id}
                              {describeExtraOptions(line) ? (
                                <span className="block text-xs text-forest/72">{describeExtraOptions(line)}</span>
                              ) : null}
                            </span>
                            <strong className="shrink-0">× {line.quantity}</strong>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>
                <dl className="space-y-3 text-sm leading-6">
                  <div>
                    <dt className="font-semibold">
                      {order.fulfillmentMethod === "delivery"
                        ? "Sunday delivery"
                        : "Pickup"}
                    </dt>
                    <dd className="mt-1 text-forest/75">
                      {order.deliveryAddress ? (
                        <>
                          {order.deliveryAddress.addressLine1}
                          {order.deliveryAddress.addressLine2
                            ? `, ${order.deliveryAddress.addressLine2}`
                            : ""}
                          <br />
                          {order.deliveryAddress.city}, CA{" "}
                          {order.deliveryAddress.postalCode}
                        </>
                      ) : order.fulfillmentMethod === "pickup" ? (
                        "See your order confirmation for pickup instructions."
                      ) : (
                        "See your confirmation for delivery details."
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>{order.extras?.length ? "Bowls, salads & snacks" : "Bowls"}</dt>
                    <dd>{formatCents(order.subtotalCents - (order.fulfillmentFeeCents ?? 0))}</dd>
                  </div>
                  {order.fulfillmentFeeCents !== undefined ? (
                    <div className="flex justify-between gap-3">
                      <dt>
                        {order.fulfillmentMethod === "delivery"
                          ? "Delivery"
                          : "Pickup"}
                      </dt>
                      <dd>{formatCents(order.fulfillmentFeeCents)}</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-3">
                    <dt>Sales tax</dt>
                    <dd>{formatCents(order.taxCents)}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-t border-forest/12 pt-3 font-semibold">
                    <dt>Total</dt>
                    <dd>{formatCents(order.totalCents)}</dd>
                  </div>
                </dl>
              </div>
            </details>
            <div className="flex flex-col gap-3 border-t border-forest/12 pt-4 sm:flex-row sm:flex-wrap sm:items-center">
              <ReorderButton
                bowlSelection={order.bowlSelection}
                extras={order.extras}
                customerEmail={email}
                fulfillmentMethod={order.fulfillmentMethod}
                mealsPerDay={order.mealsPerDay}
                peopleCount={order.peopleCount}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                {order.type === "weekly"
                  ? "Order this mix once"
                  : "Order again"}
              </ReorderButton>
              {order.receiptUrl ? (
                <a
                  href={order.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center px-2 text-sm font-semibold underline underline-offset-4"
                >
                  View receipt
                  <span className="sr-only"> (opens a new tab)</span>
                </a>
              ) : null}
              <a
                href={helpHref}
                className="inline-flex min-h-11 items-center justify-center px-2 text-sm font-semibold underline underline-offset-4"
              >
                Get order help
              </a>
            </div>
            {order.type === "weekly" ? (
              <p className="mt-3 text-xs leading-5 text-forest/72">
                Ordering this mix again creates a one-time checkout. It does not
                change or restart your weekly plan.
              </p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
