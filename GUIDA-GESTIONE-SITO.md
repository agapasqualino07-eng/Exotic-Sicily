# Guida alla Gestione del Sito — Exotic Dry Sicily

Questa guida spiega come vedere il sito, come gestire i prodotti (aggiungere,
togliere, modificare prezzo/nome/descrizione), come cambiare i testi e i
colori, e cosa manca ancora prima di poter lanciare davvero lo store.

Non serve saper programmare: bastano un editor di testo (va benissimo anche
il Blocco Note, ma è molto più comodo un editor gratuito come
[Visual Studio Code](https://code.visualstudio.com/)) e un po' di attenzione
a non cancellare simboli come `{ } " , ;` mentre modifichi.

---

## 1. Cosa contiene questo progetto

```
Exotic-Sicily/
├── index.html                → Home page (landing page)
├── store.html                 → Pagina "Store" con tutto il catalogo
├── css/
│   └── style.css              → Tutti gli stili grafici (colori, font, layout)
├── js/
│   ├── products.js            → ⭐ L'ELENCO DEI PRODOTTI — modifichi solo questo
│   ├── cart.js                → Logica del carrello (non serve toccarlo)
│   └── main.js                → Illustrazioni prodotto e interazioni (non serve toccarlo)
└── GUIDA-GESTIONE-SITO.md     → Questo file
```

Il sito è fatto apposta così: **per gestire i prodotti modifichi un solo
file** (`js/products.js`) e tutto il resto — home page, store, carrello,
filtri — si aggiorna da solo.

### Come vedere il sito

Il modo più semplice: apri il file `index.html` con doppio click, si apre
nel browser e puoi navigare normalmente (anche i link tra Home e Store
funzionano, basta che i file restino tutti nella stessa cartella).

Per un'anteprima identica a quella "vera" (utile se un giorno collegherai
strumenti più avanzati) puoi anche usare l'estensione **Live Server** di
Visual Studio Code, oppure — se hai Python installato — aprire il
terminale nella cartella del progetto e digitare:
```
python3 -m http.server 8000
```
e poi visitare `http://localhost:8000` nel browser.

---

## 2. Gestire i prodotti — la parte più importante

Apri il file **`js/products.js`**. All'inizio trovi già le istruzioni
scritte come commento, qui le riprendiamo con qualche esempio pratico.

Ogni prodotto è un blocco tra parentesi graffe `{ ... }`, così:

```js
{
  id: "mango-essiccato",
  nome: "Mango Essiccato",
  categoria: "Frutta Essiccata",
  prezzo: 7.90,
  formato: "200 g",
  badge: "Bestseller",
  inEvidenza: true,
  disponibile: true,
  descrizione: "Dolcezza pura dei tropici, essiccata lentamente per preservare tutto il sapore.",
  descrizioneEstesa: "Fette di mango selezionato, essiccato a bassa temperatura...",
  icona: "mango",
  immagine: null,
  colore: "#E8974A"
},
```

### ➕ Aggiungere un nuovo prodotto

1. Copia un blocco `{ ... }` intero (comprese le due graffe e la virgola
   finale) e incollalo **prima** della riga `];` in fondo alla lista.
2. Cambia `id` con un codice unico (senza spazi, es. `"noci-pecan"`).
3. Cambia tutti gli altri valori.
4. Se il prodotto è tra frutta esotica singola metti
   `categoria: "Frutta Essiccata"`, se è un cofanetto regalo
   `categoria: "Cofanetti & Regali"`.
5. Salva il file: il prodotto compare automaticamente nello Store (e anche
   in Home se `inEvidenza: true`).

### ✏️ Modificare prezzo, nome o descrizione

Trova il prodotto interessato (cerca il suo `nome` o `id`) e cambia solo il
testo tra virgolette o il numero dopo `prezzo:`. Esempio — alzare il
prezzo del mango a 8,50€:
```js
prezzo: 8.50,
```
⚠️ Usa sempre il **punto**, non la virgola, per i decimali (`8.50`, non
`8,50`): sul sito verrà mostrato correttamente come "€ 8,50".

### 🗑️ Togliere un prodotto

Cancella l'intero blocco `{ ... }` del prodotto (dalla graffa di apertura
alla graffa di chiusura, virgola inclusa). Sparisce sia dallo Store sia
dalla Home.

Se vuoi solo **sospenderlo temporaneamente** senza cancellarlo, più comodo
usare `disponibile: false`: il prodotto resta visibile ma con l'etichetta
"Esaurito" e non è aggiungibile al carrello.

### 🏠 Farlo comparire (o no) nella Home page

Il campo `inEvidenza: true` decide se il prodotto appare anche nella
sezione "I Nostri Preferiti" della Home. Mettilo `false` per tenerlo solo
nello Store.

### 🖼️ Sostituire l'illustrazione con una foto vera

Oggi ogni prodotto mostra un'illustrazione disegnata (mango, ananas,
ecc.) al posto della foto, perché non abbiamo ancora gli scatti reali.
Quando avrete le foto:

1. Create una cartella `images/` nel progetto e mettete lì le foto (es.
   `images/mango.jpg`).
2. Nel blocco del prodotto, cambiate `immagine: null` in
   `immagine: "images/mango.jpg"`.

La foto sostituirà automaticamente l'illustrazione, ovunque compaia quel
prodotto (Home, Store, carrello).

### 🏷️ Etichette (badge) disponibili

Il campo `badge` accetta qualsiasi testo breve. Quelli già usati come
esempio: `"Bestseller"`, `"Novità"`, `"Edizione Limitata"`, `"Best Value"`.
Per non mostrare nessuna etichetta scrivi `badge: null` (senza virgolette).

### 📂 Aggiungere una nuova categoria

Se in futuro vorrete vendere anche, ad esempio, "Agrumi Siciliani":
1. Scrivete `categoria: "Agrumi Siciliani"` nei prodotti interessati.
2. Aggiungete `"Agrumi Siciliani"` anche alla lista `CATEGORIE` in fondo
   al file, così comparirà come pulsante filtro nello Store.

---

## 3. Modificare i testi della landing page

I testi dell'Home page (titolo, sottotitolo, storia, ecc.) sono scritti
direttamente dentro `index.html`. Aprilo con l'editor e cerca il testo da
cambiare (Ctrl+F / Cmd+F per cercare): è racchiuso tra tag tipo `<h1>...
</h1>` o `<p>...</p>`. Modifica solo il testo **tra** i simboli `>` e `<`,
senza toccare i tag stessi.

Esempio — cambiare il titolo principale, riga con:
```html
<h1>Il gusto dei tropici, <em>essiccato</em> lentamente in Sicilia.</h1>
```
Puoi cambiare le parole ma lascia `<h1>`, `</h1>`, `<em>` e `</em>` come
sono (`<em>` serve solo per il colore diverso su "essiccato").

Le stesse sezioni (header, footer, carrello) sono duplicate identiche in
`store.html`: se cambi un testo che compare in entrambe le pagine (es. la
descrizione nel footer), ricordati di aggiornarlo in tutti e due i file.

---

## 4. Cambiare colori e stile (palette "Mediterraneo Premium")

Tutti i colori del sito sono variabili definite all'inizio del file
`css/style.css`, dentro `:root { ... }`:

```css
--color-terracotta: #C1502E;   /* colore principale (bottoni, accenti) */
--color-cream: #FBF6EE;        /* sfondo generale */
--color-ink: #2B2420;          /* colore del testo scuro / header / footer */
--color-olive: #3F4B3B;        /* verde della sezione storia e newsletter */
--color-sea: #2A5C6B;          /* blu mare, per dettagli */
--color-gold: #D4A24C;         /* oro, dettagli premium */
```

Per cambiare, ad esempio, il colore principale del brand, sostituisci il
valore esadecimale accanto a `--color-terracotta`. Cambia in un solo
punto e si aggiorna ovunque nel sito (bottoni, link attivi, badge, ecc.).

---

## 5. Logo e branding — quando ci mandate i vostri file

Il sito usa per ora un **logo testuale** ("EXOTIC DRY SICILY" scritto con
un font elegante) al posto di un logo grafico vero, in attesa dei vostri
file. Quando li avete pronti:

1. Mandateci il file del logo (idealmente `.svg` o `.png` con sfondo
   trasparente) e i colori esatti del brand (codici HEX, es. `#C1502E`).
2. Sostituiremo il logo testuale con l'immagine e aggiorneremo la palette
   in `css/style.css` con i colori ufficiali.

Anche il font attuale (Fraunces per i titoli, Inter per i testi) è una
scelta placeholder coerente con lo stile "mediterraneo premium": se avete
un font brand già scelto, ce lo indicate e lo sostituiamo.

---

## 6. Cosa è già "pronto ma non attivo": i pagamenti

Come richiesto, i pagamenti **non sono ancora collegati**, ma l'interfaccia
è già predisposta:

- Il carrello funziona (aggiungere, togliere, cambiare quantità) e salva
  i contenuti nel browser di chi visita il sito.
- Il tasto "Procedi al Checkout" apre una finestra che spiega che il
  pagamento online arriverà a breve, con un tasto per scrivere via email
  nel frattempo.
- Nel footer sono già presenti i loghi (segnaposto) di Visa, Mastercard,
  PayPal e Apple Pay, con la dicitura "in arrivo".

### Come si attiveranno i pagamenti veri, quando sarete pronti

Ci sono due strade, molto diverse per costo e complessità:

**A. Piattaforma e-commerce "chiavi in mano" (consigliata per iniziare)**
Servizi come **Shopify** permettono di collegare pagamenti (carte, PayPal,
Apple Pay, Satispay) in poche ore, con gestione ordini, spedizioni e
fatturazione già integrata. Il design che avete visto oggi può essere
ricreato come tema Shopify personalizzato, mantenendo lo stesso stile.
Costo: da circa 25-30 €/mese in su.

**B. Sito custom (come quello attuale) + gateway di pagamento**
Si collega un servizio come **Stripe Checkout** o **PayPal Checkout**
direttamente a queste pagine. Richiede però anche un piccolo "server"
(backend) che gestisca in sicurezza gli ordini — non può girare solo nel
browser come adesso. Più lavoro di sviluppo, ma zero canoni mensili di
piattaforma (si paga solo una commissione per transazione, tipicamente
~1,5-2,9% + costo fisso).

Quando deciderete quale strada preferite, possiamo procedere con
l'integrazione vera.

---

## 7. ⚠️ Obblighi legali prima di aprire davvero lo store

Questi punti **non sono opzionali** per un e-commerce che vende a clienti
in Italia/UE — vanno preparati prima del lancio pubblico (oggi il sito è
solo una demo interna, quindi va bene così per ora):

- **Privacy Policy** (obbligatoria — trattamento dati personali, GDPR)
- **Termini e Condizioni di vendita**
- **Cookie Policy** (+ banner cookie se usate strumenti di analytics/marketing)
- **Diritto di recesso**: 14 giorni di legge per acquisti online, da
  indicare chiaramente
- **Dati societari in footer**: ragione sociale, P.IVA, sede legale, email
  e indirizzo per il diritto di recesso
- Se vendete alimenti: **etichettatura conforme** (ingredienti, allergeni,
  valori nutrizionali, lotto e scadenza) sia sul prodotto fisico che,
  idealmente, richiamata anche in scheda prodotto online

Il footer del sito ha già i link segnaposto ("Privacy Policy", "Termini e
Condizioni", "Cookie Policy") pronti per essere collegati alle pagine vere
quando le avrete pronte (consigliato: farle scrivere o rivedere da un
commercialista/legale, non sono un dettaglio da improvvisare).

---

## 8. Pubblicare il sito online (quando sarà il momento)

Anche qui due strade semplici, senza bisogno di un vero server:

- **Netlify** o **Vercel**: si trascina la cartella del progetto in una
  pagina web e in pochi secondi il sito è online con un link pubblico
  (gratis per iniziare). Il metodo più veloce per far vedere il sito
  "vivo" prima ancora di aver collegato un dominio.
- **Dominio proprio**: una volta pubblicato su Netlify/Vercel (o altro
  hosting), si collega il dominio `exoticdrysicily.com` che già avete.

---

## 9. Checklist riassuntiva prima del lancio pubblico

- [ ] Logo e palette colori definitivi ricevuti e applicati
- [ ] Foto prodotto reali al posto delle illustrazioni
- [ ] Testi rivisti e approvati da tutti i soci
- [ ] Catalogo prodotti definitivo in `js/products.js` (prezzi reali,
      formati, disponibilità)
- [ ] Metodo di pagamento scelto (Shopify / Stripe / altro) e collegato
- [ ] Costi e tempi di spedizione reali configurati
- [ ] Privacy Policy, Termini e Condizioni, Cookie Policy pubblicati
- [ ] Dati societari (P.IVA, ragione sociale, indirizzo) in footer
- [ ] Email e social reali al posto dei segnaposto (footer e pulsante
      "Scrivici")
- [ ] Dominio collegato e sito pubblicato online

---

## Serve aiuto?

Questo file spiega le modifiche che potete fare voi in autonomia. Per gli
step più tecnici (collegare i pagamenti, pubblicare online, integrare un
font o un logo grafico) possiamo procedere insieme, un passo alla volta,
proprio come per questa prima versione.
