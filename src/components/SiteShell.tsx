import { Analytics } from "@vercel/analytics/next";
import { getSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/format";
import { CartDrawer } from "./CartDrawer";
import { CartProvider } from "./CartProvider";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { JsonLd } from "./JsonLd";
import { MotionRoot } from "./motion/MotionRoot";

/** Struttura comune a tutte le pagine del negozio (non allo Studio). */
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const sameAs = Object.values(settings.social ?? {}).filter(Boolean);
  const org = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: settings.brandName,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
        email: settings.contact?.email || undefined,
        telephone: settings.contact?.phone || undefined,
        sameAs: sameAs.length ? sameAs : undefined,
      },
      { "@type": "WebSite", "@id": `${SITE_URL}/#site`, url: SITE_URL, name: settings.brandName, inLanguage: "it-IT", publisher: { "@id": `${SITE_URL}/#org` } },
    ],
  };
  return (
    <>
      <a href="#contenuto" className="skip-link">Vai al contenuto</a>
      <CartProvider
        config={{
          freeShippingThreshold: settings.shipping?.freeShippingThreshold ?? 0,
          flatRate: settings.shipping?.flatRate ?? 0,
          email: settings.contact?.email || "",
          whatsapp: settings.contact?.whatsapp || "",
          stripeEnabled: Boolean(process.env.STRIPE_SECRET_KEY),
        }}
      >
        <MotionRoot />
        <Header settings={settings} />
        <main id="contenuto">{children}</main>
        <Footer settings={settings} />
        <CartDrawer />
      </CartProvider>
      <JsonLd data={org} />
      <Analytics />
    </>
  );
}
