import Link from "next/link";
import { ArrowDown, HandHeart, MapPin, Scale, Users } from "lucide-react";
import { MealDriveApplicationForm } from "@/components/community/MealDriveApplicationForm";
import { Accordion } from "@/components/ui/kit/accordion";
import { Reveal } from "@/components/ui/kit/reveal";
import { Timeline } from "@/components/ui/kit/timeline";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { BRAND_NAME, CONTACT } from "@/lib/brand";
import { todayInLosAngeles } from "@/lib/culinary-booking";
import { HOST_COMMITMENTS, MEAL_DRIVE_LEAD_DAYS, NON_DISCRIMINATION_STATEMENT, REVIEW_CRITERIA } from "@/lib/meal-drive";

export const dynamic = "force-dynamic";
export const metadata = {
  title: `Host a Food for the Soul meal drive — ${BRAND_NAME}`,
  description:
    "Organizations in Los Angeles and Orange County can apply to host a Food for the Soul community meal drive. Meals are free, open to all, and served first come, first served.",
};

const eyebrow = "text-[0.68rem] font-medium tracking-[0.22em] text-clay uppercase";
const ICONS = { need: HandHeart, open: Users, site: MapPin, logistics: Scale } as const;

const STEPS = [
  { title: "Apply", body: "Tell us about your organization, the community, and a site. It takes about ten minutes." },
  { title: "We review in order", body: "Complete applications are reviewed in the order received, using the same published criteria for everyone." },
  { title: "Plan together", body: "We confirm the date, the number of meals, food-safety steps, and how the line will run." },
  { title: "Drive day", body: "We bring the meals. Your volunteers serve them to everyone who comes, first come, first served." },
];

const FAQS = [
  { id: "qualify", title: "Do people need to qualify to receive a meal?", content: "No. Meals are free and open to anyone who comes. Hosts may not ask for ID, proof of income, immigration status, residency, or membership, and no one has to join or attend anything to receive a meal." },
  { id: "order", title: "How are meals handed out?", content: "First come, first served, one line for everyone, while supplies last. If we run out, we run out for everyone equally; hosts don’t hold meals back for particular groups." },
  { id: "faith", title: "Can faith communities and other groups host?", content: "Yes. Faith-based and secular organizations are welcome on equal terms and reviewed the same way. Drives must be open to all, and receiving a meal can’t depend on taking part in any service or activity." },
  { id: "who", title: "Who can apply?", content: `Organizations serving communities in Los Angeles or Orange County, such as nonprofits, schools, tenant associations, mutual-aid groups, clinics, libraries, and faith or community groups. Individuals who’d like to help can volunteer instead through the Food for the Soul page.` },
  { id: "choose", title: "How do you choose drives?", content: `We look for community need, open access, a safe site, and workable logistics: at least ${MEAL_DRIVE_LEAD_DAYS} days’ notice and enough volunteers. We never consider the race, religion, or other protected characteristics of an organization or the people it serves, and we don’t ask for demographic information. Our capacity is limited, so an application isn’t a guarantee.` },
  { id: "privacy", title: "What happens to the information we share?", content: "We use it only to review and plan the drive, as described in our Privacy Policy. Please don’t include personal details about the people you serve; we never need them." },
];

export default function HostMealDrivePage() {
  return (
    <>
      <SiteHeader current="/food-for-the-soul" />
      <main className="bg-oat">
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 pt-10 pb-14 sm:px-8 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-12">
          <div>
            <p className={eyebrow}>Food for the Soul · Host application</p>
            <h1 className="mt-4 text-[clamp(2.8rem,9vw,5rem)] leading-[1.02] tracking-[0.01em] text-forest">
              Bring a meal drive to your community.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-forest/75 sm:text-lg">
              We provide chef-made meals. You bring the place and the people who know your neighborhood. Drives are free,
              open to everyone, and served first come, first served.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#apply" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-forest px-7 text-[0.78rem] font-medium tracking-[0.16em] text-oat uppercase hover:bg-forest/90">
                Start the application
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
              </Link>
              <Link href="/food-for-the-soul" className="inline-flex min-h-12 items-center justify-center rounded-md border border-forest/20 px-7 text-[0.78rem] font-medium tracking-[0.16em] text-forest uppercase hover:border-forest">
                About Food for the Soul
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-sage/30 bg-sage/10 p-6">
            <p className="font-serif text-2xl text-forest">Open to everyone.</p>
            <p className="mt-3 text-sm leading-6 text-forest/80">{NON_DISCRIMINATION_STATEMENT}</p>
            <p className="mt-3 text-sm leading-6 font-semibold text-forest">Meals are served first come, first served, while supplies last.</p>
          </div>
        </section>

        <section aria-labelledby="criteria-heading" className="border-t border-forest/10 bg-card/60 py-14 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
            <Reveal className="mb-10 max-w-2xl">
              <p className={eyebrow}>What we look for</p>
              <h2 id="criteria-heading" className="mt-4 text-4xl leading-none text-forest sm:text-5xl">The same four criteria for every applicant.</h2>
              <p className="mt-4 text-sm leading-6 text-forest/70">
                We focus on communities where households are at risk of going without enough food. We don’t ask for, or
                consider, demographic information about your organization or the people you serve.
              </p>
            </Reveal>
            <Reveal stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {REVIEW_CRITERIA.map((criterion) => {
                const Icon = ICONS[criterion.id];
                return (
                  <div key={criterion.id} className="rounded-lg border border-forest/12 bg-oat p-5">
                    <Icon className="size-5 text-clay" aria-hidden />
                    <h3 className="mt-3 font-serif text-2xl text-forest">{criterion.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-forest/72">{criterion.body}</p>
                  </div>
                );
              })}
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="steps-heading" className="py-14 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
            <Reveal className="mb-10 max-w-2xl">
              <p className={eyebrow}>How it works</p>
              <h2 id="steps-heading" className="mt-4 text-4xl leading-none text-forest sm:text-5xl">From application to drive day.</h2>
            </Reveal>
            <Timeline steps={STEPS} />
          </div>
        </section>

        <section id="apply" aria-labelledby="apply-heading" className="scroll-mt-24 border-t border-forest/10 py-14 sm:py-20">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-12">
            <div>
              <p className={eyebrow}>The application</p>
              <h2 id="apply-heading" className="mt-4 text-4xl leading-none text-forest sm:text-5xl">Apply to host.</h2>
              <p className="mt-4 text-sm leading-6 text-forest/72">
                For organizations in Los Angeles and Orange County. Choose a date at least {MEAL_DRIVE_LEAD_DAYS} days
                away. Every host agrees to:
              </p>
              <ul className="mt-4 grid gap-2.5">
                {HOST_COMMITMENTS.map((item) => (
                  <li key={item.key} className="flex gap-2.5 text-sm leading-6 text-forest/80">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-sage" />
                    {item.label}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-6 text-forest/70">
                Prefer email? Write to{" "}
                <a href={`mailto:${CONTACT.email}?subject=Meal%20drive%20application`} className="font-semibold break-all underline underline-offset-4">
                  {CONTACT.email}
                </a>
                .
              </p>
            </div>
            <MealDriveApplicationForm today={todayInLosAngeles()} />
          </div>
        </section>

        <section aria-labelledby="host-faq-heading" className="border-t border-forest/10 bg-card/60 py-14 sm:py-20">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
            <div>
              <p className={eyebrow}>Questions</p>
              <h2 id="host-faq-heading" className="mt-4 text-4xl leading-none text-forest sm:text-5xl">Good to know.</h2>
            </div>
            <Accordion items={FAQS} defaultOpen={["qualify"]} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
