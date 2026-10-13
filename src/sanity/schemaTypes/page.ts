import { defineArrayMember, defineField, defineType } from "sanity";

export const bodyBlocks = [
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Normale", value: "normal" },
      { title: "Titolo", value: "h2" },
      { title: "Sottotitolo", value: "h3" },
    ],
    lists: [
      { title: "Elenco puntato", value: "bullet" },
      { title: "Elenco numerato", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "Grassetto", value: "strong" },
        { title: "Corsivo", value: "em" },
      ],
      annotations: [
        defineArrayMember({
          name: "link",
          type: "object",
          title: "Link",
          fields: [defineField({ name: "href", type: "string", title: "Indirizzo (https://… oppure /pagina)" })],
        }),
      ],
    },
  }),
  defineArrayMember({
    type: "image",
    options: { hotspot: true },
    fields: [defineField({ name: "alt", title: "Testo alternativo", type: "string" })],
  }),
];

export const page = defineType({
  name: "page",
  title: "Pagina (testo)",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titolo", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Indirizzo (slug)",
      type: "slug",
      options: { source: "title", maxLength: 60 },
      description: "Es. «privacy-policy» → il sito la pubblica su /privacy-policy",
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", title: "Descrizione per Google", type: "text", rows: 2, validation: (r) => r.max(170) }),
    defineField({ name: "body", title: "Contenuto", type: "array", of: bodyBlocks }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
