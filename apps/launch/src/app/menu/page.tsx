import { breadcrumbJsonLd, menuJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import Image from "next/image";
import Link from "next/link";
import { BowlCollection } from "@/components/sections/BowlCollection";
import { CartBar } from "@/components/menu/CartBar";
import { ExtrasMenu } from "@/components/menu/ExtrasMenu";
import { MenuJumpNav } from "@/components/menu/MenuJumpNav";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/kit/reveal";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { ORDER_RULES } from "@/lib/brand";
import { AVAILABLE_BOWLS } from "@/lib/current-offer";
import { MENU_COLLECTION_LIST } from "@/lib/menu";
import { MENU_EXTRAS } from "@/lib/menu-extras";
import { getAddOnVariationIds } from "@/lib/square-catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/menu");

const eyebrow = "text-[0.68rem] font-medium tracking-[0.22em] text-clay-ink uppercase";

export default function MenuPage() {
  const orderable = Boolean(getAddOnVariationIds());
  const heroImages = [AVAILABLE_BOWLS[0]?.imagePath, MENU_EXTRAS.find((item) => item.id === "rainbow-crunch")?.imagePath, MENU_EXTRAS.find((item) => item.id === "jerk-cauliflower-bites")?.imagePath].filter(Boolean) as string[];

  return (
    <>
      <SiteHeader current="/menu" />
      <main className="bg-oat">
        <JsonLd data={[menuJsonLd(), breadcrumbJsonLd([{ name: "Menu", path: "/menu" }])]} />
        <section className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 pt-8 pb-10 sm:px-8 sm:pt-12 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:px-12 lg:pb-14">
          <div className="text-center lg:text-left">
            <p className={eyebrow}>The Soul Good menu</p>
            <h1 className="mt-4 text-5xl leading-[1.02] font-normal tracking-[0.01em] text-forest sm:text-7xl">
              Everything from our kitchen.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base leading-7 text-forest/72 lg:mx-0">
              Chef-made Soul Bowls™ for your week, made-to-order salads you can build your way, and
              colorful snacks for between meals.
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm font-semibold text-forest lg:mx-0">
              {ORDER_RULES.minimumLabel} · {ORDER_RULES.freeDeliveryLabel.toLowerCase()}
            </p>
          </div>
          <div aria-hidden="true" className="relative mx-auto grid w-full max-w-md grid-cols-3 gap-2.5 sm:gap-3 lg:max-w-none">
            {heroImages.map((src, index) => (
              <div key={src} className={`relative aspect-[3/4] overflow-hidden rounded-lg bg-sand/40 shadow-[0_24px_40px_-30px_rgb(44_58_52/0.6)] ${index === 1 ? "translate-y-5" : ""}`}>
                <Image src={src} alt="" fill unoptimized={src.startsWith("/api/")} loading="eager" sizes="(min-width: 1024px) 16vw, 30vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>

        <MenuJumpNav />

        <section id="bowls" aria-labelledby="menu-bowls-heading" className="scroll-mt-36 py-14 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
            <Reveal className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <p className={eyebrow}>Weekly nourishment</p>
                <h2 id="menu-bowls-heading" className="mt-3 text-4xl leading-none font-normal tracking-[0.01em] text-forest sm:text-5xl">
                  Soul Bowls™
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:items-end">
                <p className="max-w-sm text-sm leading-6 text-forest/72 sm:text-right">
                  32 oz jars, chef-made with whole ingredients. Packed in sets of five for pickup or Sunday delivery.
                </p>
                <Button as="a" href="/checkout" className="w-full sm:w-auto">Build your ritual</Button>
              </div>
            </Reveal>
            <BowlCollection />
          </div>
        </section>

        <ExtrasMenu orderable={orderable} />

        <section id="collections" aria-labelledby="collections-heading" className="scroll-mt-36 border-t border-forest/10 bg-card/60 py-14 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
            <Reveal className="mb-8 max-w-2xl sm:mb-10">
              <p className={eyebrow}>Pathway collections</p>
              <h2 id="collections-heading" className="mt-3 text-4xl leading-none font-normal tracking-[0.01em] text-forest sm:text-5xl">
                The wider Soul Good kitchen.
              </h2>
              <p className="mt-4 text-sm leading-6 text-forest/72">
                Wraps, bowls, breakfast, and juices organized by pathway. Online ordering currently covers
                Soul Bowls™, salads, veggie cups, and snacks; ask us about these dishes for{" "}
                <Link href="/quote" className="font-semibold text-forest underline underline-offset-4 hover:text-clay-ink">gatherings</Link>.
              </p>
            </Reveal>
            <Reveal stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {MENU_COLLECTION_LIST.map((collection) => (
                <article key={collection.id} className="flex flex-col rounded-lg border border-forest/12 bg-oat p-5">
                  <p className="text-[0.65rem] font-medium tracking-[0.18em] text-sage-ink uppercase">{collection.tagline}</p>
                  <h3 className="mt-2 font-serif text-3xl leading-none text-forest">{collection.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-forest/72">{collection.description}</p>
                  <dl className="mt-4 grid gap-3 border-t border-forest/10 pt-4">
                    {collection.categories.map((category) => (
                      <div key={category.id}>
                        <dt className="text-[0.65rem] font-medium tracking-[0.14em] text-forest/72 uppercase">{category.label}</dt>
                        <dd className="mt-1 text-sm leading-6 text-forest/80">
                          {category.items.map((item) => `${item.name}${item.note ? ` (${item.note})` : ""}`).join(" · ")}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
      {orderable ? <CartBar /> : null}
    </>
  );
}
