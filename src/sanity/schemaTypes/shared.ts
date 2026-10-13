import { defineField } from "sanity";

/** Icone disponibili nei menu a tendina dello Studio (disegnate in src/components/Icon.tsx) */
export const ICON_OPTIONS = [
  { title: "Foglia (naturale)", value: "leaf" },
  { title: "Senza zuccheri", value: "noSugar" },
  { title: "Stella (selezionato a mano)", value: "handPicked" },
  { title: "Riciclo (packaging)", value: "recycle" },
  { title: "Camion (spedizione)", value: "truck" },
  { title: "Scudo (garanzia / sicurezza)", value: "shield" },
  { title: "Segnaposto (luogo)", value: "mapPin" },
  { title: "Orologio", value: "clock" },
  { title: "Regalo", value: "gift" },
  { title: "Sole", value: "sun" },
  { title: "Cuore", value: "heart" },
  { title: "Spunta", value: "checkCircle" },
];

export const FRUIT_ICON_OPTIONS = [
  { title: "Mango", value: "mango" },
  { title: "Ananas", value: "ananas" },
  { title: "Papaya", value: "papaya" },
  { title: "Banana", value: "banana" },
  { title: "Cocco", value: "cocco" },
  { title: "Kiwi", value: "kiwi" },
  { title: "Frutto della passione", value: "maracuja" },
  { title: "Cofanetto regalo", value: "cofanetto" },
];

export const iconField = (name = "icon", title = "Icona") =>
  defineField({
    name,
    title,
    type: "string",
    options: { list: ICON_OPTIONS },
    initialValue: "leaf",
  });

export const linkFields = [
  defineField({ name: "label", title: "Testo del pulsante", type: "string" }),
  defineField({
    name: "href",
    title: "Link",
    type: "string",
    description: "Pagina interna (es. /store, /prodotti/mango-essiccato) o indirizzo completo (https://…)",
  }),
];
