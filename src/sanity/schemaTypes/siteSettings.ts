import { defineField, defineType } from "sanity";
import { linkFields } from "./shared";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Impostazioni del sito",
  type: "document",
  groups: [
    { name: "brand", title: "Brand & SEO", default: true },
    { name: "header", title: "Menu & banner" },
    { name: "shipping", title: "Spedizioni" },
    { name: "contact", title: "Contatti & azienda" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    defineField({ name: "brandName", title: "Nome del brand", type: "string", group: "brand", validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "Slogan breve", type: "string", group: "brand" }),
    defineField({
      name: "description",
      title: "Descrizione per Google",
      type: "text",
      rows: 3,
      group: "brand",
      description: "Mostrata nei risultati di ricerca quando una pagina non ha una descrizione propria (max ~160 caratteri).",
      validation: (r) => r.max(200),
    }),
    defineField({ name: "logo", title: "Logo (opzionale)", type: "image", group: "brand", description: "Se vuoto, il sito mostra il nome del brand scritto." }),
    defineField({
      name: "ogImage",
      title: "Immagine di anteprima social",
      type: "image",
      group: "brand",
      description: "Immagine mostrata quando il sito viene condiviso su WhatsApp, Instagram, Facebook… (1200×630 consigliata). Se vuota, ne viene generata una automaticamente.",
    }),

    defineField({
      name: "announcement",
      title: "Barra annunci (in cima al sito)",
      type: "object",
      group: "header",
      fields: [
        defineField({ name: "enabled", title: "Mostra la barra", type: "boolean", initialValue: true }),
        defineField({ name: "text", title: "Testo", type: "string" }),
        defineField({ name: "href", title: "Link (opzionale)", type: "string" }),
      ],
    }),
    defineField({
      name: "navigation",
      title: "Menu principale",
      type: "array",
      group: "header",
      of: [{ type: "object", name: "navItem", title: "Voce", fields: linkFields, preview: { select: { title: "label", subtitle: "href" } } }],
    }),

    defineField({
      name: "shipping",
      title: "Spedizioni",
      type: "object",
      group: "shipping",
      fields: [
        defineField({
          name: "freeShippingThreshold",
          title: "Spedizione gratuita sopra (€)",
          type: "number",
          description: "Lascia 0 per non offrire mai la spedizione gratuita.",
          validation: (r) => r.min(0),
        }),
        defineField({ name: "flatRate", title: "Costo spedizione (€)", type: "number", validation: (r) => r.min(0) }),
        defineField({
          name: "countries",
          title: "Paesi di spedizione (codici a 2 lettere)",
          type: "array",
          of: [{ type: "string" }],
          description: "Es. IT, FR, DE, ES. Vengono accettati solo questi paesi al checkout.",
          initialValue: ["IT"],
        }),
        defineField({ name: "deliveryEstimate", title: "Tempi di consegna (testo)", type: "text", rows: 2 }),
      ],
    }),

    defineField({
      name: "contact",
      title: "Contatti",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "email", title: "Email", type: "string", validation: (r) => r.email() }),
        defineField({ name: "phone", title: "Telefono", type: "string" }),
        defineField({ name: "whatsapp", title: "WhatsApp (solo numero con prefisso, es. 393331234567)", type: "string" }),
      ],
    }),
    defineField({
      name: "company",
      title: "Dati aziendali (mostrati nel footer)",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "legalName", title: "Ragione sociale", type: "string" }),
        defineField({ name: "vatNumber", title: "Partita IVA", type: "string" }),
        defineField({ name: "address", title: "Sede legale", type: "string" }),
      ],
    }),
    defineField({
      name: "social",
      title: "Social",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "instagram", title: "Instagram (URL)", type: "url" }),
        defineField({ name: "facebook", title: "Facebook (URL)", type: "url" }),
        defineField({ name: "tiktok", title: "TikTok (URL)", type: "url" }),
      ],
    }),

    defineField({ name: "footerText", title: "Testo del footer", type: "text", rows: 3, group: "footer" }),
    defineField({
      name: "footerLinks",
      title: "Link «Assistenza»",
      type: "array",
      group: "footer",
      of: [{ type: "object", name: "footerLink", fields: linkFields, preview: { select: { title: "label", subtitle: "href" } } }],
    }),
    defineField({
      name: "legalLinks",
      title: "Link legali (in fondo)",
      type: "array",
      group: "footer",
      of: [{ type: "object", name: "legalLink", fields: linkFields, preview: { select: { title: "label", subtitle: "href" } } }],
    }),
    defineField({ name: "paymentNote", title: "Nota sui pagamenti", type: "string", group: "footer" }),
  ],
  preview: { prepare: () => ({ title: "Impostazioni del sito" }) },
});
