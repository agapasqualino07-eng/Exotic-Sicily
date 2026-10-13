import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqList } from "@/components/Faq";
import { getFaqs, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Domande frequenti | Exotic Dry Sicily" },
  description: "C'è zucchero aggiunto? Come si conserva? Quanto costa la spedizione? Le risposte alle domande che ci fate più spesso su frutta essiccata, ordini e resi.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const [faqs, settings] = await Promise.all([getFaqs(), getSettings()]);
  return (
    <>
      <div className="container"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Domande frequenti" }]} /></div>
      <section className="container narrow page-article">
        <h1>Domande frequenti</h1>
        <p className="lead">Se la tua domanda non c&apos;è, scrivici{settings.contact?.email ? <> a <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a></> : null}, o guarda <Link href="/spedizioni-e-resi">spedizioni e resi</Link>.</p>
        <FaqList items={faqs} />
      </section>
    </>
  );
}
