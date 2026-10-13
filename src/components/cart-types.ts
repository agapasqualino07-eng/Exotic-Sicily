export type CartLine = {
  key: string;            // slug oppure slug::variantId
  slug: string;
  variantId?: string;
  variantLabel?: string;
  name: string;
  format: string;
  price: number;
  qty: number;
  image?: string | null;  // URL già pronto (CDN Sanity)
  color?: string;
  icon?: string;
};

export type CartSnapshot = Omit<CartLine, "qty">;

export type CartConfig = {
  freeShippingThreshold: number;
  flatRate: number;
  email: string;
  whatsapp: string;
  stripeEnabled: boolean;
};
