"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import { Icon, FRUIT } from "./Icon";
import { shade } from "./ProductArt";
import { useCart } from "./CartProvider";

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button type="button" className="icon-btn" onClick={() => setOpen(true)} aria-label={`Apri il carrello, ${count} ${count === 1 ? "articolo" : "articoli"}`}>
      <Icon name="cart" size={22} />
      <span className="cart-count" data-empty={count === 0} aria-hidden="true">{count}</span>
    </button>
  );
}

export function CartDrawer() {
  const { lines, count, subtotal, shipping, total, config, open, setOpen, setQty, remove, toast } = useCart();
  const panel = useRef<HTMLElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailMode, setEmailMode] = useState(false);

  const threshold = config.freeShippingThreshold;
  const missing = threshold > 0 ? Math.max(0, threshold - subtotal) : 0;
  const progress = threshold > 0 ? Math.min(100, (subtotal / threshold) * 100) : 0;

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab" || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastFocus.current?.focus?.();
    };
  }, [open, setOpen]);

  useEffect(() => { if (lines.length === 0) { setEmailMode(false); setError(null); } }, [lines.length]);

  async function checkout() {
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines.map((l) => ({ slug: l.slug, variantId: l.variantId, qty: l.qty })) }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) { window.location.href = data.url; return; }
      if (data.mode === "email") { setEmailMode(true); return; }
      setError(data.error || "Non siamo riusciti ad avviare il pagamento. Riprova tra poco.");
    } catch {
      setError("Connessione assente. Riprova tra poco.");
    } finally {
      setBusy(false);
    }
  }

  const orderText = encodeURIComponent(
    `Ciao, vorrei ordinare:\n${lines.map((l) => `- ${l.qty} × ${l.name} (${l.format})`).join("\n")}\n\nTotale prodotti: ${formatPrice(subtotal)}\n\nNome e indirizzo di spedizione:`,
  );
  const mailHref = `mailto:${config.email}?subject=${encodeURIComponent("Ordine dal sito")}&body=${orderText}`;
  const waHref = config.whatsapp ? `https://wa.me/${config.whatsapp}?text=${orderText}` : null;

  return (
    <>
      <div className={`overlay${open ? " open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside ref={panel} className={`cart-drawer${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Carrello" aria-hidden={!open} inert={!open}>
        <div className="cart-head">
          <h2>Il tuo carrello{count ? <span> ({count})</span> : null}</h2>
          <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Chiudi il carrello" data-autofocus><Icon name="close" size={22} /></button>
        </div>

        {lines.length > 0 && threshold > 0 ? (
          <div className="ship-progress" role="status">
            <p>
              {missing > 0
                ? <>Ti mancano <strong>{formatPrice(missing)}</strong> per la spedizione gratuita</>
                : <><Icon name="check" size={16} /> Hai la <strong>spedizione gratuita</strong></>}
            </p>
            <div className="bar" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
          </div>
        ) : null}

        <div className="cart-items">
          {lines.length === 0 ? (
            <div className="cart-empty">
              <Icon name="bag" size={44} />
              <p>Il tuo carrello è vuoto.<br />Aggiungi qualche sapore esotico.</p>
              <Link href="/store" className="btn btn-primary" onClick={() => setOpen(false)}>Scopri i prodotti</Link>
            </div>
          ) : (
            lines.map((l) => {
              const c = l.color || "#E8974A";
              return (
                <div className="cart-item" key={l.key}>
                  <Link href={`/prodotti/${l.slug}`} onClick={() => setOpen(false)} className="cart-item-media" style={{ background: shade(c, 0.1) }} tabIndex={-1} aria-hidden="true">
                    {l.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={l.image} alt="" width={80} height={80} />
                    ) : (
                      <svg viewBox="0 0 100 100" fill="none" stroke={shade(c, -0.45)} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" color={shade(c, -0.45)}>{FRUIT[l.icon || "mango"]}</svg>
                    )}
                  </Link>
                  <div className="cart-item-info">
                    <h3><Link href={`/prodotti/${l.slug}`} onClick={() => setOpen(false)}>{l.name}</Link></h3>
                    <span className="meta">{l.format}</span>
                    <div className="cart-item-row">
                      <div className="qty" role="group" aria-label={`Quantità di ${l.name}`}>
                        <button type="button" onClick={() => setQty(l.key, l.qty - 1)} aria-label="Diminuisci quantità"><Icon name="minus" size={16} /></button>
                        <output aria-live="polite">{l.qty}</output>
                        <button type="button" onClick={() => setQty(l.key, l.qty + 1)} aria-label="Aumenta quantità"><Icon name="plus" size={16} /></button>
                      </div>
                      <strong>{formatPrice(l.price * l.qty)}</strong>
                    </div>
                    <button type="button" className="link-btn" onClick={() => remove(l.key)}>Rimuovi</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {lines.length > 0 ? (
          <div className="cart-summary">
            <div className="cart-row"><span>Subtotale</span><span>{formatPrice(subtotal)}</span></div>
            <div className="cart-row"><span>Spedizione</span><span>{shipping === 0 ? "Gratuita" : formatPrice(shipping)}</span></div>
            <div className="cart-row total"><span>Totale</span><span>{formatPrice(total)}</span></div>

            {emailMode ? (
              <div className="email-order">
                <p>Il pagamento online non è ancora attivo: invia il tuo ordine e ti rispondiamo di persona per confermarlo.</p>
                <a className="btn btn-primary btn-block" href={mailHref}><Icon name="mail" size={18} /> Ordina via email</a>
                {waHref ? <a className="btn btn-outline btn-block" href={waHref} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={18} /> Ordina su WhatsApp</a> : null}
              </div>
            ) : (
              <button type="button" className="btn btn-primary btn-block" onClick={checkout} disabled={busy}>
                <Icon name="lock" size={18} /> {busy ? "Un attimo…" : "Vai al pagamento"}
              </button>
            )}
            {error ? <p className="form-error" role="alert">{error}</p> : null}
            <p className="cart-notice"><Icon name="shield" size={16} /> Pagamento sicuro con Stripe. Spedizione e sconti si confermano al pagamento.</p>
          </div>
        ) : null}
      </aside>

      <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">
        <Icon name="checkCircle" size={20} /> {toast}
      </div>
    </>
  );
}
