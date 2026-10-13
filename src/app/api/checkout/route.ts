import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { getProductsForCheckout, getSettings } from "@/lib/content";

export const runtime = "nodejs";

type Item = { slug?: unknown; variantId?: unknown; qty?: unknown };

export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // Stripe non ancora configurato: il carrello propone l'ordine via email/WhatsApp
    return NextResponse.json({ mode: "email" }, { status: 503 });
  }

  let body: { items?: Item[] };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 }); }

  const items = (Array.isArray(body.items) ? body.items : []).slice(0, 30).map((i) => ({
    slug: typeof i.slug === "string" ? i.slug : "",
    variantId: typeof i.variantId === "string" ? i.variantId : undefined,
    qty: Math.max(1, Math.min(20, Math.floor(Number(i.qty)) || 1)),
  })).filter((i) => i.slug);
  if (!items.length) return NextResponse.json({ error: "Il carrello è vuoto." }, { status: 400 });

  // Prezzi e disponibilità vengono SEMPRE riletti da Sanity: quelli del browser non contano.
  const [products, settings] = await Promise.all([getProductsForCheckout([...new Set(items.map((i) => i.slug))]), getSettings()]);
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let subtotal = 0;
  for (const it of items) {
    const p = bySlug.get(it.slug);
    if (!p) return NextResponse.json({ error: "Un prodotto nel carrello non è più in vendita. Aggiorna la pagina." }, { status: 409 });
    const variant = p.variants?.length ? p.variants.find((v) => v.id === it.variantId) : undefined;
    if (p.variants?.length && !variant) return NextResponse.json({ error: `Seleziona il formato di ${p.name}.` }, { status: 409 });
    if (!p.available || variant?.available === false) return NextResponse.json({ error: `${p.name} è esaurito: rimuovilo dal carrello per procedere.` }, { status: 409 });
    const unit = variant ? variant.price : p.price;
    const cents = Math.round(unit * 100);
    subtotal += cents * it.qty;
    lineItems.push({
      quantity: it.qty,
      price_data: {
        currency: "eur",
        unit_amount: cents,
        product_data: { name: `${p.name} — ${variant?.label ?? p.format}`, metadata: { slug: p.slug, variantId: variant?.id ?? "" } },
      },
    });
  }

  const ship = settings.shipping ?? {};
  const threshold = Math.round((ship.freeShippingThreshold ?? 0) * 100);
  const free = threshold > 0 && subtotal >= threshold;
  const flat = Math.round((ship.flatRate ?? 0) * 100);
  const countries = (ship.countries?.length ? ship.countries : ["IT"]).map((c) => c.toUpperCase()) as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[];

  const stripe = new Stripe(key);
  const origin = req.nextUrl.origin;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "it",
      line_items: lineItems,
      allow_promotion_codes: true,
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: countries },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: free ? "Spedizione gratuita" : "Spedizione standard",
            fixed_amount: { amount: free ? 0 : flat, currency: "eur" },
          },
        },
      ],
      success_url: `${origin}/checkout/successo`,
      cancel_url: `${origin}/checkout/annullato`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error", err);
    return NextResponse.json({ error: "Non siamo riusciti ad avviare il pagamento. Riprova tra poco." }, { status: 502 });
  }
}
