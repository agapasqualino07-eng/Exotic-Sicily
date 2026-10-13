import { FRUIT } from "./Icon";

/** Scurisce (amt<0) o schiarisce (amt>0) un colore #RRGGBB */
export function shade(hex: string, amt: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  const r = ch((n >> 16) & 255), g = ch((n >> 8) & 255), b = ch(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/**
 * Illustrazione del sacchetto, usata quando un prodotto non ha ancora foto.
 * Pensata per sembrare un packaging vero: appena caricate le foto in Sanity
 * viene sostituita automaticamente.
 */
export function ProductArt({ icon = "mango", color = "#E8974A", format, className }: { icon?: string; color?: string; format?: string; className?: string }) {
  const body = shade(color, -0.32);
  const seal = shade(color, -0.45);
  const fruit = FRUIT[icon] ?? FRUIT.mango;
  return (
    <svg viewBox="0 0 200 250" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="100" cy="238" rx="64" ry="7" fill="#2B2420" opacity=".16" />
      <path d="M34 34h132l8 190q.5 12-12 12H38q-12.500 0-12-12Z" fill={body} />
      <path d="M34 34h132l1.500 34H32.500Z" fill={seal} />
      <path d="M40 52h120" stroke="#FBF6EE" strokeOpacity=".35" strokeWidth="1.500" strokeDasharray="3 4" />
      <path d="M34 34h132" stroke="#FBF6EE" strokeOpacity=".5" strokeWidth="2" />
      <path d="M44 74 38 224" stroke="#FFF" strokeOpacity=".12" strokeWidth="10" strokeLinecap="round" />
      <rect x="54" y="88" width="92" height="118" rx="10" fill="#FBF6EE" />
      <text x="100" y="108" textAnchor="middle" fontSize="8.500" letterSpacing="2.400" fill="#2B2420" fontWeight="600" style={{ fontFamily: "var(--font-display)" }}>EXOTIC DRY</text>
      <text x="100" y="118" textAnchor="middle" fontSize="6.500" letterSpacing="3" fill={shade(color, -0.2)} style={{ fontFamily: "var(--font-body)" }}>SICILY</text>
      <svg x="68" y="124" width="64" height="64" viewBox="0 0 100 100" fill="none" stroke={shade(color, -0.12)} strokeWidth="3.400" strokeLinecap="round" strokeLinejoin="round" color={shade(color, -0.12)}>
        {fruit}
      </svg>
      {format ? (
        <text x="100" y="199" textAnchor="middle" fontSize="8" fill="#6F6254" style={{ fontFamily: "var(--font-body)" }}>{format}</text>
      ) : null}
    </svg>
  );
}
