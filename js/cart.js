/* ============================================================================
   EXOTIC DRY SICILY — CART.JS
   Carrello lato client (nessun backend, nessun pagamento reale).
   Lo stato viene salvato nel browser (localStorage) così il carrello
   sopravvive alla chiusura della pagina. Il tasto "Procedi al checkout"
   apre per ora un messaggio informativo: la struttura (form, riepilogo
   ordine, sezione "metodo di pagamento") è già pronta per essere collegata
   a un vero gateway di pagamento in futuro — vedi GUIDA-GESTIONE-SITO.md.
   ========================================================================= */

const CART_KEY = "exoticDrySicily_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) { /* localStorage non disponibile: il carrello resta solo in memoria */ }
}

let cartState = loadCart();

function cartItemsList() {
  return Object.entries(cartState)
    .map(([id, qty]) => ({ product: getProduct(id), qty }))
    .filter(item => item.product);
}

function cartCount() {
  return Object.values(cartState).reduce((sum, qty) => sum + qty, 0);
}

function cartTotal() {
  return cartItemsList().reduce((sum, item) => sum + item.product.prezzo * item.qty, 0);
}

function addToCart(id, qty = 1) {
  cartState[id] = (cartState[id] || 0) + qty;
  saveCart(cartState);
  renderCart();
  showToast();
}

function setQty(id, qty) {
  if (qty <= 0) {
    delete cartState[id];
  } else {
    cartState[id] = qty;
  }
  saveCart(cartState);
  renderCart();
}

function removeFromCart(id) {
  delete cartState[id];
  saveCart(cartState);
  renderCart();
}

/* -------------------------------------------------------------------------
   RENDER — badge contatore + drawer
   ------------------------------------------------------------------------- */
function renderCart() {
  const countEls = document.querySelectorAll("[data-cart-count]");
  const n = cartCount();
  countEls.forEach(el => {
    el.textContent = n;
    el.dataset.empty = n === 0 ? "true" : "false";
  });

  const itemsEl = document.querySelector("[data-cart-items]");
  const summaryEl = document.querySelector("[data-cart-summary]");
  if (!itemsEl) return;

  const items = cartItemsList();

  if (items.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        ${icon("bag")}
        <p>Il tuo carrello è vuoto.<br>Aggiungi qualche sapore esotico ✦</p>
      </div>`;
    if (summaryEl) summaryEl.style.display = "none";
    return;
  }

  if (summaryEl) summaryEl.style.display = "block";

  itemsEl.innerHTML = items.map(({ product, qty }) => `
    <div class="cart-item" data-cart-item="${product.id}">
      <div class="cart-item-media" style="background:${product.colore}">
        ${product.immagine ? `<img src="${product.immagine}" alt="${product.nome}">` : icon(product.icona)}
      </div>
      <div class="cart-item-info">
        <h4>${product.nome}</h4>
        <span class="price">€ ${formatPrice(product.prezzo)} / ${product.formato}</span>
        <div class="cart-item-qty">
          <button class="qty-btn" data-qty-down="${product.id}" aria-label="Diminuisci quantità">−</button>
          <span>${qty}</span>
          <button class="qty-btn" data-qty-up="${product.id}" aria-label="Aumenta quantità">+</button>
          <button class="cart-item-remove" data-remove="${product.id}">Rimuovi</button>
        </div>
      </div>
    </div>
  `).join("");

  const totalEl = document.querySelector("[data-cart-total]");
  if (totalEl) totalEl.textContent = `€ ${formatPrice(cartTotal())}`;
}

/* -------------------------------------------------------------------------
   DRAWER OPEN/CLOSE
   ------------------------------------------------------------------------- */
function openCart() {
  document.querySelector("[data-cart-drawer]")?.classList.add("open");
  document.querySelector("[data-cart-overlay]")?.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.querySelector("[data-cart-drawer]")?.classList.remove("open");
  document.querySelector("[data-cart-overlay]")?.classList.remove("open");
  document.body.style.overflow = "";
}

/* -------------------------------------------------------------------------
   TOAST "Aggiunto al carrello"
   ------------------------------------------------------------------------- */
let toastTimer = null;
function showToast() {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* -------------------------------------------------------------------------
   MODALE CHECKOUT (placeholder — nessun pagamento attivo)
   ------------------------------------------------------------------------- */
function openCheckoutModal() {
  document.querySelector("[data-checkout-modal]")?.classList.add("open");
}
function closeCheckoutModal() {
  document.querySelector("[data-checkout-modal]")?.classList.remove("open");
}

/* -------------------------------------------------------------------------
   EVENTI GLOBALI (delega sul body: funziona anche sui prodotti generati
   dinamicamente da main.js)
   ------------------------------------------------------------------------- */
function initCart() {
  renderCart();

  document.body.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn && !addBtn.disabled) {
      addToCart(addBtn.dataset.add, 1);
      return;
    }

    if (e.target.closest("[data-cart-open]")) { openCart(); return; }
    if (e.target.closest("[data-cart-close]") || e.target.closest("[data-cart-overlay]")) { closeCart(); return; }

    const qtyUp = e.target.closest("[data-qty-up]");
    if (qtyUp) {
      const id = qtyUp.dataset.qtyUp;
      setQty(id, (cartState[id] || 0) + 1);
      return;
    }
    const qtyDown = e.target.closest("[data-qty-down]");
    if (qtyDown) {
      const id = qtyDown.dataset.qtyDown;
      setQty(id, (cartState[id] || 0) - 1);
      return;
    }
    const remove = e.target.closest("[data-remove]");
    if (remove) { removeFromCart(remove.dataset.remove); return; }

    if (e.target.closest("[data-checkout-open]")) { openCheckoutModal(); return; }
    if (e.target.closest("[data-checkout-close]") || e.target.closest("[data-checkout-overlay]")) { closeCheckoutModal(); return; }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeCart(); closeCheckoutModal(); }
  });
}

window.initCart = initCart;
