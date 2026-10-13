import { defineArrayMember, defineField, defineType } from "sanity";
import { iconField, linkFields } from "./shared";

const eyebrow = defineField({ name: "eyebrow", title: "Sopratitolo (piccolo, sopra il titolo)", type: "string" });
const cta = (name: string, title: string) =>
  defineField({ name, title, type: "object", fields: linkFields });

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero (in cima alla Home)",
  type: "object",
  fields: [
    eyebrow,
    defineField({ name: "title", title: "Titolo", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "rotatingWords",
      title: "Parole che si alternano dopo il titolo",
      type: "array",
      of: [{ type: "string" }],
      description: "Es. mango, ananas, papaya: compaiono una dopo l'altra in fondo al titolo, in corsivo colorato. Lascia vuoto per un titolo fisso.",
    }),
    defineField({ name: "highlight", title: "Parola da evidenziare (solo se non usi le parole che si alternano)", type: "string" }),
    defineField({ name: "subtitle", title: "Sottotitolo", type: "text", rows: 3 }),
    cta("primaryCta", "Pulsante principale"),
    cta("secondaryCta", "Pulsante secondario"),
    defineField({ name: "image", title: "Immagine principale (opzionale)", type: "image", options: { hotspot: true }, description: "Foto del prodotto o del laboratorio. Se vuota, il sito mostra una composizione grafica con i prodotti." }),
    defineField({ name: "badgeTitle", title: "Badge — titolo", type: "string" }),
    defineField({ name: "badgeText", title: "Badge — testo", type: "string" }),
    defineField({
      name: "trust",
      title: "Punti di fiducia (sotto i pulsanti)",
      type: "array",
      of: [defineArrayMember({ type: "object", name: "trustItem", fields: [iconField(), defineField({ name: "text", title: "Testo", type: "string" })], preview: { select: { title: "text" } } })],
    }),
  ],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title: "Hero", subtitle: title }) },
});

export const marqueeSection = defineType({
  name: "marqueeSection",
  title: "Striscia scorrevole",
  type: "object",
  fields: [defineField({ name: "items", title: "Frasi", type: "array", of: [{ type: "string" }] })],
  preview: { prepare: () => ({ title: "Striscia scorrevole" }) },
});

export const showcaseSection = defineType({
  name: "showcaseSection",
  title: "Vetrina interattiva «Scegli il tuo frutto»",
  type: "object",
  description: "Il visitatore tocca un frutto: lo sfondo prende il suo colore e può aggiungerlo subito al carrello.",
  fields: [
    eyebrow,
    defineField({ name: "title", title: "Titolo", type: "string" }),
    defineField({ name: "subtitle", title: "Sottotitolo", type: "string" }),
    defineField({ name: "products", title: "Prodotti (opzionale, max 8)", type: "array", of: [{ type: "reference", to: [{ type: "product" }] }], description: "Se vuoto mostra i primi 8 prodotti del catalogo.", validation: (r) => r.max(8) }),
  ],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title: "Vetrina interattiva", subtitle: title }) },
});

export const compareSection = defineType({
  name: "compareSection",
  title: "Confronto etichetta",
  type: "object",
  fields: [
    eyebrow,
    defineField({ name: "title", title: "Titolo", type: "string" }),
    defineField({ name: "text", title: "Testo", type: "text", rows: 2 }),
    defineField({ name: "commonTitle", title: "Colonna sinistra — titolo", type: "string" }),
    defineField({ name: "commonItems", title: "Colonna sinistra — voci (vengono barrate)", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "oursTitle", title: "Colonna destra — titolo", type: "string" }),
    defineField({ name: "oursLabel", title: "Colonna destra — etichetta", type: "string" }),
    defineField({ name: "note", title: "Nota sotto (opzionale)", type: "string" }),
  ],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title: "Confronto etichetta", subtitle: title }) },
});

export const valuesSection = defineType({
  name: "valuesSection",
  title: "Perché sceglierci (4 punti)",
  type: "object",
  fields: [
    eyebrow,
    defineField({ name: "title", title: "Titolo", type: "string" }),
    defineField({ name: "subtitle", title: "Sottotitolo", type: "text", rows: 2 }),
    defineField({
      name: "items",
      title: "Punti",
      type: "array",
      of: [defineArrayMember({ type: "object", name: "valueItem", fields: [iconField(), defineField({ name: "title", title: "Titolo", type: "string" }), defineField({ name: "text", title: "Testo", type: "text", rows: 2 })], preview: { select: { title: "title", subtitle: "text" } } })],
    }),
  ],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title: "Perché sceglierci", subtitle: title }) },
});

export const storySection = defineType({
  name: "storySection",
  title: "La nostra storia",
  type: "object",
  fields: [
    defineField({ name: "anchor", title: "Ancora del link", type: "string", description: "Es. «storia» → il menu può puntare a /#storia", initialValue: "storia" }),
    eyebrow,
    defineField({ name: "title", title: "Titolo", type: "string" }),
    defineField({ name: "paragraphs", title: "Paragrafi", type: "array", of: [{ type: "text", rows: 4 }] }),
    defineField({ name: "image", title: "Foto (opzionale)", type: "image", options: { hotspot: true } }),
    defineField({ name: "signatureName", title: "Firma — nome", type: "string" }),
    defineField({ name: "signatureRole", title: "Firma — ruolo / frase", type: "string" }),
  ],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title: "Storia", subtitle: title }) },
});

export const processSection = defineType({
  name: "processSection",
  title: "Come nasce (passaggi)",
  type: "object",
  fields: [
    eyebrow,
    defineField({ name: "title", title: "Titolo", type: "string" }),
    defineField({ name: "subtitle", title: "Sottotitolo", type: "string" }),
    defineField({
      name: "steps",
      title: "Passaggi",
      type: "array",
      of: [defineArrayMember({ type: "object", name: "step", fields: [defineField({ name: "title", title: "Titolo", type: "string" }), defineField({ name: "text", title: "Testo", type: "text", rows: 2 })], preview: { select: { title: "title", subtitle: "text" } } })],
    }),
  ],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title: "Processo", subtitle: title }) },
});

export const productsSection = defineType({
  name: "productsSection",
  title: "Vetrina prodotti",
  type: "object",
  fields: [
    eyebrow,
    defineField({ name: "title", title: "Titolo", type: "string" }),
    defineField({ name: "subtitle", title: "Sottotitolo", type: "text", rows: 2 }),
    defineField({
      name: "mode",
      title: "Quali prodotti mostrare",
      type: "string",
      options: { list: [{ title: "Quelli segnati «In evidenza»", value: "featured" }, { title: "Scelgo io i prodotti", value: "manual" }], layout: "radio" },
      initialValue: "featured",
    }),
    defineField({ name: "products", title: "Prodotti scelti", type: "array", of: [{ type: "reference", to: [{ type: "product" }] }], hidden: ({ parent }) => parent?.mode !== "manual" }),
    defineField({ name: "ctaLabel", title: "Testo del pulsante", type: "string" }),
    defineField({ name: "ctaHref", title: "Link del pulsante", type: "string", initialValue: "/store" }),
  ],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title: "Vetrina prodotti", subtitle: title }) },
});

export const testimonialsSection = defineType({
  name: "testimonialsSection",
  title: "Recensioni clienti",
  type: "object",
  description: "Si mostra solo se esistono recensioni. Aggiungile da «Recensioni clienti».",
  fields: [eyebrow, defineField({ name: "title", title: "Titolo", type: "string" })],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title: "Recensioni (appare solo se ce ne sono)", subtitle: title }) },
});

export const blogSection = defineType({
  name: "blogSection",
  title: "Dal blog (ultimi articoli)",
  type: "object",
  description: "Mostra automaticamente gli ultimi 3 articoli pubblicati.",
  fields: [
    eyebrow,
    defineField({ name: "title", title: "Titolo", type: "string" }),
    defineField({ name: "subtitle", title: "Sottotitolo", type: "string" }),
    defineField({ name: "ctaLabel", title: "Testo del pulsante", type: "string", initialValue: "Tutti gli articoli" }),
  ],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title: "Dal blog", subtitle: title }) },
});

export const faqSection = defineType({
  name: "faqSection",
  title: "Domande frequenti (in Home)",
  type: "object",
  description: "Mostra le domande segnate «Mostra anche in Home».",
  fields: [eyebrow, defineField({ name: "title", title: "Titolo", type: "string" }), defineField({ name: "subtitle", title: "Sottotitolo", type: "string" })],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title: "Domande frequenti", subtitle: title }) },
});

export const newsletterSection = defineType({
  name: "newsletterSection",
  title: "Iscrizione newsletter",
  type: "object",
  fields: [
    eyebrow,
    defineField({ name: "title", title: "Titolo", type: "string" }),
    defineField({ name: "text", title: "Testo", type: "text", rows: 2 }),
    defineField({ name: "buttonLabel", title: "Testo del pulsante", type: "string" }),
    defineField({ name: "successText", title: "Messaggio dopo l'iscrizione", type: "string" }),
    defineField({ name: "note", title: "Nota piccola", type: "string" }),
  ],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title: "Newsletter", subtitle: title }) },
});

export const ctaSection = defineType({
  name: "ctaSection",
  title: "Invito all'azione finale",
  type: "object",
  fields: [eyebrow, defineField({ name: "title", title: "Titolo", type: "string" }), defineField({ name: "text", title: "Testo", type: "text", rows: 2 }), cta("cta", "Pulsante")],
  preview: { select: { title: "title" }, prepare: ({ title }) => ({ title: "Invito finale", subtitle: title }) },
});

export const sectionTypes = [heroSection, marqueeSection, showcaseSection, compareSection, valuesSection, storySection, processSection, productsSection, testimonialsSection, blogSection, faqSection, newsletterSection, ctaSection];
export const sectionMembers = sectionTypes.map((t) => defineArrayMember({ type: t.name }));
