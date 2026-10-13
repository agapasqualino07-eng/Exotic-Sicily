import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqList } from "@/components/Faq";
import { getFaqs, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Domande Frequenti",
  description: "Ingredienti, conservazione, spedizioni, pagamenti e resi: le risposte alle domande più frequenti.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const [faqs, settings] = await Promise.all([getFaqs(), getSettings()]);
  return (
    <>
      <div className="container"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Domande Frequenti" }]} /></div>
      <section className="container narrow page-article">
        <h1>Domande Frequenti</h1>
        <p className="lead">Non trovi la risposta? Scrivici{settings.contact?.email ? <> a <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a></> : null}, o guarda <Link href="/spedizioni-e-resi">spedizioni e resi</Link>.</p>
        <FaqList items={faqs} />
      </section>
    </>
  );
}
