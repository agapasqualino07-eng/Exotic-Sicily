import { urlFor } from "./sanity-client";
import type { SImage } from "./types";

/** URL ottimizzato dal CDN di Sanity (ritaglio, WebP/AVIF automatico, qualità 80). */
export function imageUrl(img: SImage | null | undefined, width: number, height?: number): string | null {
  if (!img?.asset) return null;
  let b = urlFor(img).width(width).auto("format").quality(80);
  if (height) b = b.height(height).fit("crop");
  return b.url();
}
