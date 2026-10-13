import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SanityImage } from "@/components/SanityImage";
import { getArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Journal: idee e ricette con la frutta essiccata" },
  description: "Come usare la frutta esotica essiccata a colazione, in ufficio, in cucina e in viaggio. E come capire cosa c'è davvero dentro un sacchetto.",
  alternates: { canonical: "/journal" },
};

const date = (d?: string) => (d ? new Date(d).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }) : "");

export default async function JournalPage() {
  const articles = await getArticles();
  return (
    <>
      <div className="container"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Journal" }]} /></div>
      <section className="store-hero">
        <div className="container">
          <span className="eyebrow">Journal</span>
          <h1>Idee per mangiarla, e cose che abbiamo imparato.</h1>
          <p>Scriviamo quello che ci chiedete più spesso al banco, solo più in ordine.</p>
        </div>
      </section>
      <section className="section tight">
        <div className="container journal-grid">
          {articles.length ? articles.map((a) => (
            <article key={a._id} className="journal-card" data-reveal>
              {a.cover?.asset ? <SanityImage image={a.cover} ratio={16 / 10} widths={[400, 640, 900]} sizes="(min-width: 900px) 560px, 92vw" className="journal-cover" /> : <div className="journal-cover placeholder" aria-hidden="true" />}
              <div className="journal-body">
                {a.publishedAt ? <time dateTime={a.publishedAt}>{date(a.publishedAt)}</time> : null}
                <h2><Link href={`/journal/${a.slug}`}>{a.title}</Link></h2>
                <p>{a.excerpt}</p>
              </div>
            </article>
          )) : <p className="empty-state">Il primo articolo è in forno. Anzi, nell&apos;essiccatore.</p>}
        </div>
      </section>
    </>
  );
}
