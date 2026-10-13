import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { client as readClient, writeClient } from "@/lib/sanity-client";
import { allDocuments } from "@/lib/seed-data.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Carica i contenuti di partenza in Sanity direttamente dal browser:
 *   https://TUOSITO/api/seed?secret=<SANITY_REVALIDATE_SECRET>
 * Crea solo i documenti che mancano: non sovrascrive mai le tue modifiche.
 * Con &aggiorna=1 riscrive i contenuti di partenza con l'ultima versione dei testi
 * (sovrascrive SOLO i documenti creati dal seed, non quelli aggiunti da te).
 */
export async function GET(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret || req.nextUrl.searchParams.get("secret") !== secret) {
    return new NextResponse("Accesso negato: aggiungi ?secret=<SANITY_REVALIDATE_SECRET> all'indirizzo.", { status: 401 });
  }
  const client = writeClient();
  if (!client) return new NextResponse("Mancano NEXT_PUBLIC_SANITY_PROJECT_ID o SANITY_API_WRITE_TOKEN nelle variabili di Vercel.", { status: 503 });
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  try {
    const tx = client.transaction();
    const overwrite = req.nextUrl.searchParams.get("aggiorna") === "1";
    for (const doc of allDocuments) {
      if (overwrite) tx.createOrReplace(doc as { _id: string; _type: string });
      else tx.createIfNotExists(doc as { _id: string; _type: string });
    }
    await tx.commit();
  } catch (err) {
    const e = err as { statusCode?: number; message?: string };
    const hints: Record<number, string> = {
      401: "Il token SANITY_API_WRITE_TOKEN non è valido (copiato male o eliminato). Creane uno nuovo in Sanity → API → Tokens, aggiornalo su Vercel e fai Redeploy.",
      403: "Il token non ha il permesso di scrivere. In Sanity → API → Tokens creane uno nuovo con permesso «Editor», aggiornalo su Vercel e fai Redeploy.",
      404: `Sanity non trova il progetto «${projectId}» o il dataset «${dataset}». Controlla il Project ID su Vercel e che in Sanity → Datasets esista un dataset chiamato «${dataset}».`,
    };
    const hint = (e.statusCode && hints[e.statusCode]) || "Controlla Project ID, dataset e token nelle variabili di Vercel.";
    console.error("Seed error", err);
    return new NextResponse(
      `Sanity ha risposto con un errore${e.statusCode ? ` (${e.statusCode})` : ""}.\n\nCosa fare: ${hint}\n\nProgetto: ${projectId || "(vuoto)"} · Dataset: ${dataset}\nDettaglio tecnico: ${e.message ?? String(err)}`,
      { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }
  for (const t of ["settings", "home", "store", "product", "category", "faq", "page", "article"]) {
    try { revalidateTag(t, "max"); } catch { /* la cache si aggiorna comunque entro 60 secondi */ }
  }
  const visible = await readClient
    .withConfig({ useCdn: false })
    .fetch<{ p: number; f: number; pg: number }>(`{ "p": count(*[_type == "product"]), "f": count(*[_type == "faqItem"]), "pg": count(*[_type == "page"]) }`, {}, { cache: "no-store" })
    .catch(() => null);
  return new NextResponse(
    `Fatto: ${allDocuments.length} contenuti ${req.nextUrl.searchParams.get("aggiorna") === "1" ? "aggiornati con i testi nuovi" : "verificati/creati"} in Sanity.\n` +
      (visible ? `Il sito vede ora: ${visible.p} prodotti, ${visible.f} domande frequenti, ${visible.pg} pagine.\n` : "") +
      `Le pagine si aggiornano entro un minuto. Apri /studio per modificare i contenuti.`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}
