# Guida — Exotic Dry Sicily (Next.js + Sanity + Vercel)

Il sito è un negozio completo: **tutto ciò che si legge sul sito si modifica da Sanity Studio**
(`tuosito.com/studio`), senza toccare il codice.

## Cosa si modifica dallo Studio
| Sezione dello Studio | Cosa controlla |
|---|---|
| **Negozio → Prodotti** | nome, prezzo, prezzo barrato, formato, **varianti di formato**, foto, descrizione, ingredienti, valori nutrizionali, allergeni, badge, «in evidenza», disponibile/esaurito, SEO |
| Negozio → Categorie | filtri dello store |
| Negozio → Ordini | ordini pagati (arrivano da soli); segni «spedito» e il tracking |
| Negozio → Recensioni clienti | recensioni mostrate in Home (la sezione compare solo se ce ne sono) |
| **Home page** | tutte le sezioni: si trascinano, si riordinano, si eliminano, se ne aggiungono |
| Pagina Store | titolo, testi, riquadri informativi |
| Pagine di testo | Privacy, Cookie, Termini, Spedizioni & Resi, Contatti (e nuove pagine) |
| Domande frequenti | pagina /faq + blocco in Home |
| Iscritti newsletter | lista email (esportabile) |
| **Impostazioni del sito** | barra annunci, menu, footer, soglia spedizione gratuita, costo spedizione, paesi, contatti, dati aziendali, social, logo, immagine social |

Dopo «Publish» il sito si aggiorna in pochi secondi (con il webhook, vedi sotto; altrimenti entro 60 secondi).

## Messa online — una volta sola

### 1. Sanity (gratis)
1. Su https://www.sanity.io/manage crea un progetto (dataset `production`). Copia il **Project ID**.
2. Nel progetto → *API* → *Tokens* → crea un token con permesso **Editor**.
3. *API* → *CORS origins* → aggiungi `http://localhost:3000` e l'indirizzo del sito Vercel (con «Allow credentials»).
4. In locale: copia `.env.example` in `.env.local`, compila ID e token, poi `npm install` e `npm run seed`
   (carica prodotti, testi, FAQ e pagine di partenza; non sovrascrive nulla di esistente, `-- --force` sì).
5. `npm run dev` → apri http://localhost:3000/studio e accedi.

### 2. Vercel (piano gratuito)
1. Importa il repository GitHub su Vercel (framework Next.js, nessuna impostazione speciale).
2. *Settings → Environment Variables*: aggiungi le stesse variabili di `.env.example`.
3. Webhook di aggiornamento istantaneo: in Sanity → *API → Webhooks* → URL `https://TUOSITO/api/revalidate`,
   dataset production, trigger Create/Update/Delete, **Secret** = valore di `SANITY_REVALIDATE_SECRET`.
4. Dominio: *Settings → Domains* → `exoticdrysicily.com`.

> ⚠️ **Importante:** i termini del piano Hobby (gratuito) di Vercel ammettono solo uso **non commerciale**.
> Un negozio che incassa è uso commerciale: per il lancio reale serve il piano Pro (circa 20 $/mese) —
> oppure un hosting alternativo con piano gratuito commerciale (es. Cloudflare Pages). Per demo, test e
> anteprime il gratuito va benissimo. Il progetto è stato costruito per restare nei limiti free: immagini dal
> CDN di Sanity (non consumano la quota immagini Vercel), pagine statiche con rigenerazione, funzioni
> serverless solo per checkout/newsletter/ordini.

### 3. Pagamenti (Stripe)
Senza Stripe il carrello propone «Ordina via email / WhatsApp» (funziona già). Per i pagamenti veri:
1. Crea l'account su https://stripe.com e inserisci `STRIPE_SECRET_KEY` su Vercel.
2. Stripe → *Developers → Webhooks* → endpoint `https://TUOSITO/api/stripe/webhook`, evento
   `checkout.session.completed`; copia il *signing secret* in `STRIPE_WEBHOOK_SECRET`.
3. In Stripe attiva i metodi che vuoi (carte, Apple Pay, Google Pay, PayPal, Satispay…): compaiono da soli al checkout.
4. Codici sconto: si creano in Stripe (*Products → Coupons / Promotion codes*), il cliente li inserisce al checkout.

I prezzi vengono **sempre riletti da Sanity lato server** al checkout: nessuno può alterarli dal browser.
Ogni pagamento riuscito crea un **Ordine** nello Studio. Nota: la fattura/scontrino e l'invio email al cliente
vanno configurati in Stripe (ricevute automatiche) e col vostro commercialista.

## Prima del lancio (checklist)
- [ ] Sostituire i segnaposto `[Ragione sociale]`, `[P.IVA]`… nelle pagine Privacy/Termini/Contatti e farle verificare da un consulente
- [ ] Impostazioni → dati aziendali, social, WhatsApp
- [ ] **Confermare** i valori di esempio: spedizione gratuita sopra 49 €, costo 5,90 €, «2-4 giorni lavorativi»
- [ ] Caricare le foto vere dei prodotti (sostituiscono da sole gli illustrati) e l'immagine della Hero
- [ ] Inserire valori nutrizionali e allergeni di ogni prodotto (obbligo di etichettatura alimentare)
- [ ] Impostare il webhook Sanity e quello Stripe; provare un acquisto con carta di test (`4242 4242 4242 4242`)
- [ ] Aggiungere recensioni reali (solo con consenso)

## Sviluppo
`npm run dev` · `npm run build` · `npm run typecheck`. Senza `NEXT_PUBLIC_SANITY_PROJECT_ID` il sito mostra i
contenuti di `src/lib/seed-data.mjs`. Le skill usate per la progettazione (marketing e UI/UX) sono in `.claude/skills/`.
