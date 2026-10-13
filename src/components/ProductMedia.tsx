import { SanityImage } from "./SanityImage";
import { ProductArt, shade } from "./ProductArt";
import type { ProductCardData } from "@/lib/types";

export function ProductMedia({ product, sizes, priority }: { product: ProductCardData; sizes: string; priority?: boolean }) {
  if (product.image?.asset) {
    return <SanityImage image={product.image} alt={product.image.alt || product.name} ratio={1} sizes={sizes} widths={[240, 400, 640, 960]} priority={priority} className="product-photo" />;
  }
  const color = product.illustration?.color || "#E8974A";
  return (
    <div className="product-art" style={{ background: `radial-gradient(circle at 50% 38%, ${shade(color, 0.28)}, ${color} 72%)` }}>
      <ProductArt icon={product.illustration?.icon} color={color} format={product.format} />
    </div>
  );
}
