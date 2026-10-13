"use client";

import { useRouter, useSearchParams } from "next/navigation";
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

export function StoreCatalog({ products, categories }: { products: ProductCardData[]; categories: CategoryData[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const cat = params.get("categoria") || "tutti";
  const [sort, setSort] = useState("featured");
  const [q, setQ] = useState("");

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = products.filter((p) => (cat === "tutti" || p.category?.slug === cat) && (!term || `${p.name} ${p.shortDescription} ${p.category?.title ?? ""}`.toLowerCase().includes(term)));
    if (sort === "price-asc") list = [...list].sort((a, b) => minPrice(a) - minPrice(b));
    else if (sort === "price-desc") list = [...list].sort((a, b) => minPrice(b) - minPrice(a));
    else if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "it"));
    return list;
  }, [products, cat, sort, q]);

  const setCat = (slug: string) => router.replace(slug === "tutti" ? "/store" : `/store?categoria=${slug}`, { scroll: false });
  const tabs = [{ slug: "tutti", title: "Tutti" }, ...categories.map((c) => ({ slug: c.slug, title: c.title }))];

  return (
    <>
      <div className="catalog-bar">
        <div className="filters" role="group" aria-label="Filtra per categoria">
          {tabs.map((t) => (
            <button key={t.slug} type="button" className={`filter-btn${cat === t.slug ? " active" : ""}`} aria-pressed={cat === t.slug} onClick={() => setCat(t.slug)}>
              {t.title}
            </button>
          ))}
        </div>
        <div className="catalog-tools">
          <label className="search">
            <span className="sr-only">Cerca un prodotto</span>
            <Icon name="search" size={18} />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca…" />
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
          <p>Nessun prodotto corrisponde alla ricerca.</p>
          <button type="button" className="btn btn-outline" onClick={() => { setQ(""); setCat("tutti"); }}>Mostra tutto il catalogo</button>
        </div>
      )}
    </>
  );
}
