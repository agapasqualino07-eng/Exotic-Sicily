import { defineField, defineType } from "sanity";

export const subscriber = defineType({
  name: "subscriber",
  title: "Iscritto newsletter",
  type: "document",
  fields: [
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
    defineField({ name: "source", title: "Da dove", type: "string", readOnly: true }),
    defineField({ name: "createdAt", title: "Data iscrizione", type: "datetime", readOnly: true }),
  ],
  orderings: [{ title: "Più recenti", name: "recent", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: { select: { title: "email", subtitle: "createdAt" } },
});
