"use client";

import Image from "next/image";
import Link from "next/link";
import type { Recipe } from "@/lib/types";
import { RECIPES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Clock, Users, BarChart3, ChevronLeft } from "lucide-react";

// TODO: Backend Integration - Replace with API call to fetch recipe detail

interface RecipeDetailContentProps {
  recipe: Recipe;
}

function formatDifficulty(difficulty: string): string {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

export function RecipeDetailContent({ recipe }: RecipeDetailContentProps) {
  // Get related recipes: same category first, then others
  const sameCategoryRecipes = RECIPES.filter(
    (r) => r.id !== recipe.id && r.category === recipe.category
  );
  const otherRecipes = RECIPES.filter(
    (r) =>
      r.id !== recipe.id && !sameCategoryRecipes.some((sr) => sr.id === r.id)
  );
  const relatedRecipes = [...sameCategoryRecipes, ...otherRecipes].slice(0, 3);

  return (
    <main className="flex-1">
      {/* Back Link */}
      <div className="section-padding max-container !pb-0">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-[0.06em] font-medium text-black/50 hover:text-primary transition-colors duration-300"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          Back to Recipes
        </Link>
      </div>

      {/* Recipe Header */}
      <section className="section-padding max-container !pt-6">
        <div className="max-w-3xl mx-auto text-center mb-10">
          {/* Category */}
          <p className="label-text text-primary text-[0.65rem] tracking-widest mb-4">
            {recipe.category.toUpperCase()}
          </p>

          {/* Title */}
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
            {recipe.title}
          </h1>

          {/* Description */}
          <p className="font-body text-base md:text-lg text-black/60 leading-relaxed mb-6">
            {recipe.description}
          </p>

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 font-sans text-sm text-black/70">
            <span className="inline-flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>
                <strong className="font-medium">Prep:</strong>{" "}
                {recipe.prepTime}
              </span>
            </span>
            {recipe.cookTime !== "0 min" && (
              <span className="inline-flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
                <span>
                  <strong className="font-medium">Cook:</strong>{" "}
                  {recipe.cookTime}
                </span>
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>
                {recipe.servings}{" "}
                {recipe.servings === 1 ? "Serving" : "Servings"}
              </span>
            </span>
            <span className="inline-flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>{formatDifficulty(recipe.difficulty)}</span>
            </span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-[16/7] overflow-hidden bg-gray-light mb-12">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            data-placeholder="true"
          />
          {/* Difficulty Badge */}
          <div className="absolute top-4 left-4 bg-primary px-4 py-1.5">
            <span className="font-sans text-xs uppercase tracking-widest font-medium text-white">
              {formatDifficulty(recipe.difficulty)}
            </span>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="max-w-3xl mx-auto">
          {/* Ingredients Section */}
          <div className="mb-12">
            <h2 className="font-heading text-2xl md:text-3xl mb-6">
              Ingredients
            </h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="font-body text-base md:text-lg text-black/80 flex items-start"
                >
                  <span className="text-primary mr-3 mt-1 flex-shrink-0">
                    •
                  </span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="border-t border-border mb-12" />

          {/* Instructions Section */}
          <div className="mb-12">
            <h2 className="font-heading text-2xl md:text-3xl mb-6">
              Instructions
            </h2>
            <ol className="space-y-6">
              {recipe.instructions.map((step, index) => (
                <li
                  key={index}
                  className="font-body text-base md:text-lg text-black/80 flex items-start"
                >
                  <span className="font-sans text-sm font-semibold text-primary mr-4 mt-0.5 flex-shrink-0 w-7 h-7 bg-primary/10 flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Divider */}
          <div className="border-t border-border mb-12" />

          {/* CTA Section */}
          <div className="text-center py-8 bg-cream px-8 md:px-12">
            <p className="label-text text-primary text-xs tracking-widest mb-3">
              LOVE THIS RECIPE?
            </p>
            <h3 className="font-heading text-2xl md:text-3xl mb-4">
              Let Chef Kyla Cook for You
            </h3>
            <p className="font-body text-base text-black/60 mb-6 max-w-md mx-auto">
              Enjoy meals like this delivered to your door every week with our
              curated meal plans — made with intention, seasoned with love.
            </p>
            <Button as="a" href="/meal-plans">
              Explore Meal Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Related Recipes */}
      {relatedRecipes.length > 0 && (
        <section className="section-padding max-container bg-cream">
          <div className="mb-10 text-center">
            <p className="label-text text-primary mb-3 text-xs tracking-widest">
              MORE FROM THE KITCHEN
            </p>
            <h2 className="font-heading text-2xl md:text-3xl">
              You May Also Enjoy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {relatedRecipes.map((related) => (
              <article key={related.id} className="group">
                <Link href={`/recipes/${related.slug}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-light mb-4">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      data-placeholder="true"
                    />
                    <div className="absolute top-3 left-3 bg-primary px-3 py-1">
                      <span className="font-sans text-[0.65rem] uppercase tracking-widest font-medium text-white">
                        {formatDifficulty(related.difficulty)}
                      </span>
                    </div>
                  </div>

                  <p className="label-text text-primary text-[0.65rem] tracking-widest mb-2">
                    {related.category.toUpperCase()}
                  </p>

                  <h3 className="font-heading text-lg md:text-xl leading-snug mb-2 group-hover:text-primary transition-colors duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]">
                    {related.title}
                  </h3>

                  <p className="font-body text-sm text-black/60 leading-relaxed line-clamp-2">
                    {related.description}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
