import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const hasSanity = Boolean(projectId);
const apiVersion = "2025-02-19";

/*
 * Lettura dei contenuti, SOLO lato server (il token non arriva mai al browser).
 * Con un token le letture funzionano anche se il dataset è privato e includono
 * i documenti con il punto nell'_id (es. "product.mango-essiccato"), che Sanity
 * nasconde alle richieste anonime. Le pagine restano in cache (revalidate 60s),
 * quindi niente CDN di Sanity non pesa sulle prestazioni.
 */
const readToken = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

export const client = createClient({
  projectId: projectId || "missing-project-id",
  dataset,
  apiVersion,
  useCdn: !readToken,
  token: readToken,
  perspective: "published",
});

/** Client con permessi di scrittura: SOLO lato server (newsletter, ordini, seed). */
export function writeClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!hasSanity || !token) return null;
  return createClient({ projectId, dataset, apiVersion, useCdn: false, token, perspective: "published" });
}
