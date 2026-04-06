"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/constants";
import type { BlogPost } from "@/lib/types";

// TODO: Backend Integration - Replace with API call to fetch blog posts with pagination

type BlogCategory = "all" | BlogPost["category"];

const CATEGORIES: { label: string; value: BlogCategory }[] = [
  { label: "All", value: "all" },
  { label: "Recipes", value: "recipes" },
  { label: "Wellness", value: "wellness" },
  { label: "Soul Food Heritage", value: "soul-food-heritage" },
  { label: "Nutrition", value: "nutrition" },
];

function formatCategory(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogContent() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("all");

  const filteredPosts = useMemo(() => {
    if (activeCategory === "all") return BLOG_POSTS;
    return BLOG_POSTS.filter((post) => post.category === activeCategory);
  }, [activeCategory]);

  return (
    <main>
      <section className="section-padding max-container">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <p className="label-text text-primary mb-3 text-xs tracking-widest">
            FROM THE KITCHEN
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.5rem]">
            From the Kitchen
          </h1>
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

        {/* Article Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {filteredPosts.map((post) => (
              <article key={post.id} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  {/* Card Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-light mb-4">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      data-placeholder="true"
                    />
                  </div>

                  {/* Category Label */}
                  <p className="label-text text-primary text-[0.65rem] tracking-widest mb-2">
                    {formatCategory(post.category)}
                  </p>

                  {/* Title */}
                  <h2 className="font-heading text-xl md:text-2xl leading-snug mb-2 group-hover:text-primary transition-colors duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="font-body text-sm text-black/60 leading-relaxed mb-3 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta + Read More */}
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs text-black/40">
                      {formatDate(post.date)} · {post.readTime}
                    </span>
                    <span className="inline-flex items-center font-sans text-xs uppercase tracking-[0.06em] font-medium text-primary group-hover:text-primary-dark transition-colors duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]">
                      READ MORE
                      <svg
                        className="ml-1.5 w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="square"
                          strokeLinejoin="miter"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-body text-lg text-black/60 mb-4">
              No articles found in this category.
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              className="font-sans text-sm uppercase tracking-[0.06em] font-medium text-primary hover:text-primary-dark underline underline-offset-4 decoration-1 transition-colors duration-300"
            >
              View All Articles
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
