import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { Icon } from "./Icon";
import { Brand } from "./Header";

export function Footer({ settings }: { settings: SiteSettings }) {
  const s = settings.social ?? {};
  const socials = [
    { name: "instagram", href: s.instagram, label: "Instagram" },
    { name: "facebook", href: s.facebook, label: "Facebook" },
    { name: "tiktok", href: s.tiktok, label: "TikTok" },
  ].filter((x) => x.href);
  const c = settings.company ?? {};
  const email = settings.contact?.email;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand settings={settings} />
            <p>{settings.footerText}</p>
            {socials.length ? (
              <div className="footer-social">
                {socials.map((x) => (
                  <a key={x.name} href={x.href} target="_blank" rel="noopener noreferrer" aria-label={x.label}><Icon name={x.name} size={20} /></a>
                ))}
              </div>
            ) : null}
          </div>

          <nav className="footer-col" aria-label="Esplora">
            <h2>Esplora</h2>
            <ul>
              {(settings.navigation ?? []).map((n) => <li key={n._key ?? n.href}><Link href={n.href ?? "/"}>{n.label}</Link></li>)}
            </ul>
          </nav>

          <nav className="footer-col" aria-label="Assistenza">
            <h2>Assistenza</h2>
            <ul>
              {(settings.footerLinks ?? []).map((n) => <li key={n._key ?? n.href}><Link href={n.href ?? "/"}>{n.label}</Link></li>)}
              {email ? <li><a href={`mailto:${email}`}>{email}</a></li> : null}
            </ul>
          </nav>

          <div className="footer-col">
            <h2>Pagamenti</h2>
            <p className="payment-note">{settings.paymentNote}</p>
            <div className="payment-icons" aria-hidden="true">
              <span>VISA</span><span>MASTERCARD</span><span>APPLE&nbsp;PAY</span><span>GOOGLE&nbsp;PAY</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {c.legalName || settings.brandName}
            {c.vatNumber ? ` · P.IVA ${c.vatNumber}` : ""}
            {c.address ? ` · ${c.address}` : ""}
          </span>
          <div className="footer-bottom-links">
            {(settings.legalLinks ?? []).map((n) => <Link key={n._key ?? n.href} href={n.href ?? "/"}>{n.label}</Link>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
