import { defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "Domanda frequente",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Domanda", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Risposta", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "featured", title: "Mostra anche in Home", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Posizione", type: "number", initialValue: 50 }),
  ],
  orderings: [{ title: "Posizione", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "question", subtitle: "answer" } },
});
