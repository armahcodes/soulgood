import Image from "next/image";
import { Button } from "@/components/ui/Button";

/* ============================================
   Section 1: Hero — dark overlay on full-width image
   ============================================ */
function CannabisChefHero() {
  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
      <Image
        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&h=1000&fit=crop"
        alt="Elegant plated dish at an infused dining experience by Chef Kyla"
        fill
        className="object-cover"
        sizes="100vw"
        priority
        data-placeholder="true"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-6">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            ELEVATED CANNABIS CUISINE
          </p>
          <h1 className="font-heading text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.08] mb-6">
            Chef Kyla x Cannabis
          </h1>
          <p className="font-body text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            Where culinary artistry meets cannabis — crafting sophisticated
            infused dining experiences with precision, intention, and respect for
            the plant.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Section 2: Background Story
   ============================================ */
function BackgroundStory() {
  return (
    <section className="bg-white">
      <div className="max-container section-padding">
        <div className="max-w-3xl mx-auto">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            THE JOURNEY
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.12] mb-8">
            A Cannabis Chef&apos;s Story
          </h2>
          <div className="space-y-6 font-body text-base md:text-lg text-black/70 leading-relaxed">
            <p>
              Chef Kyla&apos;s journey into cannabis cuisine began at the
              intersection of her two deepest passions — healing through food and
              the therapeutic potential of the cannabis plant. As a classically
              trained chef with a deep understanding of nutrition, she
              recognized early on that cannabis could be more than a casual
              indulgence. In the right hands, it could be medicine, art, and a
              bridge to deeper human connection.
            </p>
            <p>
              Drawing on her formal culinary training and certification in
              nutrition science, Chef Kyla developed a precise, intentional
              approach to cannabis-infused cooking. Every dish is crafted with
              carefully measured dosages, premium flower, and ingredients chosen
              to complement and enhance the experience — never to mask it.
            </p>
            <p>
              For Chef Kyla, cannabis cuisine isn&apos;t about shock value or
              novelty. It&apos;s about elevating the plant to its rightful place
              at the table — paired with beautiful food, thoughtful
              conversation, and an atmosphere of warmth and care.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Section 3: Infused Dining Experiences — 50/50 Split
   ============================================ */
function InfusedDining() {
  return (
    <section className="bg-cream">
      <div className="max-container">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Side — full bleed */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[600px]">
            <Image
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&h=700&fit=crop"
              alt="Beautifully plated infused course at an intimate cannabis dining event"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              data-placeholder="true"
            />
          </div>
          {/* Content Side */}
          <div className="flex items-center">
            <div className="px-8 py-12 md:px-12 lg:px-16 lg:py-20">
              <p className="label-text text-primary mb-5 text-xs tracking-widest">
                PRIVATE EVENTS
              </p>
              <h2 className="font-heading text-3xl md:text-4xl leading-[1.12] mb-6">
                Infused Dining Experiences
              </h2>
              <div className="space-y-5 font-body text-base text-black/70 leading-relaxed mb-8">
                <p>
                  Chef Kyla hosts exclusive infused dining experiences that
                  redefine what cannabis cuisine can be. These intimate,
                  multi-course dinners bring together food lovers, wellness
                  enthusiasts, and the cannabis-curious for evenings of elevated
                  gastronomy.
                </p>
                <p>
                  Each course is thoughtfully dosed and paired — from
                  micro-dosed appetizers that ease guests into the experience, to
                  rich, full-flavored entrées where cannabis is woven into the
                  dish with the same care as any other ingredient. Desserts
                  feature precisely infused chocolates, botanical garnishes, and
                  seasonal fruit compositions.
                </p>
                <p>
                  Every event includes a guided tasting notes card, dosage
                  transparency, and an on-site wellness liaison to ensure every
                  guest has a comfortable, enjoyable experience.
                </p>
              </div>
              <Button as="a" href="/contact" variant="secondary">
                Inquire About Private Events
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Section 4: Kyla's Taste Legacy
   ============================================ */
function KylasTasteLegacy() {
  return (
    <section className="bg-white">
      <div className="max-container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Side */}
          <div>
            <p className="label-text text-primary mb-5 text-xs tracking-widest">
              THE LEGACY
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.12] mb-6">
              Kyla&apos;s Taste
            </h2>
            <div className="space-y-5 font-body text-base md:text-lg text-black/70 leading-relaxed mb-8">
              <p>
                Before Soul Good, Chef Kyla established herself in the cannabis
                culinary world through <em>Kyla&apos;s Taste</em> — her
                pioneering infused dining brand that put cannabis-forward cuisine
                on the map in Los Angeles. What started as intimate gatherings
                grew into one of the most respected names in elevated cannabis
                dining on the West Coast.
              </p>
              <p>
                Kyla&apos;s Taste brought together chefs, growers, and
                aficionados for curated evenings where food and cannabis were
                treated with equal reverence. The brand earned a reputation for
                sophistication, safety, and culinary excellence — proving that
                cannabis dining could be as refined as any Michelin-starred
                experience.
              </p>
              <p>
                That same philosophy of precision, intention, and respect for
                ingredients now lives on in everything Chef Kyla creates —
                including Soul Good&apos;s approach to healing through food.
              </p>
            </div>
          </div>
          {/* Image Side */}
          <div className="relative aspect-[4/3]">
            <Image
              src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop"
              alt="An elegant dessert course from Kyla's Taste cannabis dining event"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              data-placeholder="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Section 5: Philosophy Pillars for Cannabis Dining
   ============================================ */
const CANNABIS_PILLARS = [
  {
    id: "cp-1",
    title: "Precision Dosing",
    description:
      "Every dish is crafted with lab-tested cannabis and carefully measured dosages. Guests always know exactly what they're consuming, ensuring a comfortable and enjoyable experience.",
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=500&fit=crop",
  },
  {
    id: "cp-2",
    title: "Culinary Excellence",
    description:
      "Cannabis is treated as a premium ingredient, not a gimmick. Each dish is a work of culinary art — the infusion enhances the experience without overpowering the flavors.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=500&fit=crop",
  },
  {
    id: "cp-3",
    title: "Plant Respect",
    description:
      "We source from trusted, sustainable growers who share our commitment to quality. The cannabis we use is organic, pesticide-free, and selected for its specific terpene profiles.",
    image:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=500&fit=crop",
  },
  {
    id: "cp-4",
    title: "Safe & Welcoming",
    description:
      "Every event is designed to be inclusive — whether you're a seasoned connoisseur or completely new to cannabis. Wellness liaisons and guided experiences ensure everyone feels cared for.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=500&fit=crop",
  },
];

function CannabisPillars() {
  return (
    <section className="bg-cream-dark">
      <div className="max-container section-padding">
        <div className="text-center mb-12">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            OUR APPROACH
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.12] mb-4">
            The Cannabis Dining Philosophy
          </h2>
          <p className="font-body text-base md:text-lg text-black/60 leading-relaxed max-w-2xl mx-auto">
            Every infused dining experience is guided by four principles that
            ensure safety, sophistication, and delight.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {CANNABIS_PILLARS.map((pillar) => (
            <div key={pillar.id} className="bg-white border border-border">
              <div className="relative aspect-[4/5]">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  data-placeholder="true"
                />
              </div>
              <div className="p-6">
                <h3 className="font-sans text-sm uppercase tracking-[0.06em] font-semibold mb-3">
                  {pillar.title}
                </h3>
                <p className="font-body text-sm text-black/60 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Section 6: CTA
   ============================================ */
function CannabisCTA() {
  return (
    <section className="bg-black text-white">
      <div className="max-container section-padding text-center">
        <p className="label-text text-primary mb-5 text-xs tracking-widest">
          EXPERIENCE IT YOURSELF
        </p>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[3rem] leading-[1.12] mb-6 max-w-3xl mx-auto">
          Ready for an Elevated Dining Experience?
        </h2>
        <p className="font-body text-lg text-white/70 leading-relaxed max-w-2xl mx-auto mb-10">
          Whether you&apos;re planning a private dinner, a corporate event, or
          simply curious about cannabis cuisine, Chef Kyla is here to craft an
          unforgettable experience tailored to you.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button as="a" href="/contact">
            Get In Touch
          </Button>
          <Button as="a" href="/experiences" variant="secondary" className="border-white text-white hover:bg-white hover:text-black">
            View Upcoming Events
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Main Content Export
   ============================================ */
export function CannabisChefContent() {
  return (
    <>
      <CannabisChefHero />
      <BackgroundStory />
      <InfusedDining />
      <KylasTasteLegacy />
      <CannabisPillars />
      <CannabisCTA />
    </>
  );
}
