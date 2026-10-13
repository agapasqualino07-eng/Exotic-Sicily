import Link from "next/link";
import { getArticles, getFaqs, getFeaturedProducts, getProducts, getTestimonials } from "@/lib/content";
import { ArticleCard } from "./ArticleCard";
import { imageUrl } from "@/lib/image";
import type { HomeSection, Link as L, ProductCardData } from "@/lib/types";
import { FaqList } from "./Faq";
import { FRUIT, Icon } from "./Icon";
import { NewsletterForm } from "./NewsletterForm";
import { ProductArt } from "./ProductArt";
import { ProductGrid, toSnapshot } from "./ProductCard";
import { SanityImage } from "./SanityImage";
import { FruitShowcase, type ShowcaseItem } from "./motion/FruitShowcase";
import { HeroMotion } from "./motion/HeroMotion";
import { LabelCompare } from "./motion/LabelCompare";
import { ProcessScroll } from "./motion/ProcessScroll";
import { RotatingWord } from "./motion/RotatingWord";

const Head = ({ eyebrow, title, subtitle }: { eyebrow?: string; title?: string; subtitle?: string }) => (
  <div className="section-head" data-reveal>
    {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
    {title ? <h2>{title}</h2> : null}
    {subtitle ? <p>{subtitle}</p> : null}
  </div>
);

const Cta = ({ link, variant = "primary", magnetic }: { link?: L; variant?: "primary" | "outline" | "dark"; magnetic?: boolean }) =>
  link?.label && link.href ? (
    <Link href={link.href} className={`btn btn-${variant}`} {...(magnetic ? { "data-magnetic": "" } : {})}>
      {link.label}{variant === "primary" ? <Icon name="arrow" size={18} /> : null}
    </Link>
  ) : null;

const DEFAULT_ART = [
  { icon: "mango", color: "#E8974A" },
  { icon: "ananas", color: "#D9B23C" },
  { icon: "papaya", color: "#E8734F" },
];

function Hero({ s, products }: { s: Extract<HomeSection, { _type: "heroSection" }>; products: ProductCardData[] }) {
  const words = (s.rotatingWords ?? []).filter(Boolean);
  const idx = !words.length && s.highlight ? s.title.indexOf(s.highlight) : -1;
  const arts = products.filter((p) => p.illustration?.icon).slice(0, 3).map((p) => ({ icon: p.illustration!.icon!, color: p.illustration!.color || "#E8974A" }));
  const pouches = arts.length === 3 ? arts : DEFAULT_ART;

  return (
    <section className="hero">
      <HeroMotion>
        <div className="hero-bg" aria-hidden="true">
          <span className="blob b1" data-depth="-0.6" />
          <span className="blob b2" data-depth="-0.3" />
        </div>
        <div className="container hero-grid">
          <div className="hero-content">
            {/* H1 corto e con la parola chiave principale; il titolone è un paragrafo grande */}
            {s.eyebrow ? <h1 className="eyebrow hero-in" style={{ ["--d" as string]: "0ms" }}>{s.eyebrow}</h1> : null}
            <p className="hero-title hero-in" style={{ ["--d" as string]: "80ms" }}>
              {words.length ? (
                <>
                  <span>{s.title}</span>{" "}
                  <span className="hero-rot"><RotatingWord words={words} /></span>
                </>
              ) : idx >= 0 ? (
                <>{s.title.slice(0, idx)}<em>{s.highlight}</em>{s.title.slice(idx + s.highlight!.length)}</>
              ) : (
                s.title
              )}
            </p>
            {s.subtitle ? <p className="lead hero-in" style={{ ["--d" as string]: "200ms" }}>{s.subtitle}</p> : null}
            <div className="hero-cta hero-in" style={{ ["--d" as string]: "300ms" }}>
              <Cta link={s.primaryCta} magnetic />
              <Cta link={s.secondaryCta} variant="outline" />
            </div>
            {s.trust?.length ? (
              <ul className="hero-trust hero-in" style={{ ["--d" as string]: "400ms" }}>
                {s.trust.map((t) => <li key={t._key}><Icon name={t.icon || "leaf"} size={20} />{t.text}</li>)}
              </ul>
            ) : null}
          </div>

          <div className="hero-visual" data-hero-in>
            <div className="hero-arch">
              <span className="hero-sun" aria-hidden="true" />
              {s.image?.asset ? (
                <SanityImage image={s.image} ratio={4 / 5} widths={[480, 720, 960]} sizes="(min-width: 900px) 480px, 90vw" priority className="hero-photo" />
              ) : (
                <div className="hero-pouches" aria-hidden="true">
                  <div className="pouch-wrap w2" data-depth="0.5"><ProductArt icon={pouches[1].icon} color={pouches[1].color} className="pouch" /></div>
                  <div className="pouch-wrap w1" data-depth="1"><ProductArt icon={pouches[0].icon} color={pouches[0].color} className="pouch" /></div>
                  <div className="pouch-wrap w3" data-depth="1.5"><ProductArt icon={pouches[2].icon} color={pouches[2].color} className="pouch" /></div>
                </div>
              )}
            </div>
            {pouches.map((p, n) => (
              <span key={n} className={`hero-floater f${n}`} data-depth={String(2 + n)} aria-hidden="true" style={{ color: p.color }}>
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">{FRUIT[p.icon]}</svg>
              </span>
            ))}
            {s.badgeTitle ? (
              <div className="hero-badge">
                <Icon name="shield" size={26} />
                <div><strong>{s.badgeTitle}</strong><span>{s.badgeText}</span></div>
              </div>
            ) : null}
          </div>
        </div>
        <a href="#dopo-hero" className="scroll-cue" aria-label="Scorri ai contenuti"><span /></a>
      </HeroMotion>
      <span id="dopo-hero" />
    </section>
  );
}

function toShowcase(p: ProductCardData): ShowcaseItem {
  const hasVariants = (p.variants?.length ?? 0) > 0;
  const price = hasVariants ? Math.min(...p.variants!.map((v) => v.price)) : p.price;
  return {
    slug: p.slug,
    name: p.name,
    short: p.shortDescription,
    format: hasVariants ? p.variants![0].label : p.format,
    price,
    ingredients: p.ingredients,
    color: p.illustration?.color || "#E8974A",
    icon: p.illustration?.icon || "mango",
    image: imageUrl(p.image, 640, 640),
    available: p.available,
    snapshot: hasVariants ? null : toSnapshot(p),
  };
}

export async function HomeSections({ sections }: { sections: HomeSection[] }) {
  const has = (t: HomeSection["_type"]) => sections.some((s) => s._type === t);
  const [featured, all, faqs, testimonials, articles] = await Promise.all([
    getFeaturedProducts(),
    has("showcaseSection") ? getProducts() : Promise.resolve([] as ProductCardData[]),
    has("faqSection") ? getFaqs(true) : Promise.resolve([]),
    has("testimonialsSection") ? getTestimonials() : Promise.resolve([]),
    has("blogSection") ? getArticles() : Promise.resolve([]),
  ]);

  return (
    <>
      {sections.map((s) => {
        switch (s._type) {
          case "heroSection":
            return <Hero key={s._key} s={s} products={featured} />;

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

          case "showcaseSection": {
            const list = (s.products?.filter(Boolean).length ? s.products! : all).slice(0, 8);
            if (!list.length) return null;
            return <FruitShowcase key={s._key} items={list.map(toShowcase)} eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />;
          }

          case "compareSection":
            return (
              <LabelCompare key={s._key} eyebrow={s.eyebrow} title={s.title} text={s.text} commonTitle={s.commonTitle} commonItems={s.commonItems ?? []} oursTitle={s.oursTitle} oursLabel={s.oursLabel} note={s.note} />
            );

          case "valuesSection":
            return (
              <section key={s._key} className="section values">
                <div className="container">
                  <Head {...s} />
                  <div className="values-grid">
                    {(s.items ?? []).map((v, i) => (
                      <div className="value-card" key={v._key} data-reveal>
                        <span className="value-index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                        <div className="value-icon"><Icon name={v.icon || "leaf"} size={26} /></div>
                        <h3>{v.title}</h3>
                        <p>{v.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case "storySection":
            return (
              <section key={s._key} className="story" id={s.anchor || undefined}>
                <div className="story-deco" aria-hidden="true" data-parallax="-30">
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">{FRUIT.mango}</svg>
                </div>
                <div className="container story-grid">
                  <div className="story-visual" data-reveal>
                    <div className="story-visual-inner" data-parallax="-8">
                      {s.image?.asset ? (
                        <SanityImage image={s.image} ratio={4 / 5} widths={[400, 640, 900]} sizes="(min-width: 900px) 440px, 90vw" className="story-photo" />
                      ) : (
                        <div className="story-art" aria-hidden="true">
                          <ProductArt icon="cofanetto" color="#C97B3D" className="sa1" />
                          <ProductArt icon="mango" color="#E8974A" className="sa2" />
                          <span className="story-pin"><Icon name="mapPin" size={22} /> Sicilia</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="story-text">
                    {s.eyebrow ? <span className="eyebrow" data-reveal>{s.eyebrow}</span> : null}
                    <h2 data-reveal>{s.title}</h2>
                    {(s.paragraphs ?? []).map((p, i) => <p key={i} data-reveal>{p}</p>)}
                    {s.signatureName ? (
                      <div className="story-signature" data-reveal>
                        <span className="sig-name">{s.signatureName}</span>
                        <span className="sig-role">{s.signatureRole}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>
            );

          case "processSection":
            return <ProcessScroll key={s._key} eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} steps={s.steps ?? []} />;

          case "productsSection": {
            const list = s.mode === "manual" ? (s.products ?? []).filter(Boolean) : featured;
            if (!list.length) return null;
            return (
              <section key={s._key} className="section products-section">
                <div className="container">
                  <div className="products-head" data-reveal>
                    <div>
                      {s.eyebrow ? <span className="eyebrow">{s.eyebrow}</span> : null}
                      <h2>{s.title}</h2>
                    </div>
                    {s.subtitle ? <p>{s.subtitle}</p> : null}
                  </div>
                  <ProductGrid products={list} />
                  {s.ctaLabel ? (
                    <div className="products-cta"><Link href={s.ctaHref || "/store"} className="btn btn-primary">{s.ctaLabel}<Icon name="arrow" size={18} /></Link></div>
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
                      <figure key={t._id} className="testimonial" data-reveal>
                        {t.rating ? <div className="stars" role="img" aria-label={`${t.rating} stelle su 5`}>{Array.from({ length: t.rating }).map((_, i) => <Icon key={i} name="star" size={16} fill="currentColor" />)}</div> : null}
                        <blockquote>{t.quote}</blockquote>
                        <figcaption>{t.author}{t.location ? `, ${t.location}` : ""}{t.productName ? ` · ${t.productName}` : ""}</figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              </section>
            );

          case "blogSection":
            if (!articles.length) return null;
            return (
              <section key={s._key} className="section blog-section">
                <div className="container">
                  <div className="products-head" data-reveal>
                    <div>
                      {s.eyebrow ? <span className="eyebrow">{s.eyebrow}</span> : null}
                      <h2>{s.title}</h2>
                    </div>
                    {s.subtitle ? <p>{s.subtitle}</p> : null}
                  </div>
                  <div className="article-grid three">{articles.slice(0, 3).map((a) => <ArticleCard key={a._id} a={a} />)}</div>
                  <div className="products-cta"><Link href="/blog" className="btn btn-outline">{s.ctaLabel || "Tutti gli articoli"}</Link></div>
                </div>
              </section>
            );

          case "faqSection":
            if (!faqs.length) return null;
            return (
              <section key={s._key} className="section faq-section">
                <div className="container narrow">
                  <Head {...s} />
                  <div data-reveal><FaqList items={faqs} /></div>
                  <p className="faq-more"><Link href="/faq">Tutte le domande frequenti <Icon name="arrow" size={16} /></Link></p>
                </div>
              </section>
            );

          case "newsletterSection":
            return (
              <section key={s._key} className="newsletter">
                <div className="newsletter-deco" aria-hidden="true" data-parallax="-25">
                  {["kiwi", "ananas", "cocco"].map((f) => <svg key={f} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">{FRUIT[f]}</svg>)}
                </div>
                <div className="container" data-reveal>
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
                <div className="final-deco" aria-hidden="true">
                  {DEFAULT_ART.map((p, n) => (
                    <div key={n} className={`final-pouch fp${n}`} data-parallax={String(-20 - n * 15)}>
                      <ProductArt icon={p.icon} color={p.color} />
                    </div>
                  ))}
                </div>
                <div className="container" data-reveal>
                  {s.eyebrow ? <span className="eyebrow">{s.eyebrow}</span> : null}
                  <h2>{s.title}</h2>
                  {s.text ? <p>{s.text}</p> : null}
                  <Cta link={s.cta} magnetic />
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
