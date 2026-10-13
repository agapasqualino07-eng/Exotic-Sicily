import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import { getSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/format";
import { imageUrl } from "@/lib/image";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const og = imageUrl(s.ogImage, 1200, 630);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${s.brandName} — ${s.tagline ?? ""}`.replace(/ — $/, ""), template: `%s | ${s.brandName}` },
    description: s.description,
    applicationName: s.brandName,
    openGraph: { type: "website", locale: "it_IT", siteName: s.brandName, ...(og ? { images: [{ url: og, width: 1200, height: 630 }] } : {}) },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: "./" },
  };
}

export const viewport: Viewport = { themeColor: "#FBF6EE", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
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
    <html lang="it">
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
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
          <Header settings={settings} />
          <main id="contenuto">{children}</main>
          <Footer settings={settings} />
          <CartDrawer />
        </CartProvider>
        <JsonLd data={org} />
        <Analytics />
      </body>
    </html>
  );
}
