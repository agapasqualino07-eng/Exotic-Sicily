import { defineField, defineType } from "sanity";

export const order = defineType({
  name: "order",
  title: "Ordine",
  type: "document",
  description: "Gli ordini arrivano da soli quando un cliente paga. Cambia solo lo stato.",
  fields: [
    defineField({ name: "number", title: "Numero ordine", type: "string", readOnly: true }),
    defineField({
      name: "status",
      title: "Stato",
      type: "string",
      options: {
        list: [
          { title: "Da spedire", value: "new" },
          { title: "Spedito", value: "shipped" },
          { title: "Consegnato", value: "delivered" },
          { title: "Annullato / rimborsato", value: "cancelled" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
    defineField({ name: "trackingCode", title: "Codice di tracciamento (opzionale)", type: "string" }),
    defineField({ name: "customerName", title: "Cliente", type: "string", readOnly: true }),
    defineField({ name: "customerEmail", title: "Email", type: "string", readOnly: true }),
    defineField({ name: "customerPhone", title: "Telefono", type: "string", readOnly: true }),
    defineField({ name: "shippingAddress", title: "Indirizzo di spedizione", type: "text", rows: 4, readOnly: true }),
    defineField({
      name: "items",
      title: "Prodotti",
      type: "array",
      readOnly: true,
      of: [
        {
          type: "object",
          name: "orderItem",
          fields: [
            defineField({ name: "name", type: "string", title: "Prodotto" }),
            defineField({ name: "quantity", type: "number", title: "Quantità" }),
            defineField({ name: "unitAmount", type: "number", title: "Prezzo unitario (€)" }),
          ],
          preview: { select: { title: "name", q: "quantity" }, prepare: ({ title, q }) => ({ title: `${q} × ${title}` }) },
        },
      ],
    }),
    defineField({ name: "subtotal", title: "Subtotale (€)", type: "number", readOnly: true }),
    defineField({ name: "shippingCost", title: "Spedizione (€)", type: "number", readOnly: true }),
    defineField({ name: "discount", title: "Sconto (€)", type: "number", readOnly: true }),
    defineField({ name: "total", title: "Totale (€)", type: "number", readOnly: true }),
    defineField({ name: "createdAt", title: "Data", type: "datetime", readOnly: true }),
    defineField({ name: "stripeSessionId", title: "ID Stripe", type: "string", readOnly: true }),
  ],
  orderings: [{ title: "Più recenti", name: "recent", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: {
    select: { title: "number", name: "customerName", total: "total", status: "status" },
    prepare: ({ title, name, total, status }) => ({
      title: `${title ?? "Ordine"} — ${name ?? ""}`,
      subtitle: `€ ${total != null ? Number(total).toFixed(2) : "—"} · ${status ?? ""}`,
    }),
  },
});
