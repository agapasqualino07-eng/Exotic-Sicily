"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import { useCart } from "../CartProvider";
import type { CartSnapshot } from "../cart-types";
import { FRUIT, Icon } from "../Icon";
import { ProductArt, shade } from "../ProductArt";
import { flyToCart, gsap, MQ, reducedMotion, useGSAP } from "./gsap";

export type ShowcaseItem = {
  slug: string;
  name: string;
  short: string;
  format: string;
  price: number;
  ingredients?: string | null;
  color: string;
  icon: string;
  image?: string | null;
  available: boolean;
  snapshot: CartSnapshot | null; // null = ha varianti, si sceglie in scheda
};

/**
 * Vetrina interattiva "Scegli il tuo frutto": tab accessibili (frecce ←/→),
 * lo sfondo prende il colore del frutto, il sacchetto entra ruotando, il nome
 * gigante scorre dietro. Avanza da sola finché l'utente non interagisce.
 */
export function FruitShowcase({ items, eyebrow, title, subtitle }: { items: ShowcaseItem[]; eyebrow?: string; title?: string; subtitle?: string }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { add } = useCart();
  const cur = items[i];
  const { contextSafe } = useGSAP({ scope: root });

  const go = useCallback((n: number, user = false) => {
    if (user) setAuto(false);
    setI(((n % items.length) + items.length) % items.length);
  }, [items.length]);

  // Avanzamento automatico solo se visibile, senza riduci-animazioni e prima che l'utente tocchi
  useEffect(() => {
    if (!auto || reducedMotion() || items.length < 2) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.4 });
    if (root.current) io.observe(root.current);
    const t = setInterval(() => { if (visible && !document.hidden) setI((n) => (n + 1) % items.length); }, 4200);
    return () => { clearInterval(t); io.disconnect(); };
  }, [auto, items.length]);

  // Transizione a ogni cambio di frutto
  useGSAP(() => {
    if (reducedMotion()) return;
    const q = gsap.utils.selector(root);
    gsap.fromTo(q(".sc-pouch"), { xPercent: 40, rotation: 18, autoAlpha: 0, scale: 0.85 }, { xPercent: 0, rotation: -4, autoAlpha: 1, scale: 1, duration: 0.9, ease: "back.out(1.3)", overwrite: true });
    gsap.fromTo(q(".sc-copy > *"), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.06, ease: "expo.out", overwrite: true });
    gsap.fromTo(q(".sc-bigword"), { xPercent: 8, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 1, ease: "expo.out", overwrite: true });
    gsap.fromTo(q(".sc-orbit svg"), { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.8, stagger: 0.05, ease: "back.out(2)", overwrite: true });
  }, { scope: root, dependencies: [i] });

  // Il sacchetto segue leggermente il mouse
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.finePointer, () => {
      const el = stage.current;
      if (!el) return;
      const target = el.querySelector(".sc-pouch-wrap");
      const rx = gsap.quickTo(target, "rotationY", { duration: 0.6, ease: "power3.out" });
      const ry = gsap.quickTo(target, "rotationX", { duration: 0.6, ease: "power3.out" });
      gsap.set(target, { transformPerspective: 800 });
      const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); rx(((e.clientX - r.left) / r.width - 0.5) * 22); ry(-((e.clientY - r.top) / r.height - 0.5) * 16); };
      const leave = () => { rx(0); ry(0); };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
    });
    return () => mm.revert();
  }, { scope: root });

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: items.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const n = ((map[e.key] % items.length) + items.length) % items.length;
    go(n, true);
    tabs.current[n]?.focus();
  };

  const onAdd = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cur.snapshot) return;
    setAuto(false);
    add(cur.snapshot, 1);
    flyToCart(e.currentTarget, shade(cur.color, -0.2));
  });

  if (!cur) return null;
  const bg = cur.color;

  return (
    <section ref={root} id="scegli" className="showcase" style={{ ["--sc" as string]: bg, ["--sc-dark" as string]: shade(bg, -0.55), ["--sc-light" as string]: shade(bg, 0.35) }} onPointerDown={() => setAuto(false)}>
      <div className="container">
        <div className="showcase-head" data-reveal>
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          {title ? <h2>{title}</h2> : null}
          {subtitle ? <p>{subtitle}</p> : null}
        </div>

        <div className="sc-tabs" role="tablist" aria-label="Scegli il frutto" onKeyDown={onKey}>
          {items.map((it, n) => (
            <button
              key={it.slug}
              ref={(el) => { tabs.current[n] = el; }}
              role="tab"
              id={`sc-tab-${it.slug}`}
              aria-selected={n === i}
              aria-controls="sc-panel"
              tabIndex={n === i ? 0 : -1}
              className={`sc-tab${n === i ? " active" : ""}`}
              onClick={() => go(n, true)}
              style={{ ["--c" as string]: it.color }}
            >
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{FRUIT[it.icon] ?? FRUIT.mango}</svg>
              <span>{it.name.replace(/ (Essiccat[oa]|a Fette).*$/i, "")}</span>
            </button>
          ))}
        </div>

        <div className="sc-stage" id="sc-panel" role="tabpanel" aria-labelledby={`sc-tab-${cur.slug}`} ref={stage}>
          <div className="sc-bigword" aria-hidden="true">{cur.name.split(" ")[0]}</div>
          <div className="sc-visual">
            <div className="sc-orbit" aria-hidden="true">
              {[0, 1, 2, 3].map((k) => (
                <svg key={k} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={`o${k}`}>{FRUIT[cur.icon] ?? FRUIT.mango}</svg>
              ))}
            </div>
            <div className="sc-pouch-wrap">
              {cur.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cur.image} alt="" className="sc-pouch sc-photo" width={520} height={520} />
              ) : (
                <ProductArt icon={cur.icon} color={cur.color} format={cur.format} className="sc-pouch" />
              )}
            </div>
          </div>
          <div className="sc-copy" aria-live="polite">
            <h3>{cur.name}</h3>
            <p>{cur.short}</p>
            {cur.ingredients ? <p className="sc-label"><Icon name="leaf" size={16} /> Ingredienti: <strong>{cur.ingredients}</strong></p> : null}
            <div className="sc-buy">
              <span className="sc-price">{formatPrice(cur.price)} <small>/ {cur.format}</small></span>
              {!cur.available ? (
                <span className="sc-soldout">Esaurito</span>
              ) : cur.snapshot ? (
                <button type="button" className="btn btn-dark" onClick={onAdd}><Icon name="bag" size={18} /> Aggiungi al carrello</button>
              ) : (
                <Link href={`/prodotti/${cur.slug}`} className="btn btn-dark">Scegli il formato</Link>
              )}
            </div>
            <Link href={`/prodotti/${cur.slug}`} className="sc-more">Scheda completa <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="sc-nav">
            <button type="button" className="icon-btn" aria-label="Frutto precedente" onClick={() => go(i - 1, true)}><Icon name="arrow" size={20} style={{ transform: "scaleX(-1)" }} /></button>
            <span className="sc-count" aria-hidden="true">{String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
            <button type="button" className="icon-btn" aria-label="Frutto successivo" onClick={() => go(i + 1, true)}><Icon name="arrow" size={20} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
