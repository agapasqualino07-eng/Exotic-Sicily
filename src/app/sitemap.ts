import type { MetadataRoute } from "next";
import { getPageSlugs, getProductSlugs } from "@/lib/content";
import { SITE_URL } from "@/lib/format";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, pages] = await Promise.all([getProductSlugs(), getPageSlugs()]);
  const at = (path: string, extra: Partial<MetadataRoute.Sitemap[number]> = {}) => ({ url: `${SITE_URL}${path}`, ...extra });
  return [
    at("/", { changeFrequency: "weekly", priority: 1 }),
    at("/store", { changeFrequency: "weekly", priority: 0.9 }),
    at("/faq", { changeFrequency: "monthly", priority: 0.5 }),
    ...products.map((p) => at(`/prodotti/${p.slug}`, { changeFrequency: "weekly", priority: 0.8, lastModified: p.updatedAt })),
    ...pages.map((p) => at(`/${p.slug}`, { changeFrequency: "yearly", priority: 0.3, lastModified: p.updatedAt })),
  ];
}
