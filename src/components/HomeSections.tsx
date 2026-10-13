import Link from "next/link";
import { getFaqs, getFeaturedProducts, getTestimonials } from "@/lib/content";
import type { HomeSection, Link as L, ProductCardData } from "@/lib/types";
import { FaqList } from "./Faq";
import { Icon } from "./Icon";
import { NewsletterForm } from "./NewsletterForm";
import { ProductArt } from "./ProductArt";
import { ProductGrid } from "./ProductCard";
import { Reveal } from "./Reveal";
import { SanityImage } from "./SanityImage";

const Head = ({ eyebrow, title, subtitle, left }: { eyebrow?: string; title?: string; subtitle?: string; left?: boolean }) => (
  <div className={`section-head${left ? " left" : ""}`}>
    {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
    {title ? <h2>{title}</h2> : null}
    {subtitle ? <p>{subtitle}</p> : null}
  </div>
);

const Cta = ({ link, variant = "primary" }: { link?: L; variant?: "primary" | "outline" | "light" }) =>
  link?.label && link.href ? <Link href={link.href} className={`btn btn-${variant}`}>{link.label}</Link> : null;

function Hero({ s, products }: { s: Extract<HomeSection, { _type: "heroSection" }>; products: ProductCardData[] }) {
  const title = s.title;
  const idx = s.highlight ? title.indexOf(s.highlight) : -1;
  const arts = products.filter((p) => !p.image).slice(0, 3);
  const defaults = [
    { icon: "mango", color: "#E8974A" },
    { icon: "ananas", color: "#D9B23C" },
    { icon: "papaya", color: "#E8734F" },
  ];
  const pouches = (arts.length >= 3 ? arts.map((p) => p.illustration || defaults[0]) : defaults).slice(0, 3);
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          {s.eyebrow ? <span className="eyebrow">{s.eyebrow}</span> : null}
          <h1>
            {idx >= 0 ? <>{title.slice(0, idx)}<em>{s.highlight}</em>{title.slice(idx + s.highlight!.length)}</> : title}
          </h1>
          {s.subtitle ? <p className="lead">{s.subtitle}</p> : null}
          <div className="hero-cta">
            <Cta link={s.primaryCta} />
            <Cta link={s.secondaryCta} variant="outline" />
          </div>
          {s.trust?.length ? (
            <ul className="hero-trust">
              {s.trust.map((t) => <li key={t._key}><Icon name={t.icon || "leaf"} size={20} />{t.text}</li>)}
            </ul>
          ) : null}
        </div>

        <div className="hero-visual">
          <div className="hero-arch">
            {s.image?.asset ? (
              <SanityImage image={s.image} ratio={4 / 5} widths={[480, 720, 960]} sizes="(min-width: 900px) 480px, 90vw" priority className="hero-photo" />
            ) : (
              <div className="hero-pouches" aria-hidden="true">
                <ProductArt icon={pouches[1].icon} color={pouches[1].color} className="pouch p2" />
                <ProductArt icon={pouches[0].icon} color={pouches[0].color} className="pouch p1" />
                <ProductArt icon={pouches[2].icon} color={pouches[2].color} className="pouch p3" />
              </div>
            )}
          </div>
          {s.badgeTitle ? (
            <div className="hero-badge">
              <Icon name="shield" size={26} />
              <div><strong>{s.badgeTitle}</strong><span>{s.badgeText}</span></div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export async function HomeSections({ sections }: { sections: HomeSection[] }) {
  const needsFeatured = sections.some((s) => s._type === "productsSection" && s.mode !== "manual");
  const [featured, faqs, testimonials] = await Promise.all([
    needsFeatured ? getFeaturedProducts() : Promise.resolve([]),
    sections.some((s) => s._type === "faqSection") ? getFaqs(true) : Promise.resolve([]),
    sections.some((s) => s._type === "testimonialsSection") ? getTestimonials() : Promise.resolve([]),
  ]);
  const heroProducts = featured.length ? featured : [];

  return (
    <>
      {sections.map((s) => {
        switch (s._type) {
          case "heroSection":
            return <Hero key={s._key} s={s} products={heroProducts} />;

          case "marqueeSection": {
            const items = s.items ?? [];
            if (!items.length) return null;
            return (
              <div key={s._key} className="strip" aria-hidden="true">
                <div className="strip-track">
                  {[...items, ...items, ...items].map((t, i) => <span key={i}>{t}</span>)}
                </div>
              </div>
            );
          }

          case "valuesSection":
            return (
              <section key={s._key} className="section values">
                <div className="container">
                  <Reveal><Head {...s} /></Reveal>
                  <div className="values-grid">
                    {(s.items ?? []).map((v, i) => (
                      <Reveal key={v._key} delay={i * 70}>
                        <div className="value-card">
                          <div className="value-icon"><Icon name={v.icon || "leaf"} size={26} /></div>
                          <h3>{v.title}</h3>
                          <p>{v.text}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>
            );

          case "storySection":
            return (
              <section key={s._key} className="story" id={s.anchor || undefined}>
                <div className="container story-grid">
                  <div className="story-visual">
                    {s.image?.asset ? (
                      <SanityImage image={s.image} ratio={4 / 5} widths={[400, 640, 900]} sizes="(min-width: 900px) 440px, 90vw" className="story-photo" />
                    ) : (
                      <Icon name="mapPin" size={120} strokeWidth={1.1} />
                    )}
                  </div>
                  <div className="story-text">
                    {s.eyebrow ? <span className="eyebrow">{s.eyebrow}</span> : null}
                    <h2>{s.title}</h2>
                    {(s.paragraphs ?? []).map((p, i) => <p key={i}>{p}</p>)}
                    {s.signatureName ? (
                      <div className="story-signature">
                        <span className="sig-name">{s.signatureName}</span>
                        <span className="sig-role">{s.signatureRole}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>
            );

          case "processSection":
            return (
              <section key={s._key} className="section process">
                <div className="container">
                  <Reveal><Head {...s} /></Reveal>
                  <ol className="process-grid">
                    {(s.steps ?? []).map((st, i) => (
                      <li key={st._key}>
                        <Reveal delay={i * 90}>
                          <div className="process-step">
                            <div className="process-num" aria-hidden="true">{i + 1}</div>
                            <h3>{st.title}</h3>
                            <p>{st.text}</p>
                          </div>
                        </Reveal>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            );

          case "productsSection": {
            const list = s.mode === "manual" ? (s.products ?? []).filter(Boolean) : featured;
            if (!list.length) return null;
            return (
              <section key={s._key} className="section products-section">
                <div className="container">
                  <div className="products-head">
                    <div>
                      {s.eyebrow ? <span className="eyebrow">{s.eyebrow}</span> : null}
                      <h2>{s.title}</h2>
                    </div>
                    {s.subtitle ? <p>{s.subtitle}</p> : null}
                  </div>
                  <ProductGrid products={list} />
                  {s.ctaLabel ? (
                    <div className="products-cta"><Link href={s.ctaHref || "/store"} className="btn btn-primary">{s.ctaLabel}</Link></div>
                  ) : null}
                </div>
              </section>
            );
          }

          case "testimonialsSection":
            if (!testimonials.length) return null;
            return (
              <section key={s._key} className="section testimonials">
                <div className="container">
                  <Head {...s} />
                  <div className="testimonial-grid">
                    {testimonials.slice(0, 3).map((t) => (
                      <figure key={t._id} className="testimonial">
                        {t.rating ? <div className="stars" role="img" aria-label={`${t.rating} stelle su 5`}>{Array.from({ length: t.rating }).map((_, i) => <Icon key={i} name="star" size={16} fill="currentColor" />)}</div> : null}
                        <blockquote>{t.quote}</blockquote>
                        <figcaption>{t.author}{t.location ? `, ${t.location}` : ""}{t.productName ? ` · ${t.productName}` : ""}</figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              </section>
            );

          case "faqSection":
            if (!faqs.length) return null;
            return (
              <section key={s._key} className="section faq-section">
                <div className="container narrow">
                  <Head {...s} />
                  <FaqList items={faqs} />
                  <p className="faq-more"><Link href="/faq">Tutte le domande frequenti <Icon name="arrow" size={16} /></Link></p>
                </div>
              </section>
            );

          case "newsletterSection":
            return (
              <section key={s._key} className="newsletter">
                <div className="container">
                  {s.eyebrow ? <span className="eyebrow">{s.eyebrow}</span> : null}
                  <h2>{s.title}</h2>
                  {s.text ? <p>{s.text}</p> : null}
                  <NewsletterForm buttonLabel={s.buttonLabel} successText={s.successText} source="home" />
                  {s.note ? <p className="newsletter-note">{s.note}</p> : null}
                </div>
              </section>
            );

          case "ctaSection":
            return (
              <section key={s._key} className="final-cta">
                <div className="container">
                  {s.eyebrow ? <span className="eyebrow">{s.eyebrow}</span> : null}
                  <h2>{s.title}</h2>
                  {s.text ? <p>{s.text}</p> : null}
                  <Cta link={s.cta} />
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </>
  );
}
