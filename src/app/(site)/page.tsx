import type { Metadata } from "next";
import { HomeSections } from "@/components/HomeSections";
import { getHome } from "@/lib/content";
import { clip } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const h = await getHome();
  return {
    title: { absolute: h.seoTitle || "Exotic Dry Sicily" },
    description: h.seoDescription ? clip(h.seoDescription) : undefined,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const home = await getHome();
  return <HomeSections sections={home.sections} />;
}
