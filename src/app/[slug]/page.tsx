import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { RichText } from "@/components/RichText";
import { getPage, getPageSlugs } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPageSlugs()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPage(slug);
  return p ? { title: p.title, description: p.description, alternates: { canonical: `/${p.slug}` } } : {};
}

export default async function InfoPage({ params }: Props) {
  const { slug } = await params;
  const p = await getPage(slug);
  if (!p) notFound();
  return (
    <>
      <div className="container"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: p.title }]} /></div>
      <article className="container narrow page-article">
        <h1>{p.title}</h1>
        <div className="prose"><RichText value={p.body} /></div>
      </article>
    </>
  );
}
