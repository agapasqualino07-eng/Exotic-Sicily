import { createClient } from "next-sanity";

export const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "").trim();
export const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || "production").trim();
export const hasSanity = Boolean(projectId);
const apiVersion = "2025-02-19";
// Solo per i test in locale con un finto server Sanity (scripts/mock-sanity.mjs); su Vercel resta vuoto.
const testHost = process.env.SANITY_TEST_API_HOST ? { apiHost: process.env.SANITY_TEST_API_HOST, useProjectHostname: false } : {};

/*
 * Lettura dei contenuti, SOLO lato server (il token non arriva mai al browser).
 * Con un token le letture funzionano anche se il dataset è privato e includono
 * i documenti con il punto nell'_id (es. "product.mango-essiccato"), che Sanity
 * nasconde alle richieste anonime. Le pagine restano in cache (revalidate 60s),
 * quindi niente CDN di Sanity non pesa sulle prestazioni.
 */
// .trim(): un token incollato con uno spazio o un «a capo» finale rompe le richieste
const readToken = (process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN || "").trim() || undefined;

export const client = createClient({
  projectId: projectId || "missing-project-id",
  dataset,
  apiVersion,
  useCdn: !readToken,
  token: readToken,
  perspective: "published",
  ...testHost,
});

/** Client senza token: usato se il token viene rifiutato, così il sito non si blocca. */
export const anonClient = createClient({
  projectId: projectId || "missing-project-id",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  ...testHost,
});
export const hasReadToken = Boolean(readToken);

/** Client con permessi di scrittura: SOLO lato server (newsletter, ordini, seed). */
export function writeClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim();
  if (!hasSanity || !token) return null;
  return createClient({ projectId, dataset, apiVersion, useCdn: false, token, perspective: "published", ...testHost });
}
