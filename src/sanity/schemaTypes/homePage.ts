import { defineField, defineType } from "sanity";
import { sectionMembers } from "./sections";

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Nome interno", type: "string", initialValue: "Home", readOnly: true }),
    defineField({
      name: "sections",
      title: "Sezioni della Home",
      type: "array",
      description: "Trascina per cambiare l'ordine. Elimina una sezione per toglierla; «Aggiungi» per inserirne di nuove.",
      of: sectionMembers,
    }),
    defineField({ name: "seoTitle", title: "Titolo per Google", type: "string", validation: (r) => r.max(70) }),
    defineField({ name: "seoDescription", title: "Descrizione per Google", type: "text", rows: 2, validation: (r) => r.max(170) }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});

export const storePage = defineType({
  name: "storePage",
  title: "Pagina Store",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Sopratitolo", type: "string" }),
    defineField({ name: "title", title: "Titolo", type: "string" }),
    defineField({ name: "subtitle", title: "Sottotitolo", type: "text", rows: 3 }),
    defineField({
      name: "infoCards",
      title: "Riquadri informativi (sotto il catalogo)",
      type: "array",
      of: [
        {
          type: "object",
          name: "infoCard",
          fields: [
            defineField({ name: "icon", title: "Icona", type: "string", options: { list: [{ title: "Camion", value: "truck" }, { title: "Scudo", value: "shield" }, { title: "Stella", value: "handPicked" }, { title: "Foglia", value: "leaf" }, { title: "Regalo", value: "gift" }, { title: "Orologio", value: "clock" }] } }),
            defineField({ name: "title", title: "Titolo", type: "string" }),
            defineField({ name: "text", title: "Testo", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        },
      ],
    }),
    defineField({ name: "seoTitle", title: "Titolo per Google", type: "string" }),
    defineField({ name: "seoDescription", title: "Descrizione per Google", type: "text", rows: 2 }),
  ],
  preview: { prepare: () => ({ title: "Pagina Store" }) },
});
