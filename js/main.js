/* ============================================================================
   EXOTIC DRY SICILY — MAIN.JS
   Rendering prodotti (da products.js), illustrazioni SVG placeholder,
   menu mobile, filtri store, newsletter finta.
   Non serve modificare questo file per gestire i prodotti: vedi products.js.
   ========================================================================= */

/* -------------------------------------------------------------------------
   ICONE — set di illustrazioni SVG usate al posto delle foto prodotto
   finché non saranno disponibili gli scatti reali (vedi campo "immagine"
   in products.js). Anche le icone dell'interfaccia (carrello, menu, ecc.)
   sono qui, così tutto il progetto resta senza dipendenze esterne.
   ------------------------------------------------------------------------- */
const ICONS = {
  // --- Illustrazioni frutta (viewBox 0 0 100 100, stroke-based) ---
  mango: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M32 28c-10 8-16 22-12 38 3 12 15 20 27 18 14-2 24-16 22-32-2-14-13-19-15-30-1-6 2-11 6-14-9-2-19 3-22 10-3 7-2 8-6 10z"/><path d="M55 10c3 5 3 11 0 16" /></svg>`,
  ananas: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M35 14c4 6 6 10 6 16M50 10v18M65 14c-4 6-6 10-6 16" /><rect x="28" y="34" width="44" height="54" rx="18"/><path d="M28 50h44M28 66h44M42 34v54M58 34v54" stroke-width="2"/></svg>`,
  papaya: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M50 12c16 0 26 16 26 36s-10 40-26 40-26-20-26-40 10-36 26-36z"/><path d="M50 40c6 0 10 4 10 9s-4 8-10 8-10-3-10-8 4-9 10-9z" stroke-width="2.4"/><circle cx="44" cy="47" r="1.6" fill="currentColor" stroke="none"/><circle cx="50" cy="50" r="1.6" fill="currentColor" stroke="none"/><circle cx="56" cy="46" r="1.6" fill="currentColor" stroke="none"/><circle cx="47" cy="53" r="1.6" fill="currentColor" stroke="none"/><circle cx="54" cy="52" r="1.6" fill="currentColor" stroke="none"/></svg>`,
  banana: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 62c2 14 16 24 32 22 16-3 28-15 30-30" /><path d="M24 62c-2-16 6-32 20-40" /><path d="M84 54c2 3 2 7-1 10-4 4-10 3-13-1" /></svg>`,
  cocco: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="54" r="34"/><circle cx="42" cy="42" r="2" fill="currentColor" stroke="none"/><circle cx="50" cy="38" r="2" fill="currentColor" stroke="none"/><circle cx="58" cy="43" r="2" fill="currentColor" stroke="none"/><path d="M30 60c8 6 32 6 40 0" stroke-width="2.2" opacity=".7"/><path d="M28 50c10 5 34 5 44 0" stroke-width="2.2" opacity=".5"/></svg>`,
  kiwi: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="16" stroke-width="2.2"/><circle cx="50" cy="50" r="3" fill="currentColor" stroke="none"/><g stroke-width="1.8" opacity=".85"><path d="M50 34v6M50 60v6M34 50h6M60 50h6M39 39l4 4M57 57l4 4M61 39l-4 4M43 57l-4 4"/></g></svg>`,
  maracuja: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="14" stroke-width="2.2"/><g stroke-width="1.6" opacity=".85"><path d="M50 36v-6M50 64v6M36 50h-6M64 50h6M40 40l-5-5M60 60l5 5M60 40l5-5M40 60l-5 5"/></g><circle cx="50" cy="50" r="2.4" fill="currentColor" stroke="none"/></svg>`,
  cofanetto: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="40" width="64" height="42" rx="4"/><path d="M18 56h64" /><path d="M50 40v42" /><path d="M50 40c-8-14-26-14-26 0M50 40c8-14 26-14 26 0" stroke-width="2.6"/></svg>`,

  // --- Icone interfaccia (viewBox 0 0 24 24) ---
  cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2l2.6 12.4a1.8 1.8 0 0 0 1.8 1.6h8.6a1.8 1.8 0 0 0 1.76-1.44L21.5 8H6.4"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 4l16 16M20 4L4 20"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 4v16M4 12h16"/></svg>`,
  minus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 12h16"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16Z"/><path d="M4 20 14 10"/></svg>`,
  noSugar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 8v8l8 5 8-5V8Z"/><path d="M5 6.5 19 17.5"/></svg>`,
  handPicked: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5 14 9l6.5.6-5 4.4L17 20l-5-3.4L7 20l1.5-6-5-4.4L10 9Z"/></svg>`,
  recycle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 19H5.5A2.5 2.5 0 0 1 3 16.5c0-.8.4-1.5 1-2l1.5-2M9 5l3-2.5L15 5M12 2.5v9M17 5h1.5A2.5 2.5 0 0 1 21 7.5c0 .8-.4 1.5-1 2l-1.5 2M15 19l3 2.5L15 24M18 21.5H9.5A2.5 2.5 0 0 1 7 19"/></svg>`,
  truck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h11v10H2zM13 10h4l4 3.2V16h-8z"/><circle cx="6.5" cy="18.5" r="1.6"/><circle cx="17" cy="18.5" r="1.6"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5 20 6v6c0 5-3.4 8.4-8 9.5-4.6-1.1-8-4.5-8-9.5V6Z"/><path d="m8.5 12 2.4 2.4L16 9.3"/></svg>`,
  mapPin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-7.4 7-12.5A7 7 0 0 0 5 8.5C5 13.6 12 21 12 21Z"/><circle cx="12" cy="8.5" r="2.4"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 8.5h2V5h-2c-2.2 0-4 1.8-4 4v2H9v3.5h2V21h3.5v-6.5H17l.5-3.5h-3V9c0-.3.2-.5.5-.5Z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v10.5a3.5 3.5 0 1 1-3.2-3.48"/><path d="M14 3c.3 2.6 2 4.4 4.5 4.7"/></svg>`,
  checkCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="m8 12.5 2.6 2.6L16 9.6"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 7v5.5l4 2.3"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 11v5.5M12 7.8v.1"/></svg>`,
  bag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l-1 12.5H7z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>`
};

function icon(name, cls) {
  const svg = ICONS[name] || "";
  return cls ? svg.replace("<svg ", `<svg class="${cls}" `) : svg;
}

/* -------------------------------------------------------------------------
   HELPERS
   ------------------------------------------------------------------------- */
function formatPrice(n) {
  return n.toFixed(2).replace(".", ",");
}

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

/* -------------------------------------------------------------------------
   RENDER CARD PRODOTTO
   Usato sia nella home (prodotti in evidenza) sia nello store (griglia
   completa). Se il prodotto ha un campo "immagine" valorizzato, mostra la
   foto; altrimenti mostra l'illustrazione SVG placeholder.
   ------------------------------------------------------------------------- */
function renderProductCard(p) {
  const media = p.immagine
    ? `<img src="${p.immagine}" alt="${p.nome}" loading="lazy">`
    : icon(p.icona);

  const badge = p.badge
    ? `<span class="product-badge">${p.badge}</span>`
    : (!p.disponibile ? `<span class="product-badge sold-out">Esaurito</span>` : "");

  return `
    <article class="product-card" data-id="${p.id}">
      <div class="product-media" style="background:${p.colore}">
        ${badge}
        ${media}
      </div>
      <div class="product-info">
        <span class="product-cat">${p.categoria}</span>
        <h3>${p.nome}</h3>
        <p class="desc">${p.descrizione}</p>
        <div class="product-footer">
          <div class="product-price">€ ${formatPrice(p.prezzo)}<span>/ ${p.formato}</span></div>
          <button class="add-btn" data-add="${p.id}" ${p.disponibile ? "" : "disabled"} aria-label="Aggiungi ${p.nome} al carrello">
            ${icon(p.disponibile ? "plus" : "close")}
          </button>
        </div>
      </div>
    </article>`;
}

function renderGrid(container, products) {
  if (!container) return;
  container.innerHTML = products.map(renderProductCard).join("");
}

/* -------------------------------------------------------------------------
   HOME — prodotti in evidenza
   ------------------------------------------------------------------------- */
function initFeaturedProducts() {
  const el = document.querySelector("[data-featured-products]");
  if (!el) return;
  const featured = PRODUCTS.filter(p => p.inEvidenza);
  renderGrid(el, featured);
}

/* -------------------------------------------------------------------------
   STORE — griglia completa + filtri categoria
   ------------------------------------------------------------------------- */
function initStoreProducts() {
  const grid = document.querySelector("[data-store-products]");
  const filterBar = document.querySelector("[data-filters]");
  if (!grid) return;

  if (filterBar) {
    filterBar.innerHTML = CATEGORIE.map((cat, i) =>
      `<button class="filter-btn ${i === 0 ? "active" : ""}" data-filter="${cat}">${cat}</button>`
    ).join("");

    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filterBar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.filter;
      const filtered = cat === "Tutti" ? PRODUCTS : PRODUCTS.filter(p => p.categoria === cat);
      renderGrid(grid, filtered);
      updateResultsCount(filtered.length);
    });
  }

  renderGrid(grid, PRODUCTS);
  updateResultsCount(PRODUCTS.length);
}

function updateResultsCount(n) {
  const el = document.querySelector("[data-results-count]");
  if (el) el.textContent = `${n} prodott${n === 1 ? "o" : "i"}`;
}

/* -------------------------------------------------------------------------
   MENU MOBILE
   ------------------------------------------------------------------------- */
function initMobileNav() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  if (!header || !toggle) return;
  toggle.addEventListener("click", () => {
    header.classList.toggle("menu-open");
  });
  document.querySelectorAll(".main-nav a").forEach(a => {
    a.addEventListener("click", () => header.classList.remove("menu-open"));
  });
}

/* -------------------------------------------------------------------------
   NEWSLETTER (finta — nessun invio reale, solo conferma visiva)
   ------------------------------------------------------------------------- */
function initNewsletter() {
  const form = document.querySelector("[data-newsletter-form]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const success = form.querySelector(".newsletter-success");
    form.querySelector("input").value = "";
    if (success) success.classList.add("show");
  });
}

/* -------------------------------------------------------------------------
   HEADER — ombra/compattazione allo scroll (puramente estetico)
   ------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });
}

/* -------------------------------------------------------------------------
   INIT
   ------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initHeaderScroll();
  initFeaturedProducts();
  initStoreProducts();
  initNewsletter();
  if (window.initCart) window.initCart();
});
