"use client";

import Link from "next/link";
import { Icon } from "./Icon";
import { useCart } from "./CartProvider";
import type { CartSnapshot } from "./cart-types";
import { flyToCart } from "./motion/gsap";

/** Pulsante «+» delle card. Con più formati porta alla pagina prodotto per sceglierlo. */
export function QuickAdd({ snapshot, name, available, href }: { snapshot: CartSnapshot | null; name: string; available: boolean; href: string }) {
  const { add } = useCart();
  if (!available) {
    return <span className="add-btn add-btn--off" aria-label={`${name} esaurito`}><Icon name="close" size={18} /></span>;
  }
  if (!snapshot) {
    return <Link href={href} className="add-btn" aria-label={`Scegli il formato di ${name}`}><Icon name="arrow" size={18} /></Link>;
  }
  return (
    <button type="button" className="add-btn" onClick={(e) => { add(snapshot, 1); flyToCart(e.currentTarget, snapshot.color); }} aria-label={`Aggiungi ${name} al carrello`}>
      <Icon name="plus" size={20} />
    </button>
  );
}
