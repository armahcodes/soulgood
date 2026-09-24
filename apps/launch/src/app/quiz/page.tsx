import Link from "next/link";
import { QuizFlow } from "@/components/quiz/QuizFlow";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { BRAND_NAME } from "@/lib/brand";

export const metadata = {
  title: `Find your pathway — ${BRAND_NAME}`,
  description:
    "Answer a few gentle questions about your days and energy. We’ll match your Soul Good pathway and suggest a five-bowl Soul Bowls™ mix to start with.",
};

export default function QuizPage() {
  return (
    <div className="flex min-h-screen flex-col bg-oat text-forest">
      <SiteHeader
        variant="focus"
        aside={
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-[0.7rem] font-bold tracking-[0.1em] text-forest/70 uppercase transition-colors hover:text-clay"
          >
            Exit
          </Link>
        }
      />
      <main className="flex flex-1 flex-col">
        <QuizFlow />
      </main>
    </div>
  );
}
