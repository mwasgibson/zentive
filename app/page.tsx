import { RouteDiagram } from "@/components/RouteDiagram";
import { FaqItem } from "@/components/FaqItem";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { siteConfig } from "@/lib/site-config";

const features = [
  {
    category: "Core messaging",
    items: [
      "Single & bulk SMS send via API or portal",
      "Scheduled and recurring campaigns",
      "Two-way messaging with automated keyword replies",
      "Long/concatenated SMS and Unicode support",
      "Multiple sender IDs per account",
    ],
  },
  {
    category: "Compliance & trust",
    items: [
      "Opt-out / DND list management",
      "CAK sending-window enforcement",
      "Sender-ID approval workflow",
      "Prohibited-content filtering",
    ],
  },
  {
    category: "Account & billing",
    items: [
      "Prepaid wallet with real-time balance",
      "Multi-user accounts with role-based access",
      "Full transaction ledger",
    ],
  },
  {
    category: "Reporting & analytics",
    items: [
      "Real-time delivery reports (DLR)",
      "Campaign-level analytics dashboards",
      "Exportable reports",
    ],
  },
  {
    category: "Developer tools",
    items: [
      "REST API with API-key authentication",
      "Webhooks for delivery/status events",
      "Sandbox / test environment",
    ],
  },
  {
    category: "Reliability",
    items: [
      "Automatic failover and retry logic",
      "Queue-based architecture absorbs traffic bursts",
      "99.9% uptime target",
    ],
  },
];

const steps = [
  {
    n: "01",
    title: "Send — your way in",
    badges: ["REST API", "Web portal"],
    body: "Developers integrate against the REST API — single send, bulk send via JSON/CSV, webhooks. Campaign teams use the web portal instead. Same platform, same routing, underneath either one.",
  },
  {
    n: "02",
    title: "Route — direct to the network",
    badges: ["Direct SMPP bind"],
    body: "No resale hop. The message goes out over our own persistent SMPP v3.4 bind straight to the MNO's SMSC — Safaricom first — the same connection every time, not resold third-party capacity with automatic failover and retry.",
  },
  {
    n: "03",
    title: "Confirm",
    body: "A delivery report (DLR) comes back from the network, the message is marked delivered, and the client’s wallet is debited and is matched to the original message.",
  },
  {
    n: "04",
    title: "Report",
    body: "Delivery status, campaign analytics, and wallet usage are all visible in real time in the dashboard.",
  },
];

const clientSegments = [
  {
    segment: "Banks & SACCOs",
    body: "Transaction alerts, OTPs, and statement notifications where delivery has to be immediate, auditable, and never queued behind a promotional blast.",
    scenarios: [
      "One-time passcodes for login and transaction approval",
      "High deliverability for time‑critical messages",
      "Real-time debit/credit and low-balance alerts",
      "Statement and mini-statement notifications",
      "Loan repayment and arrears reminders",
    ],
  },
  {
    segment: "Retail & Enterprise",
    body: "Promotional and operational messaging at volume, sent through a system that enforces CAK sending-window and opt-out rules automatically instead of leaving compliance to whoever hits send.",
    scenarios: [
      "Scheduled promotional campaigns to segmented contact lists",
      "Order confirmations and delivery notifications",
      "Appointment, renewal, and payment reminders",
      "Internal staff and operational alerts",
    ],
  },
];

const segmentClosingLine =
  "Campaign and ops teams manage sends, contact lists, and delivery reports directly in the portal; engineering teams that want it wired into their own systems integrate the same functionality through the API.";

const faqs = [
  {
    q: "How is this different from a bulk SMS aggregator or CPaaS provider?",
    a: "Most bulk SMS providers in Kenya relay your traffic through their own upstream carrier relationships and charge a margin on top. This platform connects directly to the MNO's SMSC over SMPP, so routing, cost, compliance, and data handling stay in one place instead of passing through a reseller.",
  },
  {
    q: "Which mobile networks are supported?",
    a: "Safaricom is the first direct SMPP integration. The platform's routing layer is built to extend to Airtel and Telkom without an architectural change.",
  },
  {
    q: "Is this compliant with Kenyan telecoms regulation?",
    a: "The platform operates under a CA Communications Service Provider (CSP) licence. It enforces CAK-mandated sending-time windows for promotional messages, maintains an opt-out/DND list automatically, and requires sender IDs to be pre-approved and mapped to a verified account before use.",
  },
  {
    q: "How is subscriber data protected?",
    a: "Contact data and message content are encrypted at rest, all client-facing traffic runs over TLS, and handling of subscriber phone numbers and message content complies with the Kenya Data Protection Act, 2019.",
  },
  {
    q: "How do I integrate — API or dashboard?",
    a: "Both. A REST API (single send, bulk send, delivery-status lookup, webhook registration) covers programmatic integration, with a sandbox environment for testing. The web portal covers campaign creation, contact-list management, and reporting for non-technical users.",
  },
  {
    q: "How is message delivery tracked?",
    a: "Every submitted message gets a delivery report (DLR) from the network, captured and exposed in real time — at the individual message level and rolled up into campaign-level analytics you can export.",
  },
  {
    q: "How does billing work?",
    a: "Billing runs on a prepaid wallet: top up, and balance is deducted per successfully routed message. Every top-up and deduction is recorded in a full transaction ledger, visible in real time.",
  },
  {
    q: "What throughput can I expect?",
    a: "The initial target is 10–30 transactions per second (TPS) per SMPP bind. Throughput scales horizontally by adding further binds and worker instances as volume grows, without changing how you integrate.",
  },
];

export default function HomePage() {
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
        <section className="section max-w-7xl pb-20 pt-16 sm:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <p className="eyebrow">Bulk SMS, built for enterprises</p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                Send bulk SMS over a{" "}
                <span className="text-signal-dark">direct SMPP connection</span> to the network —
                not through an aggregator.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                {siteConfig.productName} connects straight to the MNO&apos;s SMSC, starting with
                Safaricom. That means direct control over routing, cost, compliance, and your
                data — with real-time delivery reports and CAK-compliant sender governance built
                in from day one.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#contact" className="btn-primary">
                  Request early access
                </a>
                <a href="#platform" className="btn-secondary">
                  See the platform
                </a>
              </div>
              <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-6 text-sm">
                <div>
                  <dt className="text-muted">Licensed</dt>
                  <dd className="mt-1 font-mono text-ink">CA CSP</dd>
                </div>
                <div>
                  <dt className="text-muted">Connection</dt>
                  <dd className="mt-1 font-mono text-ink">Direct SMPP</dd>
                </div>
                <div>
                  <dt className="text-muted">Uptime target</dt>
                  <dd className="mt-1 font-mono text-ink">99.9%</dd>
                  <dd className="mt-1 text-xs text-muted">excluding scheduled maintenance</dd>
                </div>
              </dl>
            </div>
            <div className="card flex items-center justify-center bg-surface p-8 w-full">
              <RouteDiagram />
            </div>
          </div>
        </section>

        {/* PLATFORM / FEATURES */}
        <section id="platform" className="border-t border-border bg-surface py-20">
          <div className="section">
            <p className="eyebrow">The platform</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Everything a compliance-conscious sender needs — nothing you have to build
              yourself.
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((group) => (
                <div key={group.category} className="card">
                  <h3 className="font-display text-base font-semibold text-ink">
                    {group.category}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-muted">
                        <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-wire" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GLOSSARY — answer-first blocks for AEO/GEO */}
        <section className="border-t border-border bg-surface py-16">
          <div className="section">
            <p className="eyebrow">In plain terms</p>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">What is SMPP?</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  SMPP (Short Message Peer-to-Peer) is the industry-standard protocol used to
                  exchange SMS traffic between an application and a mobile network&apos;s SMSC.
                  {" "}{siteConfig.productName} holds a persistent SMPP v3.4 bind directly to the
                  MNO, rather than sending through a reseller&apos;s own SMPP connection.
                </p>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">What is a DLR?</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  A DLR (delivery report) is the confirmation sent back by the network stating
                  whether a message reached the handset. Every message sent through the platform
                  gets a DLR captured and matched back to it in real time.
                </p>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  What is sender-ID governance?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  It&apos;s the approval process that maps an alphanumeric sender name (e.g. your
                  business name) to a verified account before it can be used, so recipients can
                  trust who a message is really from and spoofed sender names are rejected.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-20">
          <div className="section">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Two ways in. One direct route to the network.
            </h2>
            <p className="mt-4 max-w-2xl text-muted">
              However a message reaches the platform — API or portal — it leaves the same way:
              over our own SMPP bind, straight to the MNO. Nothing resold in between.
            </p>
            <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <div key={step.n} className="relative">
                  <span className="font-mono text-sm text-signal-dark">{step.n}</span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                    {step.title}
                  </h3>
                  {"badges" in step && step.badges && (
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
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute right-[-1rem] top-1 hidden font-mono text-border lg:block"
                    >
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section id="use-cases" className="border-y border-border bg-ink py-20 text-paper">
          <div className="section">
            <p className="eyebrow text-paper/50">Who it's for</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-paper sm:text-4xl">
              Built for traffic that has to arrive — and traffic that has to obey the rules.
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {clientSegments.map((seg) => (
                <div key={seg.segment} className="rounded-xl border border-paper/15 p-7">
                  <h3 className="font-display text-xl font-semibold text-paper">
                    {seg.segment}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-paper/70">{seg.body}</p>
                  <ul className="mt-5 space-y-2 border-t border-paper/10 pt-5">
                    {seg.scenarios.map((s) => (
                      <li key={s} className="flex gap-2.5 text-sm text-paper/80">
                        <span
                          aria-hidden
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal"
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 border-t border-paper/10 pt-5 text-sm leading-relaxed text-paper/60">
                    {segmentClosingLine}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20">
          <div className="section grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="eyebrow">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Straight answers, before you talk to us.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                Don&apos;t see your question here? Reach us directly at{" "}
                <a href={`mailto:${siteConfig.contactEmail}`} className="text-ink underline">
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

        {/* FINAL CTA */}
        <section className="border-t border-border bg-surface py-20">
          <div className="section flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Get early access before general availability.
              </h2>
              <p className="mt-3 max-w-lg text-muted">
                We&apos;re onboarding a small number of pilot clients ahead of go-live. Tell us
                about your sending volume and use case.
              </p>
            </div>
            <a href={`mailto:${siteConfig.contactEmail}`} className="btn-primary shrink-0">
              Request early access
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}