"use client";

import { useState } from "react";
import { BLOG_CATEGORY_LABELS } from "@/lib/blog";
import type { ArticleData } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";

/** Elenco articoli con filtro per categoria (solo le categorie effettivamente usate). */
export function BlogList({ articles }: { articles: ArticleData[] }) {
  const [cat, setCat] = useState("tutti");
  const used = Object.keys(BLOG_CATEGORY_LABELS).filter((k) => articles.some((a) => a.category === k));
  const list = cat === "tutti" ? articles : articles.filter((a) => a.category === cat);
  const [first, ...rest] = list;
  return (
    <>
      {used.length > 1 ? (
        <div className="filters blog-filters" role="group" aria-label="Filtra per argomento">
          {["tutti", ...used].map((k) => (
            <button key={k} type="button" className={`filter-btn${cat === k ? " active" : ""}`} aria-pressed={cat === k} onClick={() => setCat(k)}>
              {k === "tutti" ? "Tutti" : BLOG_CATEGORY_LABELS[k]}
            </button>
          ))}
        </div>
      ) : null}
      {first ? <ArticleCard a={first} featured headingLevel={2} /> : null}
      {rest.length ? <div className="article-grid">{rest.map((a) => <ArticleCard key={a._id} a={a} headingLevel={2} />)}</div> : null}
    </>
  );
}
