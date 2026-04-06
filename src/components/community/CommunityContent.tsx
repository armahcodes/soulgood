import Image from "next/image";
import { Button } from "@/components/ui/Button";

/* ============================================
   Community Initiative Data
   ============================================ */
const INITIATIVES = [
  {
    id: "init-1",
    title: "Farms in Watts",
    description:
      "Supporting urban agriculture in Watts by partnering with community farms to grow fresh produce in neighborhoods where access to healthy food has been limited for generations. Soul Good purchases directly from these farms and provides volunteer labor during peak growing seasons.",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
    stats: "3 partner farms · 2,000+ lbs of produce annually",
  },
  {
    id: "init-2",
    title: "Wellness Center in Compton",
    description:
      "Co-founding and supporting a community wellness center in Compton that offers free nutrition workshops, cooking classes, and health screenings. Chef Kyla leads monthly cooking demonstrations, teaching families how to prepare nourishing meals on a budget using whole, accessible ingredients.",
    image:
      "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?w=800&h=600&fit=crop",
    stats: "500+ families reached · Monthly cooking demos",
  },
  {
    id: "init-3",
    title: "Hydroponic Plant Distribution",
    description:
      "Distributing free hydroponic growing kits to families in food deserts across South Los Angeles. Each kit includes everything needed to grow fresh herbs and leafy greens at home — no yard required. Recipients also receive a virtual workshop on setting up and maintaining their systems.",
    image:
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600&fit=crop",
    stats: "1,000+ kits distributed · 12 neighborhoods served",
  },
  {
    id: "init-4",
    title: "Food Desert Relief",
    description:
      "Partnering with local organizations to deliver weekly fresh meal boxes to senior citizens and at-risk families in food deserts. Each box contains chef-prepared meals using surplus ingredients from Soul Good's kitchen — reducing waste while feeding communities that need it most.",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop",
    stats: "200+ boxes delivered weekly · Zero food waste mission",
  },
];

const WAYS_TO_HELP = [
  {
    id: "help-1",
    title: "Volunteer",
    description:
      "Join us at community farms, the wellness center, or during hydroponic kit assembly days. We welcome individuals and groups.",
    icon: "🌱",
  },
  {
    id: "help-2",
    title: "Donate",
    description:
      "Financial contributions help us expand our reach — every dollar goes directly to food access programs and community wellness.",
    icon: "💛",
  },
  {
    id: "help-3",
    title: "Partner",
    description:
      "Organizations, restaurants, and farms — let's build something together. We're always looking for mission-aligned partners.",
    icon: "🤝",
  },
  {
    id: "help-4",
    title: "Spread the Word",
    description:
      "Share our mission on social media, tell a friend, or host a community dinner. Awareness is the first step to change.",
    icon: "📣",
  },
];

/* ============================================
   Section 1: Hero
   ============================================ */
function CommunityHero() {
  return (
    <section className="bg-cream">
      <div className="max-container section-padding text-center">
        <p className="label-text text-primary mb-5 text-xs tracking-widest">
          ROOTED IN COMMUNITY
        </p>
        <h1 className="font-heading text-[2.75rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.08] mb-6 max-w-4xl mx-auto">
          Nourishing Our Neighborhoods
        </h1>
        <p className="font-body text-lg md:text-xl text-black/70 leading-relaxed max-w-2xl mx-auto">
          Soul Good was born in community — and everything we do is rooted in
          giving back. From urban farms to free cooking workshops, we&apos;re on
          a mission to bring healing food to the neighborhoods that need it most.
        </p>
      </div>
    </section>
  );
}

/* ============================================
   Section 2: Full-Width Image
   ============================================ */
function CommunityImage() {
  return (
    <section className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh]">
      <Image
        src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1800&h=1000&fit=crop"
        alt="Community members at an urban farm in Los Angeles, growing fresh produce together"
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
   Section 3: Mission Statement
   ============================================ */
function MissionStatement() {
  return (
    <section className="bg-white">
      <div className="max-container section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            OUR WHY
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.12] mb-8">
            Food Is a Right, Not a Privilege
          </h2>
          <div className="space-y-6 font-body text-base md:text-lg text-black/70 leading-relaxed">
            <p>
              In Los Angeles, millions of people live in food deserts — areas
              where access to fresh, affordable, nutritious food is severely
              limited. These are the same communities where diet-related illness
              rates are highest. Chef Kyla knows this reality intimately — she
              grew up in it.
            </p>
            <p>
              Soul Good&apos;s community programs are designed to address this
              inequity head-on. We don&apos;t just deliver food — we teach
              families how to grow it, prepare it, and use it to heal. Through
              partnerships with local farms, wellness organizations, and
              neighborhood leaders, we&apos;re building a food system that works
              for everyone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Section 4: Impact Stats
   ============================================ */
const IMPACT_STATS = [
  { label: "Families Fed Weekly", value: "200+" },
  { label: "Hydroponic Kits Distributed", value: "1,000+" },
  { label: "Partner Farms in Watts", value: "3" },
  { label: "Community Workshops Held", value: "50+" },
];

function ImpactStats() {
  return (
    <section className="bg-black text-white">
      <div className="max-container section-padding">
        <div className="text-center mb-12">
          <p className="label-text text-primary mb-3 text-xs tracking-widest">
            OUR IMPACT
          </p>
          <h2 className="font-heading text-3xl md:text-4xl">
            By the Numbers
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {IMPACT_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-4xl md:text-5xl lg:text-6xl mb-3 text-primary">
                {stat.value}
              </p>
              <p className="font-sans text-xs uppercase tracking-[0.08em] text-white/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Section 5: Initiatives Grid
   ============================================ */
function InitiativesSection() {
  return (
    <section className="bg-white">
      <div className="max-container section-padding">
        <div className="text-center mb-12">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            WHERE WE GIVE BACK
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.12] mb-4">
            Our Initiatives
          </h2>
          <p className="font-body text-base md:text-lg text-black/60 leading-relaxed max-w-2xl mx-auto">
            From farm to table to community — these are the programs driving
            real change across Los Angeles.
          </p>
        </div>
        <div className="space-y-16">
          {INITIATIVES.map((initiative, idx) => (
            <div
              key={initiative.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                idx % 2 !== 0 ? "lg:[direction:rtl]" : ""
              }`}
            >
              {/* Image */}
              <div className={`relative aspect-[4/3] ${idx % 2 !== 0 ? "lg:[direction:ltr]" : ""}`}>
                <Image
                  src={initiative.image}
                  alt={initiative.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  data-placeholder="true"
                />
              </div>
              {/* Content */}
              <div className={idx % 2 !== 0 ? "lg:[direction:ltr]" : ""}>
                <h3 className="font-heading text-2xl md:text-3xl leading-[1.15] mb-4">
                  {initiative.title}
                </h3>
                <p className="font-body text-base text-black/70 leading-relaxed mb-4">
                  {initiative.description}
                </p>
                <p className="font-sans text-xs uppercase tracking-[0.06em] font-semibold text-primary">
                  {initiative.stats}
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
   Section 6: Ways to Get Involved
   ============================================ */
function GetInvolved() {
  return (
    <section className="bg-cream">
      <div className="max-container section-padding">
        <div className="text-center mb-12">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            JOIN THE MISSION
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.12] mb-4">
            Ways to Get Involved
          </h2>
          <p className="font-body text-base md:text-lg text-black/60 leading-relaxed max-w-2xl mx-auto">
            Every contribution matters — whether it&apos;s your time, your
            resources, or your voice.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {WAYS_TO_HELP.map((way) => (
            <div
              key={way.id}
              className="bg-white border border-border p-8 text-center"
            >
              <div className="text-4xl mb-5" aria-hidden="true">
                {way.icon}
              </div>
              <h3 className="font-sans text-sm uppercase tracking-[0.06em] font-semibold mb-3">
                {way.title}
              </h3>
              <p className="font-body text-sm text-black/60 leading-relaxed">
                {way.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Section 7: CTA
   ============================================ */
function CommunityCTA() {
  return (
    <section className="bg-white">
      <div className="max-container section-padding text-center">
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[3rem] leading-[1.12] mb-6 max-w-3xl mx-auto">
          Let&apos;s Build a Healthier Community Together
        </h2>
        <p className="font-body text-lg text-black/60 leading-relaxed max-w-2xl mx-auto mb-10">
          Have an idea for a partnership, want to volunteer, or just want to
          learn more? We&apos;d love to hear from you.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button as="a" href="/contact">
            Contact Us
          </Button>
          <Button as="a" href="/about" variant="secondary">
            Meet Chef Kyla
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Main Content Export
   ============================================ */
export function CommunityContent() {
  return (
    <>
      <CommunityHero />
      <CommunityImage />
      <MissionStatement />
      <ImpactStats />
      <InitiativesSection />
      <GetInvolved />
      <CommunityCTA />
    </>
  );
}
