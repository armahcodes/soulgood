import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RECIPES } from "@/lib/constants";
import { RecipeDetailContent } from "@/components/blog/RecipeDetailContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return RECIPES.map((recipe) => ({
    slug: recipe.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = RECIPES.find((r) => r.slug === slug);

  if (!recipe) {
    return { title: "Recipe Not Found | Soul Good" };
  }

  return {
    title: `${recipe.title} | Soul Good Recipes`,
    description: recipe.description,
    openGraph: {
      title: `${recipe.title} | Soul Good Recipes`,
      description: recipe.description,
      images: [{ url: recipe.image }],
    },
  };
}

export default async function RecipeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = RECIPES.find((r) => r.slug === slug);

  if (!recipe) {
    notFound();
  }

  return <RecipeDetailContent recipe={recipe} />;
}
