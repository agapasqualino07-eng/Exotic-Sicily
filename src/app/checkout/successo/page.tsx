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
      <h1>Grazie, ordine ricevuto!</h1>
      <p className="lead">Il pagamento è andato a buon fine. Ti abbiamo inviato la conferma via email: appena il pacco parte ricevi un aggiornamento.</p>
      <div className="result-actions">
        <Link href="/store" className="btn btn-primary">Continua lo shopping</Link>
        <Link href="/" className="btn btn-outline">Torna alla Home</Link>
      </div>
    </section>
  );
}
