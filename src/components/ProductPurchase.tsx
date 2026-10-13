"use client";

import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { Variant } from "@/lib/types";
import { Icon } from "./Icon";
import { useCart } from "./CartProvider";
import type { CartSnapshot } from "./cart-types";

type Base = Omit<CartSnapshot, "key" | "variantId" | "variantLabel">;

export function ProductPurchase({
  slug, base, price, compareAtPrice, format, available, variants,
}: {
  slug: string; base: Base; price: number; compareAtPrice?: number | null; format: string; available: boolean; variants: Variant[];
}) {
  const { add, setOpen } = useCart();
  const firstAvailable = variants.find((v) => v.available !== false) ?? variants[0];
  const [variantId, setVariantId] = useState(firstAvailable?.id);
  const [qty, setQty] = useState(1);
  const [stuck, setStuck] = useState(false);
  const main = useRef<HTMLDivElement>(null);

  const variant = variants.find((v) => v.id === variantId);
  const unit = variant ? variant.price : price;
  const canBuy = available && (!variants.length || variant?.available !== false);

  useEffect(() => {
    const el = main.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function addToCart() {
    add({ ...base, key: variant ? `${slug}::${variant.id}` : slug, variantId: variant?.id, variantLabel: variant?.label, format: variant?.label ?? format, price: unit }, qty);
    setOpen(true);
  }

  return (
    <>
      <div className="buybox" ref={main}>
        <div className="pdp-price">
          <strong>{formatPrice(unit)}</strong>
          {!variant && compareAtPrice && compareAtPrice > unit ? <s>{formatPrice(compareAtPrice)}</s> : null}
          <span>{variant ? variant.label : format}</span>
        </div>

        {variants.length ? (
          <fieldset className="variant-picker">
            <legend>Formato</legend>
            <div>
              {variants.map((v) => (
                <label key={v.id} className={`variant${v.id === variantId ? " active" : ""}${v.available === false ? " off" : ""}`}>
                  <input type="radio" name="variant" value={v.id} checked={v.id === variantId} disabled={v.available === false} onChange={() => setVariantId(v.id)} />
                  <span>{v.label}</span><small>{formatPrice(v.price)}</small>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {canBuy ? (
          <div className="buy-row">
            <div className="qty qty-lg" role="group" aria-label="Quantità">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuisci quantità"><Icon name="minus" size={18} /></button>
              <output aria-live="polite">{qty}</output>
              <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Aumenta quantità"><Icon name="plus" size={18} /></button>
            </div>
            <button type="button" className="btn btn-primary btn-lg grow" onClick={addToCart}>
              <Icon name="bag" size={20} /> Aggiungi al carrello · {formatPrice(unit * qty)}
            </button>
          </div>
        ) : (
          <p className="soldout-note"><Icon name="clock" size={18} /> Al momento esaurito. Scrivici per sapere quando torna disponibile.</p>
        )}
      </div>

      {canBuy ? (
        <div className={`sticky-buy${stuck ? " show" : ""}`} aria-hidden={!stuck}>
          <div><strong>{formatPrice(unit * qty)}</strong><span>{base.name}</span></div>
          <button type="button" className="btn btn-primary" onClick={addToCart} tabIndex={stuck ? 0 : -1}>Aggiungi al carrello</button>
        </div>
      ) : null}
    </>
  );
}
