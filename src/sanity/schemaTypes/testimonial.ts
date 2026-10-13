import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Recensione cliente",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Testo della recensione",
      type: "text",
      rows: 3,
      description: "Pubblica solo recensioni reali, con il consenso del cliente.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "author", title: "Nome (es. Maria R.)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "location", title: "Città (opzionale)", type: "string" }),
    defineField({ name: "rating", title: "Stelle (1-5)", type: "number", validation: (r) => r.min(1).max(5).integer() }),
    defineField({ name: "product", title: "Prodotto recensito (opzionale)", type: "reference", to: [{ type: "product" }] }),
    defineField({ name: "order", title: "Posizione", type: "number", initialValue: 50 }),
  ],
  preview: { select: { title: "author", subtitle: "quote" } },
});
