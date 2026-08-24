import { RouteDiagram } from "@/components/RouteDiagram";
import { FaqItem } from "@/components/FaqItem";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SecurityIcon } from "@/components/Securityicon";
import { Reveal } from "@/components/Reveal";
import { DeliveryField } from "@/components/DeliveryField";
import { QueueBurst } from "@/components/QueueBurst";
import {
  getSiteConfig,
  getFaqs,
  getTestimonials,
  getPageContent,
  interpolate,
} from "@/lib/cms";

export default async function HomePage() {
  const siteConfig = await getSiteConfig();
  const faqs = (await getFaqs()).map((f) => ({ q: f.question, a: f.answer }));
  const testimonials = await getTestimonials();
  const page = await getPageContent();

  const t = (text: string) => interpolate(text, siteConfig);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <SiteHeader />
      <main id="top">
        {/* HERO */}
        <section className="section relative overflow-hidden pb-20 pt-16 sm:pt-24">
          <DeliveryField />
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <p className="eyebrow">{page.hero.eyebrow}</p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                {page.hero.headline_before}
                <br />
                <span className="text-signal-dark">
                  {page.hero.headline_highlight}
                </span>
                <br />
                {page.hero.headline_after}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                {t(page.hero.subhead)}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#contact" className="btn-primary">
                  Request early access
                </a>
                <a href="#platform" className="btn-secondary">
                  {page.hero.secondary_cta_label}
                </a>
              </div>
              <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-6 text-sm">
                {page.hero.trust_stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-muted">{stat.label}</dt>
                    <dd className="mt-1 font-mono text-ink">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="card flex items-center justify-center bg-surface p-4 sm:p-6">
              <div className="w-full max-w-[110%]">
                <RouteDiagram />
              </div>
            </div>
          </div>
        </section>

        {/* PLATFORM / FEATURES */}
        <Reveal variant="up">
          <section
            id="platform"
            className="border-t border-border bg-surface py-20"
          >
            <div className="section">
              <p className="eyebrow">The platform</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {page.features.heading}
              </h2>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {page.features.groups.map((group) => (
                  <div key={group.category} className="card card-motion">
                    <h3 className="font-display text-base font-semibold text-ink">
                      {group.category}
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2.5 text-sm text-muted"
                        >
                          <span
                            aria-hidden
                            className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-wire transition-transform group-hover:scale-125 group-hover:bg-signal"
                          />
                          <span className="transition-colors group-hover:text-ink">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* SECURITY & COMPLIANCE */}
        <Reveal variant="left">
          <section
            id="security"
            className="border-t border-border bg-ink py-16 text-paper"
          >
            <div className="absolute inset-0 security-grid" />
            <div className="section">
              <p className="eyebrow text-paper/50">Security &amp; compliance</p>
              <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
                {page.security.heading}
              </h2>
              <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {page.security.bullets.map((bullet) => (
                  <div
                    key={bullet.title}
                    className="security-item flex gap-3.5"
                  >
                    <SecurityIcon
                      iconKey={bullet.icon}
                      size={20}
                      className="mt-0.5 shrink-0 text-wire security-icon"
                    />
                    <div>
                      <h3 className="font-display text-sm font-semibold text-paper">
                        {bullet.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-paper/70">
                        {bullet.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* GLOSSARY — answer-first blocks for AEO/GEO */}
        <Reveal variant="right">
          <section className="border-t border-border bg-surface py-16">
            <div className="section">
              <p className="eyebrow">In plain terms</p>
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {page.glossary.items.map((item) => (
                  <div key={item.title} className="card-motion">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {t(item.body)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* HOW IT WORKS */}
        <Reveal variant="up">
          <section id="how-it-works" className="py-20">
            <div className="section">
              <p className="eyebrow">How it works</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {page.how_it_works.heading}
              </h2>
              <p className="mt-4 max-w-2xl text-muted">
                {page.how_it_works.subhead}
              </p>
              <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {page.how_it_works.steps.map((step, i) => (
                  <div
                    key={step.n}
                    className="how-step relative"
                    style={{
                      animationDelay: `${i * 120}ms`,
                    }}
                  >
                    <span className="font-mono text-sm text-signal-dark">
                      {step.n}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                      {step.title}
                    </h3>
                    {step.badges && step.badges.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {step.badges.map((b) => (
                          <span
                            key={b}
                            className="rounded-full border border-wire/30 bg-wire-light px-2.5 py-0.5 font-mono text-[11px] text-wire"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {step.body}
                    </p>
                    {i < page.how_it_works.steps.length - 1 && (
                      <span
                        aria-hidden
                        className="how-arrow absolute right-[-1rem] top-1 hidden font-mono text-border lg:block"
                      >
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* FOR ENGINEERING TEAMS */}
        <Reveal variant="left">
          <section className="border-t border-border bg-surface py-20">
            <div className="section grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="eyebrow">For engineering teams</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {page.engineering.heading}
                </h2>
                <ul className="mt-6 space-y-3">
                  {page.engineering.bullets.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-muted">
                      <span
                        aria-hidden
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-wire"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="btn-secondary mt-8"
                >
                  {page.engineering.cta_label}
                </a>
              </div>
              <div className="card overflow-x-auto bg-ink !p-0">
                <div className="absolute inset-0 api-row" />
                <div className="border-b border-paper/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50">
                  REST API — endpoint surface
                </div>
                <table className="w-full font-mono text-[12.5px]">
                  <tbody>
                    {page.engineering.api_endpoints.map((e) => (
                      <tr
                        key={e.path}
                        className="border-b border-paper/5 last:border-0"
                      >
                        <td className="whitespace-nowrap px-5 py-2.5 text-wire api-method">
                          {e.method}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2.5 text-paper">
                          {e.path}
                        </td>
                        <td className="hidden px-5 py-2.5 text-paper/50 sm:table-cell">
                          {e.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </Reveal>

        {/* BY THE NUMBERS */}
        <Reveal variant="scale">
          <section className="border-t border-border py-16">
            <div className="section">
              <div className="flex items-center gap-4">
                <p className="eyebrow">By the numbers</p>
                <QueueBurst />
              </div>
              <div className="mt-8 grid grid-cols-2 gap-8 lg:grid-cols-4">
                {page.stats.items.map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-3xl font-semibold text-ink">
                      {s.value}
                    </p>
                    <p className="mt-1 text-sm text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* USE CASES */}
        <Reveal variant="up">
          <section
            id="use-cases"
            className="border-y border-border bg-ink py-20 text-paper"
          >
            <div className="absolute inset-0 security-grid" />
            <div className="section">
              <p className="eyebrow text-paper/50">Who it's for</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-paper sm:text-4xl">
                {page.use_cases.heading}
              </h2>
              <div className="mt-12 grid gap-6 md:grid-cols-2">
                {page.use_cases.segments.map((seg) => (
                  <div
                    key={seg.segment}
                    className="rounded-xl border border-paper/15 p-7"
                  >
                    <h3 className="font-display text-xl font-semibold text-paper">
                      {seg.segment}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-paper/70">
                      {seg.body}
                    </p>
                    <ul className="mt-5 space-y-2 border-t border-paper/10 pt-5">
                      {seg.scenarios.map((s) => (
                        <li
                          key={s}
                          className="card-motion flex gap-2.5 text-sm text-paper/80"
                        >
                          <span
                            aria-hidden
                            className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal"
                          />
                          {s}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 border-t border-paper/10 pt-5 text-sm leading-relaxed text-paper/60">
                      {page.use_cases.closing_line}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {testimonials.length > 0 && (
          <Reveal variant="scale">
            <section id="testimonials" className="py-20">
              <div className="section">
                <p className="eyebrow">What clients say</p>
                <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  From pilot clients already sending through{" "}
                  {siteConfig.productName}.
                </h2>
                <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {testimonials.map((testimonial) => (
                    <figure
                      key={testimonial.id}
                      className="card card-motion flex flex-col justify-between"
                    >
                      <blockquote className="text-sm leading-relaxed text-ink">
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-3">
                        {testimonial.logo_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={testimonial.logo_url}
                            alt=""
                            className="h-9 w-9 rounded-full border border-border object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-semibold text-ink">
                            {testimonial.client_name}
                          </p>
                          <p className="text-xs text-muted">
                            {[testimonial.client_role, testimonial.client_org]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>
        )}

        {/* FAQ */}
        <Reveal variant="right">
          <section id="faq" className="py-20">
            <div className="section grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="eyebrow">FAQ</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Straight answers, before you talk to us.
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                  Don&apos;t see your question here? Reach us directly at{" "}
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="text-ink underline"
                  >
                    {siteConfig.contactEmail}
                  </a>
                  .
                </p>
              </div>
              <div>
                {faqs.map((f) => (
                  <FaqItem key={f.q} question={f.q} answer={f.a} />
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* FINAL CTA */}
        <Reveal>
          <section className="border-t border-border bg-surface py-20">
            <div className="section flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div>
                <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {page.final_cta.headline}
                </h2>
                <p className="mt-3 max-w-lg text-muted">
                  {page.final_cta.body}
                </p>
              </div>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="btn-primary shrink-0"
              >
                <span>{page.final_cta.cta_label}</span>
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </a>
            </div>
          </section>
        </Reveal>
      </main>
      <SiteFooter />
    </>
  );
}
