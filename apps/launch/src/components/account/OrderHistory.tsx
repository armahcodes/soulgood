import { ReorderButton } from "@/components/checkout/ReorderButton";
import { formatCents, CONTACT } from "@/lib/brand";
import type { CustomerOrder } from "@/lib/checkout-record";
import { CURRENT_BOWLS } from "@/lib/current-offer";
import {
  formatCustomerDate,
  orderStatusLabel,
} from "@/lib/customer-experience";

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
        const helpHref = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Help with Soul Bowls order ${reference}`)}`;
        return (
          <article
            key={order.id}
            className="min-w-0 rounded-lg border border-forest/12 bg-card shadow-[0_20px_40px_-36px_rgb(44_58_52/0.45)] p-5 sm:p-7"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.12em] text-forest/65 uppercase">
                  {order.squareObjectType === "invoice"
                    ? "Weekly order"
                    : "One-time order"}{" "}
                  · {reference}
                </p>
                <h3 className="mt-2 text-3xl">
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
                <span className="inline-flex rounded-md border border-forest/15 bg-oat px-3 py-1.5 text-xs font-semibold">
                  {orderStatusLabel(order.status)}
                </span>
                <p className="font-serif text-3xl">
                  {formatCents(order.totalCents)}
                </p>
              </div>
            </div>
            <details className="group mt-4 border-t border-forest/12">
              <summary className="cursor-pointer py-4 text-sm font-semibold marker:text-clay">
                Order details{" "}
                <span className="sr-only">for order {reference}</span>
              </summary>
              <div className="grid gap-6 pb-4 md:grid-cols-2">
                <div>
                  <h4 className="font-sans text-xs font-bold tracking-[0.1em] text-forest/65 uppercase">
                    Your bowls
                  </h4>
                  <ul className="mt-3 space-y-2 text-sm leading-6">
                    {CURRENT_BOWLS.filter(
                      (bowl) => order.bowlSelection[bowl.id] > 0,
                    ).map((bowl) => (
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
                </div>
                <dl className="space-y-3 text-sm leading-6">
                  <div>
                    <dt className="font-semibold">
                      {order.fulfillmentMethod === "delivery"
                        ? "LA County delivery"
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
                    <dt>Bowls</dt>
                    <dd>{formatCents(order.subtotalCents)}</dd>
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
              <p className="mt-3 text-xs leading-5 text-forest/70">
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
