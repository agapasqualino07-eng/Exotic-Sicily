import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { ProductGrid } from "@/components/ProductCard";
import { StoreCatalog } from "@/components/StoreCatalog";
import { SITE_URL } from "@/lib/format";
import { getCategories, getProducts, getStorePage } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getStorePage();
  return { title: s.seoTitle || "Store", description: s.seoDescription, alternates: { canonical: "/store" } };
}

export default async function StorePage() {
  const [page, products, categories] = await Promise.all([getStorePage(), getProducts(), getCategories()]);
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/prodotti/${p.slug}`, name: p.name })),
  };
  return (
    <>
      <div className="container"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Store" }]} /></div>
      <section className="store-hero">
        <div className="container">
          {page.eyebrow ? <span className="eyebrow">{page.eyebrow}</span> : null}
          <h1>{page.title}</h1>
          {page.subtitle ? <p>{page.subtitle}</p> : null}
        </div>
      </section>

      <section className="section products-section tight">
        <div className="container">
          {products.length === 0 ? (
            <div className="empty-state"><p>Il catalogo è in arrivo. Torna a trovarci presto.</p></div>
          ) : (
            // Suspense: StoreCatalog legge i filtri dall'indirizzo (?categoria=…)
            <Suspense fallback={<ProductGrid products={products} />}>
              <StoreCatalog products={products} categories={categories} />
            </Suspense>
          )}
        </div>
      </section>

      {page.infoCards?.length ? (
        <section className="section values tight-top">
          <div className="container">
            <div className="values-grid three">
              {page.infoCards.map((c) => (
                <div className="value-card" key={c._key}>
                  <div className="value-icon"><Icon name={c.icon || "leaf"} size={26} /></div>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <JsonLd data={list} />
    </>
  );
}
