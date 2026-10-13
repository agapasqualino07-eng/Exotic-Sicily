"use client";

import { useEffect, useState } from "react";
import { reducedMotion } from "./gsap";

/** Parola che cambia ogni ~2 secondi. Tutte le parole occupano la stessa cella: niente salti di layout. */
export function RotatingWord({ words, interval = 2200 }: { words: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (words.length < 2 || reducedMotion()) return;
    const t = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);
  return (
    <>
      <span className="sr-only">{words.join(", ")}</span>
      <span className="rotator" aria-hidden="true">
        {words.map((w, n) => (
          <span key={w} className={n === i ? "on" : n === (i - 1 + words.length) % words.length ? "off" : ""}>{w}</span>
        ))}
      </span>
    </>
  );
}
