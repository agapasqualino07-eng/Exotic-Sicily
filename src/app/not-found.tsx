import Link from "next/link";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return (
    <section className="container narrow result-page">
      <div className="result-icon"><Icon name="mapPin" size={48} /></div>
      <h1>Pagina non trovata</h1>
      <p className="lead">Questo frutto non è ancora maturo: la pagina che cerchi non esiste o è stata spostata.</p>
      <div className="result-actions">
        <Link href="/store" className="btn btn-primary">Vai allo Store</Link>
        <Link href="/" className="btn btn-outline">Torna alla Home</Link>
      </div>
    </section>
  );
}
