"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** Condizioni condivise per gsap.matchMedia: le animazioni "di movimento" girano solo se l'utente non ha chiesto di ridurle. */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  desktop: "(prefers-reduced-motion: no-preference) and (min-width: 900px)",
  finePointer: "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
};

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Pallina che "vola" dal pulsante al carrello: continuità spaziale dell'azione aggiungi-al-carrello. */
export function flyToCart(from: Element | null, color = "#B84A28") {
  const target = document.querySelector("[data-cart-icon]");
  if (!from || !target || reducedMotion()) {
    bumpCart();
    return;
  }
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const dot = document.createElement("span");
  dot.className = "fly-dot";
  dot.style.background = color;
  dot.style.left = `${a.left + a.width / 2 - 9}px`;
  dot.style.top = `${a.top + a.height / 2 - 9}px`;
  document.body.appendChild(dot);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  gsap.timeline({ onComplete: () => { dot.remove(); bumpCart(); } })
    .to(dot, { x: dx, duration: 0.7, ease: "power1.inOut" }, 0)
    .to(dot, { y: dy, duration: 0.7, ease: "back.in(1.6)" }, 0)
    .to(dot, { scale: 0.4, opacity: 0.6, duration: 0.7, ease: "power2.in" }, 0);
}

export function bumpCart() {
  const el = document.querySelector("[data-cart-icon]");
  if (!el || reducedMotion()) return;
  gsap.fromTo(el, { scale: 1 }, { scale: 1.25, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
}
