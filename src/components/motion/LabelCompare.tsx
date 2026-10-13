"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "./gsap";

/**
 * "Leggi l'etichetta": quando la sezione entra in vista, gli ingredienti
 * superflui vengono barrati uno dopo l'altro e il contatore sale a 100%.
 */
export function LabelCompare({ eyebrow, title, text, commonTitle, commonItems, oursTitle, oursLabel, note }: {
  eyebrow?: string; title?: string; text?: string; commonTitle?: string; commonItems: string[]; oursTitle?: string; oursLabel?: string; note?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const q = gsap.utils.selector(root);
      const counter = { v: 0 };
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 65%", once: true } });
      tl.from(q(".lc-card"), { y: 40, autoAlpha: 0, duration: 0.8, stagger: 0.15, ease: "expo.out" })
        .from(q(".lc-strike"), { scaleX: 0, transformOrigin: "left center", duration: 0.35, stagger: 0.18, ease: "power2.out" }, "-=0.2")
        .to(counter, { v: 100, duration: 1.4, ease: "power3.out", onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(counter.v)); } }, "<0.2")
        .from(q(".lc-stamp"), { scale: 2.2, rotation: -25, autoAlpha: 0, duration: 0.6, ease: "back.out(2.4)" }, "-=0.4");
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="section label-compare">
      <div className="container">
        <div className="section-head">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          {title ? <h2>{title}</h2> : null}
          {text ? <p>{text}</p> : null}
        </div>
        <div className="lc-grid">
          <div className="lc-card lc-common">
            <h3>{commonTitle}</h3>
            <ul>
              {commonItems.map((it) => (
                <li key={it}><span className="lc-text">{it}</span><span className="lc-strike" aria-hidden="true" /></li>
              ))}
            </ul>
          </div>
          <div className="lc-card lc-ours">
            <h3>{oursTitle}</h3>
            <p className="lc-big"><span ref={num}>100</span><span>%</span></p>
            <p className="lc-label">{oursLabel}</p>
            <span className="lc-stamp" aria-hidden="true">Solo frutta</span>
          </div>
        </div>
        {note ? <p className="lc-note">{note}</p> : null}
      </div>
    </section>
  );
}
