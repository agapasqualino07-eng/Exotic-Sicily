import { createImageUrlBuilder } from "@sanity/image-url";
import type { SImage } from "./types";

/* Volutamente separato dal client Sanity: questo file finisce anche nel browser. */
const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "missing-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
});

/** URL ottimizzato dal CDN di Sanity (ritaglio, WebP/AVIF automatico, qualità 80). */
export function imageUrl(img: SImage | null | undefined, width: number, height?: number): string | null {
  if (!img?.asset) return null;
  let b = builder.image(img as never).width(width).auto("format").quality(80);
  if (height) b = b.height(height).fit("crop");
  return b.url();
}
