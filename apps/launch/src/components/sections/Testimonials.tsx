import { Star } from "lucide-react";
import { Reveal } from "@/components/ui/kit/reveal";
import { cn } from "@/lib/utils";

type Testimonial = { quote: string; name: string; tone: string };

/** Customer testimonials, shared with permission. All five-star reviews. */
const TESTIMONIALS: readonly Testimonial[] = [
  {
    quote:
      "Perfect for bringing to work, nourishing, easy, and doesn’t feel like a compromise. The ingredient quality really stands out. I love the sweet potato.",
    name: "José",
    tone: "bg-sage-ink text-oat",
  },
  {
    quote:
      "The vitality bowl got me feeling energized and full, ready to pick up my next batch when I’m in LA.",
    name: "Isabelle",
    tone: "bg-clay text-oat",
  },
  {
    quote:
      "Great for me to bring to the office, wanting quick real nourishment without the hassle at work.",
    name: "Kabir",
    tone: "bg-gold text-forest",
  },
];

function CornerMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={cn("pointer-events-none absolute size-3.5 text-clay-ink", className)}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function Stars() {
  return (
    <div className="flex items-center gap-0.5">
      <span className="sr-only">Rated 5 out of 5</span>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} aria-hidden="true" className="size-4 fill-gold text-gold" strokeWidth={1.5} />
      ))}
    </div>
  );
}

/**
 * Brand adaptation of 21st.dev efferd/staggered-testimonials-grid: three
 * framed quotes with corner marks, staggered on desktop and a swipeable
 * snap rail on phones.
 */
export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="relative overflow-hidden border-t border-forest/10 bg-card/60 pt-16 pb-16 sm:pt-24 md:pb-32">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <p className="text-[0.68rem] font-medium tracking-[0.22em] text-clay-ink uppercase">Kind words</p>
          <h2 id="testimonials-heading" className="mt-4 text-4xl leading-none font-normal tracking-[0.01em] text-forest sm:text-6xl">
            Real nourishment, real days.
          </h2>
          <div className="mt-5 flex items-center justify-center gap-3 text-sm text-forest/72">
            <Stars />
            <span>Five-star reviews from our customers</span>
          </div>
        </Reveal>

        <Reveal
          stagger
          tabIndex={0}
          role="region"
          aria-label="Customer reviews"
          className="scrollbar-none -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-8 overflow-x-auto px-5 pt-5 pb-6 sm:-mx-8 sm:scroll-px-8 sm:px-8 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0"
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <figure
              key={testimonial.name}
              style={{ "--card-index": index } as React.CSSProperties}
              className="group relative flex w-[84%] shrink-0 snap-center flex-col justify-between gap-8 bg-oat px-7 pt-8 pb-7 transition-shadow duration-300 hover:shadow-[0_24px_50px_-36px_rgb(44_58_52/0.55)] sm:w-[60%] md:w-auto md:translate-y-[calc(3rem*var(--card-index))]"
            >
              <span aria-hidden="true" className="absolute -inset-y-4 -left-px w-px bg-forest/12" />
              <span aria-hidden="true" className="absolute -inset-y-4 -right-px w-px bg-forest/12" />
              <span aria-hidden="true" className="absolute -inset-x-4 -top-px h-px bg-forest/12" />
              <span aria-hidden="true" className="absolute -inset-x-4 -bottom-px h-px bg-forest/12" />
              <CornerMark className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
              <CornerMark className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />

              <div>
                <Stars />
                <blockquote className="mt-5">
                  <p className="font-serif text-[1.35rem] leading-snug tracking-[0.01em] text-forest">
                    <span aria-hidden="true" className="mr-0.5 text-clay-ink">“</span>
                    {testimonial.quote}
                    <span aria-hidden="true" className="ml-0.5 text-clay-ink">”</span>
                  </p>
                </blockquote>
              </div>

              <figcaption className="flex items-center gap-3 border-t border-forest/10 pt-5">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full font-serif text-lg ring-2 ring-oat ring-offset-2 ring-offset-forest/10 transition-shadow group-hover:ring-offset-forest/25",
                    testimonial.tone,
                  )}
                >
                  {testimonial.name.charAt(0)}
                </span>
                <span className="flex flex-col">
                  <cite className="text-sm font-bold text-forest not-italic">{testimonial.name}</cite>
                  <span className="text-xs text-forest/72">Soul Good customer</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
