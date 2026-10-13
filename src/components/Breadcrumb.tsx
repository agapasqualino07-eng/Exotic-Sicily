import Link from "next/link";
import { SITE_URL } from "@/lib/format";
import { JsonLd } from "./JsonLd";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.label, ...(it.href ? { item: `${SITE_URL}${it.href}` } : {}) })),
  };
  return (
    <>
      <nav className="breadcrumb" aria-label="Percorso di navigazione">
        <ol>
          {items.map((it, i) => (
            <li key={i}>
              {it.href ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={ld} />
    </>
  );
}
