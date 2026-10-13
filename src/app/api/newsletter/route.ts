import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { writeClient } from "@/lib/sanity-client";

export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  let body: { email?: unknown; website?: unknown; source?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 }); }

  if (body.website) return NextResponse.json({ ok: true }); // bot: fingiamo che sia andata bene
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL.test(email) || email.length > 254) return NextResponse.json({ error: "Questa email non ci convince. Ricontrolla?" }, { status: 400 });

  const client = writeClient();
  if (!client) return NextResponse.json({ error: "L'iscrizione non è ancora attiva. Riprova più tardi." }, { status: 503 });

  const id = `subscriber.${createHash("sha256").update(email).digest("hex").slice(0, 32)}`;
  try {
    await client.createIfNotExists({
      _id: id,
      _type: "subscriber",
      email,
      source: typeof body.source === "string" ? body.source.slice(0, 40) : "sito",
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter error", err);
    return NextResponse.json({ error: "Qualcosa è andato storto. Riprova tra poco." }, { status: 500 });
  }
}
