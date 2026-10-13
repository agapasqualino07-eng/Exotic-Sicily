import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = { title: "Pagamento annullato", robots: { index: false } };

export default function CancelPage() {
  return (
    <section className="container narrow result-page">
      <div className="result-icon"><Icon name="info" size={48} /></div>
      <h1>Pagamento annullato</h1>
      <p className="lead">Nessun addebito. Il tuo carrello è ancora lì: puoi riprendere quando vuoi.</p>
      <div className="result-actions">
        <Link href="/store" className="btn btn-primary">Torna allo Store</Link>
      </div>
    </section>
  );
}
