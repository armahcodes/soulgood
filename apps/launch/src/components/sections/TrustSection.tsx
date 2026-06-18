import { Logo } from "@/components/ui/Logo";
import { FOUNDER } from "@/lib/brand";
import { PATHWAY_LIST } from "@/lib/pathways";

/**
 * Light brand-trust slices for the landing page (QR target): the founder story,
 * the four pathways with their descriptors, and the community give-back. Kept
 * lean and brand-accurate — enough to build confidence without a full site.
 */
export function TrustSection() {
  return (
    <section
      aria-label="About Soul Good"
      className="flex w-full max-w-md flex-col gap-12"
    >
      {/* Founder story (brief) */}
      <div className="flex flex-col gap-3">
        <h2 className="font-serif text-2xl leading-tight font-medium text-forest">
          Food as medicine, rooted in healing
        </h2>
        <p className="text-base leading-relaxed text-forest/75">
          Soul Good began with {FOUNDER}&rsquo;s own healing journey — discovering
          that the food she ate could restore her body and steady her spirit. She
          built Soul Good to share that: chef-made, soul-food-rooted meals crafted
          as nourishment, not just a menu. The only Black-owned brand in its tier
          grounded in soul food heritage and real community roots.
        </p>
      </div>

      {/* The four pathways */}
      <div className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl leading-tight font-medium text-forest">
          Four pathways to nourishment
        </h2>
        <ul className="flex flex-col gap-3">
          {PATHWAY_LIST.map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-1 rounded-2xl border border-sage/20 bg-oat/70 p-5 text-left"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="font-serif text-lg font-medium text-forest">
                  {p.name}
                </span>
                <span className="text-sm font-medium tracking-[0.04em] text-sage">
                  {p.descriptor}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-forest/70">
                {p.description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Community give-back */}
      <div className="flex flex-col gap-3 rounded-3xl border border-clay/25 bg-clay/10 p-6 text-left">
        <div className="flex items-center gap-2.5">
          <Logo size={22} className="text-clay" title="" />
          <h2 className="font-serif text-xl font-medium text-forest">
            Nourishment that reaches further
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-forest/75">
          Every plan donates <span className="font-medium text-forest">1 meal
          each week</span> to someone in the community. Eating well with Soul Good
          feeds your table and your neighbor&rsquo;s.
        </p>
      </div>
    </section>
  );
}
