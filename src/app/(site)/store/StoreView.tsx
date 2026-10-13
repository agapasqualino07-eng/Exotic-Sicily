import { Breadcrumb } from "@/components/Breadcrumb";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { StoreCatalog } from "@/components/StoreCatalog";
import { SITE_URL } from "@/lib/format";
import type { CategoryData, ProductCardData, StorePageData } from "@/lib/types";

/** Corpo comune di /store e /store/<categoria>. */
export function StoreView({ page, products, categories, category }: { page: StorePageData; products: ProductCardData[]; categories: CategoryData[]; category?: CategoryData }) {
  const list = category ? products.filter((p) => p.category?.slug === category.slug) : products;
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category?.title ?? page.title,
    itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/prodotti/${p.slug}`, name: p.name })),
  };
  return (
    <>
      <div className="container">
        <Breadcrumb items={[{ label: "Home", href: "/" }, ...(category ? [{ label: "Store", href: "/store" }, { label: category.title }] : [{ label: "Store" }])]} />
      </div>
      <section className="store-hero">
        <div className="container">
          <span className="eyebrow">{category ? "Categoria" : page.eyebrow}</span>
          <h1>{category ? category.title : page.title}</h1>
          {category?.intro || category?.description ? <p>{category.intro || category.description}</p> : page.subtitle ? <p>{page.subtitle}</p> : null}
        </div>
      </section>

      <section className="section products-section tight">
        <div className="container">
          {products.length === 0 ? (
            <div className="empty-state"><p>Stiamo riempiendo gli scaffali. Torna tra poco.</p></div>
          ) : (
            <StoreCatalog products={products} categories={categories} active={category?.slug ?? "tutti"} />
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
                  <h2 className="h3">{c.title}</h2>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <JsonLd data={ld} />
    </>
  );
}
