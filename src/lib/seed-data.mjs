/* ============================================================================
   CONTENUTI DI PARTENZA — Exotic Dry Sicily
   Questo file fa due cose:
   1. È il contenuto "di riserva": se Sanity non è ancora collegato, il sito
      mostra questi dati (così il sito funziona subito, anche in anteprima).
   2. `npm run seed` lo carica dentro Sanity, da dove poi lo modifichi dallo
      Studio (/studio) senza più toccare il codice.
   Gli _id sono fissi: rilanciare il seed aggiorna gli stessi documenti
   invece di duplicarli (⚠ sovrascrive eventuali modifiche fatte nello Studio
   a questi documenti: usalo solo per il primo caricamento).
   ========================================================================= */

let keyCounter = 0;
const key = () => `k${(++keyCounter).toString(36)}`;
const withKeys = (arr) => arr.map((item) => ({ _key: key(), ...item }));

/** Crea un blocco di testo formattato (Portable Text) */
export const block = (text, style = "normal") => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});
export const bullets = (items) =>
  items.map((text) => ({
    ...block(text),
    listItem: "bullet",
    level: 1,
  }));

/* Tono di voce (vedi .agents/product-marketing.md): si dà del tu, frasi corte,
   «1 ingrediente» come prova, momenti concreti, ironia asciutta, niente punti
   esclamativi, niente promesse sulla salute. */

/* ------------------------------ IMPOSTAZIONI ----------------------------- */
export const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  brandName: "Exotic Dry Sicily",
  tagline: "Frutta esotica essiccata in Sicilia",
  description:
    "Frutta esotica essiccata in Sicilia con un solo ingrediente: il frutto. Mango, ananas, papaya, kiwi e cofanetti regalo. Spedizione in tutta Italia.",
  announcement: {
    enabled: true,
    text: "Spedizione gratis da 49 € · In etichetta c'è scritto solo il frutto",
    href: "/store",
  },
  contact: { email: "info@exoticdrysicily.com", phone: "", whatsapp: "" },
  company: { legalName: "", vatNumber: "", address: "" },
  social: { instagram: "", facebook: "", tiktok: "" },
  shipping: {
    freeShippingThreshold: 49,
    flatRate: 5.9,
    countries: ["IT"],
    deliveryEstimate: "Spediamo in tutta Italia, di solito in 2-4 giorni lavorativi.",
  },
  navigation: withKeys([
    { label: "Shop", href: "/store" },
    { label: "Chi siamo", href: "/#storia" },
    { label: "Blog", href: "/blog" },
    { label: "Domande", href: "/faq" },
    { label: "Contatti", href: "/contatti" },
  ]),
  footerLinks: withKeys([
    { label: "Contatti", href: "/contatti" },
    { label: "Spedizioni e resi", href: "/spedizioni-e-resi" },
    { label: "Domande frequenti", href: "/faq" },
    { label: "Termini e condizioni", href: "/termini-e-condizioni" },
  ]),
  legalLinks: withKeys([
    { label: "Privacy", href: "/privacy-policy" },
    { label: "Cookie", href: "/cookie-policy" },
    { label: "Termini e condizioni", href: "/termini-e-condizioni" },
  ]),
  footerText:
    "Frutta esotica, tempo e pazienza siciliana. La essicchiamo piano e la chiudiamo a mano nei sacchetti, pochi alla volta.",
  paymentNote: "Paghi con Stripe. La tua carta noi non la vediamo mai.",
};

/* ------------------------------ CATEGORIE -------------------------------- */
export const categories = [
  {
    _id: "category.frutta-essiccata",
    _type: "category",
    title: "Frutta essiccata",
    slug: { _type: "slug", current: "frutta-essiccata" },
    description: "Un frutto per sacchetto. Dentro c'è solo quello.",
    intro:
      "Mango, ananas, papaya, banana, cocco, kiwi e frutto della passione. Li tagliamo maturi, li essicchiamo per ore a bassa temperatura e li chiudiamo nel sacchetto. In etichetta trovi un solo ingrediente: il frutto.",
    seoTitle: "Frutta esotica essiccata senza zuccheri aggiunti",
    seoDescription:
      "Mango, ananas, papaya, banana, cocco e kiwi essiccati in Sicilia a bassa temperatura. Un solo ingrediente per sacchetto. Spedizione gratis da 49 €.",
    order: 1,
  },
  {
    _id: "category.cofanetti-e-regali",
    _type: "category",
    title: "Cofanetti e regali",
    slug: { _type: "slug", current: "cofanetti-e-regali" },
    description: "Quattro frutti in una scatola. Da regalare, o da aprire subito.",
    intro:
      "Il cofanetto mette insieme quattro sacchetti da 100 g. È il modo più veloce per scoprire il tuo frutto preferito, ed è un regalo che non finisce in fondo a un cassetto. Per regali aziendali e quantità grandi, scrivici.",
    seoTitle: "Cofanetti regalo di frutta esotica essiccata",
    seoDescription:
      "Cofanetto regalo con mango, ananas, papaya e banana essiccati in Sicilia, 4 sacchetti da 100 g. Idea regalo gastronomica, anche per aziende.",
    order: 2,
  },
];

/* ------------------------------ PRODOTTI --------------------------------- */
const prod = (p) => ({
  _type: "product",
  _id: `product.${p.slug}`,
  slug: { _type: "slug", current: p.slug },
  category: { _type: "reference", _ref: p.category },
  ...p.rest,
});

const FRUTTA = "category.frutta-essiccata";
const COFANETTI = "category.cofanetti-e-regali";
const storage = "Tienilo in un posto fresco e asciutto, lontano dal sole. Una volta aperto, richiudi bene il sacchetto.";
const origin = "Frutta da filiere controllate, essiccata e confezionata a mano in Sicilia.";
const tags = ["Senza zuccheri aggiunti", "Senza conservanti", "Vegano"];

export const products = [
  prod({
    slug: "mango-essiccato",
    category: FRUTTA,
    rest: {
      name: "Mango essiccato",
      price: 7.9,
      format: "200 g",
      badge: "Il più preso",
      featured: true,
      available: true,
      order: 1,
      shortDescription: "Fette morbide e profumate. Sanno di mango perché sono solo mango.",
      description: [
        block("Prendiamo mango maturo, lo tagliamo a fette e lo lasciamo asciugare per ore a bassa temperatura. L'acqua se ne va, il profumo resta."),
        block("Viene morbido, un po' gommoso al centro, dolce quanto il frutto da cui parte. In etichetta c'è scritto mango, e basta."),
      ],
      howTo: ["Dal sacchetto, alle 16, alla scrivania", "A pezzetti nello yogurt o nel porridge", "Con un pecorino stagionato, all'aperitivo", "Nello zaino per la gita: non serve il frigo"],
      illustration: { icon: "mango", color: "#E8974A" },
      ingredients: "Mango 100%",
      storage,
      origin,
      dietary: tags,
    },
  }),
  prod({
    slug: "ananas-essiccato",
    category: FRUTTA,
    rest: {
      name: "Ananas essiccato",
      price: 7.5,
      format: "200 g",
      featured: true,
      available: true,
      order: 2,
      shortDescription: "Agrodolce e succoso. Il morso che ti sveglia a metà pomeriggio.",
      description: [
        block("Anelli di ananas essiccati piano, finché diventano masticabili e concentrati."),
        block("Il sapore è quello dell'ananas appena tagliato, con l'acidità al suo posto."),
      ],
      howTo: ["Sul tagliere, vicino ai formaggi", "Sminuzzato nell'insalata con finocchi e arance", "Al posto della caramella dopo pranzo", "Nella borsa della palestra"],
      illustration: { icon: "ananas", color: "#D9B23C" },
      ingredients: "Ananas 100%",
      storage,
      origin,
      dietary: tags,
    },
  }),
  prod({
    slug: "papaya-essiccata",
    category: FRUTTA,
    rest: {
      name: "Papaya essiccata",
      price: 7.9,
      format: "200 g",
      featured: true,
      available: true,
      order: 3,
      shortDescription: "Morbida e aromatica. La più delicata della squadra.",
      description: [
        block("Papaya matura essiccata a fette. Resta morbida, quasi vellutata, con un profumo dolce che ricorda il melone."),
        block("Piace a chi trova l'ananas troppo aspro."),
      ],
      howTo: ["Nella granola fatta in casa", "Con lo yogurt greco e un filo di miele", "Da sola, mentre aspetti che salga il caffè"],
      illustration: { icon: "papaya", color: "#E8734F" },
      ingredients: "Papaya 100%",
      storage,
      origin,
      dietary: tags,
    },
  }),
  prod({
    slug: "banana-essiccata",
    category: FRUTTA,
    rest: {
      name: "Banana essiccata",
      price: 6.9,
      format: "200 g",
      badge: "Novità",
      featured: true,
      available: true,
      order: 4,
      shortDescription: "Croccante fuori, morbida dentro. Essiccata, mai fritta.",
      description: [
        block("Chips di banana asciugate a bassa temperatura. Durante l'essiccazione gli zuccheri del frutto caramellano un po' da soli."),
        block("Non passa dalla friggitrice. In etichetta c'è scritto banana, e basta."),
      ],
      howTo: ["Sopra la colazione, al posto dei cereali", "Nel mix con mandorle e nocciole, per il trekking", "Sbriciolata sul gelato"],
      illustration: { icon: "banana", color: "#D9A441" },
      ingredients: "Banana 100%",
      storage,
      origin,
      dietary: tags,
    },
  }),
  prod({
    slug: "cocco-essiccato",
    category: FRUTTA,
    rest: {
      name: "Cocco essiccato a fette",
      price: 6.5,
      format: "150 g",
      featured: false,
      available: true,
      order: 5,
      shortDescription: "Fette sottili, tostate appena. Croccanti, e si sente.",
      description: [
        block("Polpa di cocco tagliata sottile e tostata con delicatezza, per un aroma più pieno."),
        block("È lo snack che fa più rumore: tienilo lontano dalle riunioni in videochiamata."),
      ],
      howTo: ["Sul porridge o sulla smoothie bowl", "Nel curry, all'ultimo momento", "Con un quadratino di cioccolato fondente"],
      illustration: { icon: "cocco", color: "#EDE3D3" },
      ingredients: "Cocco 100%",
      storage,
      origin,
      dietary: tags,
    },
  }),
  prod({
    slug: "kiwi-essiccato",
    category: FRUTTA,
    rest: {
      name: "Kiwi essiccato",
      price: 7.2,
      format: "180 g",
      featured: false,
      available: true,
      order: 6,
      shortDescription: "Verde brillante, dolce e un po' aspro. Con i semini.",
      description: [
        block("Kiwi a fette, essiccato fino a diventare masticabile. Il colore resta verde e i semini restano dove sono."),
        block("È il più aspro della famiglia. Piace a chi trova il mango troppo dolce."),
      ],
      howTo: ["Sopra lo yogurt bianco", "Nel mix con il cocco, per il contrasto", "Da solo, quando ti serve una sveglia"],
      illustration: { icon: "kiwi", color: "#9BB84A" },
      ingredients: "Kiwi 100%",
      storage,
      origin,
      dietary: tags,
    },
  }),
  prod({
    slug: "maracuja-essiccato",
    category: FRUTTA,
    rest: {
      name: "Frutto della passione essiccato",
      price: 8.9,
      format: "150 g",
      badge: "Edizione limitata",
      featured: false,
      available: true,
      order: 7,
      shortDescription: "Profumo intenso, lotti piccoli. Quando finisce, finisce.",
      description: [
        block("Polpa di frutto della passione essiccata in piccoli lotti, quando la frutta è al punto giusto. Aroma forte, acidità vivace."),
        block("Ne facciamo poco. Se lo vedi disponibile, è il momento."),
      ],
      howTo: ["Sbriciolato sulla panna cotta", "Nel gin tonic, al posto della scorza", "Da solo, a piccoli morsi: è intenso"],
      illustration: { icon: "maracuja", color: "#C97B3D" },
      ingredients: "Frutto della passione 100%",
      storage,
      origin,
      dietary: tags,
    },
  }),
  prod({
    slug: "cofanetto-tropicale",
    category: COFANETTI,
    rest: {
      name: "Cofanetto degustazione tropicale",
      price: 19.9,
      format: "4 x 100 g",
      badge: "Per assaggiare tutto",
      featured: true,
      available: true,
      order: 8,
      shortDescription: "Mango, ananas, papaya e banana. Quattro sacchetti, una scatola.",
      description: [
        block("Quattro sacchetti da 100 g in una scatola regalo: mango, ananas, papaya e banana."),
        block("Per chi vuole assaggiare tutto prima di scegliere il preferito. Oppure per un regalo che si mangia davvero."),
      ],
      howTo: ["Regalo per chi ha già tutto", "Al centro del tavolo dopo cena", "Da dividere in ufficio (o anche no)"],
      illustration: { icon: "cofanetto", color: "#8C6A4F" },
      ingredients: "Mango, ananas, papaya, banana (100% frutta)",
      storage,
      origin,
      dietary: tags,
    },
  }),
];

/* ------------------------------ FAQ -------------------------------------- */
const faq = (id, order, question, answer, featured = false) => ({ _id: `faq.${id}`, _type: "faqItem", question, answer, order, featured });
export const faqItems = [
  faq("ingredienti", 1, "C'è zucchero aggiunto?", "No. In etichetta trovi un solo ingrediente: il frutto. La dolcezza è la sua, concentrata dall'essiccazione.", true),
  faq("conservazione", 2, "Come la conservo?", "In un posto fresco e asciutto. Una volta aperto, richiudi bene il sacchetto: resta morbida più a lungo. La scadenza è stampata sulla confezione.", true),
  faq("spedizioni", 3, "Quanto costa la spedizione?", "Da 49 € in su è gratis. Sotto, il costo lo vedi nel carrello prima di pagare. Spediamo in tutta Italia.", true),
  faq("pagamenti", 4, "Come posso pagare?", "Con carta, Apple Pay o Google Pay, tramite Stripe. I dati della tua carta non passano da noi.", true),
  faq("resi", 5, "E se qualcosa non va?", "Scrivici a info@exoticdrysicily.com. Hai 14 giorni per il recesso; i prodotti alimentari già aperti non si possono restituire per motivi igienici. Se il pacco arriva rovinato, mandaci una foto e sistemiamo.", true),
  faq("regali", 6, "Fate regali aziendali?", "Sì. Scrivici quante persone sono e per quando ti servono: ti risponde una persona, non un modulo.", false),
  faq("vegano", 7, "Va bene per chi è vegano?", "È solo frutta, quindi sì. Per gli allergeni controlla sempre l'etichetta sulla confezione.", false),
];

/* ------------------------------ PAGINE ----------------------------------- */
const page = (slug, title, description, body) => ({ _id: `page.${slug}`, _type: "page", title, slug: { _type: "slug", current: slug }, description, body });

export const pages = [
  page("contatti", "Contatti", "Ordini, regali aziendali, collaborazioni o una domanda sul mango: scrivici, ti risponde una persona.", [
    block("Siamo un team piccolo. Le email le leggiamo noi, una per una."),
    block("Scrivici", "h2"),
    block("info@exoticdrysicily.com"),
    block("Per cosa puoi scriverci", "h2"),
    ...bullets(["Un ordine o una spedizione", "Regali aziendali e quantità grandi", "Negozi, bar e ristoranti che vogliono la nostra frutta", "Qualsiasi domanda sul mango"]),
    block("Dati dell'azienda", "h2"),
    block("[Ragione sociale] · P.IVA [numero] · [Indirizzo sede legale]"),
  ]),
  page("spedizioni-e-resi", "Spedizioni e resi", "Quanto costa la spedizione, quanto ci mette e cosa fare se qualcosa non va.", [
    block("Spedizioni", "h2"),
    block("Spediamo in tutta Italia. Da 49 € in su la spedizione è gratis; sotto, il costo lo vedi nel carrello prima di pagare. I tempi dipendono dal corriere: di solito 2-4 giorni lavorativi."),
    block("Diritto di recesso", "h2"),
    block("Hai 14 giorni dalla consegna per cambiare idea: scrivi a info@exoticdrysicily.com. Per motivi igienici i prodotti alimentari già aperti non si possono restituire."),
    block("Pacco rovinato o prodotto sbagliato", "h2"),
    block("Mandaci una foto entro 48 ore dalla consegna. Ti rispondiamo noi e sistemiamo."),
  ]),
  page("privacy-policy", "Privacy Policy", "Quali dati raccogliamo, perché e come puoi chiederne la cancellazione.", [
    block("Titolare del trattamento", "h2"),
    block("[Ragione sociale], [indirizzo], P.IVA [numero], email: info@exoticdrysicily.com."),
    block("Quali dati raccogliamo", "h2"),
    ...bullets([
      "Dati dell'ordine: nome, indirizzo di spedizione, email e telefono, che servono a consegnarti il pacco.",
      "Pagamento: lo gestisce Stripe. I dati della tua carta non li vediamo.",
      "Newsletter: la tua email, solo se ti iscrivi tu.",
      "Statistiche di visita anonime e aggregate (Vercel Web Analytics), senza cookie.",
    ]),
    block("Per quanto tempo", "h2"),
    block("I dati degli ordini per il tempo richiesto dagli obblighi fiscali; l'email della newsletter finché non ti cancelli."),
    block("I tuoi diritti", "h2"),
    block("Puoi chiedere accesso, rettifica, cancellazione e portabilità dei tuoi dati, oppure opporti al trattamento, scrivendo a info@exoticdrysicily.com. Puoi anche rivolgerti al Garante per la protezione dei dati personali."),
    block("Testo da completare e far verificare da un consulente prima del lancio."),
  ]),
  page("cookie-policy", "Cookie Policy", "Quali cookie e tecnologie simili usa il sito.", [
    block("Usiamo solo quello che serve al sito per funzionare: il carrello resta salvato nel tuo browser (localStorage), così non lo perdi tra una pagina e l'altra."),
    block("Le statistiche di visita sono anonime e aggregate, senza cookie di profilazione. Durante il pagamento Stripe può usare cookie tecnici e antifrode."),
    block("Se un giorno aggiungeremo strumenti di marketing, aggiorneremo questa pagina e ti chiederemo il consenso."),
  ]),
  page("termini-e-condizioni", "Termini e condizioni", "Condizioni generali di vendita di Exotic Dry Sicily.", [
    block("Venditore", "h2"),
    block("[Ragione sociale], [indirizzo], P.IVA [numero], email: info@exoticdrysicily.com."),
    block("Ordini e prezzi", "h2"),
    block("I prezzi sono in euro e comprendono l'IVA. Le spese di spedizione sono indicate nel carrello e al checkout prima della conferma. Il contratto si conclude quando ricevi l'email di conferma dell'ordine."),
    block("Pagamento", "h2"),
    block("Il pagamento avviene online tramite Stripe. Spediamo dopo la conferma del pagamento."),
    block("Recesso", "h2"),
    block("Vedi la pagina Spedizioni e resi."),
    block("Testo da completare e far verificare da un consulente prima del lancio."),
  ]),
];

/* ------------------------------ JOURNAL ---------------------------------- */
const ref = (id) => ({ _type: "reference", _ref: id, _key: key() });
const article = (slug, publishedAt, category, title, excerpt, body, productIds, seoTitle) => ({
  _id: `article.${slug}`,
  _type: "article",
  category,
  title,
  slug: { _type: "slug", current: slug },
  excerpt,
  publishedAt,
  author: "Exotic Dry Sicily",
  body,
  products: productIds.map((id) => ref(`product.${id}`)),
  ...(seoTitle ? { seoTitle } : {}),
});

export const articles = [
  article(
    "come-leggere-etichetta-frutta-essiccata",
    "2026-10-13T09:00:00.000Z",
    "guide",
    "Frutta essiccata senza zuccheri aggiunti: come leggere l'etichetta",
    "Zucchero, sciroppo, E220, olio: cosa cercare nella lista ingredienti di un sacchetto di frutta essiccata, e perché la riga più corta è quella giusta.",
    [
      block("Girare il sacchetto e leggere gli ingredienti richiede dieci secondi. È il modo più rapido per capire cosa stai comprando, e vale per qualsiasi marca, compresa la nostra."),
      block("Gli ingredienti sono in ordine di peso", "h2"),
      block("Per legge la lista parte dall'ingrediente presente in quantità maggiore. Se al secondo posto, dopo il frutto, trovi lo zucchero, vuol dire che ce n'è parecchio."),
      block("Le parole da cercare", "h2"),
      ...bullets([
        "Zucchero, saccarosio, sciroppo di glucosio o di fruttosio: è zucchero aggiunto, con nomi diversi.",
        "Anidride solforosa, solfiti, E220-E228: conservanti usati spesso per mantenere il colore. Quando superano i 10 mg/kg vanno indicati in etichetta come allergeni.",
        "Olio vegetale: lo trovi soprattutto nelle chips di banana fritte.",
        "Aromi e coloranti: servono a far sembrare il frutto più frutto di quanto sia.",
      ]),
      block("«Senza zuccheri aggiunti» non vuol dire «senza zuccheri»", "h2"),
      block("La frutta ha i suoi zuccheri. Quando la essicchi l'acqua se ne va e il sapore si concentra: per questo un sacchetto di mango è dolce anche senza aggiunte. La dicitura «senza zuccheri aggiunti» dice solo che nessuno ne ha messi altri."),
      block("E la nostra?", "h2"),
      block("Una riga: mango. Oppure ananas, papaya, banana, a seconda del sacchetto. La tabella nutrizionale completa la trovi sulla confezione."),
    ],
    ["mango-essiccato", "ananas-essiccato"],
    "Frutta essiccata senza zucchero: come leggere l'etichetta",
  ),
  article(
    "modi-di-mangiare-frutta-essiccata",
    "2026-10-10T09:00:00.000Z",
    "ricette",
    "7 modi di mangiare la frutta essiccata (oltre che dal sacchetto)",
    "Dalla colazione all'aperitivo: idee veloci per usare mango, ananas, papaya e cocco essiccati, senza accendere il forno.",
    [
      block("La frutta essiccata nasce per stare nello zaino. Ma in cucina se la cava bene. Ecco i modi che usiamo di più, in ordine di pigrizia."),
      block("1. Nello yogurt", "h3"),
      block("Mango o papaya a pezzetti nello yogurt greco. Se la lasci lì dieci minuti si ammorbidisce e rilascia profumo."),
      block("2. Nel porridge", "h3"),
      block("Aggiungila a fine cottura, così resta morbida e non si sfalda. Il cocco a fette va sopra, per la croccantezza."),
      block("3. Sul tagliere", "h3"),
      block("Ananas e mango con un pecorino stagionato. Cocco con un quadratino di cioccolato fondente. Funziona meglio di quanto sembri."),
      block("4. Nel mix da trekking", "h3"),
      block("Banana, cocco, mandorle e nocciole in un barattolo. Non serve il frigo e pesa poco."),
      block("5. Nell'insalata", "h3"),
      block("Ananas sminuzzato con finocchi e arance: un'insalata siciliana con un viaggio in più."),
      block("6. Sul dolce", "h3"),
      block("Frutto della passione sbriciolato sulla panna cotta o sul gelato alla vaniglia. Basta poco, è intenso."),
      block("7. Nel bicchiere", "h3"),
      block("Una fetta di mango o di ananas nel gin tonic, al posto della scorza."),
      block("L'ottavo modo è il più diffuso: aprire il sacchetto alle 16 e accorgersi alle 16:10 che è finito."),
    ],
    ["maracuja-essiccato", "cocco-essiccato", "cofanetto-tropicale"],
    "7 modi di mangiare la frutta essiccata",
  ),
  article(
    "idee-regalo-frutta-essiccata",
    "2026-10-06T09:00:00.000Z",
    "regali",
    "Idee regalo con la frutta essiccata (che non finiscono in un cassetto)",
    "Per i colleghi, per chi ha già tutto, per un'azienda: come regalare la frutta esotica essiccata e con cosa abbinarla.",
    [
      block("Un regalo da mangiare ha un vantaggio: nessuno deve trovargli un posto. Qui sotto le combinazioni che ci chiedete più spesso, da quella per il collega a quella per cento clienti."),
      block("Per chi non sai cosa regalare", "h2"),
      block("Il cofanetto con quattro sacchetti da 100 g (mango, ananas, papaya e banana) è pensato per questo. Si apre, si assaggia, si litiga su quale sia il migliore."),
      block("Per una cena", "h2"),
      block("Al posto della solita bottiglia, un sacchetto di mango e uno di ananas da mettere sul tagliere a fine pasto. Con un pecorino stagionato funzionano molto bene."),
      block("Per chi cucina", "h2"),
      block("Il frutto della passione essiccato è il regalo per chi ama sperimentare: si sbriciola sui dolci, si mette nei cocktail, si usa al posto della scorza di agrumi. Lo facciamo in lotti piccoli, quindi è anche un regalo che non si trova ovunque."),
      block("Per un'azienda", "h2"),
      block("Per i regali di fine anno a clienti e colleghi possiamo preparare quantità più grandi. Scrivici quante persone sono e per quando ti servono: ti rispondiamo noi, con tempi e prezzi."),
      block("Un consiglio pratico", "h2"),
      block("La frutta essiccata non ha bisogno del frigo e viaggia bene. Se il regalo deve partire, è una delle poche cose da mangiare che puoi spedire senza pensieri."),
    ],
    ["cofanetto-tropicale", "maracuja-essiccato"],
    "Idee regalo con la frutta essiccata",
  ),
];

/* ------------------------------ HOME ------------------------------------- */
export const homePage = {
  _id: "homePage",
  _type: "homePage",
  title: "Home",
  seoTitle: "Frutta esotica essiccata senza zuccheri | Exotic Dry Sicily",
  seoDescription:
    "Mango, ananas, papaya e altri frutti esotici essiccati a bassa temperatura in Sicilia. Un solo ingrediente per sacchetto. Spedizione in tutta Italia.",
  sections: [
    {
      _type: "heroSection",
      _key: key(),
      eyebrow: "Frutta esotica essiccata in Sicilia",
      title: "Sa solo di",
      rotatingWords: ["mango.", "ananas.", "papaya.", "banana.", "kiwi.", "cocco."],
      subtitle:
        "Tagliamo il frutto maturo, lo essicchiamo per ore a bassa temperatura e lo chiudiamo a mano nel sacchetto. In etichetta c'è 1 ingrediente.",
      primaryCta: { label: "Scegli il tuo frutto", href: "/#scegli" },
      secondaryCta: { label: "Vai allo shop", href: "/store" },
      badgeTitle: "1 ingrediente",
      badgeText: "Leggi l'etichetta, è corta",
      trust: withKeys([
        { icon: "noSugar", text: "Senza zuccheri aggiunti" },
        { icon: "handPicked", text: "Chiusa a mano in Sicilia" },
        { icon: "truck", text: "Spedizione gratis da 49 €" },
      ]),
    },
    {
      _type: "marqueeSection",
      _key: key(),
      items: ["Mango 100%", "Ananas 100%", "Papaya 100%", "1 ingrediente", "Essiccata in Sicilia", "Non serve il frigo"],
    },
    {
      _type: "showcaseSection",
      _key: key(),
      eyebrow: "Il raccolto",
      title: "Scegli il tuo frutto",
      subtitle: "Toccane uno e guarda l'etichetta. È corta.",
    },
    {
      _type: "compareSection",
      _key: key(),
      eyebrow: "Leggi l'etichetta",
      title: "Gira il sacchetto prima di comprare.",
      text: "Tanta frutta essiccata da scaffale ha una lista ingredienti lunga. La nostra ha una riga.",
      commonTitle: "Cosa trovi spesso in etichetta",
      commonItems: ["Zucchero o sciroppo di glucosio", "Anidride solforosa (E220)", "Aromi", "Coloranti", "Olio vegetale"],
      oursTitle: "Da noi",
      oursLabel: "Ingredienti: mango.",
      note: "Allergeni e valori nutrizionali sono sempre stampati sulla confezione.",
    },
    {
      _type: "productsSection",
      _key: key(),
      eyebrow: "I più presi",
      title: "Da dove iniziare",
      subtitle: "I sacchetti che finiscono per primi. E il cofanetto, se non sai decidere.",
      mode: "featured",
      ctaLabel: "Vedi tutti i prodotti",
      ctaHref: "/store",
    },
    {
      _type: "valuesSection",
      _key: key(),
      eyebrow: "Le regole di casa",
      title: "Quattro regole. Le rispettiamo sempre.",
      subtitle: "Le abbiamo scritte all'inizio e non le abbiamo più cambiate.",
      items: withKeys([
        { icon: "leaf", title: "1 ingrediente", text: "Il frutto. In etichetta non trovi altro." },
        { icon: "noSugar", title: "Dolce di suo", text: "Lo zucchero che senti è quello del frutto, concentrato dall'essiccazione." },
        { icon: "handPicked", title: "Scelto a mano", text: "Controlliamo ogni lotto prima di essiccarlo. Quello che non ci convince resta fuori." },
        { icon: "recycle", title: "Meno plastica", text: "Confezioni pensate per usarne meno. Ci stiamo ancora lavorando, e lo diciamo." },
      ]),
    },
    {
      _type: "storySection",
      _key: key(),
      anchor: "storia",
      eyebrow: "Chi siamo",
      title: "Frutta dei tropici, pazienza siciliana.",
      paragraphs: [
        "In Sicilia la frutta si tratta con rispetto da generazioni: agrumi, mandorle, fichi. Ci siamo chiesti perché con il mango non succedesse lo stesso.",
        "Sugli scaffali trovavamo mango essiccato con zucchero, solfiti e colori che il mango non ha. Così abbiamo iniziato a farlo noi, piano.",
        "Oggi essicchiamo mango, ananas, papaya e altri frutti esotici a bassa temperatura e li chiudiamo a mano, in piccoli lotti. Il metodo è sempre lo stesso: frutto maturo, tempo, nient'altro.",
      ],
      signatureName: "Exotic Dry Sicily",
      signatureRole: "Essiccato con calma, in Sicilia",
    },
    {
      _type: "processSection",
      _key: key(),
      eyebrow: "Come la facciamo",
      title: "Dal frutto al sacchetto",
      subtitle: "Tre passaggi. Nessuno va di fretta.",
      steps: withKeys([
        { title: "Scegliamo", text: "Frutta matura al punto giusto, da filiere controllate. Se non è pronta, aspettiamo." },
        { title: "Essicchiamo piano", text: "Bassa temperatura, tante ore. L'acqua se ne va, il sapore resta." },
        { title: "Chiudiamo a mano", text: "In Sicilia, pochi sacchetti alla volta. Poi partono verso casa tua." },
      ]),
    },
    {
      _type: "testimonialsSection",
      _key: key(),
      eyebrow: "Dicono di noi",
      title: "Cosa dice chi l'ha già assaggiata",
    },
    {
      _type: "blogSection",
      _key: key(),
      eyebrow: "Dal blog",
      title: "Idee per mangiarla, e per regalarla",
      subtitle: "Ricette veloci, abbinamenti e qualche consiglio per leggere le etichette.",
      ctaLabel: "Tutti gli articoli",
    },
    {
      _type: "faqSection",
      _key: key(),
      eyebrow: "Domande",
      title: "Prima di ordinare",
      subtitle: "Le cose che ci chiedete più spesso.",
    },
    {
      _type: "newsletterSection",
      _key: key(),
      eyebrow: "Newsletter",
      title: "Le edizioni limitate finiscono in fretta.",
      text: "Ti scriviamo quando arriva un frutto nuovo o torna quello che era finito. Una mail ogni tanto, quando c'è qualcosa da dire.",
      buttonLabel: "Avvisami",
      successText: "Fatto. Ci sentiamo al prossimo raccolto.",
      note: "Ti cancelli con un clic, quando vuoi.",
    },
    {
      _type: "ctaSection",
      _key: key(),
      eyebrow: "Ultima cosa",
      title: "Il tuo prossimo snack sa solo di frutta.",
      text: "Sette frutti e un cofanetto. Da 49 € la spedizione è gratis.",
      cta: { label: "Vai allo shop", href: "/store" },
    },
  ],
};

export const storePage = {
  _id: "storePage",
  _type: "storePage",
  eyebrow: "Shop",
  title: "Frutta esotica essiccata, un frutto per sacchetto.",
  subtitle: "Ogni sacchetto ha un solo ingrediente. Scegli il tuo, oppure prendi il cofanetto e assaggiali tutti.",
  seoTitle: "Shop frutta esotica essiccata senza zuccheri aggiunti",
  seoDescription:
    "Mango, ananas, papaya, banana, kiwi, cocco e frutto della passione essiccati in Sicilia. 1 ingrediente per sacchetto. Spedizione gratis da 49 €.",
  infoCards: withKeys([
    { icon: "truck", title: "Spedizione in tutta Italia", text: "Gratis da 49 €. Sotto, il costo lo vedi nel carrello prima di pagare." },
    { icon: "shield", title: "Pagamenti sicuri", text: "Paghi con Stripe. I dati della tua carta non passano da noi." },
    { icon: "handPicked", title: "Ti risponde una persona", text: "Qualcosa non va? Scrivici. Le email le leggiamo noi." },
  ]),
};

/** Tutti i documenti da caricare in Sanity con `npm run seed` o /api/seed */
export const allDocuments = [
  siteSettings,
  homePage,
  storePage,
  ...categories,
  ...products,
  ...faqItems,
  ...pages,
  ...articles,
];
