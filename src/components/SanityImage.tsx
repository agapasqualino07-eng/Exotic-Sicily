import { imageUrl } from "@/lib/image";
import type { SImage } from "@/lib/types";

/**
 * Immagine servita dal CDN di Sanity (resize + WebP/AVIF automatico) con
 * srcset responsive. Non passa da next/image per non consumare la quota di
 * ottimizzazione del piano gratuito di Vercel.
 */
export function SanityImage({
  image, alt, widths = [320, 480, 720, 1080], sizes = "100vw", ratio, priority = false, className,
}: {
  image: SImage | null | undefined; alt?: string; widths?: number[]; sizes?: string;
  ratio?: number; priority?: boolean; className?: string;
}) {
  if (!image?.asset) return null;
  const src = (w: number) => imageUrl(image, w, ratio ? Math.round(w / ratio) : undefined)!;
  const max = widths[widths.length - 1];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src(widths[Math.min(1, widths.length - 1)])}
      srcSet={widths.map((w) => `${src(w)} ${w}w`).join(", ")}
      sizes={sizes}
      alt={alt ?? image.alt ?? ""}
      width={max}
      height={ratio ? Math.round(max / ratio) : undefined}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
    />
  );
}
