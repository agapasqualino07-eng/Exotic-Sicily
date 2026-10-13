"use client";

import { useEffect, useState } from "react";
import { reducedMotion } from "./gsap";

/**
 * Parola che cambia ogni ~2 secondi. Nell'HTML (quello che legge Google) c'è
 * solo la prima parola: le altre sono disegnate via CSS (attr data-w), così il
 * testo indicizzato resta pulito e non c'è salto di layout.
 */
export function RotatingWord({ words, interval = 2200 }: { words: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (words.length < 2 || reducedMotion()) return;
    const t = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);
  return (
    <span className="rotator">
      <span className="rotator-text">{words[0]}</span>
      {words.map((w, n) => (
        <span key={w} data-w={w} aria-hidden="true" className={n === i ? "on" : n === (i - 1 + words.length) % words.length ? "off" : ""} />
      ))}
    </span>
  );
}
