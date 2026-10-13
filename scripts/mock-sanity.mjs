/* Finto server Sanity per provare la build con dati "veri" in locale:
   risponde alle query GROQ usando i contenuti di src/lib/seed-data.mjs.
   Token "bad" → 401; senza token i documenti con il punto nell'_id sono nascosti (come Sanity).
   Uso: node scripts/mock-sanity.mjs 4555  +  SANITY_TEST_API_HOST=http://localhost:4555 */
import http from "node:http";
import { parse, evaluate } from "groq-js";
import { allDocuments } from "../src/lib/seed-data.mjs";

const docs = allDocuments.map((d) => ({ ...d, _updatedAt: "2026-10-13T08:00:00Z", _createdAt: "2026-10-13T08:00:00Z" }));
const port = Number(process.argv[2] || 4555);
http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  const auth = req.headers.authorization || "";
  const send = (code, body) => { res.writeHead(code, { "content-type": "application/json" }); res.end(JSON.stringify(body)); };
  if (auth === "Bearer bad") return send(401, { error: "Unauthorized", message: "Session not found", statusCode: 401 });
  if (!url.pathname.includes("/data/query/")) return send(404, { error: "not found", path: url.pathname });
  const visible = auth ? docs : docs.filter((d) => !d._id.includes("."));
  const params = {};
  for (const [k, v] of url.searchParams) if (k.startsWith("$")) params[k.slice(1)] = JSON.parse(v);
  try {
    const value = await evaluate(parse(url.searchParams.get("query")), { dataset: visible, params });
    send(200, { result: await value.get(), ms: 1 });
  } catch (e) {
    send(400, { error: String(e) });
  }
}).listen(port, () => console.log("mock sanity on", port));
