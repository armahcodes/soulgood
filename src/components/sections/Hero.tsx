import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="max-container">
      <div className="flex flex-col lg:flex-row min-h-[85vh]">
        {/* Mobile image (shown above text on small screens) */}
        <div className="relative w-full h-[50vh] lg:hidden">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=900&fit=crop"
            alt="Beautifully plated Soul Good wellness meal with vibrant seasonal ingredients"
            fill
            className="object-cover"
            sizes="100vw"
            priority
            data-placeholder="true"
          />
        </div>

        {/* Left side: Copy */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 px-6 py-12 md:px-16 lg:py-0 lg:pl-16 lg:pr-12">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            NOURISH YOUR SOUL
          </p>
          <h1 className="font-heading text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] leading-[1.08] mb-6">
            Food Made With Intention
          </h1>
          <p className="font-body text-base md:text-lg text-black/70 leading-relaxed mb-8 max-w-lg">
            Chef Kyla&apos;s Soul Good brings you chef-crafted, nutrient-dense
            meals rooted in Southern soul food tradition and elevated with modern
            functional nutrition. Made with intention. Seasoned with love.
          </p>
          <div>
            <Link href="/meal-plans">
              <Button size="lg">EXPLORE PLANS</Button>
            </Link>
          </div>
        </div>

        {/* Right side: Image (desktop only) */}
        <div className="relative hidden lg:block w-1/2">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=900&fit=crop"
            alt="Beautifully plated Soul Good wellness meal with vibrant seasonal ingredients"
            fill
            className="object-cover"
            sizes="50vw"
            priority
            data-placeholder="true"
          />
        </div>
      </div>
    </section>
  );
}
