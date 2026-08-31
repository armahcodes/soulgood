import type { ReactNode } from "react";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { Wordmark } from "@/components/ui/Wordmark";

interface LegalShellProps {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}

export function LegalShell({ eyebrow, title, intro, children }: LegalShellProps) {
  return (
    <main className="min-h-screen bg-oat text-forest">
      <header className="border-b border-forest/12">
        <div className="mx-auto flex min-h-20 w-full max-w-5xl items-center px-5 sm:px-8">
          <Wordmark href="/" />
        </div>
      </header>

      <article className="mx-auto w-full max-w-3xl px-5 pt-12 pb-24 sm:px-8 sm:pt-20">
        <p className="mb-5 text-xs font-bold tracking-[0.18em] text-clay uppercase">
          {eyebrow}
        </p>
        <h1 className="text-5xl leading-[0.94] font-normal tracking-[-0.045em] sm:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-forest/68">
          {intro}
        </p>

        <div className="legal-copy mt-14 space-y-10 border-t border-forest/12 pt-10">
          {children}
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
