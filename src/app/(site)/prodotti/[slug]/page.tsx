import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Gallery } from "@/components/Gallery";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { ProductArt, shade } from "@/components/ProductArt";
import { ProductGrid, toSnapshot } from "@/components/ProductCard";
import { ProductPurchase } from "@/components/ProductPurchase";
import { RichText } from "@/components/RichText";
import { getProduct, getProductSlugs, getSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/format";
import { imageUrl } from "@/lib/image";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProductSlugs()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  const og = imageUrl(p.image, 1200, 630);
  const desc = p.seoDescription || p.shortDescription;
  return {
    title: p.seoTitle || `${p.name} ${p.format}`,
    description: desc,
    alternates: { canonical: `/prodotti/${p.slug}` },
    openGraph: { title: p.seoTitle || p.name, description: desc, type: "website", ...(og ? { images: [{ url: og, width: 1200, height: 630 }] } : {}) },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [p, settings] = await Promise.all([getProduct(slug), getSettings()]);
  if (!p) notFound();

  const variants = p.variants ?? [];
  const base = toSnapshot(p);
  const color = p.illustration?.color || "#E8974A";
  const images = p.images?.filter((i) => i?.asset) ?? [];
  const offers = variants.length
    ? variants.map((v) => ({ "@type": "Offer", name: v.label, price: v.price.toFixed(2), priceCurrency: "EUR", availability: p.available && v.available !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: `${SITE_URL}/prodotti/${p.slug}` }))
    : { "@type": "Offer", price: p.price.toFixed(2), priceCurrency: "EUR", availability: p.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: `${SITE_URL}/prodotti/${p.slug}`, itemCondition: "https://schema.org/NewCondition" };
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.shortDescription,
    sku: p.slug,
    category: p.category?.title,
    brand: { "@type": "Brand", name: settings.brandName },
    image: images.length ? images.slice(0, 4).map((i) => imageUrl(i, 1200, 1200)) : undefined,
    offers,
  };

  const shipping = settings.shipping;
  const facts: { label: string; value: string }[] = [
    { label: "Ingredienti", value: p.ingredients ?? "" },
    { label: "Allergeni", value: p.allergens ?? "" },
    { label: "Conservazione", value: p.storage ?? "" },
    { label: "Origine", value: p.origin ?? "" },
  ].filter((f) => f.value);

  return (
    <>
      <div className="container">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Store", href: "/store" }, ...(p.category ? [{ label: p.category.title, href: `/store?categoria=${p.category.slug}` }] : []), { label: p.name }]} />
      </div>

      <section className="pdp container">
        <div className="pdp-media">
          {images.length ? (
            <Gallery images={images} name={p.name} />
          ) : (
            <div className="pdp-art" style={{ background: `radial-gradient(circle at 50% 38%, ${shade(color, 0.28)}, ${color} 72%)` }}>
              <ProductArt icon={p.illustration?.icon} color={color} format={p.format} />
            </div>
          )}
        </div>

        <div className="pdp-info">
          {p.category ? <span className="eyebrow">{p.category.title}</span> : null}
          <h1>{p.name}</h1>
          {p.badge ? <span className="product-badge inline">{p.badge}</span> : null}
          <p className="lead">{p.shortDescription}</p>

          <ProductPurchase slug={p.slug} base={base} price={p.price} compareAtPrice={p.compareAtPrice} format={p.format} available={p.available} variants={variants} />

          {p.dietary?.length ? (
            <ul className="chips">{p.dietary.map((d) => <li key={d}><Icon name="check" size={14} /> {d}</li>)}</ul>
          ) : null}

          <ul className="pdp-assurances">
            <li><Icon name="truck" size={20} /><span>{shipping?.deliveryEstimate || "Spediamo in tutta Italia."}{shipping?.freeShippingThreshold ? ` Gratis sopra ${shipping.freeShippingThreshold} €.` : ""}</span></li>
            <li><Icon name="shield" size={20} /><span>Pagamento sicuro con Stripe. Non vediamo mai i dati della tua carta.</span></li>
          </ul>
        </div>
      </section>

      {(p.description?.length || facts.length || p.nutrition?.length) ? (
        <section className="section pdp-details">
          <div className="container pdp-details-grid">
            {p.description?.length ? (
              <div className="prose">
                <h2>Il prodotto</h2>
                <RichText value={p.description} />
              </div>
            ) : null}
            {(facts.length || p.nutrition?.length) ? (
              <div className="facts">
                <h2>Etichetta</h2>
                <dl>
                  {facts.map((f) => (<div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>))}
                </dl>
                {p.nutrition?.length ? (
                  <table className="nutrition">
                    <caption>Valori nutrizionali medi per 100 g</caption>
                    <tbody>{p.nutrition.map((n, i) => <tr key={i}><th scope="row">{n.label}</th><td>{n.value}</td></tr>)}</tbody>
                  </table>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {p.related?.length ? (
        <section className="section products-section">
          <div className="container">
            <div className="products-head"><div><span className="eyebrow">Ti potrebbe piacere</span><h2>Abbinalo a…</h2></div></div>
            <ProductGrid products={p.related.slice(0, 4)} />
          </div>
        </section>
      ) : null}
      <JsonLd data={ld} />
    </>
  );
}
