import Image from "next/image";
import Link from "next/link";
import { SignupForm } from "@/components/join/SignupForm";
import { Wordmark } from "@/components/ui/Wordmark";
import { CURRENT_BOWLS } from "@/lib/current-offer";
import { BRAND_NAME, type FulfillmentMethod } from "@/lib/brand";

export const metadata = {
  title: `Order Your Bowls — ${BRAND_NAME}`,
  description: "Reserve five fresh 32 oz Soul Bowls™ for a one-time $88 order or weekly plan with pickup or Los Angeles County delivery.",
};

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ fulfillment?: string }>;
}) {
  const requested = (await searchParams).fulfillment;
  const initialFulfillment: FulfillmentMethod = requested === "pickup" ? "pickup" : "delivery";

  return (
    <main className="min-h-screen bg-oat">
      <header className="border-b border-forest/12">
        <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <Wordmark href="/" />
          <Link href="/" className="text-xs font-bold tracking-[0.1em] text-forest/60 uppercase hover:text-clay">
            Back to the bowls
          </Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-12 lg:py-20">
        <section className="lg:sticky lg:top-10 lg:self-start">
          <p className="text-[0.68rem] font-bold tracking-[0.22em] text-clay uppercase">Order once or weekly</p>
          <h1 className="mt-5 max-w-[10ch] text-6xl leading-[0.86] font-normal tracking-[-0.055em] text-forest sm:text-7xl">
            Your week, nourished.
          </h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-forest/68 sm:text-lg">
            Reserve five fresh 32 oz Soul Bowls™ for $88. At checkout, choose a
            one-time order or weekly plan, then select free Sunday pickup or $8.88
            delivery within Los Angeles County.
          </p>
          <div className="mt-8 grid grid-cols-5 gap-2 border-y border-forest/12 py-5">
            {CURRENT_BOWLS.map((bowl) => (
              <div key={bowl.name} className="relative aspect-[3/4] overflow-hidden bg-sand/30">
                <Image src={bowl.imagePath} alt="" fill unoptimized sizes="100px" className="object-cover" />
              </div>
            ))}
          </div>
          <dl className="mt-7 grid grid-cols-3 divide-x divide-forest/12 border-y border-forest/12 py-5 text-center">
            <div className="px-3"><dt className="text-xs text-forest/52">Order</dt><dd className="mt-1 font-serif text-3xl text-forest">$88</dd></div>
            <div className="px-3"><dt className="text-xs text-forest/52">Bowls</dt><dd className="mt-1 font-serif text-3xl text-forest">5</dd></div>
            <div className="px-3"><dt className="text-xs text-forest/52">Each jar</dt><dd className="mt-1 font-serif text-3xl text-forest">32 oz</dd></div>
          </dl>
        </section>

        <section className="border border-forest/14 bg-white/34 p-6 sm:p-10">
          <div className="mb-8 border-b border-forest/12 pb-6">
            <p className="font-serif text-3xl text-forest">Reserve your bowls</p>
            <p className="mt-2 text-sm leading-6 text-forest/58">No charge on this step. Your full total is shown before Square payment.</p>
          </div>
          <SignupForm initialFulfillment={initialFulfillment} />
        </section>
      </div>
    </main>
  );
}
