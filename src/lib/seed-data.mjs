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

/* ------------------------------ IMPOSTAZIONI ----------------------------- */
export const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  brandName: "Exotic Dry Sicily",
  tagline: "Frutta esotica essiccata in Sicilia",
  description:
    "Frutta esotica essiccata lentamente in Sicilia. Senza zuccheri aggiunti, senza conservanti. Mango, ananas, papaya e altri sapori dei tropici, spediti in tutta Italia.",
  announcement: {
    enabled: true,
    text: "Spedizione gratuita sopra i 49 € · Solo frutta, nient'altro",
    href: "/store",
  },
  contact: {
    email: "info@exoticdrysicily.com",
    phone: "",
    whatsapp: "",
  },
  company: {
    legalName: "",
    vatNumber: "",
    address: "",
  },
  social: { instagram: "", facebook: "", tiktok: "" },
  shipping: {
    freeShippingThreshold: 49,
    flatRate: 5.9,
    countries: ["IT"],
    deliveryEstimate: "Spediamo in tutta Italia. Tempi di consegna indicativi: 2-4 giorni lavorativi dalla spedizione.",
  },
  navigation: withKeys([
    { label: "Home", href: "/" },
    { label: "I Nostri Prodotti", href: "/store" },
    { label: "La Nostra Storia", href: "/#storia" },
    { label: "Domande Frequenti", href: "/faq" },
    { label: "Contatti", href: "/contatti" },
  ]),
  footerLinks: withKeys([
    { label: "Contatti", href: "/contatti" },
    { label: "Spedizioni & Resi", href: "/spedizioni-e-resi" },
    { label: "Domande Frequenti", href: "/faq" },
    { label: "Termini e Condizioni", href: "/termini-e-condizioni" },
  ]),
  legalLinks: withKeys([
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Termini e Condizioni", href: "/termini-e-condizioni" },
  ]),
  footerText:
    "Frutta esotica essiccata, selezionata con cura e lavorata in Sicilia. Naturale, senza zuccheri aggiunti, senza compromessi.",
  paymentNote: "Pagamenti sicuri con Stripe: carte e portafogli digitali.",
};

/* ------------------------------ CATEGORIE -------------------------------- */
export const categories = [
  {
    _id: "category.frutta-essiccata",
    _type: "category",
    title: "Frutta Essiccata",
    slug: { _type: "slug", current: "frutta-essiccata" },
    description: "Singoli frutti esotici, essiccati lentamente a bassa temperatura.",
    order: 1,
  },
  {
    _id: "category.cofanetti-e-regali",
    _type: "category",
    title: "Cofanetti & Regali",
    slug: { _type: "slug", current: "cofanetti-e-regali" },
    description: "Assaggi e confezioni regalo, pronti da donare.",
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
const storage = "Conservare in luogo fresco e asciutto, lontano dalla luce. Dopo l'apertura richiudere bene la confezione.";

export const products = [
  prod({
    slug: "mango-essiccato",
    category: FRUTTA,
    rest: {
      name: "Mango Essiccato",
      price: 7.9,
      format: "200 g",
      badge: "Bestseller",
      featured: true,
      available: true,
      order: 1,
      shortDescription: "Dolcezza pura dei tropici, essiccata lentamente per preservare tutto il sapore.",
      description: [
        block("Fette di mango selezionato, essiccato a bassa temperatura per mantenere aroma e colore naturali. Nessuno zucchero aggiunto, nessun conservante."),
        block("La dolcezza è quella del frutto, concentrata dall'essiccazione lenta: morbido, aromatico, perfetto da solo, nello yogurt o in una colazione veloce."),
      ],
      illustration: { icon: "mango", color: "#E8974A" },
      ingredients: "Mango 100%",
      storage,
      origin: "Frutto da filiere controllate, essiccato e confezionato in Sicilia.",
      dietary: ["Senza zuccheri aggiunti", "Senza conservanti", "Vegano"],
    },
  }),
  prod({
    slug: "ananas-essiccato",
    category: FRUTTA,
    rest: {
      name: "Ananas Essiccato",
      price: 7.5,
      format: "200 g",
      featured: true,
      available: true,
      order: 2,
      shortDescription: "Note agrodolci e succose, tagliato a mano e asciugato al punto giusto.",
      description: [
        block("Anelli di ananas essiccati con metodo lento, per un morso agrodolce che ricorda il frutto appena tagliato."),
        block("Ottimo da solo o in tavola con formaggi."),
      ],
      illustration: { icon: "ananas", color: "#D9B23C" },
      ingredients: "Ananas 100%",
      storage,
      origin: "Frutto da filiere controllate, essiccato e confezionato in Sicilia.",
      dietary: ["Senza zuccheri aggiunti", "Senza conservanti", "Vegano"],
    },
  }),
  prod({
    slug: "papaya-essiccata",
    category: FRUTTA,
    rest: {
      name: "Papaya Essiccata",
      price: 7.9,
      format: "200 g",
      featured: true,
      available: true,
      order: 3,
      shortDescription: "Morbida, aromatica: un morso di tropico in ogni fetta.",
      description: [
        block("Papaya matura al punto giusto, essiccata per esaltarne la morbidezza e il profumo."),
        block("Ricca di fibre, perfetta come snack tra i pasti."),
      ],
      illustration: { icon: "papaya", color: "#E8734F" },
      ingredients: "Papaya 100%",
      storage,
      origin: "Frutto da filiere controllate, essiccato e confezionato in Sicilia.",
      dietary: ["Senza zuccheri aggiunti", "Senza conservanti", "Vegano"],
    },
  }),
  prod({
    slug: "banana-essiccata",
    category: FRUTTA,
    rest: {
      name: "Banana Essiccata",
      price: 6.9,
      format: "200 g",
      badge: "Novità",
      featured: true,
      available: true,
      order: 4,
      shortDescription: "Croccante fuori, morbida dentro: lo snack energetico naturale.",
      description: [
        block("Chips di banana essiccata, leggermente caramellizzata dai suoi stessi zuccheri naturali durante l'essiccazione."),
        block("Nessun olio di frittura."),
      ],
      illustration: { icon: "banana", color: "#D9A441" },
      ingredients: "Banana 100%",
      storage,
      origin: "Frutto da filiere controllate, essiccato e confezionato in Sicilia.",
      dietary: ["Senza zuccheri aggiunti", "Senza conservanti", "Vegano"],
    },
  }),
  prod({
    slug: "cocco-essiccato",
    category: FRUTTA,
    rest: {
      name: "Cocco Essiccato a Fette",
      price: 6.5,
      format: "150 g",
      featured: false,
      available: true,
      order: 5,
      shortDescription: "Sottili fette di cocco, tostate leggermente per un aroma intenso.",
      description: [
        block("Polpa di cocco tagliata sottile e tostata con delicatezza per sviluppare un aroma più intenso, mantenendo la naturale croccantezza."),
      ],
      illustration: { icon: "cocco", color: "#EDE3D3" },
      ingredients: "Cocco 100%",
      storage,
      origin: "Frutto da filiere controllate, essiccato e confezionato in Sicilia.",
      dietary: ["Senza zuccheri aggiunti", "Senza conservanti", "Vegano"],
    },
  }),
  prod({
    slug: "kiwi-essiccato",
    category: FRUTTA,
    rest: {
      name: "Kiwi Essiccato",
      price: 7.2,
      format: "180 g",
      featured: false,
      available: true,
      order: 6,
      shortDescription: "Fettine verde brillante, dolci e leggermente acidule.",
      description: [
        block("Kiwi affettato ed essiccato mantenendo il caratteristico colore verde e i piccoli semi, per un equilibrio perfetto tra dolce e acidulo."),
      ],
      illustration: { icon: "kiwi", color: "#9BB84A" },
      ingredients: "Kiwi 100%",
      storage,
      origin: "Frutto da filiere controllate, essiccato e confezionato in Sicilia.",
      dietary: ["Senza zuccheri aggiunti", "Senza conservanti", "Vegano"],
    },
  }),
  prod({
    slug: "maracuja-essiccato",
    category: FRUTTA,
    rest: {
      name: "Frutto della Passione Essiccato",
      price: 8.9,
      format: "150 g",
      badge: "Edizione Limitata",
      featured: false,
      available: true,
      order: 7,
      shortDescription: "Il profumo intenso del maracuja, in una versione da collezione.",
      description: [
        block("Polpa di frutto della passione essiccata in piccoli lotti stagionali: aroma intenso e profumato, disponibilità limitata."),
      ],
      illustration: { icon: "maracuja", color: "#C97B3D" },
      ingredients: "Frutto della passione 100%",
      storage,
      origin: "Frutto da filiere controllate, essiccato e confezionato in Sicilia.",
      dietary: ["Senza zuccheri aggiunti", "Senza conservanti", "Vegano"],
    },
  }),
  prod({
    slug: "cofanetto-tropicale",
    category: COFANETTI,
    rest: {
      name: "Cofanetto Degustazione Tropicale",
      price: 19.9,
      format: "4 x 100 g",
      badge: "Best Value",
      featured: true,
      available: true,
      order: 8,
      shortDescription: "La nostra selezione: mango, ananas, papaya e banana in un unico cofanetto.",
      description: [
        block("Un assaggio completo del nostro raccolto: quattro sacchetti da 100 g (mango, ananas, papaya e banana) in una confezione regalo pensata per essere condivisa o regalata."),
      ],
      illustration: { icon: "cofanetto", color: "#8C6A4F" },
      ingredients: "Mango, ananas, papaya, banana (100% frutta)",
      storage,
      origin: "Frutto da filiere controllate, essiccato e confezionato in Sicilia.",
      dietary: ["Senza zuccheri aggiunti", "Senza conservanti", "Vegano"],
    },
  }),
];

/* ------------------------------ FAQ -------------------------------------- */
const faq = (id, order, question, answer, featured = false) => ({
  _id: `faq.${id}`,
  _type: "faqItem",
  question,
  answer,
  order,
  featured,
});
export const faqItems = [
  faq("ingredienti", 1, "Ci sono zuccheri aggiunti o conservanti?", "No. Gli ingredienti sono solo frutta: nessuno zucchero aggiunto, nessun conservante, nessun colorante. La dolcezza è quella naturale del frutto, concentrata dall'essiccazione lenta.", true),
  faq("conservazione", 2, "Come si conserva la frutta essiccata?", "In luogo fresco e asciutto, lontano dalla luce. Dopo l'apertura richiudi bene la confezione per mantenere morbidezza e aroma.", true),
  faq("spedizioni", 3, "Spedite in tutta Italia? Quanto costa?", "Sì, spediamo in tutta Italia. Il costo di spedizione è mostrato nel carrello e al checkout, e la spedizione è gratuita sopra la soglia indicata nel carrello.", true),
  faq("pagamenti", 4, "Quali metodi di pagamento accettate?", "I pagamenti sono gestiti da Stripe: carte di credito e debito e, dove disponibili, Apple Pay e Google Pay. Non vediamo né conserviamo mai i dati della tua carta.", true),
  faq("resi", 5, "Posso restituire un prodotto?", "Hai diritto di recesso entro 14 giorni dalla consegna, come previsto dal Codice del Consumo. Per ragioni igieniche non possono essere restituiti i prodotti alimentari già aperti. Se qualcosa non va, scrivici: ogni ordine è seguito personalmente.", true),
  faq("regali", 6, "Fate confezioni regalo o ordini per aziende?", "Sì: trovi i cofanetti nello store. Per quantità maggiori o regali aziendali scrivici e troviamo la soluzione giusta.", false),
  faq("vegano", 7, "I vostri prodotti sono adatti a chi segue una dieta vegana?", "Sono fatti solo di frutta, quindi sì. Per informazioni su allergeni e valori nutrizionali consulta sempre l'etichetta riportata sulla confezione.", false),
];

/* ------------------------------ PAGINE ----------------------------------- */
const page = (slug, title, description, body) => ({
  _id: `page.${slug}`,
  _type: "page",
  title,
  slug: { _type: "slug", current: slug },
  description,
  body,
});

export const pages = [
  page("contatti", "Contatti", "Scrivici per ordini, quantità speciali o collaborazioni: rispondiamo di persona.", [
    block("Siamo un team piccolo e rispondiamo di persona. Scrivici per un ordine, una quantità speciale, un regalo aziendale o una collaborazione."),
    block("Email", "h2"),
    block("info@exoticdrysicily.com"),
    block("Dati dell'azienda", "h2"),
    block("[Ragione sociale] · P.IVA [numero] · [Indirizzo sede legale]"),
  ]),
  page("spedizioni-e-resi", "Spedizioni & Resi", "Costi, tempi di consegna e diritto di recesso.", [
    block("Spedizioni", "h2"),
    block("Spediamo in tutta Italia. Il costo di spedizione e la soglia per la spedizione gratuita sono mostrati nel carrello e al checkout. I tempi di consegna sono indicativi e dipendono dal corriere."),
    block("Diritto di recesso", "h2"),
    block("Hai 14 giorni dalla consegna per esercitare il diritto di recesso, scrivendo a info@exoticdrysicily.com. Per ragioni igieniche i prodotti alimentari già aperti non possono essere restituiti."),
    block("Prodotto danneggiato o errato", "h2"),
    block("Se il pacco arriva danneggiato o contiene un prodotto diverso da quello ordinato, scrivici entro 48 ore dalla consegna con una foto: ti rispondiamo di persona e risolviamo."),
  ]),
  page("privacy-policy", "Privacy Policy", "Come trattiamo i tuoi dati personali.", [
    block("Titolare del trattamento", "h2"),
    block("[Ragione sociale], [indirizzo], P.IVA [numero], email: info@exoticdrysicily.com."),
    block("Quali dati raccogliamo", "h2"),
    ...bullets([
      "Dati dell'ordine: nome, indirizzo di spedizione, email e telefono, necessari per consegnare il prodotto.",
      "Pagamento: gestito da Stripe. Non vediamo né conserviamo i dati della tua carta.",
      "Newsletter: la tua email, solo se ti iscrivi volontariamente.",
      "Statistiche di visita aggregate e anonime (Vercel Web Analytics), senza cookie.",
    ]),
    block("Per quanto tempo", "h2"),
    block("Conserviamo i dati degli ordini per il tempo richiesto dagli obblighi fiscali e contabili; l'email della newsletter fino alla cancellazione dell'iscrizione."),
    block("I tuoi diritti", "h2"),
    block("Puoi chiedere accesso, rettifica, cancellazione e portabilità dei dati, e opporti al trattamento, scrivendo a info@exoticdrysicily.com. Hai inoltre il diritto di proporre reclamo al Garante per la protezione dei dati personali."),
    block("Testo da completare e far verificare da un consulente prima del lancio."),
  ]),
  page("cookie-policy", "Cookie Policy", "Quali cookie e tecnologie simili usa il sito.", [
    block("Questo sito usa solo tecnologie strettamente necessarie al funzionamento: il carrello viene salvato nel tuo browser (localStorage) per non perderlo tra una pagina e l'altra."),
    block("Le statistiche di visita sono raccolte in forma aggregata e anonima, senza cookie di profilazione. Il pagamento è gestito da Stripe, che può impostare cookie tecnici e antifrode durante il checkout."),
    block("Se in futuro verranno aggiunti strumenti di marketing o profilazione, questa pagina sarà aggiornata e verrà richiesto il tuo consenso."),
  ]),
  page("termini-e-condizioni", "Termini e Condizioni", "Condizioni generali di vendita.", [
    block("Venditore", "h2"),
    block("[Ragione sociale], [indirizzo], P.IVA [numero], email: info@exoticdrysicily.com."),
    block("Ordini e prezzi", "h2"),
    block("I prezzi sono espressi in euro e comprendono l'IVA. Le spese di spedizione sono indicate nel carrello e al checkout prima della conferma. Il contratto si conclude quando ricevi la email di conferma dell'ordine."),
    block("Pagamento", "h2"),
    block("Il pagamento avviene online tramite Stripe. L'ordine viene evaso dopo la conferma del pagamento."),
    block("Recesso", "h2"),
    block("Vedi la pagina Spedizioni & Resi."),
    block("Testo da completare e far verificare da un consulente prima del lancio."),
  ]),
];

/* ------------------------------ HOME ------------------------------------- */
export const homePage = {
  _id: "homePage",
  _type: "homePage",
  title: "Home",
  seoTitle: "Exotic Dry Sicily — Frutta Esotica Essiccata, Naturale al 100%",
  seoDescription:
    "Frutta esotica essiccata lentamente in Sicilia. Senza zuccheri aggiunti, senza conservanti. Mango, ananas, papaya e altri sapori dei tropici, spediti in tutta Italia.",
  sections: [
    {
      _type: "heroSection",
      _key: key(),
      eyebrow: "100% Naturale · Essiccato in Sicilia",
      title: "Il gusto dei tropici, essiccato lentamente in Sicilia.",
      highlight: "essiccato",
      subtitle:
        "Selezioniamo i frutti più esotici e li essicchiamo con calma, senza zuccheri aggiunti né conservanti: solo frutta, tempo e pazienza siciliana.",
      primaryCta: { label: "Scopri i Prodotti", href: "/store" },
      secondaryCta: { label: "La Nostra Storia", href: "/#storia" },
      badgeTitle: "Qualità garantita",
      badgeText: "100% frutta, zero additivi",
      trust: withKeys([
        { icon: "noSugar", text: "Senza zuccheri aggiunti" },
        { icon: "handPicked", text: "Selezionato a mano" },
        { icon: "truck", text: "Spedizione in tutta Italia" },
      ]),
    },
    {
      _type: "marqueeSection",
      _key: key(),
      items: [
        "Frutta Esotica Essiccata",
        "Senza Zuccheri Aggiunti",
        "Essiccata in Sicilia",
        "Senza Conservanti",
        "Spedizione in Tutta Italia",
      ],
    },
    {
      _type: "productsSection",
      _key: key(),
      eyebrow: "Il Nostro Raccolto",
      title: "I Nostri Preferiti",
      subtitle: "Un assaggio della nostra selezione. Il catalogo completo ti aspetta nello store.",
      mode: "featured",
      ctaLabel: "Vai allo Store Completo",
      ctaHref: "/store",
    },
    {
      _type: "valuesSection",
      _key: key(),
      eyebrow: "Perché Sceglierci",
      title: "La stessa cura, in ogni sacchetto.",
      subtitle: "Quattro promesse semplici che manteniamo in ogni lotto che confezioniamo.",
      items: withKeys([
        { icon: "leaf", title: "100% Naturale", text: "Solo frutta. Nessun additivo, nessun colorante, nessun conservante: leggiamo l'etichetta anche noi." },
        { icon: "noSugar", title: "Senza Zuccheri Aggiunti", text: "La dolcezza è solo quella naturale del frutto, concentrata dal lento processo di essiccazione." },
        { icon: "handPicked", title: "Selezionato a Mano", text: "Ogni lotto è controllato a mano, frutto per frutto, prima di essere essiccato e confezionato." },
        { icon: "recycle", title: "Packaging Sostenibile", text: "Confezioni pensate per ridurre la plastica e rispettare lo stesso Mediterraneo da cui arriva la nostra frutta." },
      ]),
    },
    {
      _type: "storySection",
      _key: key(),
      anchor: "storia",
      eyebrow: "La Nostra Storia",
      title: "Nata in Sicilia, guarda al resto del mondo.",
      paragraphs: [
        "Exotic Dry Sicily nasce da un'idea semplice: portare il sapore dei frutti più esotici del mondo sulle tavole italiane, lavorati con la stessa cura artigianale che la Sicilia riserva ai suoi agrumi e alla sua frutta secca da generazioni.",
        "Selezioniamo mango, ananas, papaya e altri frutti da coltivazioni controllate, e li essicchiamo lentamente per concentrarne il sapore senza aggiungere nulla: niente zuccheri, niente conservanti, solo tempo.",
        "Il risultato è uno snack che porta il profumo dei tropici, con la stessa autenticità che troveresti in un mercato siciliano.",
      ],
      signatureName: "Exotic Dry Sicily",
      signatureRole: "Essiccato con cura, ogni giorno",
    },
    {
      _type: "processSection",
      _key: key(),
      eyebrow: "Come Nasce",
      title: "Dal frutto al sacchetto",
      subtitle: "Tre passaggi, nessuna scorciatoia.",
      steps: withKeys([
        { title: "Selezione", text: "Scegliamo frutta matura al punto giusto, da filiere controllate." },
        { title: "Essiccazione Lenta", text: "Bassa temperatura, tempi lunghi: il sapore resta intatto e le proprietà si conservano." },
        { title: "Confezionamento in Sicilia", text: "Confezioniamo in piccoli lotti, pronti per partire verso casa tua." },
      ]),
    },
    {
      _type: "testimonialsSection",
      _key: key(),
      eyebrow: "Dicono di noi",
      title: "Le parole di chi ci ha già assaggiato",
    },
    {
      _type: "faqSection",
      _key: key(),
      eyebrow: "Domande Frequenti",
      title: "Prima di ordinare",
      subtitle: "Le risposte alle domande che ci fanno più spesso.",
    },
    {
      _type: "newsletterSection",
      _key: key(),
      eyebrow: "Restiamo in Contatto",
      title: "Nuovi arrivi e lotti limitati, prima di tutti.",
      text: "Iscriviti alla newsletter: niente spam, solo aggiornamenti su nuovi arrivi, edizioni limitate e disponibilità.",
      buttonLabel: "Iscrivimi",
      successText: "Grazie! Ti terremo aggiornato.",
      note: "Puoi annullare l'iscrizione in qualsiasi momento.",
    },
    {
      _type: "ctaSection",
      _key: key(),
      eyebrow: "Exotic Dry Sicily",
      title: "Pronto a viaggiare con il gusto?",
      text: "Scopri tutta la nostra selezione di frutta esotica essiccata, pensata per chi non vuole rinunciare al gusto naturale.",
      cta: { label: "Vai allo Store", href: "/store" },
    },
  ],
};

export const storePage = {
  _id: "storePage",
  _type: "storePage",
  eyebrow: "Il Catalogo",
  title: "Tutta la nostra frutta esotica essiccata.",
  subtitle:
    "Ogni sacchetto è selezionato a mano ed essiccato lentamente in Sicilia: nessuno zucchero aggiunto, nessun conservante. Solo frutta, come dovrebbe essere.",
  seoTitle: "Store — Frutta Esotica Essiccata | Exotic Dry Sicily",
  seoDescription:
    "Sfoglia il catalogo Exotic Dry Sicily: mango, ananas, papaya, banana e altra frutta esotica essiccata artigianalmente in Sicilia, senza zuccheri aggiunti.",
  infoCards: withKeys([
    { icon: "truck", title: "Spedizione in Tutta Italia", text: "Confezioniamo con cura e spediamo in tutta Italia. Costi e tempi sono mostrati nel carrello e al checkout." },
    { icon: "shield", title: "Pagamenti Sicuri", text: "Paghi online con Stripe: i dati della tua carta non passano mai da noi." },
    { icon: "handPicked", title: "Qualità Garantita", text: "Non soddisfatto? Scrivici: ogni ordine è seguito personalmente dal nostro team." },
  ]),
};

/** Tutti i documenti da caricare in Sanity con `npm run seed` */
export const allDocuments = [
  siteSettings,
  homePage,
  storePage,
  ...categories,
  ...products,
  ...faqItems,
  ...pages,
];
