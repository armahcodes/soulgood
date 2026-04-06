"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { RECIPES } from "@/lib/constants";
import { Clock, Users, BarChart3 } from "lucide-react";

// TODO: Backend Integration - Replace with API call to fetch recipes

type RecipeCategory = "all" | string;

const CATEGORIES: { label: string; value: RecipeCategory }[] = [
  { label: "All", value: "all" },
  { label: "Bowls", value: "bowls" },
  { label: "Mains", value: "mains" },
  { label: "Soups", value: "soups" },
  { label: "Drinks", value: "drinks" },
  { label: "Snacks", value: "snacks" },
];

function formatDifficulty(difficulty: string): string {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

export function RecipesContent() {
  const [activeCategory, setActiveCategory] = useState<RecipeCategory>("all");

  const filteredRecipes = useMemo(() => {
    if (activeCategory === "all") return RECIPES;
    return RECIPES.filter((recipe) => recipe.category === activeCategory);
  }, [activeCategory]);

  return (
    <main className="flex-1">
      <section className="section-padding max-container">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <p className="label-text text-primary mb-3 text-xs tracking-widest">
            SOUL GOOD KITCHEN
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.5rem]">
            Recipes
          </h1>
          <p className="font-body text-base md:text-lg text-black/60 mt-4 max-w-2xl mx-auto">
            From Chef Kyla&apos;s kitchen to yours — nourishing recipes that
            celebrate soul food heritage with a modern wellness twist.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`font-sans text-xs uppercase tracking-[0.06em] font-medium px-5 py-2.5 border transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] ${
                activeCategory === cat.value
                  ? "bg-black text-white border-black"
                  : "bg-transparent text-black border-border hover:bg-black hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {filteredRecipes.map((recipe) => (
              <article key={recipe.id} className="group">
                <Link href={`/recipes/${recipe.slug}`} className="block">
                  {/* Recipe Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-light mb-4">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      data-placeholder="true"
                    />
                    {/* Difficulty Badge */}
                    <div className="absolute top-3 left-3 bg-primary px-3 py-1">
                      <span className="font-sans text-[0.65rem] uppercase tracking-widest font-medium text-white">
                        {formatDifficulty(recipe.difficulty)}
                      </span>
                    </div>
                  </div>

                  {/* Category Label */}
                  <p className="label-text text-primary text-[0.65rem] tracking-widest mb-2">
                    {recipe.category.toUpperCase()}
                  </p>

                  {/* Title */}
                  <h2 className="font-heading text-xl md:text-2xl leading-snug mb-2 group-hover:text-primary transition-colors duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]">
                    {recipe.title}
                  </h2>

                  {/* Description */}
                  <p className="font-body text-sm text-black/60 leading-relaxed mb-4 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Recipe Meta */}
                  <div className="flex items-center gap-4 font-sans text-xs text-black/50">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {recipe.prepTime}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" aria-hidden="true" />
                      {recipe.servings}{" "}
                      {recipe.servings === 1 ? "serving" : "servings"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
                      {formatDifficulty(recipe.difficulty)}
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-body text-lg text-black/60 mb-4">
              No recipes found in this category.
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              className="font-sans text-sm uppercase tracking-[0.06em] font-medium text-primary hover:text-primary-dark underline underline-offset-4 decoration-1 transition-colors duration-300"
            >
              View All Recipes
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
