import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard, ArticleCover, ArticleMeta } from "@/components/ArticleCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ProductGrid } from "@/components/ProductCard";
import { RichText } from "@/components/RichText";
import { categoryLabel } from "@/lib/blog";
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
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: {
      type: "article", title: a.title, description: clip(a.excerpt), publishedTime: a.publishedAt, modifiedTime: a.updatedAt,
      section: categoryLabel(a.category), url: `/blog/${a.slug}`,
      images: og ? [{ url: og, width: 1200, height: 630 }] : a.products?.[0] ? ogFallback(a.products[0].slug) : ogFallback(),
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [a, all] = await Promise.all([getArticle(slug), getArticles()]);
  if (!a) notFound();
  const others = all.filter((x) => x.slug !== a.slug);
  const related = [...others.filter((x) => x.category === a.category), ...others.filter((x) => x.category !== a.category)].slice(0, 2);
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.excerpt,
    datePublished: a.publishedAt,
    dateModified: a.updatedAt || a.publishedAt,
    articleSection: categoryLabel(a.category),
    author: a.author && a.author !== "Exotic Dry Sicily" ? { "@type": "Person", name: a.author } : { "@type": "Organization", name: "Exotic Dry Sicily", url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#org` },
    mainEntityOfPage: `${SITE_URL}/blog/${a.slug}`,
    image: a.cover?.asset ? imageUrl(a.cover, 1200, 630) : `${SITE_URL}/og/${a.products?.[0]?.slug ?? "sito"}`,
    timeRequired: a.readingMinutes ? `PT${a.readingMinutes}M` : undefined,
    inLanguage: "it-IT",
  };
  return (
    <>
      <div className="container"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: a.title }]} /></div>
      <article className="container narrow page-article blog-article">
        <header>
          <ArticleMeta a={a} />
          <h1>{a.title}</h1>
          <p className="lead">{a.excerpt}</p>
        </header>
        <div className="article-hero"><ArticleCover a={a} priority sizes="(min-width: 800px) 720px, 92vw" /></div>
        <div className="prose"><RichText value={a.body} /></div>
        <aside className="article-cta">
          <p className="article-cta-title">Ti è venuta fame?</p>
          <p>Tutti i nostri sacchetti hanno un solo ingrediente. Da 49 € la spedizione è gratis.</p>
          <Link href="/store" className="btn btn-primary">Vai allo shop <Icon name="arrow" size={18} /></Link>
        </aside>
      </article>

      {a.products?.length ? (
        <section className="section products-section">
          <div className="container">
            <div className="products-head"><div><span className="eyebrow">Citati nell&apos;articolo</span><h2>Da provare</h2></div></div>
            <ProductGrid products={a.products} />
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="section">
          <div className="container">
            <div className="products-head"><div><span className="eyebrow">Continua a leggere</span><h2>Altri articoli</h2></div></div>
            <div className="article-grid">{related.map((r) => <ArticleCard key={r._id} a={r} />)}</div>
          </div>
        </section>
      ) : null}

      <section className="newsletter">
        <div className="container">
          <span className="eyebrow">Newsletter</span>
          <h2>Un articolo nuovo ogni tanto, e i frutti appena tornati.</h2>
          <NewsletterForm source="blog" />
          <p className="newsletter-note">Ti cancelli con un clic, quando vuoi.</p>
        </div>
      </section>
      <JsonLd data={ld} />
    </>
  );
}
