import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getProducts, getStorePage } from "@/lib/content";
import { clip, seoTitle } from "@/lib/seo";
import { StoreView } from "../StoreView";

type Props = { params: Promise<{ categoria: string }> };

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const c = (await getCategories()).find((x) => x.slug === categoria);
  if (!c) return {};
  return {
    title: seoTitle(c.seoTitle || `${c.title}: frutta esotica essiccata in Sicilia`),
    description: clip(c.seoDescription || c.intro || c.description || ""),
    alternates: { canonical: `/store/${c.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { categoria } = await params;
  const [page, products, categories] = await Promise.all([getStorePage(), getProducts(), getCategories()]);
  const category = categories.find((c) => c.slug === categoria);
  if (!category) notFound();
  return <StoreView page={page} products={products} categories={categories} category={category} />;
}
