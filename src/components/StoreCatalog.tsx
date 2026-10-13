"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CategoryData, ProductCardData } from "@/lib/types";
import { Icon } from "./Icon";
import { ProductCard } from "./ProductCard";

const SORTS = [
  { value: "featured", label: "Consigliati" },
  { value: "price-asc", label: "Prezzo: dal più basso" },
  { value: "price-desc", label: "Prezzo: dal più alto" },
  { value: "name", label: "Nome A–Z" },
];

const minPrice = (p: ProductCardData) => (p.variants?.length ? Math.min(...p.variants.map((v) => v.price)) : p.price);

/** Catalogo con categorie come pagine vere (/store/<categoria>: indicizzabili), ricerca e ordinamento. */
export function StoreCatalog({ products, categories, active = "tutti" }: { products: ProductCardData[]; categories: CategoryData[]; active?: string }) {
  const [sort, setSort] = useState("featured");
  const [q, setQ] = useState("");

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = products.filter((p) => (active === "tutti" || p.category?.slug === active) && (!term || `${p.name} ${p.shortDescription} ${p.category?.title ?? ""} ${p.ingredients ?? ""}`.toLowerCase().includes(term)));
    if (sort === "price-asc") list = [...list].sort((a, b) => minPrice(a) - minPrice(b));
    else if (sort === "price-desc") list = [...list].sort((a, b) => minPrice(b) - minPrice(a));
    else if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "it"));
    return list;
  }, [products, active, sort, q]);

  const tabs = [{ slug: "tutti", title: "Tutti" }, ...categories.map((c) => ({ slug: c.slug, title: c.title }))];

  return (
    <>
      <div className="catalog-bar">
        <nav className="filters" aria-label="Categorie">
          {tabs.map((t) => (
            <Link key={t.slug} href={t.slug === "tutti" ? "/store" : `/store/${t.slug}`} scroll={false} className={`filter-btn${active === t.slug ? " active" : ""}`} aria-current={active === t.slug ? "page" : undefined}>
              {t.title}
            </Link>
          ))}
        </nav>
        <div className="catalog-tools">
          <label className="search">
            <span className="sr-only">Cerca un prodotto</span>
            <Icon name="search" size={18} />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca un frutto…" />
          </label>
          <label className="select">
            <span className="sr-only">Ordina per</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <p className="results-count" role="status" aria-live="polite">{visible.length} {visible.length === 1 ? "prodotto" : "prodotti"}</p>

      {visible.length ? (
        <div className="product-grid">
          {visible.map((p, i) => <ProductCard key={p._id} product={p} priority={i < 2} />)}
        </div>
      ) : (
        <div className="empty-state">
          <p>Niente da fare, questo frutto non ce l&apos;abbiamo. Ancora.</p>
          <button type="button" className="btn btn-outline" onClick={() => setQ("")}>Mostra tutto</button>
        </div>
      )}
    </>
  );
}
