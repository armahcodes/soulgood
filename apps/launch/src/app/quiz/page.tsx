import Link from "next/link";
import { QuizFlow } from "@/components/quiz/QuizFlow";
import { getAddOnVariationIds } from "@/lib/square-catalog";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata("/quiz");

export default function QuizPage() {
  return (
    <div className="flex min-h-screen flex-col bg-oat text-forest">
      <SiteHeader
        variant="focus"
        aside={
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-[0.7rem] font-medium tracking-[0.1em] text-forest/72 uppercase transition-colors hover:text-clay-ink"
          >
            Exit
          </Link>
        }
      />
      <main className="flex flex-1 flex-col">
        <JsonLd data={breadcrumbJsonLd([{ name: "Pathway Finder", path: "/quiz" }])} />
        <QuizFlow sidesOrderable={Boolean(getAddOnVariationIds())} />
      </main>
    </div>
  );
}
