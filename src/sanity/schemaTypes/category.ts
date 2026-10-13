import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Categoria",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Nome", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Indirizzo (slug)", type: "slug", options: { source: "title", maxLength: 60 }, validation: (r) => r.required() }),
    defineField({ name: "description", title: "Descrizione breve", type: "text", rows: 2 }),
    defineField({ name: "intro", title: "Testo della pagina categoria", type: "text", rows: 4, description: "Mostrato in cima a /store/<categoria>. 2-4 frasi: aiuta Google a capire la pagina." }),
    defineField({ name: "seoTitle", title: "Titolo per Google (opzionale)", type: "string", validation: (r) => r.max(70) }),
    defineField({ name: "seoDescription", title: "Descrizione per Google (opzionale)", type: "text", rows: 2, validation: (r) => r.max(170) }),
    defineField({ name: "order", title: "Posizione nei filtri", type: "number", description: "Numero più basso = più a sinistra.", initialValue: 10 }),
  ],
  orderings: [{ title: "Posizione", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "description" } },
});
