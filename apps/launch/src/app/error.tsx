"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { CONTACT } from "@/lib/brand";

/** Branded recovery screen for unexpected errors. Nothing about the error is shown to visitors. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app] Unexpected error", error.digest ?? "");
  }, [error]);

  return (
    <>
      <SiteHeader />
      <main className="bg-oat">
        <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.8fr] lg:px-12">
          <div>
            <p className="text-[0.68rem] font-medium tracking-[0.22em] text-clay-ink uppercase">Something went wrong</p>
            <h1 className="mt-4 text-5xl leading-[1.02] tracking-[0.01em] text-forest sm:text-6xl">Our kitchen hit a snag.</h1>
            <p className="mt-5 max-w-md text-base leading-7 text-forest/72">
              This page didn’t load the way it should. Try again, or head back to the menu. If you were placing an order,
              check your email or{" "}
              <Link href="/account" className="font-semibold underline underline-offset-4">My orders</Link> before paying
              again. If it keeps happening, email{" "}
              <a href={`mailto:${CONTACT.email}`} className="font-semibold break-all underline underline-offset-4">
                {CONTACT.email}
              </a>
              {error.digest ? ` and mention reference ${error.digest}` : ""}.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button type="button" size="lg" onClick={reset}>
                Try again
              </Button>
              <Link href="/menu" className="inline-flex min-h-12 items-center justify-center rounded-md border border-forest/20 px-7 text-[0.78rem] font-medium tracking-[0.16em] text-forest uppercase hover:border-forest">
                See the menu
              </Link>
            </div>
          </div>
          <div aria-hidden="true" className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg bg-sand/40">
            <Image src="/menu/rainbow-crunch.webp" alt="" fill sizes="(min-width: 1024px) 30vw, 80vw" className="object-cover" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
