const SAMPLE_BOWLS = [
  { name: "Glow Bowl™", tone: "bg-gold/45" },
  { name: "Herb Chicken Nourish Bowl™", tone: "bg-sage/18" },
  { name: "Performance Power Bowl™", tone: "bg-clay/18" },
  { name: "Salmon Recovery Bowl™", tone: "bg-sand/60" },
  { name: "Anti-Inflammatory Bowl™", tone: "bg-gold/28" },
  { name: "Vegan Nourish Bowl™", tone: "bg-sage/12" },
];

export function SampleBowlsSection() {
  return (
    <section id="menu" className="bg-oat">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="mb-12 grid gap-5 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-bold tracking-[0.18em] text-clay uppercase">
              In the rotation
            </p>
            <h2 className="max-w-[11ch] text-5xl leading-[0.94] font-semibold tracking-[-0.045em] text-forest sm:text-6xl">
              A different kind of comfort food.
            </h2>
          </div>
          <p className="max-w-lg text-base leading-relaxed text-forest/65 lg:justify-self-end lg:text-lg">
            The lineup changes with the season and kitchen availability. These are
            examples from the Soul Bowls™ rotation, not a guaranteed weekly menu.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_BOWLS.map((bowl, index) => (
            <article
              key={bowl.name}
              className={`${bowl.tone} flex min-h-48 flex-col justify-between rounded-[1.75rem] p-6`}
            >
              <span className="text-xs font-bold tracking-[0.16em] text-forest/40">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="max-w-[14ch] text-2xl leading-tight font-semibold tracking-[-0.02em] text-forest">
                {bowl.name}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
