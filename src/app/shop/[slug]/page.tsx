import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/constants";
import { PDPContent } from "@/components/product/PDPContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return { title: "Product Not Found | Soul Good" };
  }

  return {
    title: `${product.name} | Soul Good`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Soul Good`,
      description: product.description,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Get related products (same category, excluding current product)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  );

  // If not enough related products from same category, fill with other products
  const allRelated =
    relatedProducts.length >= 3
      ? relatedProducts
      : [
          ...relatedProducts,
          ...PRODUCTS.filter(
            (p) =>
              p.id !== product.id &&
              !relatedProducts.some((rp) => rp.id === p.id)
          ),
        ].slice(0, 4);

  return <PDPContent product={product} relatedProducts={allRelated} />;
}
