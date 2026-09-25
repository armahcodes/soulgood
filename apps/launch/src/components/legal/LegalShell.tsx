import type { ReactNode } from "react";
import { LegalToc } from "@/components/legal/LegalToc";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";

interface LegalShellProps {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}

export function LegalShell({ eyebrow, title, intro, children }: LegalShellProps) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-oat text-forest">
        <div className="border-b border-forest/10 bg-card/50">
          <div className="mx-auto w-full max-w-6xl px-5 pt-12 pb-10 sm:px-8 sm:pt-16 sm:pb-14">
            <p className="mb-5 text-xs font-medium tracking-[0.18em] text-clay-ink uppercase">
              {eyebrow}
            </p>
            <h1 className="max-w-3xl text-5xl leading-[1.02] font-normal tracking-[0.01em] sm:text-7xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-forest/72">
              {intro}
            </p>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 pt-10 pb-24 sm:px-8 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
          <article id="legal-content" className="legal-copy min-w-0 max-w-3xl">
            {children}
          </article>
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <LegalToc />
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
