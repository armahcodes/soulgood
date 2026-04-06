import { PRESS_FEATURES } from "@/lib/constants";

export function PressLogos() {
  return (
    <section className="section-padding max-container bg-cream-dark">
      {/* Section header */}
      <div className="mb-12 text-center">
        <p className="label-text text-primary mb-3 text-xs tracking-widest">
          AS FEATURED IN
        </p>
      </div>

      {/* Press logos row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-start">
        {PRESS_FEATURES.map((feature) => (
          <div key={feature.id} className="flex flex-col items-center text-center">
            {/* Publication name (styled as logo placeholder) */}
            <span className="font-heading text-xl md:text-2xl lg:text-[1.75rem] text-black/80 mb-4">
              {feature.name}
            </span>

            {/* Divider */}
            <div className="w-8 h-px bg-primary mb-4" />

            {/* Quote */}
            <p className="font-body text-sm text-black/60 leading-relaxed italic max-w-xs">
              &ldquo;{feature.quote}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
