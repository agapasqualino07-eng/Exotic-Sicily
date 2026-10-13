import type { Metadata } from "next";
import type { ProductData } from "./types";
import { formatPrice } from "./format";

const BRAND = "Exotic Dry Sicily";

/** Se il titolo contiene già il nome del brand, non aggiungere « | Exotic Dry Sicily » una seconda volta. */
export function seoTitle(t: string): Metadata["title"] {
  // Google taglia oltre ~60 caratteri: il brand si aggiunge solo se c'è spazio
  return t.toLowerCase().includes("exotic dry") || t.length > 40 ? { absolute: t } : t;
}

export const ogFallback = (slug = "sito") => [{ url: `/og/${slug}`, width: 1200, height: 630 }];

/** Taglia una descrizione a ~158 caratteri senza spezzare le parole. */
export function clip(text: string, max = 158): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, t.lastIndexOf(" ", max - 1)).replace(/[,.;:]$/, "") + "…";
}

/** Titolo prodotto con la ricerca tipica in testa: «Mango essiccato senza zuccheri aggiunti 200 g». */
export function productTitle(p: ProductData): string {
  if (p.seoTitle) return p.seoTitle;
  const noSugar = p.dietary?.some((d) => /zuccher/i.test(d));
  const name = p.name.charAt(0) + p.name.slice(1).toLowerCase();
  const full = `${name}${noSugar ? " senza zuccheri aggiunti" : ""}, ${p.format}`;
  // con « | Exotic Dry Sicily » deve restare sotto ~60 caratteri
  return full.length <= 42 ? full : `${name}, ${p.format}`;
}

export function productDescription(p: ProductData): string {
  if (p.seoDescription) return p.seoDescription;
  const ingr = p.ingredients ? ` Ingredienti: ${p.ingredients}.` : "";
  return clip(`${p.shortDescription}${ingr} ${p.format} a ${formatPrice(p.price)}, essiccato e confezionato in Sicilia. Spedizione in tutta Italia.`);
}

export { BRAND };
