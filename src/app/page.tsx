import { BRAND } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="section-padding max-container flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="label-text text-primary mb-4 tracking-widest">
          NOURISH YOUR SOUL
        </p>
        <h1 className="font-heading text-5xl md:text-7xl mb-6">
          {BRAND.name}
        </h1>
        <p className="font-body text-lg md:text-xl text-black/70 max-w-2xl mb-8">
          {BRAND.tagline}
        </p>
        <p className="font-body text-base text-black/60 max-w-xl">
          {BRAND.description}
        </p>
      </section>
    </main>
  );
}
