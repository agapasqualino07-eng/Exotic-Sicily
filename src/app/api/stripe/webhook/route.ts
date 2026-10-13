import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { writeClient } from "@/lib/sanity-client";

export const runtime = "nodejs";

/** Stripe → qui, quando un pagamento va a buon fine: crea l'ordine in Sanity (sezione «Ordini» dello Studio). */
export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !secret) return NextResponse.json({ error: "Stripe non configurato" }, { status: 503 });

  const stripe = new Stripe(key);
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Firma mancante" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Firma non valida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const client = writeClient();
    if (!client) {
      console.error("Ordine ricevuto ma SANITY_API_WRITE_TOKEN mancante:", event.data.object.id);
      return NextResponse.json({ received: true, stored: false });
    }
    const session = await stripe.checkout.sessions.retrieve(event.data.object.id, { expand: ["line_items"] });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s = session as any;
    const shipTo = s.collected_information?.shipping_details ?? s.shipping_details ?? null;
    const a = shipTo?.address;
    const address = a ? [shipTo.name, a.line1, a.line2, `${a.postal_code ?? ""} ${a.city ?? ""} ${a.state ? `(${a.state})` : ""}`.trim(), a.country].filter(Boolean).join("\n") : "";
    const eur = (c?: number | null) => (c ?? 0) / 100;

    await client.createIfNotExists({
      _id: `order.${session.id}`,
      _type: "order",
      number: `EDS-${session.id.slice(-8).toUpperCase()}`,
      status: "new",
      customerName: session.customer_details?.name ?? "",
      customerEmail: session.customer_details?.email ?? "",
      customerPhone: session.customer_details?.phone ?? "",
      shippingAddress: address,
      items: (session.line_items?.data ?? []).map((li, i) => ({
        _key: `i${i}`,
        name: li.description ?? "",
        quantity: li.quantity ?? 1,
        unitAmount: eur(li.price?.unit_amount),
      })),
      subtotal: eur(session.amount_subtotal),
      shippingCost: eur(session.total_details?.amount_shipping),
      discount: eur(session.total_details?.amount_discount),
      total: eur(session.amount_total),
      createdAt: new Date(session.created * 1000).toISOString(),
      stripeSessionId: session.id,
    });
  }
  return NextResponse.json({ received: true });
}
