"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

export function MobileNav({ items }: { items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <nav className={`main-nav${open ? " open" : ""}`} aria-label="Menu principale" id="main-nav">
        {items.map((n) => {
          const active = n.href === pathname;
          return (
            <Link key={n.href + n.label} href={n.href} aria-current={active ? "page" : undefined} className={active ? "active" : undefined}>
              {n.label}
            </Link>
          );
        })}
      </nav>
      <button type="button" className="icon-btn nav-toggle" aria-expanded={open} aria-controls="main-nav" aria-label={open ? "Chiudi il menu" : "Apri il menu"} onClick={() => setOpen((v) => !v)}>
        <Icon name={open ? "close" : "menu"} size={22} />
      </button>
    </>
  );
}
