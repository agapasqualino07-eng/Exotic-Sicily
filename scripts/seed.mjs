/* Carica i contenuti di partenza (src/lib/seed-data.mjs) dentro Sanity.
   Uso:   npm run seed            → crea i documenti mancanti (non tocca quelli esistenti)
          npm run seed -- --force → sovrascrive anche quelli esistenti
   Richiede in .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN */
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "next-sanity";
import { allDocuments } from "../src/lib/seed-data.mjs";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && !line.trim().startsWith("#") && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const { NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, NEXT_PUBLIC_SANITY_DATASET: dataset = "production", SANITY_API_WRITE_TOKEN: token } = process.env;
if (!projectId || !token) {
  console.error("Mancano NEXT_PUBLIC_SANITY_PROJECT_ID o SANITY_API_WRITE_TOKEN in .env.local (vedi GUIDA-GESTIONE-SITO.md).");
  process.exit(1);
}
const force = process.argv.includes("--force");
const client = createClient({ projectId, dataset, token, apiVersion: "2025-02-19", useCdn: false });

const tx = client.transaction();
for (const doc of allDocuments) force ? tx.createOrReplace(doc) : tx.createIfNotExists(doc);
await tx.commit();
console.log(`✓ ${allDocuments.length} documenti ${force ? "scritti" : "verificati/creati"} su ${projectId}/${dataset}`);
