import type { StructureResolver } from "sanity/structure";

const singleton = (S: Parameters<StructureResolver>[0], id: string, title: string) =>
  S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id).title(title));

/** Menu a sinistra dello Studio, in italiano e organizzato per attività. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Exotic Dry Sicily")
    .items([
      S.listItem().title("Negozio").child(
        S.list().title("Negozio").items([
          S.documentTypeListItem("product").title("Prodotti"),
          S.documentTypeListItem("category").title("Categorie"),
          S.documentTypeListItem("order").title("Ordini"),
          S.documentTypeListItem("testimonial").title("Recensioni clienti"),
        ]),
      ),
      S.divider(),
      singleton(S, "homePage", "Home page"),
      singleton(S, "storePage", "Pagina Store"),
      S.documentTypeListItem("page").title("Pagine di testo (privacy, contatti…)"),
      S.documentTypeListItem("faqItem").title("Domande frequenti"),
      S.divider(),
      S.documentTypeListItem("subscriber").title("Iscritti newsletter"),
      singleton(S, "siteSettings", "Impostazioni del sito"),
    ]);

export const SINGLETONS = ["siteSettings", "homePage", "storePage"];
