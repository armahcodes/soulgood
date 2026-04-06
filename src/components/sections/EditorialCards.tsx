import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/constants";

function formatCategory(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function EditorialCards() {
  // Use first 4 blog posts for the editorial section
  const posts = BLOG_POSTS.slice(0, 4);

  return (
    <section className="section-padding max-container">
      {/* Section header */}
      <div className="mb-12 text-center">
        <p className="label-text text-primary mb-3 text-xs tracking-widest">
          FROM THE KITCHEN
        </p>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem]">
          Recommended Reading
        </h2>
      </div>

      {/* Card grid: 4-up on desktop, 2-up tablet, 1-up mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {posts.map((post) => (
          <article key={post.id} className="group">
            <Link href={`/blog/${post.slug}`} className="block">
              {/* Card image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-light mb-4">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  data-placeholder="true"
                />
              </div>

              {/* Category label */}
              <p className="label-text text-primary text-[0.65rem] tracking-widest mb-2">
                {formatCategory(post.category)}
              </p>

              {/* Title */}
              <h3 className="font-heading text-lg md:text-xl leading-snug mb-2 group-hover:text-primary transition-colors duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="font-body text-sm text-black/60 leading-relaxed mb-3 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Read More link */}
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
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
