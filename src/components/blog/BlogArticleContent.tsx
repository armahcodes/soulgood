"use client";

import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";

// TODO: Backend Integration - Replace with CMS-powered rich text rendering

interface BlogArticleContentProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

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

function renderRichContent(content: string) {
  // Split content into paragraphs and headings
  const sections = content.split("\n\n");

  return sections.map((section, index) => {
    const trimmed = section.trim();
    if (!trimmed) return null;

    // Check if it's a heading (##)
    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={index}
          className="font-heading text-2xl md:text-3xl mt-10 mb-4"
        >
          {trimmed.replace("## ", "")}
        </h2>
      );
    }

    // Check if it's a list (lines starting with -)
    if (trimmed.includes("\n- ") || trimmed.startsWith("- ")) {
      const lines = trimmed.split("\n");
      const listTitle = !lines[0].startsWith("- ") ? lines[0] : null;
      const listItems = lines.filter((l) => l.startsWith("- "));

      return (
        <div key={index} className="my-4">
          {listTitle && (
            <p className="font-body text-base md:text-lg leading-relaxed text-black/80 mb-2">
              {listTitle}
            </p>
          )}
          <ul className="space-y-2 ml-4">
            {listItems.map((item, i) => {
              const text = item.replace(/^- /, "");
              // Check for bold markers
              const parts = text.split(/\*\*(.*?)\*\*/);
              return (
                <li
                  key={i}
                  className="font-body text-base md:text-lg leading-relaxed text-black/80 flex items-start"
                >
                  <span className="text-primary mr-3 mt-1.5 flex-shrink-0">
                    •
                  </span>
                  <span>
                    {parts.map((part, pi) =>
                      pi % 2 === 1 ? (
                        <strong key={pi} className="font-semibold text-black">
                          {part}
                        </strong>
                      ) : (
                        <span key={pi}>{part}</span>
                      )
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }

    // Check for numbered list (lines starting with digits.)
    if (/^\d+\.\s/.test(trimmed)) {
      const lines = trimmed.split("\n");
      return (
        <ol key={index} className="space-y-2 ml-4 my-4">
          {lines.map((item, i) => {
            const text = item.replace(/^\d+\.\s*/, "");
            return (
              <li
                key={i}
                className="font-body text-base md:text-lg leading-relaxed text-black/80 flex items-start"
              >
                <span className="font-sans text-sm font-medium text-primary mr-3 mt-0.5 flex-shrink-0 w-5">
                  {i + 1}.
                </span>
                <span>{text}</span>
              </li>
            );
          })}
        </ol>
      );
    }

    // Regular paragraph
    return (
      <p
        key={index}
        className="font-body text-base md:text-lg leading-relaxed text-black/80 my-4"
      >
        {trimmed}
      </p>
    );
  });
}

export function BlogArticleContent({
  post,
  relatedPosts,
}: BlogArticleContentProps) {
  return (
    <main>
      {/* Article Header */}
      <section className="section-padding max-container">
        <div className="max-w-3xl mx-auto text-center mb-10">
          {/* Category */}
          <p className="label-text text-primary text-[0.65rem] tracking-widest mb-4">
            {formatCategory(post.category)}
          </p>

          {/* Title */}
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
            {post.title}
          </h1>

          {/* Author & Date */}
          <div className="flex items-center justify-center gap-3 font-sans text-sm text-black/50">
            <span>By {post.author}</span>
            <span className="w-1 h-1 bg-black/30" />
            <span>{formatDate(post.date)}</span>
            <span className="w-1 h-1 bg-black/30" />
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-[16/7] overflow-hidden bg-gray-light mb-12">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            data-placeholder="true"
          />
        </div>

        {/* Article Body */}
        <article className="max-w-3xl mx-auto">
          {renderRichContent(post.content)}
        </article>

        {/* Divider */}
        <div className="max-w-3xl mx-auto mt-16 mb-16">
          <div className="border-t border-border" />
        </div>

        {/* Author Section */}
        <div className="max-w-3xl mx-auto flex items-center gap-4 mb-16">
          <div className="w-14 h-14 bg-cream-dark flex items-center justify-center flex-shrink-0">
            <span className="font-heading text-xl text-primary">CK</span>
          </div>
          <div>
            <p className="font-sans text-sm font-medium uppercase tracking-[0.06em]">
              {post.author}
            </p>
            <p className="font-body text-sm text-black/60">
              Classically trained chef, certified nutrition specialist, and
              founder of Soul Good.
            </p>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="section-padding max-container bg-cream">
          <div className="mb-10 text-center">
            <p className="label-text text-primary mb-3 text-xs tracking-widest">
              KEEP READING
            </p>
            <h2 className="font-heading text-2xl md:text-3xl">
              Related Articles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {relatedPosts.map((related) => (
              <article key={related.id} className="group">
                <Link href={`/blog/${related.slug}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-light mb-4">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      data-placeholder="true"
                    />
                  </div>

                  <p className="label-text text-primary text-[0.65rem] tracking-widest mb-2">
                    {formatCategory(related.category)}
                  </p>

                  <h3 className="font-heading text-lg md:text-xl leading-snug mb-2 group-hover:text-primary transition-colors duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]">
                    {related.title}
                  </h3>

                  <p className="font-body text-sm text-black/60 leading-relaxed line-clamp-2">
                    {related.excerpt}
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
