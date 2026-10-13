/* ============================================================================
   LIVELLO DATI — legge i contenuti da Sanity.
   Se Sanity non è ancora collegato (nessun NEXT_PUBLIC_SANITY_PROJECT_ID) usa
   i contenuti di partenza di seed-data.mjs, così il sito funziona subito.
   ========================================================================= */
import { client, hasSanity } from "./sanity-client";
import * as seed from "./seed-data.mjs";
import type {
  CategoryData, FaqData, HomePageData, PageData, ProductCardData, ProductData,
  SiteSettings, StorePageData, TestimonialData,
} from "./types";

const REVALIDATE = 60;

async function query<T>(q: string, params: Record<string, unknown>, tags: string[]): Promise<T> {
  return client.fetch<T>(q, params, { next: { revalidate: REVALIDATE, tags } });
}

/* ------------------------------ GROQ ------------------------------------- */
const IMG = `{ asset, hotspot, crop, alt }`;
const CARD = `{
  _id, "slug": slug.current, name, price, compareAtPrice, format, badge, featured,
  "available": coalesce(available, true), shortDescription,
  "category": category->{ title, "slug": slug.current },
  "variants": variants[]{ "id": _key, label, price, "available": coalesce(available, true) },
  "image": images[0]${IMG}, illustration, ingredients
}`;
const FULL = `{
  _id, "slug": slug.current, name, price, compareAtPrice, format, badge, featured,
  "available": coalesce(available, true), shortDescription, description,
  "category": category->{ title, "slug": slug.current },
  "variants": variants[]{ "id": _key, label, price, "available": coalesce(available, true) },
  "image": images[0]${IMG}, "images": images[]${IMG}, illustration,
  ingredients, allergens, dietary, nutrition, storage, origin, seoTitle, seoDescription,
  "related": related[]->${CARD}
}`;

/* ------------------------------ FALLBACK --------------------------------- */
type SeedProduct = (typeof seed.products)[number];
const catById = new Map(seed.categories.map((c) => [c._id, c]));

function seedCard(p: SeedProduct): ProductCardData {
  const cat = catById.get(p.category._ref);
  return {
    _id: p._id,
    slug: p.slug.current,
    name: p.name,
    price: p.price,
    format: p.format,
    badge: (p as { badge?: string }).badge ?? null,
    featured: p.featured,
    available: p.available,
    shortDescription: p.shortDescription,
    category: cat ? { title: cat.title, slug: cat.slug.current } : null,
    illustration: p.illustration,
    ingredients: p.ingredients,
  };
}
function seedFull(p: SeedProduct): ProductData {
  return {
    ...seedCard(p),
    description: p.description as ProductData["description"],
    ingredients: p.ingredients,
    dietary: p.dietary,
    storage: p.storage,
    origin: p.origin,
  };
}
const seedProductsSorted = [...seed.products].sort((a, b) => a.order - b.order);

/* ------------------------------ API -------------------------------------- */
export async function getSettings(): Promise<SiteSettings> {
  if (!hasSanity) return seed.siteSettings as unknown as SiteSettings;
  const s = await query<SiteSettings | null>(
    `*[_id == "siteSettings"][0]{ ..., logo${IMG}, ogImage${IMG} }`, {}, ["settings"],
  );
  return s ?? (seed.siteSettings as unknown as SiteSettings);
}

export async function getHome(): Promise<HomePageData> {
  const fallback = seed.homePage as unknown as HomePageData;
  if (!hasSanity) return fallback;
  const h = await query<HomePageData | null>(
    `*[_id == "homePage"][0]{
      seoTitle, seoDescription,
      sections[]{ ..., image${IMG}, products[]->${CARD} }
    }`, {}, ["home", "product"],
  );
  return h?.sections?.length ? h : fallback;
}

export async function getStorePage(): Promise<StorePageData> {
  const fallback = seed.storePage as unknown as StorePageData;
  if (!hasSanity) return fallback;
  return (await query<StorePageData | null>(`*[_id == "storePage"][0]`, {}, ["store"])) ?? fallback;
}

export async function getProducts(): Promise<ProductCardData[]> {
  if (!hasSanity) return seedProductsSorted.map(seedCard);
  return query<ProductCardData[]>(`*[_type == "product" && defined(slug.current)] | order(order asc, name asc) ${CARD}`, {}, ["product"]);
}

export async function getFeaturedProducts(): Promise<ProductCardData[]> {
  if (!hasSanity) return seedProductsSorted.filter((p) => p.featured).map(seedCard);
  return query<ProductCardData[]>(`*[_type == "product" && featured == true && defined(slug.current)] | order(order asc, name asc) ${CARD}`, {}, ["product"]);
}

export async function getProduct(slug: string): Promise<ProductData | null> {
  if (!hasSanity) {
    const p = seed.products.find((x) => x.slug.current === slug);
    if (!p) return null;
    const full = seedFull(p);
    full.related = seedProductsSorted.filter((x) => x.slug.current !== slug).slice(0, 4).map(seedCard);
    return full;
  }
  const p = await query<ProductData | null>(`*[_type == "product" && slug.current == $slug][0] ${FULL}`, { slug }, ["product"]);
  if (p && !p.related?.length) {
    const others = await query<ProductCardData[]>(
      `*[_type == "product" && slug.current != $slug && defined(slug.current)] | order(category->slug.current == $cat desc, order asc)[0...4] ${CARD}`,
      { slug, cat: p.category?.slug ?? "" }, ["product"],
    );
    p.related = others;
  }
  return p;
}

export async function getProductSlugs(): Promise<{ slug: string; updatedAt?: string }[]> {
  if (!hasSanity) return seed.products.map((p) => ({ slug: p.slug.current }));
  return query(`*[_type == "product" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`, {}, ["product"]);
}

export async function getCategories(): Promise<CategoryData[]> {
  if (!hasSanity)
    return seed.categories.map((c) => ({ _id: c._id, title: c.title, slug: c.slug.current, description: c.description }));
  return query<CategoryData[]>(
    `*[_type == "category" && defined(slug.current)] | order(order asc, title asc){ _id, title, "slug": slug.current, description }`, {}, ["category"],
  );
}

export async function getFaqs(featuredOnly = false): Promise<FaqData[]> {
  if (!hasSanity) {
    return [...seed.faqItems].sort((a, b) => a.order - b.order).filter((f) => !featuredOnly || f.featured)
      .map((f) => ({ _id: f._id, question: f.question, answer: f.answer, featured: f.featured }));
  }
  return query<FaqData[]>(
    `*[_type == "faqItem" ${featuredOnly ? "&& featured == true" : ""}] | order(order asc){ _id, question, answer, featured }`, {}, ["faq"],
  );
}

export async function getTestimonials(): Promise<TestimonialData[]> {
  if (!hasSanity) return [];
  return query<TestimonialData[]>(
    `*[_type == "testimonial"] | order(order asc, _createdAt desc)[0...9]{ _id, quote, author, location, rating, "productName": product->name }`, {}, ["testimonial"],
  );
}

export async function getPage(slug: string): Promise<PageData | null> {
  if (!hasSanity) {
    const p = seed.pages.find((x) => x.slug.current === slug);
    return p ? ({ _id: p._id, title: p.title, slug, description: p.description, body: p.body as PageData["body"] }) : null;
  }
  return query<PageData | null>(
    `*[_type == "page" && slug.current == $slug][0]{ _id, title, "slug": slug.current, description, body }`, { slug }, ["page"],
  );
}

export async function getPageSlugs(): Promise<{ slug: string; updatedAt?: string }[]> {
  if (!hasSanity) return seed.pages.map((p) => ({ slug: p.slug.current }));
  return query(`*[_type == "page" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`, {}, ["page"]);
}

/** Per il checkout: prezzi e disponibilità SEMPRE letti da Sanity lato server (mai dal browser). */
export async function getProductsForCheckout(slugs: string[]): Promise<ProductCardData[]> {
  if (!hasSanity) return [];
  return client.withConfig({ useCdn: false }).fetch<ProductCardData[]>(
    `*[_type == "product" && slug.current in $slugs] ${CARD}`, { slugs }, { cache: "no-store" },
  );
}
