import type { Metadata } from "next";
import { BlogList } from "@/components/BlogList";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { getArticles } from "@/lib/content";
import { SITE_URL } from "@/lib/format";

export const metadata: Metadata = {
  title: { absolute: "Blog: ricette e guide sulla frutta essiccata" },
  description: "Ricette veloci, abbinamenti, idee regalo e come leggere l'etichetta della frutta essiccata. Dal blog di Exotic Dry Sicily.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const articles = await getArticles();
  const ld = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog di Exotic Dry Sicily",
    url: `${SITE_URL}/blog`,
    inLanguage: "it-IT",
    publisher: { "@id": `${SITE_URL}/#org` },
    blogPost: articles.map((a) => ({ "@type": "BlogPosting", headline: a.title, url: `${SITE_URL}/blog/${a.slug}`, datePublished: a.publishedAt })),
  };
  return (
    <>
      <div className="container"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog" }]} /></div>
      <section className="store-hero">
        <div className="container">
          <span className="eyebrow">Blog</span>
          <h1>Ricette, guide e cose che abbiamo imparato.</h1>
          <p>Scriviamo le risposte alle domande che ci fate più spesso, con qualche idea per usare la frutta essiccata oltre il sacchetto.</p>
        </div>
      </section>
      <section className="section tight">
        <div className="container">
          {articles.length ? <BlogList articles={articles} /> : <p className="empty-state">Il primo articolo è nell&apos;essiccatore. Torna tra poco.</p>}
        </div>
      </section>
      <JsonLd data={ld} />
    </>
  );
}
