"use client";

import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "./gsap";

/**
 * Coreografia della hero: titolo che entra lettera per lettera (SplitText),
 * arco che si apre, sacchetti che cadono in posizione, e poi seguono il mouse
 * con profondità diverse. Solo transform/opacity: resta fluido anche su mobile.
 */
export function HeroMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const q = gsap.utils.selector(root);
      const title = q(".hero-split")[0];
      const split = title ? new SplitText(title, { type: "words,chars", aria: "auto" }) : null;

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.set(q("[data-hero-in]"), { autoAlpha: 1 })
        .from(q(".hero .eyebrow"), { y: 16, autoAlpha: 0, duration: 0.6 })
        .from(split?.chars ?? [], { yPercent: 110, rotateX: -50, autoAlpha: 0, duration: 0.9, stagger: 0.018 }, "<0.1")
        .from(q(".hero-rot"), { y: 30, autoAlpha: 0, duration: 0.7 }, "-=0.6")
        .from(q(".hero .lead, .hero-cta > *, .hero-trust li"), { y: 22, autoAlpha: 0, duration: 0.7, stagger: 0.06 }, "-=0.55")
        .from(q(".hero-arch"), { clipPath: "inset(100% 0% 0% 0% round 999px 999px 28px 28px)", duration: 1.1, ease: "expo.inOut" }, 0.15)
        .from(q(".pouch-wrap"), { yPercent: -60, rotation: (i: number) => [-25, 15, 30][i % 3], autoAlpha: 0, duration: 1.2, stagger: 0.12, ease: "back.out(1.4)" }, 0.55)
        .from(q(".hero-badge"), { x: -30, autoAlpha: 0, duration: 0.8 }, 1.1)
        .from(q(".hero-floater"), { scale: 0, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: "back.out(2)" }, 1);

      // Profondità al movimento del mouse
      const layers = q("[data-depth]") as HTMLElement[];
      const setters = layers.map((el) => ({
        d: parseFloat(el.dataset.depth || "1"),
        x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
      }));
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        setters.forEach((s) => { s.x(nx * 26 * s.d); s.y(ny * 18 * s.d); });
      };
      window.addEventListener("pointermove", onMove);

      // Allo scroll i sacchetti salgono a velocità diverse e l'arco si allontana
      gsap.to(q(".pouch-wrap"), { yPercent: (i: number) => [-18, -30, -12][i % 3], ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 } });
      gsap.to(q(".hero-content"), { y: 60, autoAlpha: 0.3, ease: "none", scrollTrigger: { trigger: root.current, start: "center top+=200", end: "bottom top", scrub: true } });

      return () => { window.removeEventListener("pointermove", onMove); split?.revert(); };
    });
  }, { scope: root });

  return <div ref={root} className="hero-motion">{children}</div>;
}
