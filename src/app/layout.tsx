import type { Metadata } from "next";
import { SITE_URL } from "@/lib/format";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };

/* Layout radice minimo: il sito ha il suo layout in (site)/, lo Studio Sanity in studio/. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
