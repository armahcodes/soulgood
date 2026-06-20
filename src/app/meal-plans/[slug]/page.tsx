import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MEAL_PLANS } from "@/lib/constants";
import { PlanDetailContent } from "@/components/meal-plans/PlanDetailContent";

interface PlanDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MEAL_PLANS.map((plan) => ({
    slug: plan.slug,
  }));
}

export async function generateMetadata({
  params,
}: PlanDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const plan = MEAL_PLANS.find((p) => p.slug === slug);

  if (!plan) {
    return {
      title: "Plan Not Found | Soul Good",
    };
  }

  return {
    title: `${plan.name} | Soul Good`,
    description: plan.description,
    openGraph: {
      title: `${plan.name} | Soul Good`,
      description: plan.description,
      images: [{ url: plan.heroImage }],
    },
  };
}

export default async function PlanDetailPage({ params }: PlanDetailPageProps) {
  const { slug } = await params;
  const plan = MEAL_PLANS.find((p) => p.slug === slug);

  if (!plan) {
    notFound();
  }

  return (
    <main className="flex-1">
      <PlanDetailContent plan={plan} />
    </main>
  );
}
