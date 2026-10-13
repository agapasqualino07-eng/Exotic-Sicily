import { ImageResponse } from "next/og";
import { FRUIT } from "@/components/Icon";
import { shade } from "@/components/ProductArt";
import { getProduct } from "@/lib/content";
import { formatPrice } from "@/lib/format";

const size = { width: 1200, height: 630 };
export const revalidate = 3600;

/**
 * Anteprima social a indirizzo fisso (/og/<slug-prodotto>, o /og/sito per quella generica):
 * colore del frutto, nome, ingredienti, prezzo. Usata quando non c'è una foto caricata.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = slug === "sito" ? null : await getProduct(slug);
  const color = p?.illustration?.color || "#E8974A";
  const dark = shade(color, -0.6);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: color, color: dark, padding: 70, alignItems: "center", gap: 60 }}>
        <div style={{ display: "flex", width: 380, height: 470, borderRadius: 36, background: shade(color, -0.32), alignItems: "center", justifyContent: "center", boxShadow: "0 30px 60px rgba(0,0,0,.25)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 240, height: 300, borderRadius: 20, background: "#FBF6EE", paddingTop: 30 }}>
            <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#2B2420", fontWeight: 700 }}>EXOTIC DRY</div>
            <div style={{ display: "flex", fontSize: 16, letterSpacing: 8, color: shade(color, -0.2) }}>SICILY</div>
            <svg width="150" height="150" viewBox="0 0 100 100" fill="none" stroke={shade(color, -0.15)} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 16 }}>
              {FRUIT[p?.illustration?.icon || "mango"]}
            </svg>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 5, fontWeight: 700, textTransform: "uppercase" }}>Exotic Dry Sicily</div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.02, marginTop: 18, color: "#2B2420" }}>{p?.name ?? "Frutta esotica essiccata in Sicilia"}</div>
          {!p ? <div style={{ display: "flex", fontSize: 34, marginTop: 24 }}>1 ingrediente: il frutto.</div> : null}
          {p?.ingredients ? <div style={{ display: "flex", fontSize: 32, marginTop: 24 }}>Ingredienti: {p.ingredients}</div> : null}
          {p ? <div style={{ display: "flex", fontSize: 44, fontWeight: 800, marginTop: 30, color: "#2B2420" }}>{formatPrice(p.price)} · {p.format}</div> : null}
        </div>
      </div>
    ),
    size,
  );
}
