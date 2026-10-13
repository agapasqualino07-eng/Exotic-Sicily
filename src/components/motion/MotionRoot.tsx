"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "./gsap";

/**
 * Effetti globali, ricreati a ogni cambio pagina:
 * - barra di avanzamento della lettura
 * - header che si nasconde scendendo e ricompare risalendo
 * - comparsa a cascata degli elementi [data-reveal]
 * - parallasse leggera su [data-parallax] (solo elementi decorativi)
 * - pulsanti "magnetici" [data-magnetic] e card prodotto con leggera inclinazione 3D
 * - striscia scorrevole che accelera e cambia verso seguendo lo scroll
 * Tutto si spegne con «riduci animazioni»; senza JavaScript il contenuto resta visibile.
 */
export function MotionRoot() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Barra di lettura (anche con animazioni ridotte: è un indicatore, non un movimento decorativo)
    if (bar.current) {
      gsap.set(bar.current, { scaleX: 0 });
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => gsap.set(bar.current, { scaleX: s.progress }) });
    }

    // Header: ombra e nascondi/mostra
    const header = document.querySelector<HTMLElement>(".site-header");
    if (header) {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (s) => {
          header.classList.toggle("scrolled", s.scroll() > 12);
          const hide = s.direction === 1 && s.scroll() > 420 && !document.querySelector(".main-nav.open");
          header.classList.toggle("tucked", hide);
        },
      });
    }

    mm.add(MQ.motion, () => {
      // Comparsa a cascata
      gsap.set("[data-reveal]", { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.08, overwrite: true }),
      });

      // Parallasse (solo decorazioni): data-parallax="-12" = yPercent finale
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amt = parseFloat(el.dataset.parallax || "-10");
        gsap.fromTo(el, { yPercent: -amt / 2 }, { yPercent: amt, ease: "none", scrollTrigger: { trigger: el.parentElement || el, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      });

      // Striscia scorrevole guidata dalla velocità di scroll
      gsap.utils.toArray<HTMLElement>(".strip-track").forEach((track) => {
        track.style.animation = "none";
        const loop = gsap.to(track, { xPercent: -33.3333, duration: 38, ease: "none", repeat: -1 });
        let dir = 1;
        ScrollTrigger.create({
          trigger: track,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (s) => {
            dir = s.direction;
            const boost = gsap.utils.clamp(1, 6, Math.abs(s.getVelocity()) / 220);
            gsap.to(loop, { timeScale: boost * dir, duration: 0.25, overwrite: true });
            gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.25, ease: "power2.out" });
          },
        });
        return () => loop.kill();
      });
    });

    mm.add(MQ.finePointer, () => {
      const offs: (() => void)[] = [];
      // Pulsanti magnetici (pochi, solo i focali)
      gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "elastic.out(1,0.4)" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "elastic.out(1,0.4)" });
        const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.3); yTo((e.clientY - r.top - r.height / 2) * 0.35); };
        const leave = () => { xTo(0); yTo(0); };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        offs.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
      });
      // Card prodotto: inclinazione 3D leggera
      gsap.utils.toArray<HTMLElement>(".product-card").forEach((card) => {
        const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
        const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });
        gsap.set(card, { transformPerspective: 900 });
        const move = (e: PointerEvent) => { const r = card.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 8); rx(-((e.clientY - r.top) / r.height - 0.5) * 8); };
        const leave = () => { rx(0); ry(0); };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        offs.push(() => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); });
      });
      return () => offs.forEach((f) => f());
    });

    // Ricalcola dopo il caricamento di font e immagini
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => { mm.revert(); window.removeEventListener("load", refresh); };
  }, { dependencies: [pathname], revertOnUpdate: true });

  return <div ref={bar} className="read-progress" aria-hidden="true" />;
}
