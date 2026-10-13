"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CartConfig, CartLine, CartSnapshot } from "./cart-types";

const STORAGE_KEY = "eds_cart_v2";
const MAX_QTY = 20;

type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  config: CartConfig;
  open: boolean;
  toast: string | null;
  setOpen: (v: boolean) => void;
  add: (item: CartSnapshot, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart fuori da CartProvider");
  return c;
}

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((l) => l && typeof l.key === "string" && typeof l.price === "number" && l.qty > 0)
      : [];
  } catch {
    return [];
  }
}

export function CartProvider({ config, children }: { config: CartConfig; children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const loaded = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLines(read());
    loaded.current = true;
    const onStorage = (e: StorageEvent) => { if (e.key === STORAGE_KEY) setLines(read()); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)); } catch { /* browser senza storage: il carrello resta in memoria */ }
  }, [lines]);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const add = useCallback((item: CartSnapshot, qty = 1) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.key === item.key);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], ...item, qty: Math.min(MAX_QTY, next[i].qty + qty) };
        return next;
      }
      return [...prev, { ...item, qty: Math.min(MAX_QTY, qty) }];
    });
    flash(`${item.name}: nel carrello`);
  }, [flash]);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, qty) } : l))));
  }, []);
  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const subtotal = Math.round(lines.reduce((s, l) => s + l.price * l.qty, 0) * 100) / 100;
    const free = config.freeShippingThreshold > 0 && subtotal >= config.freeShippingThreshold;
    const shipping = count === 0 || free ? 0 : config.flatRate;
    return { lines, count, subtotal, shipping, total: subtotal + shipping, config, open, toast, setOpen, add, setQty, remove, clear };
  }, [lines, config, open, toast, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
