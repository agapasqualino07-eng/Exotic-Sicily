import type { Metadata } from "next";
import { getCategories, getProducts, getStorePage } from "@/lib/content";
import { clip, seoTitle } from "@/lib/seo";
import { StoreView } from "./StoreView";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getStorePage();
  return {
    title: seoTitle(s.seoTitle || "Frutta esotica essiccata: tutto il catalogo"),
    description: s.seoDescription ? clip(s.seoDescription) : undefined,
    alternates: { canonical: "/store" },
  };
}

export default async function StorePage() {
  const [page, products, categories] = await Promise.all([getStorePage(), getProducts(), getCategories()]);
  return <StoreView page={page} products={products} categories={categories} />;
}
