import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { ProductGrid } from "@/components/ProductCard";
import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
import { getArticle, getArticles } from "@/lib/content";
import { SITE_URL } from "@/lib/format";
import { imageUrl } from "@/lib/image";
import { clip, ogFallback, seoTitle } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return {};
  const og = imageUrl(a.cover, 1200, 630);
  return {
    title: seoTitle(a.seoTitle || a.title),
    description: clip(a.excerpt),
    alternates: { canonical: `/journal/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: clip(a.excerpt), publishedTime: a.publishedAt, images: og ? [{ url: og, width: 1200, height: 630 }] : ogFallback() },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.excerpt,
    datePublished: a.publishedAt,
    dateModified: a.updatedAt || a.publishedAt,
    author: a.author ? { "@type": "Person", name: a.author } : { "@type": "Organization", name: "Exotic Dry Sicily", url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#org` },
    mainEntityOfPage: `${SITE_URL}/journal/${a.slug}`,
    image: a.cover?.asset ? imageUrl(a.cover, 1200, 630) : `${SITE_URL}/og/sito`,
    inLanguage: "it-IT",
  };
  return (
    <>
      <div className="container"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Journal", href: "/journal" }, { label: a.title }]} /></div>
      <article className="container narrow page-article">
        <h1>{a.title}</h1>
        <p className="lead">{a.excerpt}</p>
        {a.cover?.asset ? <SanityImage image={a.cover} ratio={16 / 9} widths={[640, 960, 1280]} sizes="(min-width: 800px) 720px, 92vw" priority className="rich-img" /> : null}
        <div className="prose"><RichText value={a.body} /></div>
      </article>
      {a.products?.length ? (
        <section className="section products-section">
          <div className="container">
            <div className="products-head"><div><span className="eyebrow">Citati nell&apos;articolo</span><h2>Da provare</h2></div></div>
            <ProductGrid products={a.products} />
          </div>
        </section>
      ) : null}
      <JsonLd data={ld} />
    </>
  );
}
