import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/constants";
import { BlogArticleContent } from "@/components/blog/BlogArticleContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Article Not Found | Soul Good" };
  }

  return {
    title: `${post.title} | Soul Good Blog`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Soul Good Blog`,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Get related posts: same category first, then other posts
  const sameCategoryPosts = BLOG_POSTS.filter(
    (p) => p.id !== post.id && p.category === post.category
  );
  const otherPosts = BLOG_POSTS.filter(
    (p) =>
      p.id !== post.id && !sameCategoryPosts.some((sp) => sp.id === p.id)
  );

  const relatedPosts = [...sameCategoryPosts, ...otherPosts].slice(0, 3);

  return <BlogArticleContent post={post} relatedPosts={relatedPosts} />;
}
