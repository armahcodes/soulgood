import Image from "next/image";
import { cn } from "@/lib/utils";

export const GATHERING_SCENES = [
  { src: "/gatherings/plated-dinner.webp", label: "Plated dinners", caption: "Served at your table by our team", alt: "A candlelit oak table set with plated vegetable-forward dishes" },
  { src: "/gatherings/team-lunch.webp", label: "Team lunches", caption: "Soul Bowls™ delivered ready to share", alt: "Rows of Soul Bowls in glass jars on an office table" },
  { src: "/gatherings/garden-gathering.webp", label: "Garden gatherings", caption: "Shared platters under the string lights", alt: "An outdoor table at golden hour with shared vegetable platters" },
  { src: "/gatherings/chef-plating.webp", label: "Chef-led service", caption: "Plating and ingredient education", alt: "A chef plating roasted vegetables and herbed grains" },
] as const;

/**
 * Brand adaptation of 21st.dev educalvolpz/hover-expand: panels share a row and
 * the one you hover or focus opens up while the rest become slim labeled rails.
 * Phones get a swipeable snap row instead.
 */
export function GatheringsGallery({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="group/gallery hidden h-[min(34rem,70vh)] gap-2 lg:flex">
        {GATHERING_SCENES.map((scene, index) => (
          <figure
            key={scene.src}
            tabIndex={0}
            className={cn(
              "group/panel relative min-w-0 overflow-hidden rounded-lg bg-sand/40 outline-none transition-[flex-grow] duration-700 ease-(--ease-soft) focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-oat",
              index === 0
                ? "flex-[5] group-hover/gallery:flex-1 group-focus-within/gallery:flex-1 hover:!flex-[5] focus:!flex-[5]"
                : "flex-1 hover:!flex-[5] focus:!flex-[5]",
            )}
          >
            <Image src={scene.src} alt={scene.alt} fill loading={index === 0 ? "eager" : "lazy"} sizes="(min-width: 1024px) 34vw, 1px" className="object-cover transition-transform duration-700 group-hover/panel:scale-[1.03]" />
            <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-forest/75 via-forest/10 to-transparent" />
            {/* Open panels show the label across; slim rails show it rotated. */}
            <figcaption
              className={cn(
                "absolute inset-x-0 bottom-0 p-5 text-oat transition-opacity duration-500 group-hover/panel:!opacity-100 group-focus/panel:!opacity-100",
                index === 0 ? "group-hover/gallery:opacity-0 group-focus-within/gallery:opacity-0" : "opacity-0",
              )}
            >
              <span className="block font-serif text-2xl leading-tight whitespace-nowrap">{scene.label}</span>
              <span className="mt-1 block text-sm whitespace-nowrap text-oat/80">{scene.caption}</span>
            </figcaption>
            <span
              aria-hidden="true"
              className={cn(
                "absolute bottom-5 left-1/2 origin-center -translate-x-1/2 font-serif text-xl whitespace-nowrap text-oat [writing-mode:vertical-rl] rotate-180 transition-opacity duration-500 group-hover/panel:!opacity-0 group-focus/panel:!opacity-0",
                index === 0 ? "opacity-0 group-hover/gallery:opacity-100 group-focus-within/gallery:opacity-100" : "opacity-100",
              )}
            >
              {scene.label}
            </span>
          </figure>
        ))}
      </div>

      <div className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:hidden">
        {GATHERING_SCENES.map((scene, index) => (
          <figure key={scene.src} className="relative aspect-[4/5] w-[72%] shrink-0 snap-center overflow-hidden rounded-lg bg-sand/40 sm:w-[44%]">
            <Image src={scene.src} alt={scene.alt} fill loading={index === 0 ? "eager" : "lazy"} sizes="(min-width: 640px) 44vw, 72vw" className="object-cover" />
            <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-forest/70 via-transparent to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-4 text-oat">
              <span className="block font-serif text-xl leading-tight">{scene.label}</span>
              <span className="mt-0.5 block text-xs text-oat/80">{scene.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
