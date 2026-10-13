import { defineArrayMember, defineField, defineType } from "sanity";
import { FRUIT_ICON_OPTIONS } from "./shared";

export const DIETARY_OPTIONS = [
  "Senza zuccheri aggiunti",
  "Senza conservanti",
  "Vegano",
  "Senza glutine",
  "Biologico",
  "100% naturale",
];

export const product = defineType({
  name: "product",
  title: "Prodotto",
  type: "document",
  groups: [
    { name: "main", title: "Principale", default: true },
    { name: "media", title: "Immagini" },
    { name: "details", title: "Dettagli & etichetta" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "name", title: "Nome", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Indirizzo della pagina (slug)",
      type: "slug",
      group: "main",
      options: { source: "name", maxLength: 80 },
      description: "Premi «Generate». Diventa l'indirizzo /prodotti/<slug>. Non cambiarlo dopo la pubblicazione, o i vecchi link smettono di funzionare.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "category", title: "Categoria", type: "reference", to: [{ type: "category" }], group: "main", validation: (r) => r.required() }),
    defineField({
      name: "price",
      title: "Prezzo (€, IVA inclusa)",
      type: "number",
      group: "main",
      description: "Usa il punto per i decimali: 7.90",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Prezzo di listino barrato (opzionale)",
      type: "number",
      group: "main",
      description: "Se compilato e più alto del prezzo, il sito mostra il vecchio prezzo barrato e lo sconto.",
    }),
    defineField({ name: "format", title: "Formato / peso", type: "string", group: "main", description: "Es. 200 g — oppure 4 x 100 g", validation: (r) => r.required() }),
    defineField({
      name: "variants",
      title: "Varianti di formato (opzionale)",
      type: "array",
      group: "main",
      description: "Per offrire più formati dello stesso prodotto (es. 100 g, 200 g, 500 g). Se vuoto, si usano prezzo e formato qui sopra.",
      of: [
        defineArrayMember({
          type: "object",
          name: "variant",
          fields: [
            defineField({ name: "label", title: "Nome (es. 500 g)", type: "string", validation: (r) => r.required() }),
            defineField({ name: "price", title: "Prezzo (€)", type: "number", validation: (r) => r.required().min(0) }),
            defineField({ name: "available", title: "Disponibile", type: "boolean", initialValue: true }),
          ],
          preview: { select: { title: "label", price: "price" }, prepare: ({ title, price }) => ({ title, subtitle: price != null ? `€ ${price}` : "" }) },
        }),
      ],
    }),
    defineField({ name: "badge", title: "Etichetta sulla card", type: "string", group: "main", description: "Es. Bestseller, Novità, Edizione Limitata, Offerta. Vuoto = nessuna." }),
    defineField({ name: "featured", title: "In evidenza (mostra in Home)", type: "boolean", group: "main", initialValue: false }),
    defineField({ name: "available", title: "Disponibile all'acquisto", type: "boolean", group: "main", initialValue: true, description: "Se spento, il prodotto resta visibile con la scritta «Esaurito»." }),
    defineField({ name: "order", title: "Posizione nel catalogo", type: "number", group: "main", description: "Numero più basso = prima.", initialValue: 50 }),
    defineField({ name: "shortDescription", title: "Descrizione breve (card)", type: "text", rows: 2, group: "main", validation: (r) => r.required().max(180) }),
    defineField({
      name: "description",
      title: "Descrizione completa (pagina prodotto)",
      type: "array",
      group: "main",
      of: [{ type: "block", styles: [{ title: "Normale", value: "normal" }, { title: "Titolo", value: "h3" }], lists: [{ title: "Elenco", value: "bullet" }] }],
    }),

    defineField({
      name: "images",
      title: "Foto",
      type: "array",
      group: "media",
      description: "La prima è quella principale. Se non carichi foto, il sito mostra l'illustrazione qui sotto.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Testo alternativo (per accessibilità e Google)", type: "string" })],
        }),
      ],
    }),
    defineField({
      name: "illustration",
      title: "Illustrazione (se non ci sono foto)",
      type: "object",
      group: "media",
      fields: [
        defineField({ name: "icon", title: "Frutto", type: "string", options: { list: FRUIT_ICON_OPTIONS } }),
        defineField({ name: "color", title: "Colore di sfondo", type: "string", description: "Formato #RRGGBB, es. #E8974A", validation: (r) => r.regex(/^#[0-9a-fA-F]{6}$/, { name: "colore" }).warning("Usa il formato #RRGGBB") }),
      ],
    }),

    defineField({ name: "ingredients", title: "Ingredienti", type: "string", group: "details" }),
    defineField({ name: "allergens", title: "Allergeni", type: "string", group: "details", description: "Es. «Può contenere tracce di frutta a guscio». Lascia vuoto se non applicabile." }),
    defineField({
      name: "dietary",
      title: "Caratteristiche",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
      options: { list: DIETARY_OPTIONS.map((v) => ({ title: v, value: v })) },
    }),
    defineField({
      name: "nutrition",
      title: "Valori nutrizionali (per 100 g)",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "object",
          name: "nutritionRow",
          fields: [
            defineField({ name: "label", title: "Voce (es. Energia)", type: "string" }),
            defineField({ name: "value", title: "Valore (es. 1230 kJ / 294 kcal)", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
    defineField({
      name: "howTo",
      title: "Come mangiarlo (idee)",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
      description: "Una idea per riga, es. «Nello yogurt della mattina». Mostrate nella pagina prodotto.",
    }),
    defineField({ name: "storage", title: "Conservazione", type: "text", rows: 2, group: "details" }),
    defineField({ name: "origin", title: "Origine / lavorazione", type: "text", rows: 2, group: "details" }),
    defineField({
      name: "related",
      title: "Prodotti consigliati insieme (opzionale)",
      type: "array",
      group: "details",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      description: "Se vuoto, il sito suggerisce altri prodotti della stessa categoria.",
    }),

    defineField({ name: "seoTitle", title: "Titolo per Google", type: "string", group: "seo", validation: (r) => r.max(70) }),
    defineField({ name: "seoDescription", title: "Descrizione per Google", type: "text", rows: 2, group: "seo", validation: (r) => r.max(170) }),
  ],
  orderings: [
    { title: "Posizione", name: "order", by: [{ field: "order", direction: "asc" }] },
    { title: "Nome", name: "name", by: [{ field: "name", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", price: "price", format: "format", media: "images.0", available: "available" },
    prepare: ({ title, price, format, media, available }) => ({
      title,
      subtitle: `${price != null ? `€ ${Number(price).toFixed(2)}` : "—"} · ${format ?? ""}${available === false ? " · ESAURITO" : ""}`,
      media,
    }),
  },
});
