import { ImageResponse } from "next/og";

export const alt = "Exotic Dry Sicily — Frutta esotica essiccata";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 90, background: "#FBF6EE", color: "#2B2420" }}>
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 8, color: "#C1502E", fontWeight: 600 }}>100% NATURALE · ESSICCATO IN SICILIA</div>
        <div style={{ display: "flex", fontSize: 92, lineHeight: 1.05, marginTop: 28, fontWeight: 700 }}>Exotic Dry Sicily</div>
        <div style={{ display: "flex", fontSize: 40, marginTop: 26, color: "#4A4038" }}>Il gusto dei tropici, essiccato lentamente.</div>
        <div style={{ display: "flex", marginTop: 50, width: 160, height: 10, background: "#D4A24C", borderRadius: 5 }} />
      </div>
    ),
    size,
  );
}
