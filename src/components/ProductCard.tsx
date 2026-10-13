import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { imageUrl } from "@/lib/image";
import type { ProductCardData } from "@/lib/types";
import { ProductMedia } from "./ProductMedia";
import { QuickAdd } from "./AddToCartButton";
import type { CartSnapshot } from "./cart-types";

export function toSnapshot(p: ProductCardData, variant?: { id: string; label: string; price: number }): CartSnapshot {
  return {
    key: variant ? `${p.slug}::${variant.id}` : p.slug,
    slug: p.slug,
    variantId: variant?.id,
    variantLabel: variant?.label,
    name: p.name,
    format: variant?.label ?? p.format,
    price: variant?.price ?? p.price,
    image: imageUrl(p.image, 160, 160),
    color: p.illustration?.color,
    icon: p.illustration?.icon,
  };
}

export function ProductCard({ product: p, priority = false }: { product: ProductCardData; priority?: boolean }) {
  const variants = (p.variants ?? []).filter((v) => v.available !== false);
  const hasVariants = (p.variants?.length ?? 0) > 0;
  const minPrice = hasVariants ? Math.min(...(variants.length ? variants : p.variants!).map((v) => v.price)) : p.price;
  const available = p.available && (!hasVariants || variants.length > 0);
  const discount = p.compareAtPrice && p.compareAtPrice > p.price ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0;
  const badge = !available ? "Esaurito" : p.badge || (discount ? `-${discount}%` : null);
  const href = `/prodotti/${p.slug}`;

  return (
    <article className={`product-card${available ? "" : " is-soldout"}`}>
      <Link href={href} className="product-media" aria-label={p.name} tabIndex={-1}>
        {badge ? <span className={`product-badge${available ? "" : " sold-out"}`}>{badge}</span> : null}
        <ProductMedia product={p} sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw" priority={priority} />
      </Link>
      <div className="product-info">
        {p.category ? <span className="product-cat">{p.category.title}</span> : null}
        <h3><Link href={href}>{p.name}</Link></h3>
        <p className="desc">{p.shortDescription}</p>
        <div className="product-footer">
          <div className="product-price">
            {hasVariants ? <small>da </small> : null}{formatPrice(minPrice)}
            {!hasVariants && p.compareAtPrice && p.compareAtPrice > p.price ? <s>{formatPrice(p.compareAtPrice)}</s> : null}
            {!hasVariants ? <span>/ {p.format}</span> : null}
          </div>
          <QuickAdd snapshot={hasVariants ? null : toSnapshot(p)} name={p.name} available={available} href={href} />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <div className="product-grid">
      {products.map((p, i) => <ProductCard key={p._id} product={p} priority={i < 2} />)}
    </div>
  );
}
