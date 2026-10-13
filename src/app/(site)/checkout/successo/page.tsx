import type { Metadata } from "next";
import Link from "next/link";
import { ClearCart } from "@/components/ClearCart";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = { title: "Ordine ricevuto", robots: { index: false } };

export default function SuccessPage() {
  return (
    <section className="container narrow result-page">
      <ClearCart />
      <div className="result-icon ok"><Icon name="checkCircle" size={48} /></div>
      <h1>Ordine arrivato. Ora tocca a noi.</h1>
      <p className="lead">Il pagamento è andato a buon fine e la conferma è nella tua email. Prepariamo il pacco a mano: quando parte, ti scriviamo.</p>
      <div className="result-actions">
        <Link href="/store" className="btn btn-primary">Torna allo shop</Link>
        <Link href="/" className="btn btn-outline">Torna alla Home</Link>
      </div>
    </section>
  );
}
