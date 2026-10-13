import Link from "next/link";
import { categoryLabel, formatDate } from "@/lib/blog";
import type { ArticleData } from "@/lib/types";
import { FRUIT } from "./Icon";
import { shade } from "./ProductArt";
import { SanityImage } from "./SanityImage";

/** Copertina: foto se c'è, altrimenti un'illustrazione nei colori del primo prodotto citato. */
export function ArticleCover({ a, priority = false, sizes = "(min-width: 900px) 380px, 92vw" }: { a: ArticleData; priority?: boolean; sizes?: string }) {
  if (a.cover?.asset) {
    return <SanityImage image={a.cover} alt={a.cover.alt || ""} ratio={16 / 10} widths={[400, 640, 960]} sizes={sizes} priority={priority} className="article-cover" />;
  }
  const c = a.coverColor || "#E8974A";
  return (
    <div className="article-cover article-art" style={{ background: `radial-gradient(circle at 30% 30%, ${shade(c, 0.35)}, ${c} 75%)` }} aria-hidden="true">
      <svg viewBox="0 0 100 100" fill="none" stroke={shade(c, -0.45)} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">{FRUIT[a.coverIcon || "mango"]}</svg>
      <svg viewBox="0 0 100 100" fill="none" stroke="#FBF6EE" strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ghost">{FRUIT[a.coverIcon || "mango"]}</svg>
    </div>
  );
}

export function ArticleMeta({ a, compact = false }: { a: ArticleData; compact?: boolean }) {
  return (
    <p className="article-meta">
      <span className="article-cat">{categoryLabel(a.category)}</span>
      {a.publishedAt && !compact ? <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time> : null}
      {a.readingMinutes ? <span>{a.readingMinutes} min di lettura</span> : null}
    </p>
  );
}

export function ArticleCard({ a, featured = false, headingLevel = 3 }: { a: ArticleData; featured?: boolean; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className={`article-card${featured ? " featured" : ""}`} data-reveal>
      <div className="article-card-media"><ArticleCover a={a} priority={featured} sizes={featured ? "(min-width: 900px) 640px, 92vw" : undefined} /></div>
      <div className="article-card-body">
        <ArticleMeta a={a} compact={!featured} />
        <H><Link href={`/blog/${a.slug}`}>{a.title}</Link></H>
        <p>{a.excerpt}</p>
        <span className="article-more" aria-hidden="true">Leggi l&apos;articolo →</span>
      </div>
    </article>
  );
}
