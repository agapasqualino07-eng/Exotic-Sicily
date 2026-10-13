import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { writeClient } from "@/lib/sanity-client";
import { allDocuments } from "@/lib/seed-data.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Carica i contenuti di partenza in Sanity direttamente dal browser:
 *   https://TUOSITO/api/seed?secret=<SANITY_REVALIDATE_SECRET>
 * Crea solo i documenti che mancano: non sovrascrive mai le tue modifiche.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret || req.nextUrl.searchParams.get("secret") !== secret) {
    return new NextResponse("Accesso negato: aggiungi ?secret=<SANITY_REVALIDATE_SECRET> all'indirizzo.", { status: 401 });
  }
  const client = writeClient();
  if (!client) return new NextResponse("Mancano NEXT_PUBLIC_SANITY_PROJECT_ID o SANITY_API_WRITE_TOKEN nelle variabili di Vercel.", { status: 503 });
  const tx = client.transaction();
  for (const doc of allDocuments) tx.createIfNotExists(doc as { _id: string; _type: string });
  await tx.commit();
  for (const t of ["settings", "home", "store", "product", "category", "faq", "page"]) revalidateTag(t, "max");
  return new NextResponse(`Fatto: ${allDocuments.length} contenuti verificati/creati in Sanity. Apri /studio per modificarli.`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
