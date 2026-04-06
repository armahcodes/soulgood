import type { Metadata } from "next";
import { RecipesContent } from "@/components/blog/RecipesContent";

export const metadata: Metadata = {
  title: "Recipes | Soul Good",
  description:
    "Explore Chef Kyla's nourishing recipes — from rainbow power bowls to herb-crusted salmon. Soul food heritage meets modern wellness nutrition.",
  openGraph: {
    title: "Recipes | Soul Good",
    description:
      "Explore Chef Kyla's nourishing recipes — from rainbow power bowls to herb-crusted salmon. Soul food heritage meets modern wellness nutrition.",
  },
};

export default function RecipesPage() {
  return <RecipesContent />;
}
