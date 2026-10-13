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
import { ogFallback, productDescription, productTitle, seoTitle } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProductSlugs()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  const og = imageUrl(p.image, 1200, 630);
  const title = productTitle(p);
  const desc = productDescription(p);
  return {
    title: seoTitle(title),
    description: desc,
    alternates: { canonical: `/prodotti/${p.slug}` },
    // senza foto, l'anteprima social è generata da /og/<slug> (colore del frutto + prezzo)
    openGraph: { title, description: desc, type: "website", url: `/prodotti/${p.slug}`, images: og ? [{ url: og, width: 1200, height: 630, alt: p.name }] : ogFallback(p.slug) },
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
  // Spedizione e reso nell'offerta: Google li mostra nei risultati Shopping
  const ship = settings.shipping ?? {};
  const shippingDetails = {
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: (ship.flatRate ?? 0).toFixed(2), currency: "EUR" },
    shippingDestination: (ship.countries?.length ? ship.countries : ["IT"]).map((c) => ({ "@type": "DefinedRegion", addressCountry: c })),
    deliveryTime: { "@type": "ShippingDeliveryTime", handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" }, transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 4, unitCode: "DAY" } },
  };
  const returnPolicy = { "@type": "MerchantReturnPolicy", applicableCountry: "IT", returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow", merchantReturnDays: 14, returnMethod: "https://schema.org/ReturnByMail" };
  const offerBase = { priceCurrency: "EUR", url: `${SITE_URL}/prodotti/${p.slug}`, itemCondition: "https://schema.org/NewCondition", shippingDetails, hasMerchantReturnPolicy: returnPolicy, seller: { "@id": `${SITE_URL}/#org` } };
  const offers = variants.length
    ? variants.map((v) => ({ "@type": "Offer", ...offerBase, name: v.label, price: v.price.toFixed(2), availability: p.available && v.available !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" }))
    : { "@type": "Offer", ...offerBase, price: p.price.toFixed(2), availability: p.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" };
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.shortDescription,
    sku: p.slug,
    category: p.category?.title,
    brand: { "@type": "Brand", name: settings.brandName },
    image: images.length ? images.slice(0, 4).map((i) => imageUrl(i, 1200, 1200)) : [`${SITE_URL}/og/${p.slug}`],
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
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Store", href: "/store" }, ...(p.category ? [{ label: p.category.title, href: `/store/${p.category.slug}` }] : []), { label: p.name }]} />
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
            <li><Icon name="shield" size={20} /><span>Paghi con Stripe. La tua carta noi non la vediamo mai.</span></li>
          </ul>
        </div>
      </section>

      {(p.description?.length || p.howTo?.length || facts.length || p.nutrition?.length) ? (
        <section className="section pdp-details">
          <div className="container pdp-details-grid">
            <div>
              {p.description?.length ? (
                <div className="prose">
                  <h2>Com&apos;è fatto</h2>
                  <RichText value={p.description} />
                </div>
              ) : null}
              {p.howTo?.length ? (
                <div className="howto">
                  <h2>Come mangiarlo</h2>
                  <ul>{p.howTo.map((h) => <li key={h}><Icon name="sun" size={18} />{h}</li>)}</ul>
                </div>
              ) : null}
            </div>
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
            <div className="products-head"><div><span className="eyebrow">Già che ci sei</span><h2>Sta bene insieme a</h2></div></div>
            <ProductGrid products={p.related.slice(0, 4)} />
          </div>
        </section>
      ) : null}
      <JsonLd data={ld} />
    </>
  );
}
