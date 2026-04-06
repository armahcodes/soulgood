import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { PHILOSOPHY_PILLARS } from "@/lib/constants";

/* ============================================
   Section 1: Hero — cream background, large serif headline
   ============================================ */
function AboutHero() {
  return (
    <section className="bg-cream">
      <div className="max-container section-padding text-center">
        <p className="label-text text-primary mb-5 text-xs tracking-widest">
          THE WOMAN BEHIND THE MISSION
        </p>
        <h1 className="font-heading text-[2.75rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.08] mb-6 max-w-4xl mx-auto">
          Meet Chef Kyla
        </h1>
        <p className="font-body text-lg md:text-xl text-black/70 leading-relaxed max-w-2xl mx-auto">
          Classically trained chef. Certified nutrition specialist. Community
          builder. The visionary behind Soul Good — a brand born from personal
          transformation and the deep belief that food made with intention can
          heal.
        </p>
      </div>
    </section>
  );
}

/* ============================================
   Section 2: Full-Width Lifestyle Image
   ============================================ */
function AboutFullImage() {
  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
      <Image
        src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1800&h=1000&fit=crop"
        alt="Chef Kyla in the kitchen preparing a vibrant, intentional meal"
        fill
        className="object-cover"
        sizes="100vw"
        priority
        data-placeholder="true"
      />
    </section>
  );
}

/* ============================================
   Section 3: Transformation Story
   ============================================ */
function TransformationStory() {
  return (
    <section className="bg-white">
      <div className="max-container section-padding">
        <div className="max-w-3xl mx-auto">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            A JOURNEY OF HEALING
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.12] mb-8">
            From Struggle to Purpose
          </h2>
          <div className="space-y-6 font-body text-base md:text-lg text-black/70 leading-relaxed">
            <p>
              Chef Kyla&apos;s path to Soul Good didn&apos;t begin in a culinary
              classroom — it began with a wake-up call. Years of processed food
              and unconscious eating had taken a real toll on her body. She was
              living with obesity, hypertension, high cholesterol, and elevated
              cortisol levels. The numbers on her charts told a story her body
              already knew — something had to change.
            </p>
            <p>
              Rather than turning to quick fixes, Kyla turned to the kitchen. She
              made a deliberate decision to rebuild her relationship with food —
              studying every ingredient, learning how specific nutrients support
              the body, and rediscovering the healing power of the Southern
              recipes she grew up with.
            </p>
            <p>
              Through intentional cooking and a commitment to functional
              nutrition, Kyla reversed her hypertension, brought her cholesterol
              back to healthy levels, and reduced her cortisol. The
              transformation was not just physical — it was spiritual. Food
              became her medicine, her meditation, and her mission.
            </p>
            <p>
              That personal transformation became Soul Good: a brand built on the
              conviction that chef-crafted, nutrient-dense meals can change lives
              the same way they changed hers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Section 4: Credentials
   ============================================ */
function Credentials() {
  const credentials = [
    {
      title: "Culinary Education",
      description:
        "Classically trained at a premier culinary institution, mastering techniques from French fundamentals to global cuisines — with a specialization in Southern and soul food traditions.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeWidth={1.5}
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeWidth={1.5}
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
          <path
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeWidth={1.5}
            d="M12 14l9-5-9-5-9 5 9 5zM12 14v7"
          />
        </svg>
      ),
    },
    {
      title: "Nutrition Certification",
      description:
        "Certified nutrition specialist with deep expertise in functional nutrition, anti-inflammatory protocols, and the science behind how food impacts hormones, gut health, and chronic disease.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: "Speaking & Education",
      description:
        "A sought-after speaker at wellness conferences, food festivals, and community events. Chef Kyla shares her expertise on healing through food, ancestral nutrition, and building equitable food systems.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeWidth={1.5}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      ),
    },
    {
      title: "Celebrity Clientele",
      description:
        "Trusted by professional athletes, entertainers, and executives across Los Angeles who rely on Chef Kyla for consistent, premium nutrition that fuels their demanding lifestyles.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeWidth={1.5}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-cream-dark">
      <div className="max-container section-padding">
        <div className="text-center mb-12 md:mb-16">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            CREDENTIALS & EXPERTISE
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.12]">
            Built on Knowledge, Driven by Purpose
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {credentials.map((cred) => (
            <div key={cred.title} className="flex gap-5">
              <div className="flex-shrink-0 text-primary mt-1">{cred.icon}</div>
              <div>
                <h3 className="font-sans text-sm uppercase tracking-[0.06em] font-semibold mb-3">
                  {cred.title}
                </h3>
                <p className="font-body text-base text-black/70 leading-relaxed">
                  {cred.description}
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
   Section 5: Philosophy — brand pillars
   ============================================ */
function Philosophy() {
  return (
    <section id="philosophy" className="bg-white">
      <div className="max-container section-padding">
        <div className="text-center mb-12 md:mb-16">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            OUR PHILOSOPHY
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.12] mb-6 max-w-3xl mx-auto">
            Southern Soul Food Meets Functional Healing Nutrition
          </h2>
          <p className="font-body text-base md:text-lg text-black/70 leading-relaxed max-w-2xl mx-auto">
            Every Soul Good meal is built on five pillars — principles that guide
            how we source, prepare, and serve food that truly nourishes.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {PHILOSOPHY_PILLARS.map((pillar) => (
            <div key={pillar.id} className="text-center">
              <div className="relative w-full aspect-[4/5] mb-5">
                <Image
                  src={pillar.image}
                  alt={pillar.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  data-placeholder="true"
                />
              </div>
              <h3 className="font-sans text-sm uppercase tracking-[0.06em] font-semibold mb-2">
                {pillar.name}
              </h3>
              <p className="font-body text-sm text-black/60 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Section 6: Community Impact
   ============================================ */
function CommunityImpact() {
  const initiatives = [
    {
      title: "Food Desert Initiatives",
      description:
        "Soul Good actively works to address food deserts across South Los Angeles, partnering with local organizations to bring fresh, nutritious produce and prepared meals to communities that have been systematically underserved by the food industry.",
      image:
        "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop",
      alt: "Fresh produce from community gardens supporting food desert initiatives",
    },
    {
      title: "Community Farms in Watts",
      description:
        "In partnership with neighborhood leaders, Soul Good supports community farms in the Watts neighborhood — growing fresh vegetables, herbs, and fruit that supply both our kitchen and free distribution to local families.",
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
      alt: "Thriving community garden with rows of fresh vegetables in Watts",
    },
    {
      title: "Wellness Center in Compton",
      description:
        "Chef Kyla is building a wellness center in Compton — a space dedicated to cooking classes, nutrition education, mental health resources, and hydroponic plant distribution for families looking to grow their own food at home.",
      image:
        "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&h=400&fit=crop",
      alt: "Community wellness education class teaching healthy cooking techniques",
    },
  ];

  return (
    <section className="bg-cream">
      <div className="max-container section-padding">
        <div className="text-center mb-12 md:mb-16">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            BEYOND THE PLATE
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.12] mb-6 max-w-3xl mx-auto">
            Nourishing Communities
          </h2>
          <p className="font-body text-base md:text-lg text-black/70 leading-relaxed max-w-2xl mx-auto">
            Soul Good&apos;s mission extends beyond meal delivery. Chef Kyla is
            committed to building equitable food systems and empowering
            communities through nutrition education, urban farming, and
            accessible wellness resources.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {initiatives.map((initiative) => (
            <div key={initiative.title}>
              <div className="relative w-full aspect-[3/2] mb-5">
                <Image
                  src={initiative.image}
                  alt={initiative.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  data-placeholder="true"
                />
              </div>
              <h3 className="font-sans text-sm uppercase tracking-[0.06em] font-semibold mb-3">
                {initiative.title}
              </h3>
              <p className="font-body text-base text-black/70 leading-relaxed">
                {initiative.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Section 7: CTA — Explore Meal Plans
   ============================================ */
function AboutCTA() {
  return (
    <section className="bg-black text-white">
      <div className="max-container section-padding text-center">
        <p className="label-text text-primary mb-5 text-xs tracking-widest">
          READY TO BEGIN?
        </p>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.12] mb-6 max-w-2xl mx-auto">
          Nourish Your Body. Feed Your Soul.
        </h2>
        <p className="font-body text-base md:text-lg text-white/70 leading-relaxed max-w-xl mx-auto mb-10">
          Experience chef-crafted meals designed to heal, energize, and inspire —
          delivered fresh to your door across Greater Los Angeles.
        </p>
        <Button
          as="a"
          href="/meal-plans"
          variant="secondary"
          size="lg"
          className="border-white text-white hover:bg-white hover:text-black"
        >
          EXPLORE MEAL PLANS
        </Button>
      </div>
    </section>
  );
}

/* ============================================
   Main About Content Component
   ============================================ */
export function AboutContent() {
  return (
    <>
      {/* 1. Hero — cream background, large serif headline */}
      <AboutHero />

      {/* 2. Full-width lifestyle image */}
      <AboutFullImage />

      {/* 3. Transformation story — healing journey narrative */}
      <TransformationStory />

      {/* 4. Credentials — culinary school, nutrition cert, speaking */}
      <Credentials />

      {/* 5. Philosophy — brand pillars */}
      <Philosophy />

      {/* 6. Community impact — food deserts, farms, wellness center */}
      <CommunityImpact />

      {/* 7. CTA — explore meal plans */}
      <AboutCTA />
    </>
  );
}
