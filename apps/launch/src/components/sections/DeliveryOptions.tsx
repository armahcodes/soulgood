import { CalendarDays, Clock3, MapPin, Receipt, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/kit/reveal";
import { DeliveryMap } from "@/components/sections/DeliveryMap";
import { ORDER_RULES, SERVICE_AREA } from "@/lib/brand";
import { EAT_NOW } from "@/lib/ordering";

const WEEKLY = [
  { icon: CalendarDays, text: "Every Sunday, by the Soul Good team" },
  { icon: MapPin, text: `Anywhere in ${SERVICE_AREA.weekly}` },
  { icon: Truck, text: "$8.88 delivery · free on orders over $100" },
  { icon: Receipt, text: ORDER_RULES.minimumLabel },
];

const ON_DEMAND = [
  { icon: Clock3, text: `${EAT_NOW.days}, during menu hours` },
  { icon: MapPin, text: `Within about ${EAT_NOW.radiusMiles} miles of our ${SERVICE_AREA.kitchen} kitchen` },
  { icon: Truck, text: "Courier fee added at checkout · free on orders over $100" },
  { icon: Receipt, text: ORDER_RULES.minimumLabel },
];

/** Weekly vs on-demand delivery, side by side with the service-area map. */
export function DeliveryOptions({ showEatNowAction = true }: { showEatNowAction?: boolean }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-12">
      <Reveal stagger className="grid gap-4">
        <article className="rounded-lg border border-forest/12 bg-card p-6 sm:p-7">
          <p className="text-[0.65rem] font-bold tracking-[0.18em] text-sage uppercase">Weekly nourishment</p>
          <h3 className="mt-2 text-3xl leading-tight tracking-[-0.02em] text-forest">Delivered every Sunday.</h3>
          <p className="mt-3 text-sm leading-6 text-forest/72">
            Your bowls for the week, prepared by Chef Kyla and brought to your door by our own
            delivery team, never a third-party courier.
          </p>
          <ul className="mt-5 grid gap-2.5">
            {WEEKLY.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-forest/80">
                <Icon className="mt-0.5 size-4 shrink-0 text-sage" aria-hidden />
                {text}
              </li>
            ))}
          </ul>
          <Button as="a" href="/checkout?fulfillment=delivery" className="mt-6 w-full sm:w-auto">
            Plan my Sunday delivery
          </Button>
        </article>

        <article className="rounded-lg border border-clay/25 bg-card p-6 sm:p-7">
          <p className="text-[0.65rem] font-bold tracking-[0.18em] text-clay uppercase">Take Out · On demand</p>
          <h3 className="mt-2 text-3xl leading-tight tracking-[-0.02em] text-forest">A bowl when you want it.</h3>
          <p className="mt-3 text-sm leading-6 text-forest/72">
            Order single bowls Thursday through Sunday. An on-demand courier, through partners like
            Uber Direct, or a Soul Good courier brings it to you.
          </p>
          <ul className="mt-5 grid gap-2.5">
            {ON_DEMAND.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-forest/80">
                <Icon className="mt-0.5 size-4 shrink-0 text-clay" aria-hidden />
                {text}
              </li>
            ))}
          </ul>
          {showEatNowAction ? (
            <Button as="a" href={EAT_NOW.menuUrl} target="_self" variant="secondary" className="mt-6 w-full sm:w-auto">
              See the Take Out menu
            </Button>
          ) : null}
        </article>
      </Reveal>

      <Reveal className="lg:sticky lg:top-28">
        <DeliveryMap />
        <p className="mt-3 text-xs leading-5 text-forest/60">
          Areas are approximate. Weekly delivery addresses are verified at checkout; on-demand
          coverage and courier fees depend on your exact address and are shown in Take Out checkout.
        </p>
      </Reveal>
    </div>
  );
}
