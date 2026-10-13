import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

const TAGS: Record<string, string[]> = {
  product: ["product", "home"],
  category: ["category", "product"],
  page: ["page"],
  faqItem: ["faq"],
  testimonial: ["testimonial"],
  siteSettings: ["settings"],
  homePage: ["home"],
  storePage: ["store"],
  article: ["article"],
};

/** Sanity chiama questo indirizzo ogni volta che pubblichi: il sito si aggiorna in pochi secondi. */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ error: "SANITY_REVALIDATE_SECRET mancante" }, { status: 503 });
  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret);
  if (!isValidSignature) return NextResponse.json({ error: "Firma non valida" }, { status: 401 });
  const tags = TAGS[body?._type ?? ""] ?? [];
  for (const t of tags) revalidateTag(t, "max");
  return NextResponse.json({ revalidated: tags });
}
