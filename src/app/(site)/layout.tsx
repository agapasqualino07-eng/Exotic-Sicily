import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/inter/wght.css";
import "../globals.css";
import { getSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/format";
import { imageUrl } from "@/lib/image";
import { SiteShell } from "@/components/SiteShell";

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
  };
}

export const viewport: Viewport = { themeColor: "#FBF6EE", width: "device-width", initialScale: 1 };

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
