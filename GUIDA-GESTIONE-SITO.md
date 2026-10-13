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
| **Home page** | tutte le sezioni (hero con parole che si alternano, vetrina interattiva «Scegli il tuo frutto», confronto etichetta, processo a scorrimento, ecc.): si trascinano, si riordinano, si eliminano, se ne aggiungono |
| Pagina Store | titolo, testi, riquadri informativi |
| Pagine di testo | Privacy, Cookie, Termini, Spedizioni & Resi, Contatti (e nuove pagine) |
| Domande frequenti | pagina /faq + blocco in Home |
| **Blog (articoli)** | il blog su /blog: titolo, categoria (Ricette, Guide, Regali, Dietro le quinte), riassunto, copertina, testo, prodotti citati. Senza copertina il sito disegna un'illustrazione nei colori del primo prodotto citato. Gli ultimi 3 articoli compaiono in Home (sezione «Dal blog») e ogni scheda prodotto mostra gli articoli che la citano. È lo strumento SEO più forte: 1-2 articoli al mese su domande reali |
| Iscritti newsletter | lista email (esportabile) |
| **Impostazioni del sito** | barra annunci, menu, footer, soglia spedizione gratuita, costo spedizione, paesi, contatti, dati aziendali, social, logo, immagine social |

Dopo «Publish» il sito si aggiorna in pochi secondi (con il webhook, vedi sotto; altrimenti entro 60 secondi).

## Messa online — una volta sola

### 1. Sanity (gratis) — tutto dal browser, senza terminale
1. Su https://www.sanity.io/manage crea un progetto (dataset `production`). Copia il **Project ID**.
2. Nel progetto → *API → CORS origins* → aggiungi l'indirizzo del sito Vercel (es. `https://exotic-sicily.vercel.app`)
   con **Allow credentials** attivo (serve per far funzionare `/studio`).
3. Nel progetto → *API → Tokens* → crea un token con permesso **Editor**.
4. Su Vercel → *Settings → Environment Variables* aggiungi:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = il Project ID
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
   - `SANITY_API_WRITE_TOKEN` = il token Editor
   - `SANITY_REVALIDATE_SECRET` = una parola segreta a tua scelta (es. `mango-2026-xyz`)
5. Vercel → *Deployments* → ultimo deploy → **⋯ → Redeploy** (le variabili valgono solo dai deploy successivi).
6. Apri `https://TUOSITO/api/seed?secret=LA-TUA-PAROLA`: carica prodotti, testi, FAQ, pagine e articoli di partenza
   (crea solo ciò che manca, non sovrascrive mai le tue modifiche).
   Per **sostituire** i contenuti di partenza con l'ultima versione dei testi (es. dopo un aggiornamento del sito)
   aggiungi `&aggiorna=1`: riscrive solo i documenti creati dal seed, ma **cancella le modifiche fatte a quelli**.
7. Apri `https://TUOSITO/studio`, accedi con l'account Sanity e modifica tutto.

Finché il Project ID non è impostato, `/studio` mostra queste istruzioni invece di un errore.
In locale, in alternativa: `.env.local` + `npm run seed`.

### 2. Vercel
Il file `vercel.json` forza il preset Next.js. Webhook di aggiornamento istantaneo: in Sanity → *API → Webhooks* → URL
`https://TUOSITO/api/revalidate`, dataset production, trigger Create/Update/Delete, **Secret** = `SANITY_REVALIDATE_SECRET`.
Dominio: *Settings → Domains*.

> ⚠️ **Importante:** i termini del piano Hobby (gratuito) di Vercel ammettono solo uso **non commerciale**.
> Un negozio che incassa è uso commerciale: per il lancio reale serve il piano Pro (circa 20 $/mese) o un altro
> hosting. Per demo e test il gratuito va benissimo; il progetto è costruito per restare nei limiti free.

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
- [ ] Riscrivere «Chi siamo» (Home → sezione Storia) con la vostra storia vera: nomi, luogo, come è nata. Il testo attuale è una bozza nel tono giusto, non un fatto
- [ ] Rendere specifici i passaggi del processo (es. temperatura e ore di essiccazione) e l'origine della frutta («filiere controllate» è vago): sono le prove più forti, non inventarle
- [ ] Verificare i tempi di consegna (2-4 giorni) usati anche nei dati per Google Shopping
- [ ] Google Search Console: aggiungere il dominio e inviare `https://TUOSITO/sitemap.xml"

## Sviluppo
`npm run dev` · `npm run build` · `npm run typecheck`. Senza `NEXT_PUBLIC_SANITY_PROJECT_ID` il sito mostra i
contenuti di `src/lib/seed-data.mjs`. Animazioni: GSAP (`src/components/motion/`), tutte disattivate se il visitatore ha attivato «riduci animazioni». Contesto marketing e tono di voce in `.agents/product-marketing.md` (leggerlo prima di scrivere testi nuovi). Le skill usate per la progettazione (marketing e UI/UX) sono in `.claude/skills/`.
