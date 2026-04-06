import { BRAND } from "@/lib/constants";

/* ============================================
   Shared Legal Page Layout
   ============================================ */

interface LegalSection {
  title: string;
  content: string[];
}

interface LegalPageContentProps {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export function LegalPageContent({
  eyebrow,
  title,
  lastUpdated,
  sections,
}: LegalPageContentProps) {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream">
        <div className="max-container section-padding text-center">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            {eyebrow}
          </p>
          <h1 className="font-heading text-[2.75rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.08] mb-6 max-w-4xl mx-auto">
            {title}
          </h1>
          <p className="font-body text-base text-black/50">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-container section-padding">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index}>
                <h2 className="font-heading text-2xl md:text-3xl mb-5">
                  {index + 1}. {section.title}
                </h2>
                <div className="space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="font-body text-base text-black/70 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact note */}
          <div className="border-t border-border mt-16 pt-10">
            <p className="font-body text-base text-black/70 leading-relaxed">
              If you have any questions about this document, please contact us at{" "}
              <a
                href={`mailto:${BRAND.email}`}
                className="text-primary hover:text-primary-dark transition-colors duration-300 underline underline-offset-4"
              >
                {BRAND.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
