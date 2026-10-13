import { getArticles, getCategories, getProducts, getSettings } from "@/lib/content";
import { formatPrice, SITE_URL } from "@/lib/format";

export const revalidate = 3600;

/** /llms.txt: riassunto leggibile dagli assistenti AI (ChatGPT, Perplexity, Claude…) per citarci correttamente. */
export async function GET() {
  const [s, products, categories, articles] = await Promise.all([getSettings(), getProducts(), getCategories(), getArticles()]);
  const lines = [
    `# ${s.brandName}`,
    "",
    `> ${s.description ?? ""}`,
    "",
    "Frutta esotica essiccata a bassa temperatura e confezionata a mano in Sicilia. Ogni sacchetto contiene un solo ingrediente: il frutto. Vendita online con spedizione in tutta Italia.",
    "",
    "## Prodotti",
    ...products.map((p) => `- [${p.name}](${SITE_URL}/prodotti/${p.slug}): ${p.shortDescription} ${p.ingredients ? `Ingredienti: ${p.ingredients}. ` : ""}${formatPrice(p.price)} / ${p.format}.${p.available ? "" : " (esaurito)"}`),
    "",
    "## Categorie",
    ...categories.map((c) => `- [${c.title}](${SITE_URL}/store/${c.slug})`),
    "",
    "## Informazioni",
    `- [Domande frequenti](${SITE_URL}/faq)`,
    `- [Spedizioni e resi](${SITE_URL}/spedizioni-e-resi)`,
    `- [Contatti](${SITE_URL}/contatti)`,
    ...(articles.length ? ["", "## Journal", ...articles.map((a) => `- [${a.title}](${SITE_URL}/journal/${a.slug}): ${a.excerpt}`)] : []),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
