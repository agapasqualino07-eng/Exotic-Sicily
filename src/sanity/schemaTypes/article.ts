import { defineField, defineType } from "sanity";
import { bodyBlocks } from "./page";

export const BLOG_CATEGORIES = [
  { title: "Ricette e idee", value: "ricette" },
  { title: "Guide", value: "guide" },
  { title: "Regali", value: "regali" },
  { title: "Dietro le quinte", value: "dietro-le-quinte" },
];

export const article = defineType({
  name: "article",
  title: "Articolo del blog",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titolo", type: "string", validation: (r) => r.required().max(90) }),
    defineField({ name: "slug", title: "Indirizzo (slug)", type: "slug", options: { source: "title", maxLength: 80 }, validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Categoria",
      type: "string",
      options: { list: BLOG_CATEGORIES, layout: "radio" },
      initialValue: "ricette",
    }),
    defineField({ name: "excerpt", title: "Riassunto (anteprima e Google)", type: "text", rows: 3, validation: (r) => r.required().max(180) }),
    defineField({ name: "cover", title: "Immagine di copertina", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Testo alternativo", type: "string" })] }),
    defineField({ name: "publishedAt", title: "Data di pubblicazione", type: "datetime", initialValue: () => new Date().toISOString() }),
    defineField({ name: "author", title: "Autore (opzionale)", type: "string" }),
    defineField({ name: "body", title: "Testo", type: "array", of: bodyBlocks }),
    defineField({ name: "products", title: "Prodotti citati (mostrati in fondo)", type: "array", of: [{ type: "reference", to: [{ type: "product" }] }] }),
    defineField({ name: "seoTitle", title: "Titolo per Google (opzionale)", type: "string", validation: (r) => r.max(70) }),
  ],
  orderings: [{ title: "Più recenti", name: "recent", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "category", media: "cover" } },
});
