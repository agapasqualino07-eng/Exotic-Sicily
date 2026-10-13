"use client";

import { useState } from "react";
import type { SImage } from "@/lib/types";
import { imageUrl } from "@/lib/image";

/** Galleria: immagine grande + miniature. Usa direttamente il CDN di Sanity. */
export function Gallery({ images, name }: { images: SImage[]; name: string }) {
  const [i, setI] = useState(0);
  const cur = images[i];
  const big = (img: SImage, w: number) => imageUrl(img, w, Math.round(w * 1))!;
  return (
    <div className="gallery">
      <div className="gallery-main">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={big(cur, 900)}
          srcSet={`${big(cur, 480)} 480w, ${big(cur, 800)} 800w, ${big(cur, 1200)} 1200w`}
          sizes="(min-width: 900px) 540px, 92vw"
          alt={cur.alt || name}
          width={900}
          height={900}
          fetchPriority={i === 0 ? "high" : undefined}
        />
      </div>
      {images.length > 1 ? (
        <div className="gallery-thumbs" role="group" aria-label="Altre foto">
          {images.map((img, idx) => (
            <button key={idx} type="button" className={idx === i ? "active" : ""} aria-label={`Foto ${idx + 1} di ${images.length}`} aria-pressed={idx === i} onClick={() => setI(idx)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={big(img, 160)} alt="" width={80} height={80} loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
