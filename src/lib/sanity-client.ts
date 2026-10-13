import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SImage } from "./types";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const hasSanity = Boolean(projectId);

export const client = createClient({
  projectId: projectId || "missing-project-id",
  dataset,
  apiVersion: "2025-02-19",
  useCdn: true,
});

/** Client con permessi di scrittura: SOLO lato server (newsletter, ordini, seed). */
export function writeClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!hasSanity || !token) return null;
  return createClient({ projectId, dataset, apiVersion: "2025-02-19", useCdn: false, token });
}

const builder = createImageUrlBuilder({ projectId: projectId || "missing-project-id", dataset });
export const urlFor = (source: SImage) => builder.image(source as never);
