import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Categoria",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Nome", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Indirizzo (slug)", type: "slug", options: { source: "title", maxLength: 60 }, validation: (r) => r.required() }),
    defineField({ name: "description", title: "Descrizione breve", type: "text", rows: 2 }),
    defineField({ name: "order", title: "Posizione nei filtri", type: "number", description: "Numero più basso = più a sinistra.", initialValue: 10 }),
  ],
  orderings: [{ title: "Posizione", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "description" } },
});
