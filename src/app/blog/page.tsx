import type { Metadata } from "next";
import { BlogContent } from "@/components/blog/BlogContent";

export const metadata: Metadata = {
  title: "Blog | From the Kitchen | Soul Good",
  description:
    "Explore recipes, wellness tips, soul food heritage stories, and nutrition insights from Chef Kyla and the Soul Good kitchen.",
  openGraph: {
    title: "Blog | From the Kitchen | Soul Good",
    description:
      "Explore recipes, wellness tips, soul food heritage stories, and nutrition insights from Chef Kyla and the Soul Good kitchen.",
  },
};

export default function BlogPage() {
  return <BlogContent />;
}
