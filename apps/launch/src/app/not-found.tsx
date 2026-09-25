import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { AVAILABLE_BOWLS } from "@/lib/current-offer";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[70vh] items-center bg-oat px-5 py-20 text-center sm:px-8">
        <div className="mx-auto flex max-w-xl flex-col items-center">
          <div aria-hidden="true" className="mb-8 flex -space-x-4">
            {AVAILABLE_BOWLS.slice(0, 3).map((bowl, index) => (
              <div
                key={bowl.id}
                className="relative size-16 overflow-hidden rounded-full border-4 border-oat bg-sand shadow-sm"
                style={{ zIndex: 3 - index }}
              >
                <Image src={bowl.imagePath} alt="" fill unoptimized sizes="64px" className="scale-150 object-cover object-[50%_60%]" />
              </div>
            ))}
          </div>
          <p className="text-[0.68rem] font-medium tracking-[0.22em] text-clay uppercase">Page not found</p>
          <h1 className="mt-4 text-5xl leading-[1.02] font-normal tracking-[0.01em] text-forest sm:text-6xl">
            This bowl isn’t on the menu.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-forest/72">
            The page you’re looking for may have moved. Let’s get you back to something nourishing.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button as="a" href="/" size="lg">Back to Soul Good</Button>
            <Button as="a" href="/quiz" variant="secondary" size="lg">Find your pathway</Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
