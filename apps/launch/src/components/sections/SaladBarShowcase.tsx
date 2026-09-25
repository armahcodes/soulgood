import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/kit/reveal";
import { formatCents } from "@/lib/brand";
import { extraPriceCents, findExtra } from "@/lib/menu-extras";
import { cn } from "@/lib/utils";

const FEATURED = [
  { id: "build-your-own-salad", note: "Pick a base, three toppings, and a dressing", span: "sm:col-span-2 sm:row-span-2" },
  { id: "rainbow-crunch", note: "Cabbage, carrots, radishes, fresh mint", span: "" },
  { id: "jerk-cauliflower-bites", note: "Roasted, bold, with your choice of sauce", span: "" },
  { id: "crunch-cup", note: "Carrot sticks, radishes, cauliflower", span: "" },
  { id: "veggie-tasting-trio", note: "Choose any three to share", span: "" },
] as const;

/**
 * Homepage salad bar & sides: an asymmetric bento of the new menu (brand
 * adaptation of 21st.dev avanishverma4/bento-grid-01), linking to /menu.
 */
export function SaladBarShowcase() {
  return (
    <section id="salad-bar" aria-labelledby="salad-bar-heading" className="scroll-mt-24 border-t border-forest/10 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal className="mb-10 flex flex-col items-center gap-5 text-center sm:mb-14 lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div>
            <p className="text-[0.68rem] font-medium tracking-[0.22em] text-clay-ink uppercase">New · The salad bar & sides</p>
            <h2 id="salad-bar-heading" className="mt-4 text-4xl leading-none tracking-[0.01em] text-forest sm:text-6xl">
              Crisp, colorful, made to order.
            </h2>
          </div>
          <div className="flex max-w-sm flex-col items-center gap-4 lg:items-end">
            <p className="text-sm leading-6 text-forest/72 lg:text-right">
              Add made-to-order salads, veggie cups, and roasted bites to any weekly order or gathering.
            </p>
            <Link href="/menu#salads" className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-forest underline underline-offset-4 hover:text-clay-ink">
              Explore the salad bar <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </Reveal>
        <Reveal stagger className="grid auto-rows-[minmax(11rem,1fr)] grid-cols-2 gap-3 sm:auto-rows-[minmax(13rem,1fr)] sm:grid-cols-4 sm:gap-4">
          {FEATURED.map((item) => {
            const extra = findExtra(item.id)!;
            return (
              <Link
                key={item.id}
                href="/menu#salads"
                aria-label={`${extra.name}, ${formatCents(extraPriceCents(item.id))}. ${item.note}`}
                className={cn("group/tile relative overflow-hidden rounded-lg bg-sand/40", item.span, item.span ? "col-span-2" : "")}
              >
                <Image src={extra.imagePath} alt="" fill sizes={item.span ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 25vw, 50vw"} className="object-cover transition-transform duration-700 group-hover/tile:scale-[1.04]" />
                <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-forest/70 via-forest/5 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4 text-oat sm:p-5">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className={cn("font-serif leading-tight", item.span ? "text-3xl sm:text-4xl" : "text-xl")}>{extra.name}</span>
                    <span className="shrink-0 rounded-md bg-oat/90 px-2 py-0.5 text-xs font-semibold text-forest tabular-nums">{formatCents(extraPriceCents(item.id))}</span>
                  </span>
                  <span className={cn("mt-1 block text-xs leading-5 text-oat/85", item.span ? "sm:text-sm" : "hidden sm:block")}>{item.note}</span>
                </span>
              </Link>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
