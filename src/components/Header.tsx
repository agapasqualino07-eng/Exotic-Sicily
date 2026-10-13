import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { SanityImage } from "./SanityImage";
import { CartButton } from "./CartDrawer";
import { MobileNav } from "./MobileNav";

export function Brand({ settings }: { settings: SiteSettings }) {
  if (settings.logo?.asset) {
    return (
      <Link href="/" className="logo" aria-label={settings.brandName}>
        <SanityImage image={settings.logo} alt={settings.brandName} widths={[160, 320]} sizes="160px" priority className="logo-img" />
      </Link>
    );
  }
  const [first, ...rest] = (settings.brandName || "Exotic Dry Sicily").split(" ");
  const last = rest.pop();
  return (
    <Link href="/" className="logo" aria-label={settings.brandName}>
      {[first, ...rest].join(" ").toUpperCase()}<span>{last}</span>
    </Link>
  );
}

export function AnnouncementBar({ settings }: { settings: SiteSettings }) {
  const a = settings.announcement;
  if (!a?.enabled || !a.text) return null;
  const inner = <span>{a.text}</span>;
  return (
    <div className="announce">
      {a.href ? <Link href={a.href}>{inner}</Link> : inner}
    </div>
  );
}

export function Header({ settings }: { settings: SiteSettings }) {
  return (
    <>
      <AnnouncementBar settings={settings} />
      <header className="site-header">
        <div className="container header-inner">
          <Brand settings={settings} />
          <MobileNav items={(settings.navigation ?? []).map((n) => ({ label: n.label ?? "", href: n.href ?? "/" }))} />
          <div className="header-actions">
            <Link href="/store" className="btn btn-outline btn-sm hide-sm">Shop</Link>
            <CartButton />
          </div>
        </div>
      </header>
    </>
  );
}
