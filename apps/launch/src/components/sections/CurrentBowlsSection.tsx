import Image from "next/image";
import { CURRENT_BOWLS, CURRENT_OFFER } from "@/lib/current-offer";

export function CurrentBowlsSection() {
  return (
    <section id="menu" className="bg-oat">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="mb-12 grid gap-5 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-bold tracking-[0.18em] text-clay uppercase">
              In your week now
            </p>
            <h2 className="max-w-[11ch] text-5xl leading-[0.94] font-semibold tracking-[-0.045em] text-forest sm:text-6xl">
              Five bowls. One of each.
            </h2>
          </div>
          <p className="max-w-lg text-base leading-relaxed text-forest/65 lg:justify-self-end lg:text-lg">
            Each week includes the five current Soul Bowls™ below, layered in
            {` ${CURRENT_OFFER.format}`} and labeled with prep and eat-by dates.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {CURRENT_BOWLS.map((bowl, index) => (
            <article
              key={bowl.name}
              className={`${bowl.tone} flex flex-col overflow-hidden rounded-[1.75rem]`}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-white/50">
                <Image
                  src={bowl.imagePath}
                  alt={`${bowl.name} in a 32 ounce Soul Good jar`}
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-7 flex items-center justify-between gap-3 text-xs font-bold tracking-[0.14em] text-forest/48 uppercase">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{bowl.serving}</span>
                </div>
                <h3 className="text-2xl leading-tight font-semibold tracking-[-0.025em] text-forest">
                  {bowl.name}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-forest/68">
                  {bowl.ingredients}
                </p>
                <div className="mt-auto pt-8">
                  <p className="text-xs leading-relaxed font-semibold text-forest/64">
                    {bowl.dietary.join(" · ")}
                  </p>
                  {bowl.allergen ? (
                    <p className="mt-2 text-xs leading-relaxed font-bold text-clay">
                      {bowl.allergen}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-3 rounded-[1.75rem] border border-forest/10 bg-white/55 p-6 text-sm leading-relaxed text-forest/65 md:grid-cols-2">
          <p><strong className="text-forest">Cold:</strong> {CURRENT_OFFER.coldServing}</p>
          <p><strong className="text-forest">Warm:</strong> {CURRENT_OFFER.warmServing}</p>
          <p className="md:col-span-2"><strong className="text-forest">Storage:</strong> {CURRENT_OFFER.storage}</p>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-forest/48">
          Ingredients and product descriptions reflect the current labels. The
          kitchen handles major allergens, and cross-contact cannot be ruled out.
        </p>
      </div>
    </section>
  );
}
