/* ============================================================================
   EXOTIC DRY SICILY — CATALOGO PRODOTTI
   ============================================================================
   QUESTO È L'UNICO FILE CHE SERVE MODIFICARE PER GESTIRE I PRODOTTI DEL SITO.

   Per istruzioni dettagliate leggi "GUIDA-GESTIONE-SITO.md" nella cartella
   principale del progetto. In breve:

   - Per AGGIUNGERE un prodotto: copia un blocco { ... } intero, incollalo
     prima della riga "];" qui sotto, cambia i valori e dagli un "id" unico.
   - Per TOGLIERE un prodotto: cancella il suo blocco { ... } intero
     (comprese le graffe).
   - Per MODIFICARE nome/prezzo/descrizione: cambia semplicemente il testo
     tra virgolette del campo che ti interessa.
   - Non serve toccare nessun altro file: index.html e store.html si
     aggiornano da soli leggendo questa lista.

   Campi di ogni prodotto:
   - id            → codice univoco, senza spazi (es. "mango-essiccato")
   - nome          → nome visibile del prodotto
   - categoria     → "Frutta Essiccata" oppure "Cofanetti & Regali"
                     (puoi creare nuove categorie scrivendo un nome nuovo)
   - prezzo        → numero con il punto per i decimali (es. 7.90)
   - formato       → peso/formato mostrato accanto al prezzo (es. "200 g")
   - badge         → etichetta piccola sulla card. Va bene: "Bestseller",
                     "Novità", "Edizione Limitata", "Best Value", oppure
                     null (nessuna etichetta) — attenzione: null va scritto
                     senza virgolette
   - inEvidenza    → true/false — se true, il prodotto compare anche nella
                     home page nella sezione "I Nostri Preferiti"
   - disponibile   → true/false — se false, il prodotto resta visibile ma
                     con scritta "Esaurito" e non è acquistabile
   - descrizione   → frase breve mostrata sulla card (1 riga)
   - descrizioneEstesa → 2-3 frasi, riservata per una futura scheda prodotto
   - icona         → nome dell'illustrazione da usare (vedi ICONE
                     disponibili in js/main.js): mango, ananas, papaya,
                     banana, cocco, kiwi, maracuja, cofanetto
   - immagine      → lascia null per usare l'illustrazione. Quando avrete
                     le foto vere, mettete qui il percorso del file
                     (es. "images/mango.jpg") e verrà mostrata la foto
                     al posto dell'illustrazione automaticamente
   - colore        → colore di sfondo dell'illustrazione, formato "#RRGGBB"
   ========================================================================= */

const PRODUCTS = [
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
    descrizioneEstesa: "Fette di mango selezionato, essiccato a bassa temperatura per mantenere aroma e colore naturali. Nessuno zucchero aggiunto, nessun conservante.",
    icona: "mango",
    immagine: null,
    colore: "#E8974A"
  },
  {
    id: "ananas-essiccato",
    nome: "Ananas Essiccato",
    categoria: "Frutta Essiccata",
    prezzo: 7.50,
    formato: "200 g",
    badge: null,
    inEvidenza: true,
    disponibile: true,
    descrizione: "Note agrodolci e succose, tagliato a mano e asciugato al punto giusto.",
    descrizioneEstesa: "Anelli di ananas essiccati con metodo lento, per un morso agrodolce che ricorda il frutto appena tagliato. Ottimo da solo o in tavola con formaggi.",
    icona: "ananas",
    immagine: null,
    colore: "#D9B23C"
  },
  {
    id: "papaya-essiccata",
    nome: "Papaya Essiccata",
    categoria: "Frutta Essiccata",
    prezzo: 7.90,
    formato: "200 g",
    badge: null,
    inEvidenza: true,
    disponibile: true,
    descrizione: "Morbida, aromatica: un morso di tropico in ogni fetta.",
    descrizioneEstesa: "Papaya matura al punto giusto, essiccata per esaltarne la morbidezza e il profumo. Ricca di fibre, perfetta come snack tra i pasti.",
    icona: "papaya",
    immagine: null,
    colore: "#E8734F"
  },
  {
    id: "banana-essiccata",
    nome: "Banana Essiccata",
    categoria: "Frutta Essiccata",
    prezzo: 6.90,
    formato: "200 g",
    badge: "Novità",
    inEvidenza: true,
    disponibile: true,
    descrizione: "Croccante fuori, morbida dentro: lo snack energetico naturale.",
    descrizioneEstesa: "Chips di banana essiccata, leggermente caramellizzata dai suoi stessi zuccheri naturali durante l'essiccazione. Nessun olio di frittura.",
    icona: "banana",
    immagine: null,
    colore: "#D9A441"
  },
  {
    id: "cocco-essiccato",
    nome: "Cocco Essiccato a Fette",
    categoria: "Frutta Essiccata",
    prezzo: 6.50,
    formato: "150 g",
    badge: null,
    inEvidenza: false,
    disponibile: true,
    descrizione: "Sottili fette di cocco, tostate leggermente per un aroma intenso.",
    descrizioneEstesa: "Polpa di cocco tagliata sottile e tostata con delicatezza per sviluppare un aroma più intenso, mantenendo la naturale croccantezza.",
    icona: "cocco",
    immagine: null,
    colore: "#EDE3D3"
  },
  {
    id: "kiwi-essiccato",
    nome: "Kiwi Essiccato",
    categoria: "Frutta Essiccata",
    prezzo: 7.20,
    formato: "180 g",
    badge: null,
    inEvidenza: false,
    disponibile: true,
    descrizione: "Fettine verde brillante, dolci e leggermente acidule.",
    descrizioneEstesa: "Kiwi affettato ed essiccato mantenendo il caratteristico colore verde e i piccoli semi, per un equilibrio perfetto tra dolce e acidulo.",
    icona: "kiwi",
    immagine: null,
    colore: "#9BB84A"
  },
  {
    id: "maracuja-essiccato",
    nome: "Frutto della Passione Essiccato",
    categoria: "Frutta Essiccata",
    prezzo: 8.90,
    formato: "150 g",
    badge: "Edizione Limitata",
    inEvidenza: false,
    disponibile: true,
    descrizione: "Il profumo intenso del maracuja, in una versione da collezione.",
    descrizioneEstesa: "Polpa di frutto della passione essiccata in piccoli lotti stagionali: aroma intenso e profumato, disponibilità limitata.",
    icona: "maracuja",
    immagine: null,
    colore: "#C97B3D"
  },
  {
    id: "cofanetto-tropicale",
    nome: "Cofanetto Degustazione Tropicale",
    categoria: "Cofanetti & Regali",
    prezzo: 19.90,
    formato: "4 x 100 g",
    badge: "Best Value",
    inEvidenza: true,
    disponibile: true,
    descrizione: "La nostra selezione: mango, ananas, papaya e banana in un unico cofanetto.",
    descrizioneEstesa: "Un assaggio completo del nostro raccolto: quattro sacchetti da 100 g in una confezione regalo pensata per essere condivisa o regalata.",
    icona: "cofanetto",
    immagine: null,
    colore: "#8C6A4F"
  }
];

/* Categorie mostrate nei filtri dello store, nell'ordine in cui appaiono.
   Se aggiungi una nuova "categoria" a un prodotto sopra, ricordati di
   aggiungerla anche in questa lista per farla comparire come filtro. */
const CATEGORIE = ["Tutti", "Frutta Essiccata", "Cofanetti & Regali"];
