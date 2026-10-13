"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "./gsap";

/**
 * "Dal frutto al sacchetto": su desktop la sezione si ferma e i passaggi
 * scorrono in orizzontale seguendo lo scroll (un solo pin per pagina);
 * su mobile i passaggi sono verticali con la linea che si disegna.
 */
export function ProcessScroll({ eyebrow, title, subtitle, steps }: { eyebrow?: string; title?: string; subtitle?: string; steps: { _key: string; title?: string; text?: string }[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.desktop, () => {
      const el = track.current!;
      const distance = () => Math.max(0, el.scrollWidth - el.clientWidth);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance() + window.innerHeight * 0.6}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
      });
      tl.to(el, { x: () => -distance(), ease: "none" }, 0)
        .fromTo(".ps-line-fill", { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0)
        .from(".ps-step", { autoAlpha: 0.25, scale: 0.92, stagger: 0.25, ease: "power1.out" }, 0);
    });
    mm.add("(prefers-reduced-motion: no-preference) and (max-width: 899px)", () => {
      gsap.fromTo(".ps-line-fill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: track.current, start: "top 70%", end: "bottom 60%", scrub: true } });
      gsap.utils.toArray<HTMLElement>(".ps-step").forEach((s) => gsap.from(s, { x: 30, autoAlpha: 0, duration: 0.7, ease: "expo.out", scrollTrigger: { trigger: s, start: "top 85%", once: true } }));
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="process-scroll">
      <div className="container ps-inner">
        <div className="ps-head">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          {title ? <h2>{title}</h2> : null}
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        <div className="ps-line" aria-hidden="true"><span className="ps-line-fill" /></div>
        <ol className="ps-track" ref={track}>
          {steps.map((s, n) => (
            <li key={s._key} className="ps-step">
              <span className="ps-num" aria-hidden="true">{String(n + 1).padStart(2, "0")}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
