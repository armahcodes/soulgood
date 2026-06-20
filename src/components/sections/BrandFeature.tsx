import Image from "next/image";
import Link from "next/link";

export function BrandFeature() {
  return (
    <section className="max-container">
      <div className="flex flex-col lg:flex-row min-h-[600px]">
        {/* Left side: Lifestyle Image (~55% width) */}
        <div className="relative w-full h-[50vh] lg:h-auto lg:w-[55%]">
          <Image
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=900&fit=crop"
            alt="Chef Kyla preparing a vibrant, nourishing meal in the Soul Good kitchen"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
            data-placeholder="true"
          />
        </div>

        {/* Right side: Brand Copy */}
        <div className="flex flex-col justify-center w-full lg:w-[45%] px-6 py-16 md:px-16 lg:py-0 lg:px-16 bg-cream">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            THE SOUL GOOD PHILOSOPHY
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.12] mb-6">
            Healing Through Food
          </h2>
          <p className="font-body text-base md:text-lg text-black/70 leading-relaxed mb-4">
            Chef Kyla believes that food prepared with intention has the power to
            heal. Drawing from generations of Southern soul food tradition and
            informed by modern nutritional science, every Soul Good meal is
            designed to nourish your body, calm your mind, and feed your spirit.
          </p>
          <p className="font-body text-base md:text-lg text-black/70 leading-relaxed mb-8">
            After reversing her own hypertension, high cholesterol, and elevated
            cortisol through intentional cooking, Chef Kyla made it her mission
            to bring this transformative approach to every plate she serves.
          </p>
          <div>
            <Link
              href="/about"
              className="inline-flex items-center font-sans text-sm uppercase tracking-[0.06em] font-medium text-primary hover:text-primary-dark transition-colors duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]"
            >
              LEARN MORE
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
