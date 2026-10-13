import type { PortableTextBlock } from "@portabletext/react";

export type SImage = {
  asset?: { _ref: string; _id?: string };
  hotspot?: { x: number; y: number; width: number; height: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
};

export type Link = { label?: string; href?: string };

export type Variant = { id: string; label: string; price: number; available?: boolean };

export type ProductCardData = {
  _id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  format: string;
  badge?: string | null;
  featured?: boolean;
  available: boolean;
  shortDescription: string;
  category?: { title: string; slug: string } | null;
  variants?: Variant[] | null;
  image?: SImage | null;
  illustration?: { icon?: string; color?: string } | null;
};

export type ProductData = ProductCardData & {
  description?: PortableTextBlock[] | null;
  images?: SImage[] | null;
  ingredients?: string | null;
  allergens?: string | null;
  dietary?: string[] | null;
  nutrition?: { label: string; value: string }[] | null;
  storage?: string | null;
  origin?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  related?: ProductCardData[] | null;
};

export type CategoryData = { _id: string; title: string; slug: string; description?: string };

export type SiteSettings = {
  brandName: string;
  tagline?: string;
  description?: string;
  logo?: SImage | null;
  ogImage?: SImage | null;
  announcement?: { enabled?: boolean; text?: string; href?: string };
  navigation?: (Link & { _key?: string })[];
  footerLinks?: (Link & { _key?: string })[];
  legalLinks?: (Link & { _key?: string })[];
  footerText?: string;
  paymentNote?: string;
  contact?: { email?: string; phone?: string; whatsapp?: string };
  company?: { legalName?: string; vatNumber?: string; address?: string };
  social?: { instagram?: string; facebook?: string; tiktok?: string };
  shipping?: {
    freeShippingThreshold?: number;
    flatRate?: number;
    countries?: string[];
    deliveryEstimate?: string;
  };
};

export type FaqData = { _id: string; question: string; answer: string; featured?: boolean };
export type TestimonialData = {
  _id: string;
  quote: string;
  author: string;
  location?: string;
  rating?: number;
  productName?: string;
};
export type PageData = { _id: string; title: string; slug: string; description?: string; body?: PortableTextBlock[] };

/* ------------------------- Sezioni della Home ---------------------------- */
type Keyed = { _key: string };
export type HomeSection = Keyed &
  (
    | {
        _type: "heroSection";
        eyebrow?: string; title: string; highlight?: string; subtitle?: string;
        primaryCta?: Link; secondaryCta?: Link; image?: SImage | null;
        badgeTitle?: string; badgeText?: string;
        trust?: { _key: string; icon?: string; text?: string }[];
      }
    | { _type: "marqueeSection"; items?: string[] }
    | { _type: "valuesSection"; eyebrow?: string; title?: string; subtitle?: string; items?: { _key: string; icon?: string; title?: string; text?: string }[] }
    | { _type: "storySection"; anchor?: string; eyebrow?: string; title?: string; paragraphs?: string[]; image?: SImage | null; signatureName?: string; signatureRole?: string }
    | { _type: "processSection"; eyebrow?: string; title?: string; subtitle?: string; steps?: { _key: string; title?: string; text?: string }[] }
    | { _type: "productsSection"; eyebrow?: string; title?: string; subtitle?: string; mode?: "featured" | "manual"; products?: ProductCardData[] | null; ctaLabel?: string; ctaHref?: string }
    | { _type: "testimonialsSection"; eyebrow?: string; title?: string }
    | { _type: "faqSection"; eyebrow?: string; title?: string; subtitle?: string }
    | { _type: "newsletterSection"; eyebrow?: string; title?: string; text?: string; buttonLabel?: string; successText?: string; note?: string }
    | { _type: "ctaSection"; eyebrow?: string; title?: string; text?: string; cta?: Link }
  );

export type HomePageData = { seoTitle?: string; seoDescription?: string; sections: HomeSection[] };
export type StorePageData = {
  eyebrow?: string; title?: string; subtitle?: string;
  infoCards?: { _key: string; icon?: string; title?: string; text?: string }[];
  seoTitle?: string; seoDescription?: string;
};
