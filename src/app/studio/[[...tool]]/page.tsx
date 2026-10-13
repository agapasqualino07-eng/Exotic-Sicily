import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { hasSanity } from "@/lib/sanity-client";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!hasSanity) return <StudioSetup />;
  return <NextStudio config={config} />;
}

/** Mostrata finché su Vercel non c'è NEXT_PUBLIC_SANITY_PROJECT_ID: spiega come collegare Sanity. */
function StudioSetup() {
  const box: React.CSSProperties = { maxWidth: 680, margin: "0 auto", padding: "8vh 24px 40px", fontFamily: "system-ui, sans-serif", lineHeight: 1.6, color: "#2B2420" };
  const code: React.CSSProperties = { background: "#F3E9D7", padding: "2px 6px", borderRadius: 6, fontSize: ".92em" };
  return (
    <main style={{ minHeight: "100vh", background: "#FBF6EE", margin: 0, overflow: "auto" }}>
      <div style={box}>
        <p style={{ color: "#B84A28", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", fontSize: 13 }}>Exotic Dry Sicily · Studio</p>
        <h1 style={{ fontSize: 32, margin: "8px 0 16px" }}>Collega Sanity per modificare il sito</h1>
        <p>Il sito funziona già con i contenuti di esempio. Per modificarli da qui servono 5 minuti:</p>
        <ol style={{ paddingLeft: 22, display: "grid", gap: 12, marginTop: 16 }}>
          <li>Vai su <a href="https://www.sanity.io/manage" target="_blank" rel="noopener noreferrer">sanity.io/manage</a>, accedi e crea un progetto (dataset <code style={code}>production</code>). Copia il <strong>Project ID</strong>.</li>
          <li>Nel progetto: <strong>API → CORS origins → Add</strong> l&apos;indirizzo di questo sito (es. <code style={code}>https://exotic-sicily.vercel.app</code>) con <strong>Allow credentials</strong> attivo.</li>
          <li>Su Vercel: <strong>Settings → Environment Variables</strong> aggiungi <code style={code}>NEXT_PUBLIC_SANITY_PROJECT_ID</code> e <code style={code}>NEXT_PUBLIC_SANITY_DATASET</code> = <code style={code}>production</code>.</li>
          <li>Su Vercel: <strong>Deployments → … → Redeploy</strong>. Ricarica questa pagina: lo Studio sarà attivo.</li>
          <li>Per caricare prodotti e testi di partenza: in Sanity crea un token <strong>Editor</strong> (API → Tokens), aggiungilo su Vercel come <code style={code}>SANITY_API_WRITE_TOKEN</code>, aggiungi anche <code style={code}>SANITY_REVALIDATE_SECRET</code> (una parola segreta a tua scelta), fai Redeploy e apri <code style={code}>/api/seed?secret=LA-TUA-PAROLA</code>.</li>
        </ol>
      </div>
    </main>
  );
}
